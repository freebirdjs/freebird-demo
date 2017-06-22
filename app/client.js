import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import reducer from './redux/reducer';
import clientMiddleware from './redux/clientMiddleware';
import {permitJoining} from './redux/modules/navBar';
import {devIncoming, devStatus, attrsChange} from './redux/modules/cardBlock';
import {notice, requestClose} from './redux/modules/noticeBar';

import NavBar from './components/NavBar/NavBar';
import CardBlock from './components/CardBlock/CardBlock';
import NoticeBar from './components/NoticeBar/NoticeBar';

import rpcClient from './helpers/rpcClient';

/*********************************************/
/* client app                                */
/*********************************************/
var store = createStore(reducer, applyMiddleware(clientMiddleware)),
    title = 'coap-shepherd';

rpcClient.on('open', function () {
    // channel established
});

rpcClient.on('close', function () {
    // channel closed
});

rpcClient.on('ind', function (msg) {
    // indication sent from the freebird server
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
