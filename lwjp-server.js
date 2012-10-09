/*jslint node: true */
"use strict";

var PORT = 8124;

var assert = require('assert');
var net = require('net');

var lwjp = require('./lwjp');


function replyQuery(msg, data, c) {
  var reply = {
    '_lwjp-query-id': msg['_lwjp-query-id'],
    '_lwjp-response-value': JSON.stringify(data)
  };
  c.write(lwjp.encode(reply));
}


var server = net.createServer(function(c) { //'connection' listener
  c.setEncoding(); // get utf8 string instead of a Buffer

  console.log('server connected');
  c.on('end', function() {
    console.log('server disconnected');
  });

  c.on('data', function(msg) {
    var body = lwjp.decode(msg);
    if (body['_lwjp-query-id'] != null) {
      console.log("received "+body['type']+" query "+body['_lwjp-query-id']);

      if (body['type'] === 'ping') {
        console.log("replying to query "+body['_lwjp-query-id']);
        c.write(lwjp.encode_reply(msg, {reply: 'pong'}));
      }
    }
  });
});

server.listen(PORT, function() { //'listening' listener
  var address = server.address();
  console.log(' * Running on '+address.address+':'+address.port);
});
