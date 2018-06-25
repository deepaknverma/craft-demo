import * as QuickBooks from 'node-quickbooks';
import { LogManager } from 'inceptum';
import { EtlBatch, EtlDestination, EtlState } from 'inceptum-etl';
import { chunk, flatten } from 'lodash';
const log = LogManager.getLogger();

export interface QboConfig {
  consumerKey: string,
  consumerSecret: string,
  oauthToken: string,
  oauthTokenSecret: string,
  realmId: string,
  minorversion: string,
}

const accountType = {
  'undeposited funds': 187,
  'Bistro Income': 184,
  'Bar Income': 185,
};

export class AccountRef {
  value: number;
  name: string;

  public toQboObject(obj: object): AccountRef {
    const instance = new AccountRef();
    instance.value = (accountType.hasOwnProperty(obj['AccountFullName'])) ? accountType[obj['AccountFullName']] : 187 ;
    instance.name = obj['AccountFullName'];
    return instance;
  }
}
export class JournalEntryLineDetail {
  PostingType: string;
  AccountRef: AccountRef;

  public toQboObject(obj: object): JournalEntryLineDetail {
    const instance = new JournalEntryLineDetail();
    const accountRef = new AccountRef();
    instance.PostingType = (obj['Credit']) ? 'Credit' : 'Debit';
    instance.AccountRef = accountRef.toQboObject(obj) ;
    return instance;
  }
}
export class JournalEntry {
  Description: string;
  Amount: number;
  DetailType: string;
  JournalEntryLineDetail: JournalEntryLineDetail;

  public toQboObject(obj: object): JournalEntry {
    const instance = new JournalEntry();
    const journalEntryLineDetail = new JournalEntryLineDetail();
    instance.Description = obj['Allocation Memo'];
    instance.Amount = (obj['Credit']) ? obj['Credit'] : obj['Debit'];
    instance.DetailType = obj['Memo'];
    instance.JournalEntryLineDetail = journalEntryLineDetail.toQboObject(obj);
    return instance;
  }
}
export default class ExpensesDestination extends EtlDestination {
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
      log.info(`Executing ${currentBatch.length} operations`, currentBatch);
      if (currentBatch.length > 0) {
        const transactionsToUpload = currentBatch.map((record) => record.getTransformedData() as JournalEntry);
        // this.qbo.createJournalEntry(transactionsToUpload);
        // createJournalEntry
        // log.debug('Finsihed processing the batch', transactionsToUpload);
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
