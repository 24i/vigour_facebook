'use strict'

var Plugin = require('vigour-wrapper/lib/bridge/plugin')
var shared = require('../../lib/shared')
var web = require('../../lib/web')

describe('Web', function () {
  var Facebook = new Plugin({
    inject: [shared, web]
  }).Constructor
  var facebook
  it('should be able to create a plugin instance', function () {
    facebook = new Facebook({appId: '1224035690956856'})
    window.fb = facebook
  })

  describe('API', function () {
    it('should be able to log in', function () {
      facebook.login()

    })

    it('should be able to share in', function () {

    })
  })
})
