import { EtlSource, EtlBatch, EtlState } from 'inceptum-etl';
export default class PaymentsSource extends EtlSource {
    getNextBatch(): Promise<EtlBatch>;
    protected savePointToString(savePoint: object): string;
    protected stringToSavePoint(savePoint: string): object;
    hasNextBatch(): boolean;
    stateChanged(newState: EtlState): Promise<void>;
}
