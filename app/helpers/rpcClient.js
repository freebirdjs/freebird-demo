var fbRpc = require('freebird-rpc');

var rpcClient = fbRpc.createClient('ws://' + window.location.hostname + ':3030');

module.exports = rpcClient;