import { LogManager } from 'inceptum';
import { EtlBatch, EtlDestination } from 'inceptum-etl';
import { chunk, flatten } from 'lodash';

export default class InvoicesDestination extends EtlDestination {

  public async store(batch: EtlBatch): Promise<void> {
    return;
  }
}
