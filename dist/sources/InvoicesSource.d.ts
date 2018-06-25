import { EtlSource, EtlBatch, EtlState } from 'inceptum-etl';
export interface ISavePoint {
    [key: string]: any;
}
export default class InvoicesSource extends EtlSource {
    getNextBatch(): Promise<EtlBatch>;
    protected savePointToString(savePoint: object): string;
    protected stringToSavePoint(savePoint: string): object;
    hasNextBatch(): boolean;
    stateChanged(newState: EtlState): Promise<void>;
}
