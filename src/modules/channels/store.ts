import model from './model';
import { Channel } from './types';
import { User } from '../users/types';

export default {
  getChannelsByIds: (org: string, channels: string[]) =>
    model.getChannelsModel(org).find({ id: { $in: channels } }),
  async getChannelsForUser(user: User, org: string): Promise<Channel[]> {
    return model
      .getUserToChannelSchemaModel(org)
      .find({ user_id: user.id })
      .exec()
      .then((res) => res.map((rel) => rel._doc.channel_id))
      .then((ids) => this.getChannelsByIds(org, ids));
  },
  async createChannel(
    channel: Channel,
    org: string,
    users: string[]
  ): Promise<Channel> {
    const ChannelModel = model.getChannelsModel(org);
    const savedChannel = await new ChannelModel(channel)
      .save()
      .then((doc) => doc._doc);
    const ops = users.map((id) => ({
      updateOne: {
        filter: { channel_id: savedChannel.id, user_id: id },
        update: { channel_id: savedChannel.id, user_id: id },
        upsert: true,
      },
    }));
    return model
      .getUserToChannelSchemaModel(org)
      .bulkWrite(ops)
      .then(() => channel);
  }
};
