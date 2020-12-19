import * as uuid from 'uuid';

export class Channel {
  id: string;
  name: string;
  createdAt: Date;

  constructor(name: string) {
    this.id = uuid.v4();
    this.name = name;
    this.createdAt = new Date();
  }
}
export class UserToChannel {
  user_id: string;
  channel_id: string;

  constructor(userId: string, channelId: string) {
    this.user_id = userId;
    this.channel_id = channelId;
  }
  get userId(): string {
    return this.user_id
  }
  set userId(id: string) {
    this.user_id = id
  }
  get channelId(): string {
    return this.channel_id
  }
  set channelId(id: string) {
    this.channel_id = id
  }
}
