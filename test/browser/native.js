'use strict'

var Plugin = require('vigour-wrapper/lib/bridge/plugin')

var shared = require('../../lib/shared')
var native = require('../../lib/native')

describe('Native', function () {
  var facebook
  // fire ready
  // login
  // share
  it.skip('should be able to create a plugin instance', function () {
    var Facebook = new Plugin({
      inject: [shared, native]
    }).Constructor
    facebook = new Facebook()
  })

  describe.skip('API', function () {
    it('should be able to log in', function () {

    })

    it('should be able to share in', function () {

    })
  })
})
