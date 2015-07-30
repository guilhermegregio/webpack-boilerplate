var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');
var http = require('http');
var proxy = httpProxy.createProxyServer({
	changeOrigin: true
}); 

var app = express();
var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve('./build');

app.use(express.static(publicPath));

if(!isProduction) {
	app.all('/build/*', function (req, res) {
		proxy.web(req, res, {target: 'http://127.0.0.1:9001'});
	});
	app.all('/api/*', function(req, res) {
		proxy.web(req, res, {target: 'http://127.0.0.1:9002/'});
	});
}

app.listen(port, function () {
	console.log('Server running on port ' + port);
});
