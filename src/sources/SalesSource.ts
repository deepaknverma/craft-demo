import * as _ from 'lodash';
import { promisifyAll } from 'bluebird';
import * as moment from 'moment';
import * as fs from 'fs';
import * as csvToObject from 'csvtojson';
import { LogManager, MySQLClient, DBTransaction } from 'inceptum';
import { MySQLDataByKey, EtlSavepointManager, EtlSource, EtlBatch, EtlState } from 'inceptum-etl';

const log = LogManager.getLogger();

export interface ISavePoint {
  [key: string]: any,
}

export default class SalesSource extends EtlSource {
  protected files: Array<string>;
  protected fileDir: string;
  protected fileName: string;
  protected header: string;
  protected headers: Array<string>;
  protected totalLine: number;
  protected config: object;
  protected errorFound = false;

  constructor(config: object) {
    super();
    this.files = [];
    this.fileName = '';
    this.fileDir = config['fileDir'];
    this.header = `"TxnDate","RefNumber","Memo","Debit","Credit","AccountFullName","ItemSalesTaxRefFullName","Allocation Memo"`;
  }

  public getErrorFound(): boolean {
    return this.errorFound;
  }

  /**
   * Convert the savepoint object to a string for storage
   * @param savePoint
   */
  // tslint:disable-next-line:prefer-function-over-method
  protected savePointToString(savePoint: object) {
    return JSON.stringify(savePoint);
  }

  /**
   * Convert a given string to savepoint object. If it is an empry string
   * returns the default savepoint
   * @param savePoint
   */
  protected stringToSavePoint(savePoint: string) {
    if (savePoint.length === 0) {
      return this.defaultSavePoint();
    }
    return JSON.parse(savePoint);
  }

  /**
   * Get the default savepoint.
   */
  // tslint:disable-next-line:prefer-function-over-method
  public defaultSavePoint(): object {
    return {
      fileName: this.fileName,
    };
  }

  /**
   * This method can be overriten to set the required data to fetch the next batch
   */
  protected async initCurrentSavePoint() {
    this.files = fs.readdirSync(this.fileDir).sort();
    this.headers = await this.loadHeader();
  }

  private loadHeader(): Promise<Array<string>> {
    return new Promise<Array<string>>((resolve, reject) => {
      csvToObject({ noheader: true })
        .fromString(this.header)
        .on('csv', (csvRow) => {
          resolve(csvRow);
        });
    });
  }

  /**
   * Get's the next batch of objects. It should add this object as listener to the batch
   * to know when it finished and make the relevant updates to the savePoint in
   * {@link #stateChanged}
   */
  public async getNextBatch(): Promise<EtlBatch> {
    const fname = this.files.shift();
    this.fileName = `${this.fileDir}/${fname}`;
    const data = await this.loadFromCsvFile();
    const batch = new EtlBatch(data, 1, 1, fname);
    batch.registerStateListener(this);
    return batch;
  }

  /**
   * Get the stored save point using the etlSavepointManager
   * @param savepointManager
   */
  public async initSavePoint(etlSavepointManager: EtlSavepointManager): Promise<void> {
    this.etlSavepointManager = etlSavepointManager;
    this.initialSavePoint = await this.getStoredSavePoint();
    await this.initCurrentSavePoint();
  }
  //
  private async loadFromCsvFile(): Promise<Array<object>> {
    return new Promise<Array<object>>((resolve, reject) => {
      const data: Array<object> = [];
      csvToObject({ noheader: true, headers: this.headers })
        .fromFile(this.fileName)
        .on('json', (jsonObj) => {
          data.push(jsonObj);
        })
        .on('done', (error) => {
          resolve(data);
        });
    });
  }

  public hasNextBatch(): boolean {
    return (this.files.length > 0);
  }

  public async stateChanged(newState: EtlState): Promise<void> {
    if (newState === EtlState.ERROR) {
      log.debug(`savepoint stored: ${this.getCurrentSavepoint()}`);
    }
  }
}
