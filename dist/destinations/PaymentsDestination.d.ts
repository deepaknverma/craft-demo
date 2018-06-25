import { EtlBatch, EtlDestination } from 'inceptum-etl';
export default class PaymentsDestination extends EtlDestination {
    store(batch: EtlBatch): Promise<void>;
}
