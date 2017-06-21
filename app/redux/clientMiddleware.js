import request from 'superagent';

import ioClient from '../helpers/ioClient';

const GETDEVS = 'app/cardBlock/GETDEVS';
const WRITE = 'app/cardBlock/WRITE';
const PERMITJOIN = 'app/navBar/PERMITJOIN';
const GETWEATHER = 'app/weather/GETWEATHER';

const clientMiddleware = store => next => action => {
    switch (action.type) {
// navBar
        case PERMITJOIN:
            ioConnectedDelay(function () {
                ioClient.sendReq('permitJoin', { time: action.time }, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        next(action);    
                    } 
                });
            });
            break;

// cardBlork
        case GETDEVS:
            ioConnectedDelay(function () {
                ioClient.sendReq('getDevs', {}, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        action.devs = data;
                        next(action);    
                    } 
                });
            });
            break;

        case WRITE:
            ioClient.sendReq('write', { permAddr: action.permAddr, auxId: action.auxId, value: action.value }, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    next(action);    
                } 
            });
            break;

// weather
        case GETWEATHER:
            function callback(err, results) {
                if (err) {
                    console.log(err);
                } else {
                    if (results.weather.cod == '404') {
                        action.notfound = true;
                    } else {
                        action.weather = results.weather;
                        action.city = results.city;
                    }

                    next(action);
                }
            }

            if (navigator.geolocation) {     
                navigator.geolocation.getCurrentPosition(function (position) {
                    getCityAndWeather(position.coords.latitude, position.coords.longitude, callback);
                }, function () {
                    console.log('Can not get geolocation.');
                    getCityAndWeather(action.lat, action.lon, callback);
                });       
            } else {  
                console.log('Can not get geolocation.');
                getCityAndWeather(action.lat, action.lon, callback);
            }

            break;

        default:
            next(action);
            break;
    }
};

function ioConnectedDelay (callback) {
    if (ioClient._connected) {
        callback();
    } else {
        setTimeout(function () {
            ioConnectedDelay(callback);
        }, 1000);
    }
}

function getCityAndWeather(lat, lon, callback) {
    var getCityUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + 
            ',' + lon + '&language=EN&key=AIzaSyBUxTIZNL7SId1f3A5Yc3vWSUgDmLspEGs',
        getWeatherUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + 
            '&lon=' + lon + '&units=metric&appid=ca57f9dc62e223f3f10d001470edd6cc',
        results = {};

    request.get(getCityUrl).end(function (err, rsp) {
        if (err) {
            callback(err);
        } else {
            results.city = JSON.parse(rsp.text).results[0].address_components[4].short_name.split(' ')[0];
            
            request.get(getWeatherUrl).end(function (err, rsp) {
                if (err) {
                    callback(err);
                } else {
                    results.weather = JSON.parse(rsp.text);
                    callback(null, results);
                } 
            });   
        } 
    });
}

export default clientMiddleware;