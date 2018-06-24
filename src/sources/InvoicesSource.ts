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

export default class InvoicesSource extends EtlSource {

  public async getNextBatch(): Promise<EtlBatch> {
    return;
  }
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
    return;
  }
  /* istanbul ignore next */
  // tslint:disable:prefer-function-over-method
  stateChanged(newState: EtlState): Promise<void> {
    return Promise.resolve();
  }
}
