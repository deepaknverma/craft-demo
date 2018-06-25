import { EtlSavepointManager, EtlSource, EtlBatch, EtlState } from 'inceptum-etl';
export interface ISavePoint {
    [key: string]: any;
}
export default class SalesSource extends EtlSource {
    protected files: Array<string>;
    protected fileDir: string;
    protected fileName: string;
    protected header: string;
    protected headers: Array<string>;
    protected totalLine: number;
    protected config: object;
    protected errorFound: boolean;
    constructor(config: object);
    getErrorFound(): boolean;
    /**
     * Convert the savepoint object to a string for storage
     * @param savePoint
     */
    protected savePointToString(savePoint: object): string;
    /**
     * Convert a given string to savepoint object. If it is an empry string
     * returns the default savepoint
     * @param savePoint
     */
    protected stringToSavePoint(savePoint: string): any;
    /**
     * Get the default savepoint.
     */
    defaultSavePoint(): object;
    /**
     * This method can be overriten to set the required data to fetch the next batch
     */
    protected initCurrentSavePoint(): Promise<void>;
    private loadHeader();
    /**
     * Get's the next batch of objects. It should add this object as listener to the batch
     * to know when it finished and make the relevant updates to the savePoint in
     * {@link #stateChanged}
     */
    getNextBatch(): Promise<EtlBatch>;
    /**
     * Get the stored save point using the etlSavepointManager
     * @param savepointManager
     */
    initSavePoint(etlSavepointManager: EtlSavepointManager): Promise<void>;
    private loadFromCsvFile();
    hasNextBatch(): boolean;
    stateChanged(newState: EtlState): Promise<void>;
}
