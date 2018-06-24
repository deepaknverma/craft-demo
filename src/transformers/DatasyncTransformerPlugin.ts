import { TransformerPlugin } from 'inceptum-etl';
import { LogManager, Context, InceptumApp, BaseSingletonDefinition } from 'inceptum';
import InvoicesTranformer from './InvoicesTranformer';
import ExpensesTranformer from './ExpensesTranformer';
import ProductsTranformer from './ProductsTranformer';
import PaymentsTranformer from './PaymentsTranformer';

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
            const singletonDefinition = new BaseSingletonDefinition<any>(InvoicesTranformer, this.getEtlObjectName());
            context.registerSingletons(singletonDefinition);
          }
          break;
        case 'ExpensesSync':
          {
            const singletonDefinition = new BaseSingletonDefinition<any>(ExpensesTranformer, this.getEtlObjectName());
            context.registerSingletons(singletonDefinition);
          }
          break;
        case 'ProductsSync':
          {
            const singletonDefinition = new BaseSingletonDefinition<any>(ProductsTranformer, this.getEtlObjectName());
            context.registerSingletons(singletonDefinition);
          }
          break;
        case 'PaymentsSync':
          {
            const singletonDefinition = new BaseSingletonDefinition<any>(PaymentsTranformer, this.getEtlObjectName());
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
