var fs = require('fs');
var peg = require('pegjs');
var parser = peg.buildParser(fs.readFileSync('grammar.peg', 'utf8'));
console.log(JSON.stringify(parser.parse(fs.readFileSync('input.txt', 'utf8')), null, 2));
