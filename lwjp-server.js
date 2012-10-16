/*jslint node: true */
"use strict";

var PORT = 8124;

var assert = require('assert');
var net = require('net');

var lwjp = require('./lwjp');


var server = net.createServer(function(c) { //'connection' listener

  function queryReply(msg, reply_data) {
    var reply = {
      '_lwjp-query-id': msg['_lwjp-query-id'],
      '_lwjp-response-value': reply_data
    };
    c.write(lwjp.encode(reply));
  }

  c.setEncoding(); // get utf8 string instead of a Buffer

  console.log('server connected');
  c.on('end', function() {
    console.log('server disconnected');
  });

  c.on('data', function(msg) {
    var body = lwjp.decode(msg);
    assert(body['_lwjp-query-id'] != null); // only handle query messages

    console.log("received "+body['type']+" query "+body['_lwjp-query-id']);
    if (body.type === "ping") {
        console.log("replying to query "+body['_lwjp-query-id']);
        queryReply(msg, {resp: 'pong'});
    } else {
        assert(false); // unrecognize query type
    }
  });
});

server.listen(PORT, function() { //'listening' listener
  var address = server.address();
  console.log(' * Running on '+address.address+':'+address.port);
});
