import { Schema, Document, model } from 'mongoose';
import { Message } from '../../types/Message';

interface MessageDoc extends Document<Message> {
  _doc: Message;
}

export const MessageSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    from: {
      type: {
        id: String,
        username: String,
        name: String,
      },
      required: true,
    },
    channel: { type: String, required: true, index: 1 },
    msg: { type: String, required: true },
  },
  {
    timestamps: true
  }
);

export const getMessagesModel = (org: string) =>
  model<MessageDoc>('Message', MessageSchema, `${org}_messages`);

// Export the model and return your IUser interface
export default {
  getMessagesModel,
};
