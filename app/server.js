var chalk = require('chalk'),
    nodemailer = require('nodemailer'),
    Discovery = require('udp-discovery').Discovery;

var Freebird = require('freebird'),
    // bleCore = require('freebird-netcore-ble')('noble'),
    // mqttCore = require('freebird-netcore-mqtt')(),
    coapCore = require('freebird-netcore-coap')();
    // zigbeeCore = require('freebird-netcore-zigbee')('/dev/ttyACM0', {
    //     net: {
    //         panId: 0x7C71
    //     }
    // });

var fbRpc = require('freebird-rpc'),
    http = require('http'),
    rpcServer = fbRpc.createServer(
        http.createServer().listen(3030)
    );

var freebird = new Freebird([ /*bleCore, mqttCore,*/ coapCore /*, zigbeeCore*/ ]);

var discover = new Discovery();

var name = 'freebird-demo-ip-broadcast',
    interval = 100,
    available = true,
    serv = {
        port: 80,
        proto: 'tcp',
        addrFamily: 'IPv4'
    };

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'sivann.freebird@gmail.com', 
        pass: '26583302'
    }
});

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
    // setTimeout(function () {
        freebird.start(function (err) {
            console.log('Server started');

            discover.announce(name, serv, interval, available);

            // Allow remote machines to join the network within 180 secs
            //freebird.permitJoin(180);
        });
    // }, 60000);

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
                    case 'dIn':
                        gadList.flame = gad;
                        gad.writeReportCfg('dInState', { enable: true }, function () {});
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

        if (msg.id === presenceGadId) {    
                // console.log(freebird.xx.xx);        
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

        }
    });

/**********************************/
/* start shepherd                 */
/**********************************/
// start your shepherd

};
//       ____               __    _          __
//      / __/_______  ___  / /_  (_)________/ /
//     / /_/ ___/ _ \/ _ \/ __ \/ / ___/ __  / 
//    / __/ /  /  __/  __/ /_/ / / /  / /_/ /  
//   /_/ /_/   \___/\___/_.___/_/_/   \__,_/  
/**********************************/
/* welcome function               */
/**********************************/
function showWelcomeMsg() {
var fbPart1 = chalk.blue('         ____               __    _          __'),
    fbPart2 = chalk.blue('        / __/_______  ___  / /_  (_)________/ /'),
    fbPart3 = chalk.blue('       / /_/ ___/ _ \\/ _ \\/ __ \\/ / ___/ __  / '),
    fbPart4 = chalk.blue('      / __/ /  /  __/  __/ /_/ / / /  / /_/ /  '),
    fbPart5 = chalk.blue('     /_/ /_/   \\___/\\___/_.___/_/_/   \\__,_/  ');

    console.log('');
    console.log('');
    console.log('Welcome to freebird-demo webapp... ');
    console.log('');
    console.log(fbPart1);
    console.log(fbPart2);
    console.log(fbPart3);
    console.log(fbPart4);
    console.log(fbPart5);
    console.log(chalk.gray('    A network server and manager for the heterogeneous machine network'));
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

/**********************************/
/* Indication funciton            */
/**********************************/
// function readyInd () {
//     ioServer.sendInd('ready', {});
//     console.log(chalk.green('[         ready ] '));
// }

// function permitJoiningInd (timeLeft) {
//     ioServer.sendInd('permitJoining', { timeLeft: timeLeft });
//     console.log(chalk.green('[ permitJoining ] ') + timeLeft + ' sec');
// }

// function errorInd (msg) {
//     ioServer.sendInd('error', { msg: msg });
//     console.log(chalk.red('[         error ] ') + msg);
// }

// function devIncomingInd (dev) {
//      ioServer.sendInd('devIncoming', { dev: dev });
//     console.log(chalk.yellow('[   devIncoming ] ') + '@' + dev.permAddr);
// }

// function devStatusInd (permAddr, status) {
//     ioServer.sendInd('devStatus', { permAddr: permAddr, status: status });

//     if (status === 'online')
//         status = chalk.green(status);
//     else 
//         status = chalk.red(status);

//     console.log(chalk.magenta('[     devStatus ] ') + '@' + permAddr + ', ' + status);
// }

// function attrsChangeInd (permAddr, gad) {
//     ioServer.sendInd('attrsChange', { permAddr: permAddr, gad: gad });
//     console.log(chalk.blue('[   attrsChange ] ') + '@' + permAddr + ', auxId: ' + gad.auxId + ', value: ' + gad.value);
// }

// function toastInd (msg) {
//     ioServer.sendInd('toast', { msg: msg });

// }

// app();

module.exports = app;
