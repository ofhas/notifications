import os from "os";
import winston from "winston";
import amqp from "amqplib";
import msgsStore from '../modules/messages/store'

interface RbbitConfig {
    host: string
    user: string
    password: string
}

interface Config {
    rabbitmq: RbbitConfig
}
export const NOTIFICATION_EXCHANGES = 'api-notification'
export interface RabbitModule {
    subscribeToChannels: ({ channels }: { channels: string[] }) => any
}

const ensureTopology = (rabbitMQChannel: amqp.Channel,
    queue: string,
    exchange: string) => rabbitMQChannel
        .assertQueue(queue)
        .then(ok => rabbitMQChannel.assertExchange(NOTIFICATION_EXCHANGES, 'fanout'))
        .then(ok => rabbitMQChannel.bindQueue(queue, exchange, '*'))

let channel: amqp.Channel | undefined;
export const getChannel = ()=> channel
export default async (logger: winston.Logger,
config: Config): Promise<amqp.Channel> => {
    // const subscribedChannels
    const { user, password, host } = config.rabbitmq
    const url = `amqp://${user}:${password}@${host}`
    logger.info('Connecting to rabbitmq...', { url })
    const conn = await amqp.connect(url)
    const scopedChannel = channel = await conn.createChannel()
    scopedChannel.on("error", ()=>({}))
    const exchange = NOTIFICATION_EXCHANGES
    const queue = `${NOTIFICATION_EXCHANGES}-${os.hostname}`
    await ensureTopology(scopedChannel, queue, exchange)
    .then(ok =>
        scopedChannel.consume(queue,
             msg => msg && msgsStore.subject.next(msg),
             { exclusive: true, noAck: true }))

    return scopedChannel
}