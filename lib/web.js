'use strict'

var Observable = require('vigour-js/lib/observable')
var Config = require('vigour-js/lib/config')

var pkg = require('../package.json').vigour

const DEF_SRC = pkg.web.src
const DEF_VER = pkg.web.version
const DEF_SCP = pkg.scope
const SDK_ID = 'facebook-jssdk'

const ERR_SRC = 'Facebook: can not init without skd src'
const ERR_SCP = 'Facebook: missing scope'

var shared = require('./shared')

module.exports = new Observable({
  inject: shared,
  platform: 'web',
  ready: false,
  connectionStatus: false,
  queue: {
    useVal: {}
  },
  define: {
    init () {
      var fb = this
      var fbWeb = fb.web
      // set up window callback for SDK script loaded
      window.fbAsyncInit = function fbAsyncInit () {
        fb.ready.val = true
        FB.init({
          appId: fb.appId.val,
          xfbml: fbWeb && fbWeb.xfbml ? fbWeb.xfbml.val : true,
          version: fbWeb && fbWeb.version && fbWeb.version.val || DEF_VER
        })
        FB.getLoginStatus((response) => {
          fb.loginResponse(response)
        })
        // do queued stuff
        for (let q in fb.queue) {
          let method = fb[q]
          method.apply(fb, fb.queue[q])
        }
      }
      // insert script
      var src = fbWeb && fbWeb.src && fbWeb.src.val || DEF_SRC
      if (!src) {
        throw new Error(ERR_SRC)
      }
      var scriptElement = makeScriptElement(src, SDK_ID)
      document.getElementsByTagName('head')[0].appendChild(scriptElement)
      var scope = fb.scope && fb.scope.val
      if (!scope) {
        if (DEF_SCP) {
          fb.set({scope: DEF_SCP})
        } else {
          throw new Error(ERR_SCP)
        }
      }
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
        }, {scope: fb.scope.val})
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
