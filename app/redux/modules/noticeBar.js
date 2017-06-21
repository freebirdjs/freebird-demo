// Actions
const NOTICE = 'app/noticeBar/NOTICE';
const REQUESTCLOSE = 'app/noticeBar/REQUESTCLOSE';

const initialState = { 
        open: false,
        message : 'Notice Bar'
    };

// Reducer
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case NOTICE:
                return {
                    ...state,
                    open: action.open,
                    message : action.message
                };

        case REQUESTCLOSE:
                return {
                    ...state,
                    open: false
                };

        default: 
            return state;
  }
}

// Action Creators
export function notice(open, message) {
    return { type: NOTICE, open: open, message: message };
}

export function requestClose() {
    return { type: REQUESTCLOSE };
}
