import * as QuickBooks from 'node-quickbooks';
import { EtlBatch, EtlDestination } from 'inceptum-etl';
import { QboConfig } from '../types/QboConfig';
export default class SalesDestination extends EtlDestination {
    batchStatus: boolean;
    protected qbo: any;
    protected config: QboConfig;
    constructor(config: QboConfig);
    generateToken(): Promise<void>;
    initialiseQboObject(): QuickBooks;
    store(batch: EtlBatch): Promise<void>;
}
