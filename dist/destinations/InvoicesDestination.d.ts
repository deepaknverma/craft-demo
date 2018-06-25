import { EtlBatch, EtlDestination } from 'inceptum-etl';
export default class InvoicesDestination extends EtlDestination {
    store(batch: EtlBatch): Promise<void>;
}
