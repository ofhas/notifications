import mongoose from 'mongoose'
import winston from 'winston'

interface MongoConfig {
    host: string
    port: number
    database: string
}

interface Config {
  mongo: MongoConfig
}

export default (logger: winston.Logger, config: Config) => {
  const {host, port, database} : MongoConfig = config.mongo
  const url = process.env.MONGO_URI || `mongodb://${host}:${port}/${database}`;
  logger.info(`connecting to mongodb: ${url}`);
  const connection = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).catch(e => {
    logger.error('Error connecting to mongo', e);
    throw e;
  }).then(data => {
    logger.info(`mongodb connected`);
    return data;
  });
  return connection
};
