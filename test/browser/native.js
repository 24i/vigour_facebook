'use strict'

var Plugin = require('vigour-wrapper/lib/bridge/plugin')

var devBridge = require('../../dev/bridge')
var shared = require('../../lib/shared')
var native = require('../../lib/native')

describe('Native Plugin', function () {
  var Facebook = new Plugin({
    inject: [shared, native],
    bridge: {
      useVal: devBridge
    }
  }).Constructor
  var facebook

  it('should be able to create a plugin instance', function (done) {
    facebook = new Facebook()
  })

  describe('Facebook API', function () {
    it('should be able to log in', function () {

    })

    it('should be able to share in', function () {

    })
  })
})
