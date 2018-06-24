import { EtlBatch, EtlTransformer } from 'inceptum-etl';
import * as moment from 'moment';
export default class ExpensesTransformer extends EtlTransformer {
  /**
   * Copy batch records to transform data
   * @param batch
   */
  // tslint:disable-next-line:prefer-function-over-method
  public async transform(batch: EtlBatch): Promise<void> {
    return;
  }

}
