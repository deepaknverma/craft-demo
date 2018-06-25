import { TransformerPlugin } from 'inceptum-etl';
import { LogManager, Context, InceptumApp, BaseSingletonDefinition } from 'inceptum';
import InvoicesTransformer from './InvoicesTransformer';
import SalesTransformer from './SalesTransformer';
import ProductsTransformer from './ProductsTransformer';
import PaymentsTransformer from './PaymentsTransformer';

export interface TransformersConfig {
    dbClient: string,
    fieldsMapping: {},
}
const log = LogManager.getLogger();
export class DatasyncTransformerPlugin extends TransformerPlugin {
  protected registerTransformerSingleton(etlName: string, transformersType: string, transformersConfig: TransformersConfig, context: Context) {
    try {
      switch (transformersType) {
        case 'InvoicesSync':
          {
            const singletonDefinition = new BaseSingletonDefinition<any>(InvoicesTransformer, this.getEtlObjectName());
            context.registerSingletons(singletonDefinition);
          }
          break;
        case 'SalesSync':
          {
            const singletonDefinition = new BaseSingletonDefinition<any>(SalesTransformer, this.getEtlObjectName());
            context.registerSingletons(singletonDefinition);
          }
          break;
        case 'ProductsSync':
          {
            const singletonDefinition = new BaseSingletonDefinition<any>(ProductsTransformer, this.getEtlObjectName());
            context.registerSingletons(singletonDefinition);
          }
          break;
        case 'PaymentsSync':
          {
            const singletonDefinition = new BaseSingletonDefinition<any>(PaymentsTransformer, this.getEtlObjectName());
            context.registerSingletons(singletonDefinition);
          }
          break;
        default:
          super.registerTransformerSingleton(etlName, transformersType, transformersConfig, context);
      }
    } catch (e) {
        throw new Error(`Unknown transformation type: ${transformersType}`);
    }
  }
}
