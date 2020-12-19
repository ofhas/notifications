import http from "http";
import UnreachableCaseError from "../UnreachableCaseError";
import { User } from "../modules/users/types";
import { Message } from "./Message";

export enum ActionType {
  SendMessage = "SendMessage",
  RefreshSubscription = "RefreshSubscription",
  Empty = 'Empty',
}
export enum ResponseTypes {
    MessageSent = "MessageSent",
    MessagesUpdate = 'MessagesUpdate',
    SubscriptionRefresed = "SubscriptionRefresed",
  }
export interface IncomingMessageWithAuthContext extends http.IncomingMessage {
    authContext: {
      user: User;
    };
}

export interface ValidatedAction<T> {
    action?: Action<T>;
    valid: boolean;
}

  export class Action<T> {
    type: ActionType;
    data?: T;

    constructor(type: ActionType, data?: T) {
      this.type = type;
      this.data = data;
    }

    static fromData<T>(type: string, data?: T): Action<T> {
      const mayBeType: ActionType = (ActionType as any)[type];
      switch (mayBeType) {
        case ActionType.SendMessage:
          return new Action(mayBeType, data);
        case ActionType.RefreshSubscription:
            return new Action(mayBeType, data);
        case ActionType.Empty:
          return new Action(mayBeType, data);
        default:
          throw new UnreachableCaseError(mayBeType);
      }
    }
  }

  export class Response<T> {
    type: ResponseTypes;
    data?: T;

    constructor(type: ResponseTypes, data?: T) {
      this.type = type;
      this.data = data;
    }

    static fromData<T>(type?: string, data?: T): Response<T> {
      const mayBeType: ResponseTypes = (ResponseTypes as any)[type || 'unknown'];
      switch (mayBeType) {
        case ResponseTypes.MessageSent:
          return new Response(ResponseTypes.MessageSent, data);
        case ResponseTypes.MessagesUpdate:
          return new Response(ResponseTypes.MessagesUpdate, data);
        case ResponseTypes.SubscriptionRefresed:
          return new Response(ResponseTypes.SubscriptionRefresed, data);
        default:
          throw new UnreachableCaseError(mayBeType);
      }
    }
  }