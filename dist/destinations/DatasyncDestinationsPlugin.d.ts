import { DestinationPlugin } from 'inceptum-etl';
import { Context } from 'inceptum';
export declare class DatasyncDestinationPlugin extends DestinationPlugin {
    protected registerDestinationSingleton(etlName: string, destinationType: string, destinationConfig: object, context: Context): void;
}
