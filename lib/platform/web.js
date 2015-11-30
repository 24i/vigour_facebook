'use strict'

// TODO move this to the package / config
const SCRIPT_SRC = '//connect.facebook.net/en_NL/sdk.js'
const SCRIPT_ID = 'facebook-jssdk'
const SCOPE = 'public_profile,email'
const VERSION = 'v2.5'
const ERROR = 'error'

exports.platform = {
  on: {
    init: {
      facebook (data) {
        let script = document.createElement('script')
        let plugin = this.parent
        script.onerror = () => {
          plugin.initialised.val = false
          this.emit(ERROR, 'Facebook script load error')
        }
        script.src = SCRIPT_SRC
        script.id = SCRIPT_ID
        window.fbAsyncInit = () => {
          FB.init({
            appId: plugin.appID,
            xfbml: true,
            version: VERSION
          })
          FB.getLoginStatus((res) => this.handleResponse(res))
          plugin.ready.val = true
        }
        document.getElementsByTagName('head')[0].appendChild(script)
      }
    },
    login: {
      facebook (done) {
        FB.login((res) => {
          this.handleResponse(res)
          done()
        }, { scope: SCOPE })
      }
    },
    logout: {
      facebook (done) {
        FB.logout((res) => {
          this.parent.set({
            status: res.status,
            user: {
              token: false,
              id: false
            }
          })
          done()
        })
      }
    },
    share: {
      facebook (obj) {
        FB.ui({
          method: 'share',
          href: obj.data
        }, function (res) {
          var err = res.error_message
          if (!err) {
            obj.done()
          } else {
            this.emit(ERROR, err)
            obj.done(true)
          }
        })
      }
    }
  },
  define: {
    handleResponse (res) {
      var auth = res.authResponse
      this.parent.set({
        status: res.status,
        user: {
          token: (auth && auth.accessToken) || false,
          id: (auth && auth.userID) || false
        }
      })
    }
  }
}
