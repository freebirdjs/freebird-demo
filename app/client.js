import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import reducer from './redux/reducer';
import clientMiddleware from './redux/clientMiddleware';
import { permitJoining } from './redux/modules/navBar';
import { devIncoming, statusChanged, gadIncoming, attrsChange } from './redux/modules/cardBlock';
import { notice, requestClose } from './redux/modules/noticeBar';

import NavBar from './components/NavBar/NavBar';
import CardBlock from './components/CardBlock/CardBlock';
import NoticeBar from './components/NoticeBar/NoticeBar';

import rpcClient from './helpers/rpcClient';

/*********************************************/
/* client app                                */
/*********************************************/
var store = createStore(reducer, applyMiddleware(clientMiddleware)),
    title = 'freebird-demo';

rpcClient.on('open', function () {
    // channel established
});

rpcClient.on('close', function () {
    // channel closed
});

rpcClient.on('ind', function (msg) {
    var cmd = msg.subsys + ':' + msg.type;

    switch (cmd) {
        case 'net:permitJoining':
            store.dispatch(permitJoining(msg.data.timeLeft));
            break;

        case 'dev:devIncoming':
            store.dispatch(devIncoming(msg.id, msg.data));
            break;

        case 'dev:statusChanged':
            store.dispatch(statusChanged(msg.id, msg.data.status));
            break;

        case 'gad:gadIncoming':
            store.dispatch(gadIncoming(msg.id, msg.data));
            break;

        case 'gad:attrsChanged':
            store.dispatch(attrsChange(msg.id, msg.data));
            break;

        default:
            return;
    }
});

/*********************************************/
/* App component                             */
/*********************************************/
var App = React.createClass({
    render: function () {
        return (
            <MuiThemeProvider>
                <div>
                    <NavBar title={this.props.title} />
                    <CardBlock />
                    <NoticeBar />
                </div>     
            </MuiThemeProvider>
        );
    }
});

/*********************************************/
/* render                                    */
/*********************************************/
ReactDOM.render(
    <Provider store={store}>
        <App title={title} />
    </Provider>, 
    document.getElementById('root')
);
