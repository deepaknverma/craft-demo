import * as moment from 'moment';
import { LogManager, MySQLClient, DBTransaction } from 'inceptum';
import { EtlBatch, EtlTransformer } from 'inceptum-etl';
import { JournalEntry } from '../destinations/ExpensesDestination';
const log = LogManager.getLogger();

export class SalesObject {
  TxnDate: string;
  RefNumber: string;
  Memo: string;
  Debit: string;
  Credit: string;
  AccountFullName: string;
  ItemSalesTaxRefFullName: string;
  'Allocation Memo': string;
}

export default class ExpensesTransformer extends EtlTransformer {
  /**
   * Copy batch records to transform data
   * @param batch
   */
  // tslint:disable-next-line:prefer-function-over-method
  public async transform(batch: EtlBatch): Promise<void> {
    return batch.getRecords().forEach((record) => {
      const data = record.getData() as SalesObject;
      const journalEntry = new JournalEntry();
      const transformedData = journalEntry.toQboObject(data);
      log.debug(transformedData);
      record.setTransformedData(transformedData);
    });
  }

}
