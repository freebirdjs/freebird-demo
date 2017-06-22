import ioClient from '../../helpers/ioClient';

// Actions
const PERMITJOIN =    'app/navBar/PERMITJOIN';
const PERMITJOINING = 'app/navBar/PERMITJOINING';

const initialState = { timeLeft: 0 };

// Reducer
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case PERMITJOIN:
            return {
                ...state,
                timeLeft: action.duration
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
export function permitJoin(duration) {
    return { type: PERMITJOIN, duration: duration };
}

export function permitJoining(timeLeft) {
    return { type: PERMITJOINING, timeLeft: timeLeft };
}
