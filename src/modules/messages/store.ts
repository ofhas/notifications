import amqp from 'amqplib';
import * as rxjs from 'rxjs';
import { Dictionary } from 'lodash';
import { Message, NotificationMessage } from '../../types/Message';
import { filter, map, share } from 'rxjs/operators';
import logging, { get } from '../../libs/logging';
import { Maybe } from './MaybeNotificationMessage';
import { getChannel, NOTIFICATION_EXCHANGES } from '../../libs/rabbitmq';
import { Response, ResponseTypes } from '../../types/Action';
import model from './model';
import { toDotNotation } from '../utils';

export const publishToExchange = <T>(action: NotificationMessage<T>) =>
  getChannel()?.publish(
    NOTIFICATION_EXCHANGES,
    '',
    Buffer.from(JSON.stringify(action))
  );
const subject = new rxjs.Subject<amqp.ConsumeMessage>();
const notificationMessageChannel$ = subject
  .pipe(
    map<amqp.ConsumeMessage, Dictionary<any>>((msgStr) => {
      try {
        const msg = JSON.parse(msgStr.content.toString());
        return msg;
      } catch (e) {
        get().error('Error parsing msg to JSON', e, msgStr);
      }
    })
  )
  .pipe(filter((x) => x != null))
  .pipe(
    map<Dictionary<any>, Maybe<NotificationMessage<Dictionary<any>>>>(
      (dict) => {
        try {
          return {
            valid: true,
            data: {
              ...Response.fromData<Dictionary<any>>(dict.type, dict.data),
              organization: dict.organization,
            },
          };
        } catch (e) {
          logging.get().error('Fail validating Action.', e, { ...dict });
          return { valid: false, data: e };
        }
      }
    )
  )
  .pipe(
    filter((x) => !!x?.valid),
    map((x) => x?.data)
  );

const multicasted = notificationMessageChannel$.pipe(share());

export const getMsgsObserver = (channels: Set<string>, org: string) => {
  const observ = new rxjs.Subject<NotificationMessage<Dictionary<any>>>();
  const subscription = multicasted.subscribe(observ);
  const channel$ = observ.pipe(
    filter(
      (action) =>
        action.organization === org &&
        action.type === ResponseTypes.MessagesUpdate &&
        channels.has((action.data as Message).channel)
    ),
    map((notifMessage) => notifMessage.data as Message)
  );
  return {
    channel$,
    subscription,
  };
};
export const upsertMsgs = (msgs: Message[], organization: string) =>{
  const ops = msgs.map((msg) => ({
    updateOne: {
      filter: { id: msg.id },
      update: toDotNotation(msg),
      upsert: true,
    },
  }))

  return model
  .getMessagesModel(organization)
  .bulkWrite(ops)
    .then((doc) => doc)
    .catch(e => {
      logging.getLogger().error(e)
      throw e;
    });
}

export const getChannelsMsgs = (channel: string, org: string) =>
  model.getMessagesModel(org).find({ channel }).sort({_id: -1}).limit(100).exec();

export default {
  getChannelsMsgs,
  upsertMsgs,
  getMsgsObserver,
  subject,
};
