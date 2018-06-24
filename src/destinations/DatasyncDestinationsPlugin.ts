import { DestinationPlugin } from 'inceptum-etl';
import { LogManager, Context, BaseSingletonDefinition } from 'inceptum';
import InvoicesDestination from './InvoicesDestination';
import ExpensesDestination from './ExpensesDestination';
import ProductsDestination from './ProductsDestination';
import PaymentsDestination from './PaymentsDestination';

const log = LogManager.getLogger();
export class DatasyncDestinationPlugin extends DestinationPlugin {
  protected registerDestinationSingleton(etlName: string, destinationType: string, destinationConfig: object, context: Context) {
    try {
      switch (destinationType) {
        case 'InvoicesSync':
          {
            const singletonDefinition = new BaseSingletonDefinition<any>(InvoicesDestination, this.getEtlObjectName());
            context.registerSingletons(singletonDefinition);
          }
          break;
        case 'ExpensesSync':
          {
            const singletonDefinition = new BaseSingletonDefinition<any>(ExpensesDestination, this.getEtlObjectName());
            context.registerSingletons(singletonDefinition);
          }
          break;
        case 'ProductsSync':
          {
            const singletonDefinition = new BaseSingletonDefinition<any>(ProductsDestination, this.getEtlObjectName());
            context.registerSingletons(singletonDefinition);
          }
          break;
        case 'PaymentsSync':
          {
            const singletonDefinition = new BaseSingletonDefinition<any>(PaymentsDestination, this.getEtlObjectName());
            context.registerSingletons(singletonDefinition);
          }
          break;
        default:
          super.registerDestinationSingleton(etlName, destinationType, destinationConfig, context);
      }
    } catch (e) {
      log.debug(e);
    }
  }
}
