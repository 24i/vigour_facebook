'use strict'

// TODO move this to the package / config
const SCRIPT_ID = 'facebook-jssdk'
const ERROR = 'error'

exports._platform = {
  on: {
    init: {
      facebook(data) {
        var handleResponse = this.handleResponse

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
          plugin.ready.val = true
          global.FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
              // causes app to crash but we need it
              // handleResponse(response, plugin)
            }
          })
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
    }
  },
  define: {
    handleResponse (res, plugin) {
      var auth = res.authResponse
      if (auth) {
        global.FB.api('/' + auth.userID, function (response) {
          if (response && !response.error) {
            auth.nick = response.name
          }
        })
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
