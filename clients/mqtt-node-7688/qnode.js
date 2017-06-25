/* This is the MQTT machine node on Linkit Smart 7688 (Not 7688 Duo). */
/* This code will not be compiled at server-side.                     */

// To start qnode:
//  $ ssh root@192.168.1.115
//  # cd app
//       Make sure these files are there:
//          /app/node_modules should have 2 modules: smartobject, mqtt-node
//          /app/tsl2561.js
//          /app/qnode.js
//  # node qnode.js

var MqttNode = require('mqtt-node'),
    SmartObject = require('smartobject'),
//    Discovery = require('udp-discovery').Discovery,
    Tsl2561 = require('./tsl2561.js');

var so, qnode;

/*******************************************************************/
/* Smart Object Initialization                                     */
/*******************************************************************/
so = new SmartObject({
    illumSensor: new Tsl2561(0, 0, 1),
    poller: null
}, function () {
    var self = this,
        sensor = this.hal.illumSensor;
    sensor.init(function () {
        console.log('Illuminance sensor initialized.');

        setTimeout(function () {
            // Start to poll the sensor every second
            startPollingLux();
        }, 2000);
    });
});

// Illuminance Sensor (oid = 3301 or 'illuminance')
so.init('illuminance', 0, {
    sensorValue: {                  // < rid = 5700, R, Float >
        read: function (cb) {
            var sensor = this.parent.hal.illumSensor;

            sensor.readLux(function (err, lux) {
                cb(err, lux);
            });
        }
    },
    units: 'lux'                    // < rid = 5701, R, String >
});

function startPollingLux() {
    if (!so.hal.poller) {
        so.hal.poller = setInterval(function () {
            // Use so driver, not Tsl2561 driver (for possilbe notification)
            so.read('illuminance', 0, 'sensorValue', function (err, lux) {
                if (!err) {
                    // console.log('Read lux: ' + lux);
                }
            });
        }, 1000);
    }
}

function stopPollingLux() {
    if (so.hal.poller) {
        clearInterval(so.hal.poller);
        so.hal.poller = null;
    }
}

/*******************************************************************/
qnode = new MqttNode('mqtt-node-sivann-illum', so);

qnode.on('ready', function () {
    console.log('qnode is ready');
    // Start to poll the sensor every second
    startPollingLux();
});

qnode.on('registered', function () {
    console.log('qnode is registered.');
});

qnode.on('login', function () {
});


/*******************************************************************/
/* [TODO] Wait for freebird server broadcaster done                */
/*******************************************************************/

// qnode.connect('mqtt://192.168.1.118');

// function startRegister() {
//     var discover = new Discovery();

//     function register() {
//         coapNode.register(ip, 5683, function (err, msg) {
//             console.log(msg);
//             if (msg.status !== '2.01' || msg.status !== '2.04') {
//                     setTimeout(register, 5000);
//             }
//         });
//     }

//     function callback (name, data, reason) {
//         if (name === 'coap-shepherd-ip-broadcast') {
//             ip = data.addr;
//             discover.sendEvent('done');
//             discover.removeListener('available', callback);
//             register();
//         }
//     }

//     discover.on('available', callback);
// }
