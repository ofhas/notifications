const hostname = 'localhost:9000'
const apiPathPrefix = '/api'
const config = {
    // mongo
    mongo: {
        host: "mongodb",
        port: 27017,
        database: "notifications"
    },
    kafka: {
        hosts: ["kafka"]
    },
    rabbitmq:{
        user: "admin",
        password: "admin",
        host: "rabbitmq"
    },
    jwt:{
        secret: process.env.JWT_SECRET,
        algorithm: 'aes-256-ctr',
        iv: '1234567890123456'
    },
    passport: {
        clientID: process.env.G_CLIEND_ID,
        clientSecret: process.env.G_CLIENT_SECRET,
        callbackURL: `http://${hostname}${apiPathPrefix}/auth/google/callback`
    }
};

export default config;
