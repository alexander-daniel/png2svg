'use strict';

var tape = require('tape');
var fs = require('fs');
var execFile = require('child_process').execFile;

tape.test('should create svg from png with expected contents', function (t) {

    var args = ['./cmd.js', 'test/sprite.png', 'test/out.svg'];
    execFile('node', args, function (err) {
        if (err) return console.error(err);

        var svgString = fs.readFileSync('test/out.svg', 'utf8');
        var expectedSvgString = fs.readFileSync('test/expected.svg', 'utf8');
        t.ok(svgString === expectedSvgString);
        t.end();

        fs.unlinkSync('test/out.svg');
    });

});
