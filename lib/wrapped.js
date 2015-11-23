'use strict'

// var pkg = require('../package.json')
// var _pluginId = pkg.name
var _pluginId = 'vigour-facebook'
var Plugin = require('vigour-wrapper/lib/bridge/plugin')
var Config = require('vigour-js/lib/config')

var shared = require('./shared')

module.exports = new Plugin({
  key: _pluginId,
  inject: shared,
  platform: 'wrapped',
  token: false,
  on: {
    new () {
      var fb = this
      // console.log('new facebook plugin!', fb.bridge, fb.bridge.send)
      var config = new Config()
      if (config && config.facebook) {
        let setFromConf = {}
        config.facebook.each((val, key) => {
          if (!fb[key]) {
            setFromConf[key] = val.plain()
          }
        })
        fb.set(setFromConf)
      }
      var appId = fb.appId && fb.appId.val
      if (!appId) {
        throw new Error('Facebook: needs an appId')
      }
      console.log('Plugin new! go send init!', fb.send, fb.bridge)
      fb.send('init', appId)
      console.log('wat')
    },
    loginState (response) {
      this.loginResponse(response)
    }
  },
  define: {
    login (callback) {
      var fb = this
      fb.send('login', function loginResponse (err, response) {
        if (err) {
          fb.emit('error', err)
        } else {
          fb.loginResponse(response)
        }
        if (callback) {
          callback(err, response)
        }
      })
    },
    loginResponse (response) {
      var fb = this
      var setobj = {
        connectionStatus: response.status
      }
      if (response.status === 'connected') {
        var auth = response.authResponse
        setobj.token = auth.accessToken
        setobj.userID = auth.userID
      // setobj.signedRequest: auth.signedRequest
      }
      fb.set(setobj)
    },
    logout (callback) {
      var fb = this
      fb.set({
        token: false,
        userID: false,
        connectionStatus: 'unknown'
      })
      fb.send('logout', callback)
    },
    share (shared, callback) {
      this.send('share', shared, callback)
    }
  }
}).Constructor
