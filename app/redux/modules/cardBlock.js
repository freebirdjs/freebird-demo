// Actions
const GETDEVS = 'app/cardBlock/GETDEVS';
const WRITE = 'app/cardBlock/WRITE';
const DEVINCOMING = 'app/cardBlock/DEVINCOMING';
const DEVSTATUS = 'app/cardBlock/DEVSTATUS';
const ATTRSCHANGE = 'app/cardBlock/ATTRSCHANGE';

const initialState = {
        devs: { } 
    };

// Reducer
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GETDEVS:
            return {
                ...state,
                devs: action.devs
            };

        case WRITE:
            if (!state.devs || !state.devs[action.permAddr] || !state.devs[action.permAddr].gads || !state.devs[action.permAddr].gads[action.auxId]) 
                return state;
            else 
                return {
                    ...state,
                    devs: {
                        ...state.devs,
                        [action.permAddr]: {
                            ...state.devs[action.permAddr],
                            gads: {
                                ...state.devs[action.permAddr].gads,
                                [action.auxId]: {
                                    ...state.devs[action.permAddr].gads[action.auxId],
                                    value: action.value
                                }
                            }
                        }
                    }
                };

        case DEVINCOMING:
            return {
                ...state,
                devs: {
                    ...state.devs,
                    [action.dev.permAddr]: action.dev
                }
            };

        case DEVSTATUS:
            if (!state.devs || !state.devs[action.permAddr]) 
                return state;
            else 
                return {
                    ...state,
                    devs: {
                        ...state.devs,
                        [action.permAddr]: {
                            ...state.devs[action.permAddr],
                            status: action.status
                        }
                    }
                };

        case ATTRSCHANGE:
            if (!state.devs ||!state.devs[action.permAddr] || !state.devs[action.permAddr].gads || !state.devs[action.permAddr].gads[action.gad.auxId]) 
                return state;
            else 
                return {
                    ...state,
                    devs: {
                        ...state.devs,
                        [action.permAddr]: {
                            ...state.devs[action.permAddr],
                            gads: {
                                ...state.devs[action.permAddr].gads,
                                [action.gad.auxId]: action.gad
                            }
                        }
                    }
                };

        default:
            return state;
    }
}

// Action Creators
export function getDevs() {
    return { type: GETDEVS };
}

export function write(permAddr, auxId, value) {
    return { type: WRITE, permAddr: permAddr, auxId: auxId, value: value };
}

export function devIncoming(dev) {
    return { type: DEVINCOMING, dev: dev };
}

export function devStatus(permAddr, status) {
    return { type: DEVSTATUS, permAddr: permAddr, status: status };
}

export function attrsChange(permAddr, gad) {
    return { type: ATTRSCHANGE, permAddr: permAddr, gad: gad };
}

