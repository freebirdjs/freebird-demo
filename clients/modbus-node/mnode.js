var CoapNode = require('coap-node'),
    SmartObject = require('smartobject');

var plcNode = require('./plcNode');

var ip = '',
    so = new SmartObject();

so.init('pressure', 0, {
    sensorValue: {
        read: function (cb) {
            plcNode.readPressure(function (err, bar) {
                if (err) 
                    cb(err);
                else
                    cb(null, bar);
            });
        }
    }
});

var coapNode = new CoapNode('modbus-node-pressure', so);

plcNode.start(function (err) {
    console.log('ready');
    if (!err)      
        startRegister();

    setInterval(function () { so.read('pressure', 0, 'sensorValue', readHandle); }, 500);
});

coapNode.on('registered', function () {
    console.log('registered');
});

function readHandle(err, data) {
    console.log(data);
}

function startRegister() {
    function register() {
        coapNode.register('0.0.0.0', 5683, function (err, msg) {
            console.log(msg);
            if (msg.status !== '2.01') 
                setTimeout(register, 5000);
        });
    }

    register();
}
