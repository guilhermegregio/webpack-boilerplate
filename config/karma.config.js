var path = require('path');
var webpackConfig = require('./webpack.config');
var entry = path.resolve(webpackConfig.context, webpackConfig.entry);
var preprocessors = {};
preprocessors[entry] = ['webpack'];

module.exports = function(config) {
	config.set({
		basePath: '',

		frameworks: ['mocha', 'sinon-chai'],

		files: [ entry ],

		webpack: webpackConfig,

		exclude: [],

		preprocessors: preprocessors,

		reporters: ['progress'],

		port: 9876,

		colors: true,

		logLevel: config.LOG_INFO,

		autoWatch: true,

		browsers: ['PhantomJS'],

		singleRun: false,

		client: {
			mocha: {
				reporter: 'html',
				ui: 'tdd'
			}
		},

		plugins: [
			require('karma-webpack'),
			'karma-sinon-chai',
			'karma-mocha',
			'karma-phantomjs-launcher'
		]
	});
}

