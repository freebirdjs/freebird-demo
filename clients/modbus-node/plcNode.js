var modbus = require('jsmodbus');

var plcNode = {},
    client = modbus.client.tcp.complete({
        'host': '192.168.0.11',
        'port': '502',
        'unitId': 1,
        // 'logEnabled': true,
        // 'logLevel': 'debug'
    });

plcNode.start = function (callback) {
    client.on('connect', function () {
        callback(null);
    });

    client.on('error', function (err) {
        callback(err);
    });

    client.connect();
};

plcNode.readPressure = function (callback) {
    client.readHoldingRegisters(6001, 1).then(function (resp) {
        var pressure = resp.register[0].toString(16);

        while (pressure.length !== 8) {
            pressure = pressure + '0';
        }
        pressure = new Buffer(pressure, 'hex');
        callback(null, pressure.readFloatBE(0));
    }, callback);
};

module.exports = plcNode;
