import { EtlBatch, EtlDestination } from 'inceptum-etl';
export default class ProductsDestination extends EtlDestination {
    store(batch: EtlBatch): Promise<void>;
}
