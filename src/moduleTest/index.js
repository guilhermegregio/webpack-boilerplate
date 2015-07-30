var app = angular.module('moduleTest', []);

require('./moduleTest.directive')(app);
require('./moduleTest.controller')(app);

module.exports = app;
