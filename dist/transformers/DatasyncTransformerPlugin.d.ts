import { TransformerPlugin } from 'inceptum-etl';
import { Context } from 'inceptum';
export interface TransformersConfig {
    dbClient: string;
    fieldsMapping: {};
}
export declare class DatasyncTransformerPlugin extends TransformerPlugin {
    protected registerTransformerSingleton(etlName: string, transformersType: string, transformersConfig: TransformersConfig, context: Context): void;
}
