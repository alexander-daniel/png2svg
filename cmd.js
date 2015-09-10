#!/usr/bin/env node

/*jshint strict:false */

var getPixels = require('get-pixels');
var fs = require('fs');
var rgb2hex = require('rgb2hex');

var image = process.argv[2];
var output = process.argv[3];

if (!output) output = __dirname + './output.svg';
var svgStream = fs.createWriteStream(output);

var ProgressBar = require('progress');

getPixels(image, function(err, pixels) {
    if (err) return console.log('Bad pixels path');
    console.log('processing ' + image + ' -> SVG');

    var bar = new ProgressBar(':percent', { total: (pixels.data.buffer.byteLength / 4) });
    var shape = pixels.shape.slice();
    var width = shape[0];
    var height = shape[1];

    svgStream.write('<?xml version="1.0" encoding="utf-8" ?>\n'+
                    '<svg baseProfile="full" ' +
                    'version="1.1" ' +
                    'height="'+height+'px" ' +
                    'width="'+width+'px" ' +
                    'xmlns="http://www.w3.org/2000/svg" ' +
                    'xmlns:ev="http://www.w3.org/2001/xml-events" ' +
                    'xmlns:xlink="http://www.w3.org/1999/xlink">\n');

    var c = 0;
    for (var i = 0; i < height; i += 1) {
        for (var j = 0; j < width; j += 1) {
            var r = pixels.data.buffer[c];
            var g = pixels.data.buffer[c+1];
            var b = pixels.data.buffer[c+2];
            var a = pixels.data.buffer[c+3];

            var rgbStr = 'rgb('+r+','+g+','+b+')';
            var hexObj = rgb2hex(rgbStr);
            var rectStr = '<rect fill="'+ hexObj.hex +'" height="1px" width="1px" x="' + j + '" y="'+ i +'" />\n';
            svgStream.write(rectStr);
            bar.tick();
            c += 4;
        }
    }

    svgStream.end('</svg>', function () {
        console.log('done!');
    });

});
