
import ChatApp, { ChatProps } from './ChatApp';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import Store from './observables/Store';
import { observer } from "mobx-react-lite"
import { createHashHistory } from "history";
import { Router } from "react-router";
import { HashRouter } from "react-router-dom";
const history = createHashHistory();

const appStore = new Store()
const ChatAppView = observer(({ store }: ChatProps) => <ChatApp store={store}/>)
const appEle = document.getElementById('chat-app');

ReactDOM.render(
    <Router history={history}>
        <HashRouter>
            <ChatAppView store={appStore}/>    
        </HashRouter>
    </Router>, appEle);