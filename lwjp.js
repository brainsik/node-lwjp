/*jslint node: true */
"use strict";

var assert = require('assert');

function decode(msg) {
  var parts = msg.split('\n');

  var header = parts[1];
  assert(parts[1] === 'lwjp'); // header check

  var length = parseInt(parts[2], 10);
  var body = parts[3];
  assert(body.length === length); // length check

  return JSON.parse(body);
}

function encode(data) {
  var body = JSON.stringify(data);
  return "\nlwjp\n"+body.length+"\n"+body;
}

function encode_reply(msg, data) {
  var reply = {
    '_lwjp-query-id': msg['_lwjp-query-id'],
    '_lwjp-response-value': JSON.stringify(data)
  };
  return encode(reply);
}

exports.decode = decode;
exports.encode = encode;
exports.encode_reply = encode_reply;
