// FOR TESTING ON A HOST PC
// In a TEST folder: $ npm install mqtt-shephrd
// Run: $ node qserver.js

var util = require('util');
var MqttShepherd = require('mqtt-shepherd');
var qserver = new MqttShepherd();   // create a LWMQN server

qserver.on('ready', function () {
    console.log('Server is ready');
    console.log('Permit devices joining for 180 seconds');
    qserver.permitJoin(180);
});

qserver.start(function (err) {      // start the sever
    if (err)
        console.log(err);
});

qserver.on('ind', function (msg) {
    switch (msg.type) {
        case 'devIncoming':
            var qnode = msg.qnode;
            if (qnode.clientId === 'mqtt-node-sivann-illum') {
                qnode.readReq('illuminance/0/sensorValue', function (err, rsp) {
                    if (!err)
                        console.log('>> Current illuminance: ' + rsp.data);    // rsp = { status, data }
                });
            }
            break;

        case 'devStatus':
            var qnode = msg.qnode;
            if (qnode.clientId === 'mqtt-node-sivann-illum' && msg.data === 'online') {
                // setting for notification of led state reporting
                qnode.writeAttrsReq('illuminance/0/sensorValue', {
                    pmin: 1,
                    pmax: 60,
                    stp: 10
                }, function (err, rsp) {
                    console.log('>> Illuminance report setting done: ');
                    console.log(rsp);
                });

                qnode.observeReq('illuminance/0/sensorValue', function (err, rsp) {
                    console.log('>> Illuminance observation starts: ');
                    console.log(rsp);
                });
            }
            break;

        case 'devChange':
            // If illuminance state changes, print it out
            var data = msg.data;
            if (data && data.oid === 'illuminance') {
                console.log('>> Illuminance state at machine changed: ');
                console.log('    ' + util.inspect(data));
            }
            break;
        default:
            // Not deal with other msg.type in this example
            break;
    }
});
