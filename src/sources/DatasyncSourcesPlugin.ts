import { SourcePlugin } from 'inceptum-etl';
import { LogManager, Context, InceptumApp, BaseSingletonDefinition } from 'inceptum';
import InvoicesSource from './InvoicesSource';
import ExpensesSource from './ExpensesSource';
import ProductsSource from './ProductsSource';
import PaymentsSource from './PaymentsSource';

const log = LogManager.getLogger();

export class DatasyncSourcePlugin extends SourcePlugin {
  protected registerSourceSingleton(etlName: string, sourceType: string, sourceConfig: any, context: Context) {
    try {
      switch (sourceType) {
        case 'InvoicesSync':
          {
            const singletonDefinition = new BaseSingletonDefinition<any>(InvoicesSource, 'EtlSource');
            singletonDefinition.constructorParamByValue(sourceConfig['sourceOptions']);
            context.registerSingletons(singletonDefinition);
          }
          break;
        case 'ExpensesSync':
          {
            const singletonDefinition = new BaseSingletonDefinition<any>(ExpensesSource, 'EtlSource');
            singletonDefinition.constructorParamByValue(sourceConfig['sourceOptions']);
            context.registerSingletons(singletonDefinition);
          }
          break;
        case 'ProductsSync':
          {
            const singletonDefinition = new BaseSingletonDefinition<any>(ProductsSource, 'EtlSource');
            singletonDefinition.constructorParamByValue(sourceConfig['sourceOptions']);
            context.registerSingletons(singletonDefinition);
          }
          break;
        case 'PaymentsSync':
          {
            const singletonDefinition = new BaseSingletonDefinition<any>(PaymentsSource, 'EtlSource');
            singletonDefinition.constructorParamByValue(sourceConfig['sourceOptions']);
            context.registerSingletons(singletonDefinition);
          }
          break;
      default:
        super.registerSourceSingleton(
          etlName,
          sourceType,
          sourceConfig,
          context,
        );
      }
} catch (e) {
  log.debug(e);
    }
  }
}
