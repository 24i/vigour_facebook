'use strict'

var runTests = require('../tests')

describe('Facebook Manual Tests', function () {
	describe('require facebook', function() {
		it('should require facebook API', function () {
			var facebook = require('../../lib')
    	facebook.appId.val = '1523994961255055'
			window.vigour_facebook = facebook
		})
		describe('feature tests', function(){
			this.timeout(25 * 1000)
	    runTests()
	  })
	})
})
