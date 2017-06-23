// Actions
const GETDEVS = 'app/cardBlock/GETDEVS';
const GETGADS = 'app/cardBlock/GETGADS';
const WRITE   = 'app/cardBlock/WRITE';
const DEVINCOMING   = 'app/cardBlock/DEVINCOMING';
const STATUSCHANGED = 'app/cardBlock/STATUSCHANGED';
const GADINCOMING   = 'app/cardBlock/GADINCOMING';
const ATTRSCHANGE   = 'app/cardBlock/ATTRSCHANGE';

const initialState = {
        devs: { },
        gads: { }
    };

// Reducer
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GETDEVS:
            return {
                ...state,
                devs: action.devs
            };

        case GETGADS:
            return {
                ...state,
                gads: action.gads
            };

        case WRITE:
            if (!state.gads || !state.gads[action.id])
                return state;
            else 
                return {
                    ...state,
                    gads: {
                        ...state.gads,
                        [action.id]: {
                            ...state.gads[action.id],
                            attrs: {
                                ...state.gads[action.id].attrs,
                                [action.attrName]: action.value
                            }
                        }
                    }
                };

        case DEVINCOMING:
            return {
                ...state,
                devs: {
                    ...state.devs,
                    [action.id]: action.dev
                }
            };

        case STATUSCHANGED:
            if (!state.devs || !state.devs[action.id]) 
                return state;
            else 
                return {
                    ...state,
                    devs: {
                        ...state.devs,
                        [action.id]: {
                            ...state.devs[action.id],
                            net: {
                                ...state.devs[action.id].net,
                                status: action.status
                            }
                        }
                    }
                };

        case GADINCOMING:
            return {
                ...state,
                gads: {
                    ...state.gads,
                    [action.id]: action.gad
                }
            };

        case ATTRSCHANGE:
            if (!state.gads || !state.gads[action.id]) 
                return state;
            else 
                return {
                    ...state,
                    gads: {
                        ...state.gads,
                        [action.id]: {
                            ...state.gads[action.id],
                            attrs: Object.assign({}, state.gads[action.id].attrs, action.value)
                        }
                    }
                };

        default:
            return state;
    }
}

// Action Creators
// Request
export function getDevs() {
    return { type: GETDEVS };
}

export function getGads() {
    return { type: GETGADS };
}

export function write(id, attrName, value) {
    return { type: WRITE, id: id, attrName: attrName, value: value };
}

// Indication
export function devIncoming(id, dev) {
    return { type: DEVINCOMING, id: id, dev: dev };
}

export function statusChanged(id, status) {
    return { type: STATUSCHANGED, id: id, status: status };
}

export function gadIncoming(id, gad) {
    return { type: GADINCOMING, id: id, gad: gad };
}

export function attrsChange(id, value) {
    return { type: ATTRSCHANGE, id: id, value: value };
}

