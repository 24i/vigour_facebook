'use strict'
exports._platform = {
  on: {
    // init: {
    //  check for login status maybe>
    // }
    login: {
      facebook (done) {
        // called on login attempt
        const handleResponse = this.handleResponse
        const plugin = this.parent
        window.facebookConnectPlugin.login(['public_profile', 'email'], function (res) {
          handleResponse(res, plugin)
        })
        done()
      }
    },
    logout: {
      facebook (done) {
        facebookConnectPlugin.logout(function success () {
          console.log('login success')
        }, function failure () {
          console.log('logout fail')
        })
      }
    },
    share: {
      facebook (obj) {
        // called on share attempt
        facebookConnectPlugin.showDialog({
          method: 'share',
          href: obj.url,
          caption: obj.caption || void 0,
          description: obj.description || void 0,
          picture: obj.img || void 0,
          share_feedWeb: true // iOS only
        }, function success () {
          console.log('share success')
        }, function failure () {
          console.log('fail')
        })
      }
    },
    invite: {
      facebook (obj) {
        // called on share attempt
        facebookConnectPlugin.appInvite({
          url: 'http://example.com',
          picture: 'http://example.com/image.png'
        }, function success (res) {
          if (res.completionGesture === 'cancel') {
            console.log('not really invited')
          } else {
            console.log('invite success')
          }
        }, function failure () {
          console.log('fail')
        })
      }
    }
  },
  define: require('./web.js')._platform.define
}
