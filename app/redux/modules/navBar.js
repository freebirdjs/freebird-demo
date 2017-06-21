import ioClient from '../../helpers/ioClient';

// Actions
const PERMITJOIN = 'app/navBar/PERMITJOIN';
const PERMITJOINING = 'app/navBar/PERMITJOINING';

const initialState = { timeLeft: {} };

// Reducer
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case PERMITJOIN:
            return {
                ...state,
                timeLeft: action.time
            };

        case PERMITJOINING:
            return {
                ...state,
                timeLeft: action.timeLeft
            };

        default: 
            return state;
  }
}

// Action Creators
export function permitJoin(time) {
    return { type: PERMITJOIN, time: time };
}

export function permitJoining(timeLeft) {
    return { type: PERMITJOINING, timeLeft: timeLeft };
}
