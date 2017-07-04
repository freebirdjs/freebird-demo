var chalk = require('chalk'),
    //nodemailer = require('nodemailer'),
    Discovery = require('udp-discovery').Discovery;

var Freebird = require('freebird'),
    bleCore = require('freebird-netcore-ble')('cc-bnp', { path: '/dev/ttyACM1' }),
    mqttCore = require('freebird-netcore-mqtt')(),
    coapCore = require('freebird-netcore-coap')();
    zigbeeCore = require('freebird-netcore-zigbee')('/dev/ttyACM0', {
        net: {
            panId: 0x7C71
        }
    });

var mnode = require('../clients/modbus-node/mnode.js');

var fbRpc = require('freebird-rpc'),
    http = require('http'),
    rpcServer = fbRpc.createServer(
        http.createServer().listen(3030)
    );

var freebird = new Freebird([ bleCore, mqttCore, coapCore , zigbeeCore ]);

var discover = new Discovery();


var name = 'freebird-demo-ip-broadcast',
    interval = 500,
    available = true,
    serv = {
        port: 80,
        proto: 'tcp',
        addrFamily: 'IPv4'
    };

/*var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'sivann.freebird@gmail.com', 
        pass: '26583302'
    }
});*/

var gadList = {
        temperature: null,
        humidity: null,
        illuminance: null,
        flame: null,
        presence: null,
        buzzer: null,
        lightCtrl: null,
        pwrCtrl: null
    },
    lightCtrlTimeout;

var app = function () {
/**********************************/
/* show Welcome Msg               */
/**********************************/
    showWelcomeMsg();

/**********************************/
/* set Leave Msg                  */
/**********************************/
    setLeaveMsg();


    freebird.addTransport('rpcServer', rpcServer, function (err) {
        if (err)
            console.log(err);
    });

    // start the server
    setTimeout(function () {
        freebird.start(function (err) {
            console.log('Server started');

            discover.announce(name, serv, interval, available);

            // Allow remote machines to join the network within 180 secs
            //freebird.permitJoin(180);
        });
    }, 60000);

    freebird.on('ready', function () {
        // ...
        console.log('freebird ready');
    });

    freebird.on('devIncoming', function (dev) {
        console.log('devIncoming');
        console.log(dev);
        // ...
    });

    freebird.on('gadIncoming', function (gad) {
        // ...
    });

    freebird.on('devNetChanged', function (msg) {
        console.log('devNetChanged');
        console.log(msg);

        var dev = freebird.findByNet('device', msg.ncName, msg.permAddr),
            gads = [];

        if (dev.dump().net.status !== 'online') return;

        setTimeout(function () {
            dev.dump().gads.forEach(function (gadInfo) {
                var gad = freebird.findByNet('gadget', msg.ncName, msg.permAddr, gadInfo.auxId);

                if (gad)
                    gads.push(gad);
            });

            gads.forEach(function (gad) {
                var gadInfo = gad.dump(),
                    gadType = gadInfo.panel.classId;

                switch (gadType) {
                    case 'temperature':
                        gadList[gadType] = gad;
                        gad.writeReportCfg('sensorValue', { enable: true }, function () {});
                        break;
                    case 'humidity':
                        gadList[gadType] = gad;
                        gad.writeReportCfg('sensorValue', { enable: true }, function () {});
                        break;
                    case 'illuminance':
                        if (msg.ncName === 'freebird-netcore-mqtt') {
                            gadList[gadType] = gad;
                            gad.writeReportCfg('sensorValue', { enable: true }, function () {});
                        }
                        break;
                    case 'pressure':
                        gadList[gadType] = gad;
                        gad.writeReportCfg('sensorValue', { enable: true }, function () {});
                        break;
                    case 'dIn':
                        if (msg.ncName === 'freebird-netcore-coap') {
                            gadList[gadType] = gad;
                            gad.writeReportCfg('dInState', { enable: true }, function () {});
                        }
                        break;
                    case 'presence':
                        gadList[gadType] = gad;
                        gad.writeReportCfg('dInState', { enable: true }, function () {});
                        break;
                    case 'buzzer':
                        gadList[gadType] = gad;
                        break;
                    case 'lightCtrl':
                        gadList[gadType] = gad;
                        break;
                    case 'pwrCtrl':
                        if (msg.ncName === 'freebird-netcore-zigbee') {
                            gadList[gadType] = gad;
                            gad.writeReportCfg('onOff', { pmin: 60, pmax: 180, enable: true }, function () {});
                        }
                        break;
                    default:
                        break;
                }
            });
        }, 300);            
    });

    freebird.on('gadAttrsChanged', function (msg) {
        var presenceGadId = gadList.presence ? gadList.presence.dump().id : null,
            tempGadId = gadList.temperature ? gadList.temperature.dump().id : null,
            flameGadId = gadList.flame ? gadList.flame.dump().id : null,
            illumGadId = gadList.illuminance ? gadList.illuminance.dump().id : null;
console.log(msg);
        if (msg.id === presenceGadId) {         
            if (msg.data.dInState === true && gadList.lightCtrl && gadList.lightCtrl.isEnabled()) {
                if (gadList.lightCtrl.dump().attrs.onOff) return;
                gadList.lightCtrl.write('onOff', 1, function () {});
                if (lightCtrlTimeout) {
                    clearTimeout(lightCtrlTimeout);
                    lightCtrlTimeout = null;
                }
                lightCtrlTimeout = setTimeout(function () {
                    gadList.lightCtrl.write('onOff', 0, function () {});
                    lightCtrlTimeout = null;
                }, 5000);
            }
        } else if (msg.id === illumGadId) {
            if (msg.data.sensorValue <= 40 && gadList.lightCtrl && gadList.lightCtrl.isEnabled()) {
                gadList.lightCtrl.write('onOff', 1, function () {});
            } else if (msg.data.sensorValue >= 40 && gadList.lightCtrl && gadList.lightCtrl.isEnabled()) {
                gadList.lightCtrl.write('onOff', 0, function () {});
            }
        } else if (msg.id === tempGadId) {
            if (msg.data.sensorValue >= 28 && gadList.pwrCtrl && gadList.pwrCtrl.isEnabled()) {
                gadList.pwrCtrl.write('onOff', 1, function () {});
            } else if (msg.data.sensorValue <= 27.5 && gadList.pwrCtrl && gadList.pwrCtrl.isEnabled()) {
                gadList.pwrCtrl.write('onOff', 0, function () {});
            }
        } else if (msg.id === flameGadId) {
            if (msg.data.dInState === true && gadList.buzzer && gadList.buzzer.isEnabled()) {
                gadList.buzzer.write('onOff', true, function () {});
            } else if (msg.data.dInState === false && gadList.buzzer && gadList.buzzer.isEnabled()) {
                gadList.buzzer.write('onOff', false, function () {});
            } 
        }
    });

/**********************************/
/* start shepherd                 */
/**********************************/
// start your shepherd

};
                     
