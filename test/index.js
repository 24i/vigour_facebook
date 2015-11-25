'use strict'

var runTests = require('./tests')

describe('Facebook', () => {
  it('should be able to require facebook', () => {
    var facebook = window.vigour_facebook = require('../lib')
    facebook.appId.val = '1523994961255055'
  })

  describe('methods and properties', function(){
		this.timeout(2 * 60 * 1000)
    runTests()
  })
})
