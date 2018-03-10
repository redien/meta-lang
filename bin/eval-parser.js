#!/usr/bin/env node
var parser = require(process.argv[2]);
var fs = require('fs');
var util = require('util');
var input = process.argv[3];
var result = parser.parse(input, null).result;
console.log(util.inspect(result, false, null));
