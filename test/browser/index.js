'use strict'

var ua = require('vigour-ua')
var agent = ua(navigator.userAgent)

if (agent.platform === 'android' || agent.platform === 'ios') {
	require('gaston-tester')
}

var runTests = require('../tests')

describe('Facebook Mock', function () {
	describe('shared + mock JS methods', function() {
		it('should require facebook API', function () {
			var facebook = require('../../lib/mock')
			window.vigour_facebook = facebook
		})
		describe('feature tests', function(){
	    runTests()
	  })
	})
	describe('shared + wrapped + mock native methods', function () {
		it('should mutate bridge to insert mock native plugin', function () {
			require('../mockNative')
		})
		it('should require facebook API', function () {
			var facebook = require('../../lib/wrapped')
			window.vigour_facebook = facebook
		})
		describe('feature tests', function () {
	    runTests()
	  })
	})

})
