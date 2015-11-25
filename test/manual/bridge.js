'use strict'

describe('Facebook Native Bridge Plugin', function () {
	var facebook
	it('should be able to require', function () {
		facebook = require('../../lib/wrapped')
	})

	it('should get connection status on init', function (done) {
		var statuschange
		facebook.connectionStatus.once('data', function onStatus() {
			facebook.connectionStatus.off(onStatus)
			statuschange = true
		})

		facebook.send('init', {}, (err, response) => {
			expect(statuschange).to.be.true
			expect(err).to.be.null
			done()
		})

	})

	describe('login', function () {
		it('should give the right', function () {
		
		})
	})

	

})