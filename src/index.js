require('angular');

if (ON_TEST) {
	require('angular-mocks/angular-mocks');
}

require('./moduleTest');

var app = angular.module('app', ['moduleTest']);

module.exports = app;
global.window.app = app;
