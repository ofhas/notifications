import winston from 'winston'
import config from './src/libs/config'
import passport from './src/libs/passport'
import express from './src/libs/express'
import { initLogger } from './src/libs/logging'
import server from './src/libs/server'
import ws from './src/libs/ws'
import mongo from './src/libs/mongo'
import rabbitmq from './src/libs/rabbitmq'

// tslint:disable-next-line:no-var-requires
const bootleg = require('bootleg')
const app = bootleg();

app.phase('config', config);
app.phase('logging', initLogger, "@config");
app.phase('mongo', mongo, "@logging", "@config");
app.phase('passport', passport,'@logging', '@config');
app.phase('express', express, '@logging', '@passport');
app.phase('server', server, '@logging', '@express', '@config');
// app.phase('kafka', kafka, '@logging', '@config');
app.phase('rabbitmq', rabbitmq , '@logging', '@config');
app.phase('ws', ws, '@logging', '@server', '@config');

app
.boot()
.then((components: {logging: winston.Logger, config: { appName: string }}) => {
    const logger = components.logging;
    const { appName } = components.config;
    logger.info(`app: ${appName} boot successfully. env: ${process.env.NODE_ENV}`)
})
.catch((e: object) => {
    /*
        In case the boot sequence fails we don't have
        access to the logger instance, so we left with console.
    */
   /* tslint:disable-next-line:no-console */
    console.error("Boot failed: ", e)
    process.exit(1)
})
.done();