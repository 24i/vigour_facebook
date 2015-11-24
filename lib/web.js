'use strict'

var _ = require('lodash')

var Observable = require('vigour-js/lib/observable')
var Config = require('vigour-js/lib/config')

var pkg = require('../package.json').vigour

const SDK_ID = 'facebook-jssdk'

const ERR_SRC = 'Facebook: can not init without skd src'
const ERR_SCP = 'Facebook: missing scope'
const ERR_APP = 'Facebook: missing appId'

var shared = require('./shared')

var facebook = module.exports = new Observable({
  inject: shared,
  platform: 'web',
  ready: false,
  initialised: false,
  loading: false,
  _loadings: { useVal: [] },
  _queue: { useVal: {} },
  login: {
    val: false,
    on: {
      value () {
        var login = this
        var val = login.val
        console.log('login value!', val)
        if (val === true) {
          console.log('log in!')
          facebook._login((err) => {
            if (err) {
              login.val = 'error'
            } else {
              login.val = 'success'
            }
          })
        } else if (val === false) {
          console.log('log out!')
          facebook._logout()
        }
      }
    }
  },
  share: {
    val: false,
    on: {
      value () {
        var share = this
        var url = share.val
        console.log('go share', url)
        if (url !== 'success' && url !== 'error') {
          console.log('ok thats an url go share!')
          facebook._share(url, (err, response) => {
            if (err) {
              facebook.emit('error', err)
              share.val = 'error'
            } else {
              share.val = 'success'
            }
          })
        }
      }
    }
  },
  define: {
    _loading (id) {
      var fb = this
      fb.loading.val = fb._loadings.push(id)
    },
    _notLoading(id) {
      var fb = this
      _.remove(fb._loadings, (item) => {
        return item === id
      })
      fb.loading.val = fb._loadings.length
    },
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
        return callback(null)
      }
      fb._loading('login')
      if (fb.init()) {
        FB.login((response) => {
          var err = null
          fb._notLoading('login')
          fb.loginResponse(response)
          if (response.status !== 'connected') {
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
        console.log('already have no token!')
        return callback(null)
      }
      fb._notLoading('login')
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
    },
    _share (shared, callback) {
      var fb = this
      fb._loading('share')
      if (fb.ready.val) {
        FB.ui({
          method: 'share',
          href: shared
        }, function shareResponse (response) {
          fb._notLoading('share')
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
var c
function init (fb) {
  fb.initialised.val = true
  fb._loading('init')
  var fbWeb = fb.web
  // set up window callback for SDK script loaded
  window.fbAsyncInit = function fbAsyncInit () {
    fb.ready.val = true

    fb._notLoading('init')
    alert(fb._loadings)
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
