'use strict'
// TODO move this to the package / config
const SCRIPT_ID = 'facebook-jssdk'
const ERROR = 'error'

exports._platform = {
  on: {
    init: {
      facebook (data) {
        const script = document.createElement('script')
        const plugin = this.parent
        script.onerror = () => {
          plugin.initialised.val = false
          this.emit(ERROR, 'Facebook script load error')
        }
        script.src = plugin.web.src.val
        script.id = SCRIPT_ID
        global.fbAsyncInit = () => {
          FB.init({
            appId: process.env.FB_APPID || 1558522311117426,
            xfbml: true,
            version: this.parent.web.version.val,
            cookie: true
          })
          FB.getLoginStatus((res) => console.log('e', res))
          // FB.getLoginStatus((res) => this.handleResponse(res, plugin))
          plugin.ready.set(true)
        }
        document.getElementsByTagName('head')[0].appendChild(script)
      }
    },
    login: {
      facebook (done) {
        // console.log('got login emit')
        const handleResponse = this.handleResponse
        const plugin = this.parent
        if (plugin.ready.compute()) {
          FB.login(function (res) {
            handleResponse(res, plugin)
          }, {
            scope: plugin.scope.val
          })
          done()
        }
      }
    },
    logout: {
      facebook (data, stamp) {
        const plugin = this.parent
        plugin.set({
          status: 'unknown',
          user: {
            token: false,
            id: false
          }
        }, stamp)
        FB.logout(function (res) {
          const err = res.error_message
          if (!err) {
            // console.log('no error logging out');
          } else {
              // console.log('error logging out');
            this.emit(ERROR, err)
          }
        })
      }
    },
    share: {
      facebook (obj, done) {
        var platform = this
        FB.ui({
          method: 'share',
          href: obj.data
        }, (res) => {
          const err = res.error_message
          if (!err) return
          else platform.emit(ERROR, err)
        })
      }
    }
  },
  define: {
    handleResponse (res, plugin) {
      var auth = res.authResponse
      if (auth) {
        plugin.login.emit('success', auth)
      } else {
        console.log('no auth :(')
        plugin.set({ status: void 0 })
        plugin.set({ user: { val: false } }, false)
      }
    }
  }
}
