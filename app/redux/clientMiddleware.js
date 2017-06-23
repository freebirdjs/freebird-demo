import _ from 'busyman';
import request from 'superagent';

import rpcClient from '../helpers/rpcClient';

const GETDEVS = 'app/cardBlock/GETDEVS';
const GETGADS = 'app/cardBlock/GETGADS';
const WRITE   = 'app/cardBlock/WRITE';
const PERMITJOIN = 'app/navBar/PERMITJOIN';
const GETWEATHER = 'app/weather/GETWEATHER';

const clientMiddleware = store => next => action => {
    switch (action.type) {
// navBar
        case PERMITJOIN:
            rpcClient.send('net', 'permitJoin', { duration: action.duration }, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    next(action);    
                } 
            });
            break;

// cardBlork
        case GETDEVS:
            rpcClient.send('net', 'getAllDevIds', {}, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    rpcClient.send('net', 'getDevs', { ids: data.ids }, function (err, data) {  // { devs: [ {}, {}, {}... ]}
                        var devs = {};

                        _.forEach(data, function (dev) {
                            devs[dev.id] = dev;
                        });

                        if (err) {
                            console.log(err);
                        } else {
                            action.devs = devs;
                            next(action);    
                        } 
                    });   
                } 
            });
            break;

        case GETGADS:
            rpcClient.send('net', 'getAllGadIds', {}, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    rpcClient.send('net', 'getGads', { ids: data.ids }, function (err, data) {  // { gads: [ {}, {}, {}... ]}
                        var gads = {};

                        _.forEach(data, function (gad) {
                            gads[gad.id] = gad;
                        });

                        if (err) {
                            console.log(err);
                        } else {
                            action.gads = gads;
                            next(action);    
                        } 
                    }); 
                } 
            });
            break;

        case WRITE:
            rpcClient.send('gad', 'write', { id: action.id, attrName: action.attrName, value: action.value }, function (err, data) {
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

function rpcConnectedDelay (callback) {
    if (rpcClient._connected) {
        callback();
    } else {
        setTimeout(function () {
            rpcConnectedDelay(callback);
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