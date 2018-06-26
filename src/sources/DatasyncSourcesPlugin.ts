import { SourcePlugin } from 'inceptum-etl';
import { LogManager, Context, InceptumApp, BaseSingletonDefinition } from 'inceptum';
import InvoicesSource from './InvoicesSource';
import SalesSource from './SalesSource';

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
        case 'SalesSync':
          {
            const singletonDefinition = new BaseSingletonDefinition<any>(SalesSource, 'EtlSource');
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
