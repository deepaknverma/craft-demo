import * as moment from 'moment';
import { LogManager, MySQLClient, DBTransaction } from 'inceptum';
import { EtlBatch, EtlTransformer } from 'inceptum-etl';
import { JournalEntry } from '../types/JournalEntry';
import { SalesObject } from '../types/SalesObject';
const log = LogManager.getLogger();

export default class SalesTransformer extends EtlTransformer {
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
      record.setTransformedData(transformedData);
    });
  }

}
