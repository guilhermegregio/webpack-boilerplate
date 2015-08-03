require('angular');

if (ON_TEST) {
	require('angular-mocks/angular-mocks');
}

var app = angular.module('app', [require('./moduleTest').name]);

module.exports = app;
