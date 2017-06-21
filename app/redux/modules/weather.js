// Actions
const GETWEATHER = 'app/weather/GETWEATHER';

const initialState = {
        info: {
            weather: [{}],
            main: {}
        },
        city: '' 
    };

// Reducer
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GETWEATHER:
            if (action.notfound) 
                return state;

            return {
                ...state,
                info: action.weather,
                city: action.city
            };

        default:
            return state;
    }
}

// Action Creators
export function getWeather(lat, lon) {
    return { type: GETWEATHER, lat: lat, lon: lon};
}
