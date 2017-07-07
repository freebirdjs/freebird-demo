import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {getWeather} from '../../redux/modules/weather';
import WeatherIcon from '../Icons/WeatherIcon';

class WeatherCard extends React.Component {
    static propTypes = {
        getWeather: PropTypes.func.isRequired
    }

    constructor(props, context) {
        super(props, context);
    }

    render() {
        let desc = 'Cloudy';
        let name = 'Taoyuan';
        let temp = 30;
        let weatherIcon = <WeatherIcon icon={'04d'} />;
        let tempMin = 26;
        let tempMax = 30;

        return (
            <div style={{width: '100%', height: '100%', backgroundColor: '#1F3A93'}}>
                <div style={{float: 'left', width: '50%', height: '100%', color: 'white'}}>
                    <div style={{position: 'relative', transform: 'translateY(-50%)', top: '50%', margin: "0% auto", width: '70%'}}>
                        <div style={{fontSize: '1.4em', textAlign: 'right'}}>{desc}</div>
                        <div style={{margin:'10% 0% 30%'}}>
                            <div style={{float: 'left', width: '80%', fontSize: '1.8em', textAlign: "right", fontWeight:"bold"}}>{temp}</div>
                            <div style={{paddingTop:'5%', fontSize: '0.7em'}}>°C</div>
                        </div>
                        <div style={{fontSize: '1.4em', textAlign: 'right'}}>{name}</div>
                    </div>
                </div>

                <div style={{float: 'left', width: '50%', height: '100%'}}>
                    <div style={{position: 'relative', transform: 'translateY(-50%)', top: '50%', margin: "0% auto", width: '80%'}}>
                        <div style={{width: '100%', height: '30%'}}>{weatherIcon}</div>
                        <div style={{fontSize: '1em', color: '#35BBFC', margin:'5% 0% 10%', textAlign: "center"}}>
                            <svg fill="#FFFFFF" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z"/>
                                <path d="M0 0h24v24H0z" fill="none"/>
                            </svg>
                            {tempMin}°
                        </div>
                        <div style={{fontSize: '1em', color: '#D64541', textAlign: "center"}}>
                            <svg fill="#FFFFFF" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 11h3v10h2V11h3l-4-4-4 4zM4 3v2h16V3H4z"/>
                                <path d="M0 0h24v24H0z" fill="none"/>
                            </svg>
                            {tempMax}°
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

function mapStateToProps (state) {
    return { 
        weather: state.weather.info,
        city: state.weather.city 
    };
}

export default connect(
    mapStateToProps , 
    {getWeather}
)(WeatherCard)
