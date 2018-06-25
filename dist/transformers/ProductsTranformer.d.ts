import { EtlBatch, EtlTransformer } from 'inceptum-etl';
export default class ProductsTransformer extends EtlTransformer {
    /**
     * Copy batch records to transform data
     * @param batch
     */
    transform(batch: EtlBatch): Promise<void>;
}
