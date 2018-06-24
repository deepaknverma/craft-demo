import * as moment from 'moment';
import * as _ from 'lodash';
import cliniko from 'cliniko';
import { LogManager, MySQLClient, DBTransaction } from 'inceptum';
import { MySQLDataByKey, EtlSavepointManager, EtlSource, EtlBatch, EtlState } from 'inceptum-etl';

const log = LogManager.getLogger();

export interface ISavePoint {
  [key: string]: any,
}

export default class InvoicesSource extends EtlSource {
  protected currentSavePoint: ISavePoint;
  protected initialSavePoint: ISavePoint;
  protected currentStartTime: moment.Moment;
  protected lastRunStartTime: moment.Moment;
  protected totalBatches: number;
  protected currentBatch: number;
  protected currentState = false;

  /* istanbul ignore next */
  // tslint:disable:prefer-function-over-method
  protected savePointToString(savePoint: object): string {
    return '';
  }
  /* istanbul ignore next */
  // tslint:disable:prefer-function-over-method
  protected stringToSavePoint(savePoint: string): object {
    return {};
  }

  hasNextBatch(): boolean {
    return this.currentState;
  }

  /**
   * This method can be overwritten to set the required data to fetch the next batch
   */
  protected async initCurrentSavePoint(): Promise<void> {
    log.debug(this.initialSavePoint);
    // Validate the initial savepoint
    if (!this.initialSavePoint.hasOwnProperty('lastRunStartTime')) {
      throw new Error(`Missing the lastRunStartTime field in savepoint`);
    }
    this.lastRunStartTime = moment(this.initialSavePoint['lastRunStartTime']);

    this.currentStartTime = moment();
    this.currentSavePoint = {
      lastRunStartTime: this.currentStartTime.format('YYYY-MM-DD HH:mm:ss'),
    };
  }

  /* istanbul ignore next */
  /**
   * This get called at the end of each batch
   * @param newState has the current batch successfully run
   */
  public async stateChanged(newState: EtlState): Promise<void> {
    if (newState === EtlState.ERROR) {
      throw new Error(`Error found processing batch`);
    }
    // Fininal batch is done. update the starting and ending save point
    if ((newState === EtlState.SAVE_ENDED)) {
      await this.updateStoredSavePoint({
        lastRunStartTime: this.currentStartTime.format('YYYY-MM-DD HH:mm:ss'),
      });
      log.debug(`All done. Savepoint stored: ${this.getCurrentSavepoint()}`);
    }
  }

  protected async getInvoices(): Promise<any> {
    try {
      const results = await cliniko.getInvoices();
      log.debug('results: ', results);
      return Promise.resolve(results);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * Get's the next batch of objects. It should add this object as listener to the batch
   * to know when it finished and make the relevant updates to the savePoint in
   * {@link #stateChanged}
   */
  public async getNextBatch(): Promise<EtlBatch> {
    let data = [];
    if (this.hasNextBatch()) {
      data = await this.getInvoices();
      log.debug(data);
      // log.info(`read report from: ${this.currentBatch} - ${this.totalBatches} : batch ${this.currentBatch}`);
    }
    const batch = new EtlBatch(
      data,
      this.currentBatch,
      this.totalBatches,
      `${this.currentBatch}`,
    );
    batch.registerStateListener(this);
    this.currentBatch++;
    return batch;
  }
}
