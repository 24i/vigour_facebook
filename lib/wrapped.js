'use strict'
var Plugin = require('vigour-wrapper/lib/bridge/plugin')

var shared = require('./shared')

module.exports = new Plugin({
  inject: shared,
  platform: 'wrapped',
  on: {
    loginState (setobj) {
      this.set(setobj)
    }
  },
  define: {
    init (appId) {
      var fb = this
      fb.send('init', appId, (err, response) => {
        if (!err) {
          fb.set(response)
        }
        fb.ready.val = true
      })
    },
    _login (callback) {
      var fb = this
      if (fb.token.val) {
        return callback && callback(null)
      }
      fb._isLoading('login')
      fb.send('login', {}, function loginResponse (err, response) {
        fb._isNotLoading('login')
        if (err) {
          fb.emit('error', err)
        } else {
          fb.set(response)
        }
        if (callback) {
          callback(err, response)
        }
      })
    },
    _logout (callback) {
      var fb = this
      if (!fb.token.val) {
        return callback && callback(null)
      }
      fb._isNotLoading('login')
      fb.set({
        login: false,
        token: false,
        userId: false,
        connectionStatus: 'unknown'
      })
      fb.send('logout', {}, callback)
    },
    _share (shared, callback) {
      var fb = this
      fb._isLoading('share')
      this.send('share', shared, (err, response) => {
        fb._isNotLoading('share')
        if (callback) {
          callback(err, response)
        }
      })
    }
  }
})
