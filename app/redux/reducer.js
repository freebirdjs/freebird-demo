import { combineReducers } from 'redux';

import navBar from './modules/navBar';
import cardBlock from './modules/cardBlock';
import weather from './modules/weather';
import noticeBar from './modules/noticeBar';

export default combineReducers({
    navBar,
    cardBlock,
    weather,
    noticeBar
});
