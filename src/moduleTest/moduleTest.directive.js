function register(module) {
    'use strict';

    if (ON_TEST) {
        require('./moduleTest.directive.spec')(module);
    }

    module.directive('teste', moduleTestDirective);

    function moduleTestDirective() {
        require('./moduleTest.styl');

        var directive = {
            restrict: 'EA',
            template: require('./moduleTest.html'),
            link: link,
            controller: 'TesteController',
            controllerAs: 'teste',
            bindToController: true,
            scope: {
				count: '@'
            }
        };

        return directive;

        function link(scope, element, attrs) {}
    }
}


module.exports = register;
