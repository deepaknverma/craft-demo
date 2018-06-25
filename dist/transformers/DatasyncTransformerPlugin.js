"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inceptum_etl_1 = require("inceptum-etl");
const inceptum_1 = require("inceptum");
const InvoicesTransformer_1 = require("./InvoicesTransformer");
const SalesTransformer_1 = require("./SalesTransformer");
const ProductsTransformer_1 = require("./ProductsTransformer");
const PaymentsTransformer_1 = require("./PaymentsTransformer");
const log = inceptum_1.LogManager.getLogger();
class DatasyncTransformerPlugin extends inceptum_etl_1.TransformerPlugin {
    registerTransformerSingleton(etlName, transformersType, transformersConfig, context) {
        try {
            switch (transformersType) {
                case 'InvoicesSync':
                    {
                        const singletonDefinition = new inceptum_1.BaseSingletonDefinition(InvoicesTransformer_1.default, this.getEtlObjectName());
                        context.registerSingletons(singletonDefinition);
                    }
                    break;
                case 'SalesSync':
                    {
                        const singletonDefinition = new inceptum_1.BaseSingletonDefinition(SalesTransformer_1.default, this.getEtlObjectName());
                        context.registerSingletons(singletonDefinition);
                    }
                    break;
                case 'ProductsSync':
                    {
                        const singletonDefinition = new inceptum_1.BaseSingletonDefinition(ProductsTransformer_1.default, this.getEtlObjectName());
                        context.registerSingletons(singletonDefinition);
                    }
                    break;
                case 'PaymentsSync':
                    {
                        const singletonDefinition = new inceptum_1.BaseSingletonDefinition(PaymentsTransformer_1.default, this.getEtlObjectName());
                        context.registerSingletons(singletonDefinition);
                    }
                    break;
                default:
                    super.registerTransformerSingleton(etlName, transformersType, transformersConfig, context);
            }
        }
        catch (e) {
            throw new Error(`Unknown transformation type: ${transformersType}`);
        }
    }
}
exports.DatasyncTransformerPlugin = DatasyncTransformerPlugin;
//# sourceMappingURL=DatasyncTransformerPlugin.js.map