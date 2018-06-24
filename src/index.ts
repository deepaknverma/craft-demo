import { LogManager, InceptumApp, Context } from 'inceptum';
import * as program from 'commander';
import * as moment from 'moment-timezone';
import { ConfigPlugin, RunnerPlugin } from 'inceptum-etl';
import { DatasyncSavepointPlugin } from './savepoints/DatasyncSavepointsPlugin';
import { DatasyncDestinationPlugin } from './destinations/DatasyncDestinationsPlugin';
import { DatasyncTransformerPlugin } from './transformers/DatasyncTransformerPlugin';
import { DatasyncSourcePlugin } from './sources/DatasyncSourcesPlugin';

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

const app = new InceptumApp();
const context = app.getContext();

const logger = context.getLogger();

logger.debug('debug: ', app.getConfig('etls', []));
const validEtls = [
  ...app.getConfig('app.validEtls', []),
  ...Object.keys(app.getConfig('etls', [])),
];

if (validEtls.indexOf(etlName) < 0) {
  // tslint:disable-next-line:no-console
  console.log(
    `Unknown etl name: ${etlName}. Valid etls: ${validEtls.join(', ')}`,
  );
  // tslint:disable-next-line:no-console
  console.log(program.usage());
  process.exit(1);
}

logger.info(`Starting execution of ETL: ${etlName}`);

app.use(
  new DatasyncSavepointPlugin(etlName),
  new DatasyncDestinationPlugin(etlName),
  new DatasyncSourcePlugin(etlName),
  new DatasyncTransformerPlugin(etlName),
  new ConfigPlugin(etlName),
  new RunnerPlugin(etlName),
);

const f = async () => {
  try {
    await app.start();
    const etlRunner = await context.getObjectByName('EtlRunner');
    await etlRunner.executeEtl();
    // log success
    logger.info(`Finished, all good!`);
  } catch (err) {
    logger.fatal(err, `Finished Error:${err.message}`);
  }
  await app.stop();
};
f().catch((err) => {
  logger.fatal(err, `Etl finished before starting :${err.message}`);
});
