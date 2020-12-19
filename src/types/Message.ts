import * as uuid from 'uuid'
import {  Response } from './Action'

export interface From {
    id: string
    username: string
    name?: string
}
export class Message {
    id: string
    from: From
    channel: string
    msg: string
    created_at: Date
    updated_at: Date
    constructor(from: From, channel: string, msg: string){
        this.id = uuid.v4();
        this.from = from;
        this.channel = channel;
        this.msg = msg;
        this.created_at = new Date();
        this.updated_at = new Date();
    }
    get updatedAt(){
        return this.updated_at
    }
    set updatedAt(date: Date){
         this.updated_at = date
    }
    get createdAt(){
        return this.created_at
    }
    set createdAt(date: Date){
         this.created_at = date
    }

}

export interface NotificationMessage<T> extends Response<T> {
    organization: string
}