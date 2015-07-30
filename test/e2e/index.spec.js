'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('Protractor Demo App', function() {

	var content = element(by.css('.red'));

    beforeEach(function() {
        browser.get('http://localhost:3000');
    });

    it('should have a title', function() {
		expect(browser.getTitle()).to.eventually.equal('Webpack AngularJS Boilerplate');
    });

    it('should have a text', function() {
		expect(content.getText()).to.eventually.equal('Controller1 Module Test Directive');
    });
});
