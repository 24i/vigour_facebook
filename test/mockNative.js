'use strict'

var runTests = require('./tests')

// modify the bridge to have a mock Native Facebook Plugin:

var bridge = require('vigour-wrapper/lib/bridge')

var yesno

var nativeMethods = {
  init(opt, cb) {
    // get current logged in status
    // in case of error > cb(err)
    // in case of not
    // 50/50 initial state logged out / in
    var response = (yesno = !yesno)
      ? { connectionStatus: 'unknown' }
      : {
        connectionStatus: 'connected',
        token: 'TOKEN_X',
        userId: 'USERID_X'
      }
    // async callback
    setTimeout(() => {
      cb && cb(null, response)
    })
  },
  login(opts, cb) {
    // log in with facebook
    // opts === undefined
    // in case of error > cb(err)
    // cancelling login is an error
    var response = {
      connectionStatus: 'connected',
      token: 'TOKEN_X',
      userId: 'USERID_X'
    }
    // async callback
    setTimeout(() => {
      cb && cb(null, response)
    })
  },
  logout(opts, cb) {
    // log out of facebook
    // opts === undefined
    // in case of error > cb(err)
    // no response object
    // async callback
    setTimeout(() => {
      console.log('webst no cb', opts, cb)
      cb && cb(null)
    })
  },
  share(opts, cb, bridge) {
    // share url on facebook
    // opts === url to share
    // in case of error > cb(err)
    // cancelling sharing is an error
    // user cancels sharing > not an error
    // no response object
    // async callback
    setTimeout(() => {
      var facebook = bridge.plugins['vigour-facebook']
      // we log in during the share operation
      facebook.emit('loginState', {
        connectionStatus: 'connected',
        token: 'TOKEN_X',
        userId: 'USERID_X'
      })
      // now we shared it
      cb && cb(null)
    })
  }
}

bridge.define({
  send(pluginId, fnName, opts, cb) {
    nativeMethods[fnName](opts, cb, bridge)
  }
})
