const config = {
    // general
    appName: "notifications",
    // logging
    console: true,
    file: true,
    fileName: "app-log",
    // http
    port: process.env.PORT || 8080,
    // mongo
    mongo: {
        host: "localhost",
        port: 27017,
        database: "notifications"
    },
    // primus
    primus: {
        pathname: '/ws'
    }
};

export default config;