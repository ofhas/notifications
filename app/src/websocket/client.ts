const config  = require("config");

const Primus = require('./primus.js')

const { path } = config.ws;

export function createWSClient(token: string) {
    const origin = window.location.origin.replace('http', 'ws')
    const url = `${origin}${path}?access_token=${token}`
    const client = new Primus(url);
    
    client.pathname =  path || '/ws'
    client.on('open', () => console.info(`Connected to: ${url}`))
    client.on('error', (e: object) => {
        console.error('Error in WS connection.', e);
        window.location.replace('/');
    });
    client.on('end', () => console.info(`Disconnected from: ${url}`));

    window.onbeforeunload = function () {
        client.end();
    };

    return client
}
