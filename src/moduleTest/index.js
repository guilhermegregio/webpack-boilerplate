var app = angular.module('app.test', []);

require('./moduleTest.directive')(app);
require('./moduleTest.controller')(app);

module.exports = app;
