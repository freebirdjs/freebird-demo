var Board = require('firmata'),
    CoapNode = require('coap-node'),
    SmartObject = require('smartobject'),
    Discovery = require('udp-discovery').Discovery;

var ip = '',
    so = new SmartObject();

so.init('dIn', 0, {
    dInState: {
        read: function (cb) {
            fireRead(cb);
        }
    },
    appType: 'flameSensor'
});

var coapNode = new CoapNode('coap-node-sivann-flame', so),
    board = new Board("/dev/ttyS0", function(err) {
        console.log(err);
        if (err) {
            console.log(err);
            board.reset();
            return;
        }

        console.log('>> coap-node strat.');

        startRead();
        startRegister();
    });

coapNode.on('registered', function () {
    console.log('registered');
});


function startRegister() {
    var discover = new Discovery();

    function register() {
        coapNode.register(ip, 5683, function (err, msg) {
            console.log(msg);
            if (msg.status !== '2.01') 
                setTimeout(register, 5000);
        });
    }

    function annLis(name, data, reason) {
        if (name === 'freebird-ip-broadcast') {
            ip = data.addr;
            discover.sendEvent('done');
            discover.removeListener('available', annLis);
            register();
        }
    }

    discover.on('available', annLis);
}

function startRead() {
    board.pinMode(5, board.MODES.INPUT);
    board.digitalRead(5, function(result) { });

    setInterval(function () { so.read('dIn', 0, 'dInState', readHandle); }, 500);
}

function fireRead(callback) {
    var fireValue = board.pins[5].value;

    callback(null, !fireValue);
}

function readHandle(err, data) {
    console.log(data);
}
