import React, { useEffect } from 'react';
import axios from 'axios';
import Login from '../Login';
import Channels from '../Channels';
import { observer } from 'mobx-react-lite';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  Redirect,
} from 'react-router-dom';

import Store from '../observables/Store';
import './index.sass';
import { User } from '../types';
import api, { getUsers } from '../api';
import { Dictionary } from 'lodash';
export interface ChatProps {
  store: Store;
}

export interface APIConfig {
  paths: Dictionary<string>;
}

const {
  api: apiConf,
  path,
}: { api: APIConfig; path: string } = require('config');

const login = (user: User) =>
  axios
    .post(`${path + apiConf.paths.login}`, user, { withCredentials: true })
    .then((res) => res.data.data);

const Chat = observer(({ store }: ChatProps) => {
  const history = useHistory();

  useEffect(() => {
    api.authWithCoockie().then(async ({ user, accessToken }) => {
      const users = await getUsers();
      store.setToken(accessToken);
      store.setUser(user);
      store.setUsers(users);
      history.push('/');
    });
  }, [true]);

  return (
    <>
      <Switch>
        <Route path="/login">
          <Login
            onLogin={(user: User) =>
              login(user).then(async ({ accessToken, user }) => {
                const users = await getUsers();
                store.setToken(accessToken);
                store.setUser(user);
                store.setUsers(users);
                history.push('/');
              })
            }
          />
        </Route>
        <Route path="/">
          {!!store.user ? <Channels store={store} /> : <Redirect to="/login" />}
        </Route>
      </Switch>
    </>
  );
});

export default Chat;
