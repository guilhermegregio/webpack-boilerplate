function register(module) {
	'use strict';
	suite('moduleTest.directive', function() {
		setup(angular.mock.module(module.name));

		test('should test properly', function() {
			assert.equal(true, true);
		});
	});
}

module.exports = register;
