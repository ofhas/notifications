import axios from 'axios';
import { Channel } from '../../src/modules/channels/types';
import { User } from '../../src/modules/users/types';
import { Message } from '../../src/types/Message';
const prefix = '/api'
export const getChannelMsgs = (channelId: string) =>
  axios
    .get(`${prefix}/channels/msgs?channel=${channelId}`, {
      withCredentials: true,
    })
    .then((res) => res.data)
    .then<Message[]>((response) => response && response.data);
export const getChannels = () =>
  axios
    .get(`${prefix}/channels`, { withCredentials: true })
    .then((res) => res.data)
    .then<Channel[]>((response) => response && response.data);
export const getUsers = () =>
  axios
    .get(`${prefix}/users`, { withCredentials: true })
    .then((res) => res.data)
    .then<User[]>((response) => response && response.data);
export const postChannel = (channel: Channel, users: string[]) =>
  axios
    .post(`${prefix}/channels`, { channel, users }, { withCredentials: true })
    .then((res) => res.data)
    .then<Channel>((response) => response && response.data);
export const authWithCoockie = () =>
    axios
      .get(`${prefix}/auth`, { withCredentials: true })
      .then((res) => res.data)

export const logout = () =>
    axios
      .get(`${prefix}/logout`, { withCredentials: true })
      .then(() => location.replace('/'))

export default {
  getChannelMsgs,
  getChannels,
  getUsers,
  postChannel,
  authWithCoockie,
  logout
};
