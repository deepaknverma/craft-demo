"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inceptum_1 = require("inceptum");
const program = require("commander");
const moment = require("moment-timezone");
const inceptum_etl_1 = require("inceptum-etl");
const DatasyncSavepointsPlugin_1 = require("./savepoints/DatasyncSavepointsPlugin");
const DatasyncDestinationsPlugin_1 = require("./destinations/DatasyncDestinationsPlugin");
const DatasyncTransformerPlugin_1 = require("./transformers/DatasyncTransformerPlugin");
const DatasyncSourcesPlugin_1 = require("./sources/DatasyncSourcesPlugin");
// please use moment in the code to manage the timezone correctly
moment.tz.setDefault('Australia/Sydney');
program.version('0.1.0')
    .usage('[options] <etlName>')
    .option('-v', 'verbose')
    .parse(process.argv);
if (program.args.length === 0) {
    // tslint:disable-next-line:no-console
    console.log('Please specify an etl to execute');
    // tslint:disable-next-line:no-console
    console.log(program.usage());
    process.exit(1);
}
const etlName = program.args[0];
const app = new inceptum_1.InceptumApp();
const context = app.getContext();
const logger = context.getLogger();
logger.debug('debug: ', app.getConfig('etls', []));
const validEtls = [
    ...app.getConfig('app.validEtls', []),
    ...Object.keys(app.getConfig('etls', [])),
];
if (validEtls.indexOf(etlName) < 0) {
    // tslint:disable-next-line:no-console
    console.log(`Unknown etl name: ${etlName}. Valid etls: ${validEtls.join(', ')}`);
    // tslint:disable-next-line:no-console
    console.log(program.usage());
    process.exit(1);
}
logger.info(`Starting execution of ETL: ${etlName}`);
app.use(new DatasyncSavepointsPlugin_1.DatasyncSavepointPlugin(etlName), new DatasyncDestinationsPlugin_1.DatasyncDestinationPlugin(etlName), new DatasyncSourcesPlugin_1.DatasyncSourcePlugin(etlName), new DatasyncTransformerPlugin_1.DatasyncTransformerPlugin(etlName), new inceptum_etl_1.ConfigPlugin(etlName), new inceptum_etl_1.RunnerPlugin(etlName));
const f = () => __awaiter(this, void 0, void 0, function* () {
    try {
        yield app.start();
        const etlRunner = yield context.getObjectByName('EtlRunner');
        yield etlRunner.executeEtl();
        // log success
        logger.info(`Finished, all good!`);
    }
    catch (err) {
        logger.fatal(err, `Finished Error:${err.message}`);
    }
    yield app.stop();
});
f().catch((err) => {
    logger.fatal(err, `Etl finished before starting :${err.message}`);
});
//# sourceMappingURL=index.js.map