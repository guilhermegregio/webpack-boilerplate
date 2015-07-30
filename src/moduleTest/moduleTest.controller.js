function register(module) {
    'use strict';

    if (ON_TEST) {
		require('./moduleTest.controller.spec')(module);
    }

    module.controller('TesteController', TesteController);

    function TesteController() {
		var vm = this;
		vm.name = 'Controller' + vm.count;
    }
}

module.exports = register;
