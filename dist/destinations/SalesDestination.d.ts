import { EtlBatch, EtlDestination } from 'inceptum-etl';
import { QboConfig } from '../types/QboConfig';
export default class SalesDestination extends EtlDestination {
    batchStatus: boolean;
    protected qbo: any;
    constructor(config: QboConfig);
    store(batch: EtlBatch): Promise<void>;
}
