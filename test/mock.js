'use strict'

var runTests = require('./tests')

// modify the bridge to have a mock Native Facebook Plugin:

var bridge = require('vigour-wrapper/lib/bridge')

var nativeMethods = {
  login (opts, cb) {
    // log in with facebook
    // opts === undefined
    // in case of error > cb(err)
    // cancelling login is an error
    var response = {
      token: 'TOKEN_X',
      userId: 'USERID_X'
    }
    // async callback
    setTimeout(() => {
      cb(null, response)
    })
  },
  logout (opts, cb) {
    // log out of facebook
    // opts === undefined
    // in case of error > cb(err)
    // no response object
    // async callback
    setTimeout(() => {
      cb(null)
    })
  },
  share (opts, cb) {
    // share url on facebook
    // opts === url to share
    // in case of error > cb(err)
    // cancelling sharing is an error
    // user cancels sharing > not an error
    // no response object
    // async callback
    setTimeout(() => {
      cb(null)
    })
  }
}

bridge.define({
  send (pluginId, fnName, opts, cb) {
    nativeMethods[fnName](opts, cb)
  }
})

describe('Facebook', () => {
  var facebook

  it('should be able to require facebook', () => {
    facebook = require('../../lib/wrapped')
  })

  describe('methods and properties', () => {
    runTests(facebook)
  })
})
