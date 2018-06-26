import * as fs from 'fs';
import * as path from 'path';
import * as request from 'request-promise';
import * as QuickBooks from 'node-quickbooks';
import { Json2csvParser } from 'json2csv';
import { LogManager } from 'inceptum';
import { EtlBatch, EtlDestination, EtlState } from 'inceptum-etl';
import { JournalEntry } from '../types/JournalEntry';
import { QboConfig } from '../types/QboConfig';
const log = LogManager.getLogger();

export default class SalesDestination extends EtlDestination {
  public batchStatus: boolean;
  protected qbo = QuickBooks;
  protected config: QboConfig;

  constructor(config: QboConfig) {
      super();
      this.config = { ...config };
  }

  async generateToken() {
    try {
      const auth = (new Buffer(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString('base64'));
      const res = await request.post({
        url: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${auth}`,
        },
        form: {
          grant_type: 'refresh_token',
          refresh_token: 'L011538735469jImcGIu44Na0ERFrUl9iQ4inoweByn4R1zlyj',
        },
      });
      const obj = JSON.parse(res);
      this.config.oauthToken = obj['access_token'];
    } catch (e) {
      log.error(e);
    }
  }

  async initialiseQboObject(): QuickBooks {
    await this.generateToken();
    if (this.qbo) {
      this.qbo = new QuickBooks(this.config.consumerKey,
        this.config.consumerSecret,
        this.config.oauthToken, /* oAuth access token */
        false, /* no token secret for oAuth 2.0 */
        this.config.realmId,
        true, /* use a sandbox account */
        true, /* turn debugging on */
        4, /* minor version */
        '2.0', /* oauth version */
        this.config.refreshToken, /* refresh token */
      );
    }
  }

  public async store(batch: EtlBatch): Promise<void> {
    await this.initialiseQboObject();
    try {
      const currentBatch = batch.getTransformedRecords();
      log.info(`Executing ${currentBatch.length} operations`);
      if (currentBatch.length > 0) {
        const transactionsToUpload = currentBatch.map((record) => record.getTransformedData() as JournalEntry);

        // transactionsToUpload.map((record: JournalEntry) => {
        //   const newRecord = record;
        //   newRecord.JournalEntryLineDetail.PostingType = (record.JournalEntryLineDetail.PostingType === 'Credit') ? 'Debit' : 'Credit';
        //   this.qbo.createJournalEntry({
        //     Line: [record, newRecord],
        //   });
        // });
        fs.writeFileSync(path.join(__dirname, `../../csv/outputfiles/${Date.now()}.json`), transactionsToUpload);
        log.debug(transactionsToUpload);
        // createJournalEntry
        log.debug('Finsihed processing the batch');
        this.batchStatus = true;
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