/**********************************/
/* welcome function               */
/**********************************/
function showWelcomeMsg() {
var fbPart1 = chalk.blue('      77                   freebird v0.1.9                   77 '),
    fbPart2 = chalk.blue('       72927                                             75927  '),
    fbPart3 = chalk.blue('          288888477                               774888882     '),
    fbPart4 = chalk.blue('             7888888889277                 7710888888807        '),
    fbPart5 = chalk.blue('                7088888888888427     7148888888888847           '),
    fbPart6 = chalk.blue('                   70888880888888   88888808888847              '),
    fbPart7 = chalk.blue('                      7088800409807880040888847                 '),
    fbPart8 = chalk.blue('                         7088809488099088847                    '),
    fbPart9 = chalk.blue('                            7480049490857                       '),
    fbPart10 = chalk.blue('                               8088888     '),
    fbPart11 = chalk.blue('                              888470888             '),
    fbPart12 = chalk.blue('                            1887     7887         '),
    fbPart13 = chalk.blue('                           77           27      '),
    introPart1 = chalk.gray('A network server and'),
    introPart2 = chalk.gray('manager for'),
    introPart3 = chalk.gray('heterogeneous'),
    introPart4 = chalk.gray('machine network');


    console.log('');
    console.log('');
    console.log('Welcome to freebird-demo webapp... ');
    console.log('');
    console.log(fbPart1);
    console.log(fbPart2);
    console.log(fbPart3);
    console.log(fbPart4);
    console.log(fbPart5);
    console.log(fbPart6);
    console.log(fbPart7);
    console.log(fbPart8);
    console.log(fbPart9);
    console.log(fbPart10 + introPart1);
    console.log(fbPart11 + introPart2);
    console.log(fbPart12 + introPart3);
    console.log(fbPart13 + introPart4);
    //console.log(chalk.gray('    A network server and manager for the heterogeneous machine network'));
    console.log('');
    console.log('   >>> Protocols:  BLE, Zigbee, MQTT, CoAP, Modbus');
    console.log('   >>> Version:    freebird v0.1.9');
    console.log('   >>> Document:   https://github.com/freebirdjs/freebird/wiki');
    console.log('   >>> Copyright (c) 2017, The MIT License (MIT)');
    console.log('');
    console.log('The server is up and running, press Ctrl+C to stop server.');
    console.log('');
    console.log('---------------------------------------------------------------');
}

/**********************************/
/* goodBye function               */
/**********************************/
function setLeaveMsg() {
    process.stdin.resume();

    function showLeaveMessage() {
        console.log(' ');
        console.log(chalk.blue('      _____              __      __                  '));
        console.log(chalk.blue('     / ___/ __  ___  ___/ /____ / /  __ __ ___       '));
        console.log(chalk.blue('    / (_ // _ \\/ _ \\/ _  //___// _ \\/ // // -_)   '));
        console.log(chalk.blue('    \\___/ \\___/\\___/\\_,_/     /_.__/\\_, / \\__/ '));
        console.log(chalk.blue('                                   /___/             '));
        console.log(' ');
        console.log('    >>> This is a simple demonstration of how the freebird works.');
        console.log('    >>> Please visit the link to know more about this project:   ');
        console.log('    >>>   ' + chalk.yellow('https://github.com/freebirdjs/freebird/wiki'));
        console.log(' ');
        process.exit();
    }

    process.on('SIGINT', showLeaveMessage);
}

module.exports = app;
