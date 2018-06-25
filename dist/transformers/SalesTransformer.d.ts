import { EtlBatch, EtlTransformer } from 'inceptum-etl';
export default class SalesTransformer extends EtlTransformer {
    /**
     * Copy batch records to transform data
     * @param batch
     */
    transform(batch: EtlBatch): Promise<void>;
}
