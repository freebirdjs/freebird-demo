var chalk = require('chalk'),
    nodemailer = require('nodemailer'),
    Discovery = require('udp-discovery').Discovery;

var Freebird = require('freebird'),
    bleCore = require('freebird-netcore-ble')('noble'),
    mqttCore = require('freebird-netcore-mqtt')(),
    coapCore = require('freebird-netcore-coap')(),
    zigbeeCore = require('freebird-netcore-zigbee')('/dev/ttyACM0', {
        net: {
            panId: 0x7C71
        }
    });

var fbRpc = require('freebird-rpc'),
    http = require('http'),
    rpcServer = fbRpc.createServer(
        http.createServer().listen(3030)
    );

var freebird = new Freebird([ /*bleCore, mqttCore, coapCore, */zigbeeCore ]);

var discover = new Discovery();

var name = 'freebird-ip-broadcast',
    interval = 1000,
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
    freebird.start(function (err) {
        console.log('Server started');

        discover.announce(name, serv, interval, available);

        // Allow remote machines to join the network within 180 secs
        //freebird.permitJoin(180);
    });

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
                        gad.writeReportCfg('sensorValue', { enable: true }, function () {});
                        break;
                    case 'humidity':
                        gad.writeReportCfg('sensorValue', { enable: true }, function () {});
                        break;
                    case 'illuminance':
                        gad.writeReportCfg('sensorValue', { enable: true }, function () {});
                        break;
                    case 'flame':
                        break;
                    case 'presence':
                        gad.writeReportCfg('dInState', { enable: true }, function () {});
                        break;
                    case 'buzzer':
                        break;
                    case 'lightCtrl':
                        break;
                    case 'pwrCtrl':
                        break;
                    default:
                        break;
                }
            });
        }, 300);            
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
var blePart1 = chalk.blue('       ___   __    ____      ____ __ __ ____ ___   __ __ ____ ___   ___ '),
    blePart2 = chalk.blue('      / _ ) / /   / __/____ / __// // // __// _ \\ / // // __// _ \\ / _ \\'),
    blePart3 = chalk.blue('     / _  |/ /__ / _/ /___/_\\ \\ / _  // _/ / ___// _  // _/ / , _// // /'),
    blePart4 = chalk.blue('    /____//____//___/     /___//_//_//___//_/   /_//_//___//_/|_|/____/ ');

    console.log('');
    console.log('');
    console.log('Welcome to ble-shepherd webapp... ');
    console.log('');
    console.log(blePart1);
    console.log(blePart2);
    console.log(blePart3);
    console.log(blePart4);
    console.log(chalk.gray('         A network server and manager for the BLE machine network'));
    console.log('');
    console.log('   >>> Author:     Hedy Wang (hedywings@gmail.com)');
    console.log('   >>> Version:    ble-shepherd v1.0.0');
    console.log('   >>> Document:   https://github.com/bluetoother/ble-shepherd');
    console.log('   >>> Copyright (c) 2016 Hedy Wang, The MIT License (MIT)');
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
        console.log('    >>> This is a simple demonstration of how the shepherd works.');
        console.log('    >>> Please visit the link to know more about this project:   ');
        console.log('    >>>   ' + chalk.yellow('https://github.com/zigbeer/zigbee-shepherd'));
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
