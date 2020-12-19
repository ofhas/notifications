// import winston from "winston";

// import Kafka, { ConsumerGlobalConfig, ConsumerStream } from 'node-rdkafka';

// interface KafkaConfig {
//     hosts: string[]
// }

// interface Config {
//     kafka: KafkaConfig
// }

// export interface KafkaModule {
//     createStream: ({ channels }: { channels: string[] }) => ConsumerStream
// }

// export default (logger: winston.Logger, config: Config): KafkaModule => {
//     const globalConfig: ConsumerGlobalConfig = {
//         "metadata.broker.list": config.kafka.hosts.join(',')
//     }
//     const topicConfig: Kafka.ConsumerTopicConfig = {
//         "auto.commit.enable": false,
//         "enable.auto.commit": false
//     }

//     return {
//         createStream: ({ channels }: { channels: string[] }) : ConsumerStream => {
//             logger.info("Creating new consumer stream", channels)
//             return Kafka.createReadStream(globalConfig, topicConfig, {
//             topics: channels
//           })
//         }
//     }
// }