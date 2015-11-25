'use strict'

var Observable = require('vigour-js/lib/observable')
var Config = require('vigour-config')

var pkg = require('../package.json').vigour

const SDK_ID = 'facebook-jssdk'

const ERR_SRC = 'Facebook: can not init without skd src'
const ERR_SCP = 'Facebook: missing scope'
const ERR_APP = 'Facebook: missing appId'

var shared = require('./shared')

var facebook = module.exports = new Observable({
  inject: shared,
  platform: 'web',
  initialised: false,
  _queue: { useVal: {} },
  define: {
    init (appId) {
      var fb = this
      if (appId) {
        fb.appId.val = appId
      }
      if (fb.ready.val) {
        return true
      } else {
        if (!fb.initialised.val) {
          init(fb)
        }
        return false
      }      
    },
    _login (callback) {
      var fb = this
      if(fb.token.val) {
        return callback && callback(null)
      }
      if (fb.init()) {
        fb._isLoading('login')
        FB.login((response) => {
          var err = null
          fb._isNotLoading('login')
          if (response.status === 'connected') {
            response = fb.loginResponse(response)
          } else {
            err = 'login failed'
            fb.emit('error', err)
          }
          if (callback) {
            callback(err, response)
          }
        }, {scope: fb.scope.val})
      } else {
        if (fb._queue._logout) {
          delete fb._queue._logout
        }
        fb._queue._login = [callback]
      }
    },
    _logout (callback) {
      var fb = this
      if(!fb.token.val) {
        return callback && callback(null)
      }
      fb._isNotLoading('login')
      fb.set({
        login: false,
        token: false,
        userId: false,
        connectionStatus: 'unknown'
      })
      if (fb.init()) {
        FB.logout((response) => {
          if (callback) {
            callback(null, response)
          }
        })
      } else {
        if (fb._queue._login) {
          delete fb._queue._login
        } else {
          fb._queue._logout = [callback]
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
        setobj.userId = auth.userId
        setobj.login = 'success'
        // setobj.signedRequest: auth.signedRequest
      }
      fb.set(setobj)
      return setobj
    },
    _share (shared, callback) {
      var fb = this
      if (fb.init()) {
        fb._isLoading('share')
        FB.ui({
          method: 'share',
          href: shared
        }, function shareResponse (response) {
          fb._isNotLoading('share')
          if (callback) {
            callback(null, response)
          }
        })
      } else {
        fb._queue._share = [shared, callback]
      }
    }
  }
})

var config = new Config()
if (config.facebook) {
  facebook.set(config.facebook.convert())
}

function init (fb) {
  fb.initialised.val = true
  fb._isLoading('init')
  var fbWeb = fb.web
  // set up window callback for SDK script loaded
  window.fbAsyncInit = function fbAsyncInit () {
    fb.ready.val = true
    fb._isNotLoading('init')

    var appId = fb.appId && fb.appId.val
    if (!appId) {
      throw new Error(ERR_APP)
    }
    FB.init({
      appId: appId,
      xfbml: fbWeb && fbWeb.xfbml && fbWeb.xfbml.val,
      version: fbWeb && fbWeb.version && fbWeb.version.val
    })
    FB.getLoginStatus((response) => {
      fb.loginResponse(response)
      // do queued stuff
      for (let key in fb._queue) {
        fb[key].apply(fb, fb._queue[key])
      }
    })
    
  }
  // insert script
  var src = fbWeb && fbWeb.src && fbWeb.src.val
  if (!src) {
    throw new Error(ERR_SRC)
  }
  var scriptElement = makeScriptElement(src, SDK_ID)
  document.getElementsByTagName('head')[0].appendChild(scriptElement)
}

function makeScriptElement (src, id) {
  var script = document.createElement('script')
  script.onerror = () => {
    this.emit('error', 'script load error! src:' + src + ' id:' + id)
  }
  script.src = src
  script.id = id
  return script
}
