import { Dictionary, groupBy } from 'lodash';
import { makeAutoObservable } from 'mobx';
import { User } from '../../../src/modules/users/types';

export default class Store {
  user: User;
  users: User[] = [];
  token: string = '';
  channelCounters: Dictionary<number> = {};

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: User) {
    this.user = user;
  }

  resetUser() {
    this.user;
  }

  setUsers(users: User[]) {
    this.users = users;
  }

  setToken(token: string) {
    this.token = token;
  }

  addCounters(counters: Dictionary<number>) {
    const update = Object.entries(counters).reduce(
      (acc, [channelId, counter]) => {
        const nextCounter = (this.channelCounters[channelId] || 0) + counter;
        return {
          ...acc,
          [channelId]: nextCounter,
        };
      },
      {}
    );

    this.channelCounters = {
      ...this.channelCounters,
      ...update,
    };
  }

  resetChannelCounter(channelId: string){
    this.channelCounters = {
        ...this.channelCounters,
        [channelId]: 0
    }
  }
}
