"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inceptum_etl_1 = require("inceptum-etl");
const inceptum_1 = require("inceptum");
const InvoicesDestination_1 = require("./InvoicesDestination");
const SalesDestination_1 = require("./SalesDestination");
const ProductsDestination_1 = require("./ProductsDestination");
const PaymentsDestination_1 = require("./PaymentsDestination");
const log = inceptum_1.LogManager.getLogger();
class DatasyncDestinationPlugin extends inceptum_etl_1.DestinationPlugin {
    registerDestinationSingleton(etlName, destinationType, destinationConfig, context) {
        try {
            switch (destinationType) {
                case 'InvoicesSync':
                    {
                        const singletonDefinition = new inceptum_1.BaseSingletonDefinition(InvoicesDestination_1.default, this.getEtlObjectName());
                        context.registerSingletons(singletonDefinition);
                    }
                    break;
                case 'SalesSync':
                    {
                        const singletonDefinition = new inceptum_1.BaseSingletonDefinition(SalesDestination_1.default, this.getEtlObjectName());
                        singletonDefinition.constructorParamByValue(destinationConfig['destinationOptions']);
                        context.registerSingletons(singletonDefinition);
                    }
                    break;
                case 'ProductsSync':
                    {
                        const singletonDefinition = new inceptum_1.BaseSingletonDefinition(ProductsDestination_1.default, this.getEtlObjectName());
                        context.registerSingletons(singletonDefinition);
                    }
                    break;
                case 'PaymentsSync':
                    {
                        const singletonDefinition = new inceptum_1.BaseSingletonDefinition(PaymentsDestination_1.default, this.getEtlObjectName());
                        context.registerSingletons(singletonDefinition);
                    }
                    break;
                default:
                    super.registerDestinationSingleton(etlName, destinationType, destinationConfig, context);
            }
        }
        catch (e) {
            log.debug(e);
        }
    }
}
exports.DatasyncDestinationPlugin = DatasyncDestinationPlugin;
//# sourceMappingURL=DatasyncDestinationsPlugin.js.map