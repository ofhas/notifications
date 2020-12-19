import mongoos, { Schema, Document, model } from 'mongoose';
import { Channel, UserToChannel } from './types';

interface ChannelDoc extends Document<Channel> {
  _doc: Channel;
}

interface UserToChannelDoc extends Document<UserToChannel> {
  _doc: UserToChannel;
}

export const ChannelSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String },
  },
  { timestamps: true }
);

export const UserToChannelSchema: Schema = new Schema(
  {
    user_id: { type: String, required: true },
    channel_id: { type: String, required: true },
  },
  { timestamps: true }
);
UserToChannelSchema.index({ user_id: 1, channel_id: 1 }, { unique: true });

export const getUserToChannelSchemaModel = (org: string) =>
  model<UserToChannelDoc>('UserToChannel', UserToChannelSchema, `${org}_users_channels`);
export const getChannelsModel = (org: string) =>
  model<ChannelDoc>('Channel', ChannelSchema, `${org}_channels`);

// Export the model and return your IUser interface
export default {
  getChannelsModel,
  getUserToChannelSchemaModel
};
