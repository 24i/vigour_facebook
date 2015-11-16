'use strict'

var Plugin = require('vigour-wrapper/lib/bridge/plugin')
var shared = require('../../lib/shared')
var web = require('../../lib/web')

describe('Native Plugin', function () {
  var Facebook = new Plugin({
    inject: [shared, web]
  })
  var facebook
  it('should be able to create a plugin instance', function (done) {
    facebook = new Facebook()
  })

  describe('Facebook API', function () {
    it('should be able to log in', function () {
      // facebook.login()
    })

    it('should be able to share in', function () {

    })
  })
})
