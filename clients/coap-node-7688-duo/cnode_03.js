var Board = require('firmata'),
    CoapNode = require('coap-node'),
    SmartObject = require('smartobject'),
    Discovery = require('udp-discovery').Discovery;

var ip = '',
    so = new SmartObject();

so.init('buzzer', 0, {
    onOff: {
        read: function (cb) {
            buzzerRead(cb);
        },
        write: function (value, cb) {
            buzzerWrite(value, cb);
        }
    }
});

var coapNode = new CoapNode('mt7688_03', so),
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

    var annLis = function(name, data, reason) {
        if (name === 'freebird-demo-ip-broadcast') {
            ip = data.addr;
            discover.sendEvent('done');

            coapNode.register(ip, 5683, function (err, msg) {
                console.log(msg);
                discover.removeListener('available', annLis);
            });
        }
    };

    discover.on('available', annLis);
}

function startRead() {
    board.pinMode(5, board.MODES.INPUT);
    board.digitalRead(5, function(result) { });
}

function buzzerRead(callback) {
    var buzzerValue = board.pins[5].value;

    callback(null, buzzerValue);
}

function buzzerWrite(value, callback) {
    var buzzerValue;

    if (value === true) {
        buzzerValue = board.HIGH;
    } else {
        buzzerValue = board.LOW;
    }

    board.digitalWrite(5, buzzerValue);
    callback(null, value);
}

function readHandle(err, data) {
    console.log(data);
}
