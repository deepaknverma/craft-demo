import { DestinationPlugin } from 'inceptum-etl';
import { LogManager, Context, BaseSingletonDefinition } from 'inceptum';
import InvoicesDestination from './InvoicesDestination';
import SalesDestination from './SalesDestination';

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
        case 'SalesSync':
          {
            const singletonDefinition = new BaseSingletonDefinition<any>(SalesDestination, this.getEtlObjectName());
            singletonDefinition.constructorParamByValue(destinationConfig['destinationOptions']);
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
