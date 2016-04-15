'use strict'

// TODO move this to the package / config
const SCRIPT_ID = 'facebook-jssdk'
const ERROR = 'error'

exports._platform = {
  on: {
    init: {
      facebook(data) {
        var that = this

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
            appId: this.parent.appId.val,
            xfbml: true,
            version: this.parent.web.version.val
          })
          // FB.getLoginStatus((res) => this.handleResponse(res, plugin))
          plugin.ready.val = true
        }
        document.getElementsByTagName('head')[0].appendChild(script)
      }
    },
    login: {
      facebook(done) {
        var handleResponse = this.handleResponse
        var plugin = this.parent
        plugin.ready.is(true, function() {
          FB.login(function(res) {
            handleResponse(res, plugin)
          }, {
            scope: plugin.scope.val
          })
          done()
        })
      }
    },
    logout: {
      facebook(done) {
        FB.logout((res) => {
          var err = res.error_message
          if (!err) {
            this.parent.set({
              status: res.status,
              user: {
                token: false,
                id: false
              }
            })
            done()
          } else {
            this.emit(ERROR, err)
            done(true)
          }
        })
      }
    },
    share: {
      facebook(obj) {
        var platform = this
        FB.ui({
          method: 'share',
          href: obj.data
        }, function(res) {
          var err = res.error_message
          if (!err) {
            obj.done()
          } else {
            platform.emit(ERROR, err)
            obj.done(true)
          }
        })
      }
    },
    track: {
      facebook (obj) {
        FB.AppEvents.logEvent('hahah')
        // FB.AppEvents.LogEvent('haha')
      }
    }
  },
  define: {
    handleResponse (res, plugin) {
      var auth = res.authResponse
      if (auth) {
        plugin.set({
          status: res.status,
          user: {
            token: (auth && auth.accessToken) || false,
            id: (auth && auth.userID) || false,
            val: (auth && auth.userID && true) || false
          }
        })
      }
    }
  }
}
