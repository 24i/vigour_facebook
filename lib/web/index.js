'use strict'
var Observable = require('vigour-js/lib/observable')

// TODO move this to the package
const SCRIPT_SRC = '//connect.facebook.net/en_NL/sdk.js'
const SCRIPT_ID = 'facebook-jssdk'
const VERSION = 'v2.5'
const READY = 'ready'
const ERROR = 'error'

module.exports = new Observable({
  // inject: require('../shared'),
  connectionStatus: false,
  loading: false,
  ready: false,
  on: {
    value (appId) {
      if (appId) {
        this.init(appId)
      }
    }
  },
  define: {
    init (appId) {
      appId = appId || this.appId
      if (!appId) {
        throw new Error('No app id defined')
      }
      if (this.initialised) {
        this.ready.is(true, () => this.initInternal(appId))
      } else {
        let script = document.createElement('script')
        script.onerror = () => {
          this.initialised = false
          this.emit(ERROR, 'Facebook script load error')
        }
        script.src = SCRIPT_SRC
        script.id = SCRIPT_ID
        window.fbAsyncInit = () => this.initInternal(appId)
        document.getElementsByTagName('head')[0].appendChild(script)
        this.initialised = true
      }
    },
    initInternal (appId) {
      FB.init({
        appId: appId,
        xfbml: true,
        version: VERSION
      })
      FB.getLoginStatus((res) => this.handleResponse(res))
      this.ready.val = true
    },
    handleResponse (res) {
      var status = res.status
      var obj = { connectionStatus: status }
      if (status === 'connected') {
        let auth = res.authResponse
        obj.token = auth.accessToken
        obj.userId = auth.userID
      } else {
        obj.token = false
        obj.userId = false
      }
      this.set(obj)
    },
    login (cb) {
      var ready = this.ready
      if (ready.val) {
        if (this.token.val) {
          return cb && cb(null)
        } else {
          let success = (res) => {
            this.handleResponse(res)
            if (cb) {
              cb(null, res)
            }
          }
          FB.login(success, { scope: this.scope.val })
        }
      } else {
        ready.once(() => this.login(cb))
        if (!this.initialised) {
          this.init()
        }
      }
    },
    logout (cb) {
      var ready = this.ready
      if (ready.val) {
        if (this.token.val) {
          return cb && cb(null)
        } else {
          let success = (res) => {
            if (cb) {
              cb(null, res)
            }
          }
          FB.logout(success)
        }
      } else {
        ready.once(() => this.login(cb))
        if (!this.initialised) {
          this.init()
        }
      }
    },
    share () {

    }
  }
})
