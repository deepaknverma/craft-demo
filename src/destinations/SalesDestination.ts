import * as QuickBooks from 'node-quickbooks';
import * as _ from 'lodash';
import { LogManager } from 'inceptum';
import { EtlBatch, EtlDestination, EtlState } from 'inceptum-etl';
import { JournalEntry } from '../types/JournalEntry';
import { QboConfig } from '../types/QboConfig';

const log = LogManager.getLogger();

export default class SalesDestination extends EtlDestination {
  public batchStatus: boolean;
  protected qbo = QuickBooks;

  constructor(config: QboConfig) {
      super();
      this.qbo = new QuickBooks(
        config.consumerKey,
        config.consumerSecret,
        config.oauthToken,
        config.oauthTokenSecret,
        config.realmId,
        true, // use the sandbox?
        true, // enable debugging?
      );
  }
  public async store(batch: EtlBatch): Promise<void> {
    const self = this;
    try {
      const currentBatch = batch.getTransformedRecords();
      log.info(`Executing ${currentBatch.length} operations`);
      if (currentBatch.length > 0) {
        const transactionsToUpload = currentBatch.map((record) => record.getTransformedData() as JournalEntry);
        this.qbo.createJournalEntry(transactionsToUpload);
        // createJournalEntry
        log.debug('Finsihed processing the batch', transactionsToUpload);
        self.batchStatus = true;
      } else {
        /* istanbul ignore next */
        log.debug('nothing to store in destination. Empty Array');
      }
    } catch (e) {
      /* istanbul ignore next */
      this.batchStatus = false;
      /* istanbul ignore next */
      log.error(e);
      /* istanbul ignore next */
      batch.setState(EtlState.ERROR);
      // log error
      /* istanbul ignore next */
      log.error(`Error saving batch in table: Batch:${batch.getBatchFullIdentifcation()}`);

    }
  }
}
