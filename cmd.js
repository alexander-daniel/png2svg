#!/usr/bin/env node
/*jshint strict:false */

var getPixels = require('get-pixels');
var fs = require('fs');
var image = process.argv[2];
var output = process.argv[3];

if (!output) output = __dirname + './output.svg';
var svgStream = fs.createWriteStream(output);

var ProgressBar = require('progress');

getPixels(image, function(err, pixels) {
	if (err) return console.log('Bad pixels path');
	console.log('processing ' + image + ' -> SVG');

	var shape = pixels.shape.slice();
	var width = shape[0];
	var height = shape[1];
	//console.log(pixels.data.buffer);
	var bar = new ProgressBar(':percent', { total: (pixels.data.buffer.byteLength / 4) });

	svgStream.write('<?xml version="1.0" encoding="utf-8" ?><svg baseProfile="full" height="'+height+'px" version="1.1" width="'+width+'px" xmlns="http://www.w3.org/2000/svg" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xlink="http://www.w3.org/1999/xlink"><defs />');

	var c = 0;
	for (var i = 0; i < height; i += 1) {
		for (var j = 0; j < width; j += 1) {
			bar.tick();
			var pixel = 'rgba(' + pixels.data.buffer[c] + ',' + pixels.data.buffer[c+1] + ',' + pixels.data.buffer[c+2] + ',' + pixels.data.buffer[c+3] + ')';
			var rectStr = '<rect fill="'+ pixel +'" height="1px" width="1px" x="' + j + '" y="'+ i +'" />';
			svgStream.write(rectStr);
			c += 4;
		}

	}
	svgStream.end('</svg>', function () {
		console.log('done!');
	});
	
});
