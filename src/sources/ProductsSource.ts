import { EtlSource, EtlBatch, EtlState } from 'inceptum-etl';

export default class ProductsSource extends EtlSource {

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
