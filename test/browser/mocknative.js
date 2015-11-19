'use strict'

var Plugin = require('vigour-wrapper/lib/bridge/plugin')

var devBridge = require('../../dev/bridge')
var shared = require('../../lib/shared')
var FacebookNative = require('../../lib/native')

describe('Mock Native', function () {
  var facebook
  // fire ready
  // login
  // share
  it('should be able to create a plugin instance', function () {
    facebook = new FacebookNative()
  })

  describe('API', function () {
    it('should be able to log in', function (done) {
      facebook.login(function (err, response) {
        console.log('login callback!?', err, response)
        if (err) {
          throw err
        }
        done()
      })
    })

    it('should be able to share', function (done) {
      facebook.login(function (err) {
        if (err) {
          throw err
        }
        done()
      })
    })
  })
})
