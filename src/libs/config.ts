import { JWTConfig } from "../modules/authentication/types";

let config: Config;
const logger = console

const getConfByEnv = async (env: string): Promise<any> => {
    return require(`../conf/${env}`).default
}
export interface Config {
    jwt: JWTConfig
}

export const get = (): Config => config
export const getConfig = (): Config => config

export default async () => {
    const all = require("../conf/cmn").default
    const env = await getConfByEnv(process.env.NODE_ENV || "NotFound").catch(e => {
        logger.error('Can\'t find additional conf file', e)
    })

    config = {
        ...all,
         ...env
        }
    return config;
}
