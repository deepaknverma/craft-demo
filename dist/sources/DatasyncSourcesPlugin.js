"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inceptum_etl_1 = require("inceptum-etl");
const inceptum_1 = require("inceptum");
const InvoicesSource_1 = require("./InvoicesSource");
const SalesSource_1 = require("./SalesSource");
const ProductsSource_1 = require("./ProductsSource");
const PaymentsSource_1 = require("./PaymentsSource");
const log = inceptum_1.LogManager.getLogger();
class DatasyncSourcePlugin extends inceptum_etl_1.SourcePlugin {
    registerSourceSingleton(etlName, sourceType, sourceConfig, context) {
        try {
            switch (sourceType) {
                case 'InvoicesSync':
                    {
                        const singletonDefinition = new inceptum_1.BaseSingletonDefinition(InvoicesSource_1.default, 'EtlSource');
                        singletonDefinition.constructorParamByValue(sourceConfig['sourceOptions']);
                        context.registerSingletons(singletonDefinition);
                    }
                    break;
                case 'SalesSync':
                    {
                        const singletonDefinition = new inceptum_1.BaseSingletonDefinition(SalesSource_1.default, 'EtlSource');
                        singletonDefinition.constructorParamByValue(sourceConfig['sourceOptions']);
                        context.registerSingletons(singletonDefinition);
                    }
                    break;
                case 'ProductsSync':
                    {
                        const singletonDefinition = new inceptum_1.BaseSingletonDefinition(ProductsSource_1.default, 'EtlSource');
                        singletonDefinition.constructorParamByValue(sourceConfig['sourceOptions']);
                        context.registerSingletons(singletonDefinition);
                    }
                    break;
                case 'PaymentsSync':
                    {
                        const singletonDefinition = new inceptum_1.BaseSingletonDefinition(PaymentsSource_1.default, 'EtlSource');
                        singletonDefinition.constructorParamByValue(sourceConfig['sourceOptions']);
                        context.registerSingletons(singletonDefinition);
                    }
                    break;
                default:
                    super.registerSourceSingleton(etlName, sourceType, sourceConfig, context);
            }
        }
        catch (e) {
            log.debug(e);
        }
    }
}
exports.DatasyncSourcePlugin = DatasyncSourcePlugin;
//# sourceMappingURL=DatasyncSourcesPlugin.js.map