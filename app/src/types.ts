export interface User { 
    username: string,
    password: string 
}
export type Errors = string[]
export type WSClient = {
    send: (msg: string) => void;
    close: () => void;
}
