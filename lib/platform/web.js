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
        script.onerror = () => {
          this.initialised.val = false
          this.emit(ERROR, 'Facebook script load error')
        }
        script.src = SCRIPT_SRC
        script.id = SCRIPT_ID
        window.fbAsyncInit = () => {
          FB.init({
            appId: this.appID,
            xfbml: true,
            version: VERSION
          })
          FB.getLoginStatus((res) => this.handleResponse(res))
          this.ready.val = true
        }
        document.getElementsByTagName('head')[0].appendChild(script)
      }
    },
    login: {
      facebook (data) {
        FB.login((res) => this.handleResponse(res), { scope: SCOPE })
      }
    },
    logout: {
      facebook (data) {
        FB.logout((res) => {
          this.parent.set({
            status: res.status,
            user: {
              token: false,
              id: false
            }
          })
        })
      }
    },
    share: {
      facebook (data) {
        FB.ui({
          method: 'share',
          href: data
        }, (res) => this.shared.set(data))
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
