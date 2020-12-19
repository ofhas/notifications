import winston, { Logger } from 'winston'

interface LoggingConfig {
    appName: string
    console: boolean
    file: boolean
}

let logger: Logger;

export const initLogger = (config?: LoggingConfig) => {
  logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: `${config?.appName}.log` })
    ]
  })

  return logger;
}
export const get = () => logger
export const getLogger = () => logger

export default {
  get,
  initLogger,
  getLogger
}
