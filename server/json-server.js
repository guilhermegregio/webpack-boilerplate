var jsonServer = require('json-server');
var path = require('path');

var dbLocation = path.resolve(__dirname, './db.json');

var server = jsonServer.create();

server.use(jsonServer.defaults);

var router = jsonServer.router(dbLocation);
server.use('/api/', router);

server.listen(9002);
