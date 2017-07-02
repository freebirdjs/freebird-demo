var fbRpc = require('freebird-rpc');
var ws = require('ws');

var rpcClient = fbRpc.createClient('ws://' + window.location.hostname + ':3030', {}, ws); //window.location.hostname

module.exports = rpcClient;