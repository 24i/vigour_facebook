'use strict'
// TODO move this to the package / config
const SCRIPT_ID = 'facebook-jssdk'
const ERROR = 'error'

exports._platform = {
  on: {
    init: {
      facebook (data) {
        let script = document.createElement('script')
        let plugin = this.parent
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
            version: this.parent.web.version.val
          })
          // FB.getLoginStatus((res) => this.handleResponse(res, plugin))
          plugin.ready.set(true)
        }
        document.getElementsByTagName('head')[0].appendChild(script)
      }
    },
    login: {
      facebook (done) {
        // console.log('got login emit')
        var handleResponse = this.handleResponse
        var plugin = this.parent
        if (plugin.ready.compute()) {
          if (window.facebookConnectPlugin) {
            window.facebookConnectPlugin.login(['public_profile', 'email'], function (res) {
              handleResponse(res, plugin)
            })
            done()
          } else {
            FB.login(function (res) {
              handleResponse(res, plugin)
            }, {
              scope: plugin.scope.val
            })
            done()
          }
        }
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
  //   logout: {
  //     facebook (done) {
  //
  //       // console.error('YES GO LOGOUT')
  //
  //       // console.log('calling facebook logout!')
  //       this.parent.set({
  //         status: 'unknown',
  //         user: {
  //           token: false,
  //           id: false
  //         }
  //       })
  //       done()
  //
  //       FB.logout((res) => {
  //         // console.log('got logout res!', res)
  //         var err = res.error_message
  //         // if (!err) {
  //
  //         // } else {
  //         //   this.emit(ERROR, err)
  //         //   done(true)
  //         // }
  //       })
  //     }
  //   },
  //   share: {
  //     facebook (obj) {
  //       var platform = this
  //       FB.ui({
  //         method: 'share',
  //         href: obj.data
  //       }, function (res) {
  //         var err = res.error_message
  //         if (!err) {
  //           obj.done()
  //         } else {
  //           platform.emit(ERROR, err)
  //           obj.done(true)
  //         }
  //       })
  //     }
  //   }
  // },
}
