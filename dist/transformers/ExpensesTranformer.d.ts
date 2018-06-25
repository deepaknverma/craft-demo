import { EtlBatch, EtlTransformer } from 'inceptum-etl';
export declare class SalesObject {
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
    transform(batch: EtlBatch): Promise<void>;
}
