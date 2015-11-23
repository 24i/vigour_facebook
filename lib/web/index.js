'use strict'

var Observable = require('vigour-js/lib/observable')
var Config = require('vigour-js/lib/config')

// TODO: get this stuff from config:
var SDK_SRC = '//connect.facebook.net/en_NL/sdk.js'
var SDK_ID = 'facebook-jssdk'
var SCOPE = 'public_profile,email'

module.exports = new Observable({
  key: 'Facebook',
  platform: 'web',
  token: false,
  ready: false,
  connectionStatus: false,
  queue: {
    useVal: {}
  },
  on: {
    new () {
      var fb = this
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
      if (!fb.appId && fb.appId.val) {
        throw new Error('Facebook: needs an appId')
      }
      fb.init()
    }
  },
  define: {
    init () {
      var fb = this
      // set up window callback for SDK script loaded
      window.fbAsyncInit = function fbAsyncInit () {
        fb.ready.val = true
        FB.init({
          appId: fb.appId.val,
          xfbml: fb.xfbml ? fb.xfbml.val : true,
          version: fb.version ? fb.version.val : 'v2.5'
        })
        FB.getLoginStatus(function (response) {
          fb.loginResponse(response)
        })
        // do queued stuff
        for (let q in fb.queue) {
          let method = fb[q]
          method.apply(fb, fb.queue[q])
        }
      }
      // insert script
      var src = fb.src && fb.src.val || SDK_SRC
      var scriptElement = makeScriptElement(src, SDK_ID)
      document.getElementsByTagName('head')[0].appendChild(scriptElement)
    },
    login (callback) {
      var fb = this
      if (fb.ready.val) {
        FB.login((response) => {
          fb.loginResponse(response)
          if (response.status !== 'connected') {
            fb.emit('error', 'login failed')
          }
          if (callback) {
            callback(null, response)
          }
        }, {scope: SCOPE})
      } else {
        if (fb.queue.logout) {
          delete fb.queue.logout
        }
        fb.queue.login = [callback]
      }
    },
    logout (callback) {
      var fb = this
      fb.set({
        token: false,
        userID: false,
        connectionStatus: 'unknown'
      })
      if (fb.ready.val) {
        FB.logout((response) => {
          if (callback) {
            callback(null, response)
          }
        })
      } else {
        if (fb.queue.login) {
          delete fb.queue.login
        } else {
          fb.queue.logout = [callback]
        }
      }
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
    share (shared, callback) {
      var fb = this
      if (fb.ready.val) {
        FB.ui({
          method: 'share',
          href: shared
        }, function shareResponse (response) {
          if (callback) {
            callback(null, response)
          }
        })
      } else {
        fb.queue.share = [shared, callback]
      }
    }
  }
}).Constructor

function makeScriptElement (src, id) {
  var script = document.createElement('script')
  script.onerror = () => {
    this.emit('error', 'script load error! src:' + src + ' id:' + id)
  }
  script.src = src
  script.id = id
  return script
}
