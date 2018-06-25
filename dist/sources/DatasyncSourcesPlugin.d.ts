import { SourcePlugin } from 'inceptum-etl';
import { Context } from 'inceptum';
export declare class DatasyncSourcePlugin extends SourcePlugin {
    protected registerSourceSingleton(etlName: string, sourceType: string, sourceConfig: any, context: Context): void;
}
