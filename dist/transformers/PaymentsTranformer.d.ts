import { EtlBatch, EtlTransformer } from 'inceptum-etl';
export default class PaymentsTransformer extends EtlTransformer {
    /**
     * Copy batch records to transform data
     * @param batch
     */
    transform(batch: EtlBatch): Promise<void>;
}
