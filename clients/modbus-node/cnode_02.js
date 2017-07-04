var CoapNode = require('coap-node'),
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

var coapNode = new CoapNode('mt7688_02', so),
    board = new Board("/dev/ttyS0", function(err) {
        console.log(err);
        if (err) {
            console.log(err);
            board.reset();
            return;
        }

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
