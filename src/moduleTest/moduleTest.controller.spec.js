function register(module) {
	'use strict';
	suite('moduleTest.controller', function() {
		var ctrlFn;
		var testeController;

		setup(angular.mock.module(module.name));

		setup(angular.mock.inject(function($controller) {
			ctrlFn = $controller('TesteController', {}, true);
			ctrlFn.instance.count = 1;
			testeController = ctrlFn();	
		}));

		test('should test properly', function() {
			assert.equal(testeController.name, 'Controller1');
		});

	});
}

module.exports = register;
