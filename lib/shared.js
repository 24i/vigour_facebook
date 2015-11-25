'use strict'

var pkg = require('../package.json')
var defaults = pkg.vigour

var isEmpty = window.isempty = require('vigour-js/lib/util/is/empty')

module.exports = {
  key: pkg.name,
  inject: defaults,
  ready: false,
  loading: false,
  _loadings: {},
  appId: false,
  token: false,
  connectionStatus: false,
  login: {
    val: false,
    on: {
      value () {
        var login = this
        var facebook = login.parent
        var val = login.val
        if (val === true) { // log in
          facebook._login((err) => {
            if (err) {
              login.val = 'error'
            } else {
              login.val = 'success'
            }
          })
        } else if (val === false) { // log out
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
        var facebook = share.parent
        var url = share.val
        console.log('share val', url)
        if (url !== 'success' && url !== 'error') {
          console.log('ok thats an url go share!')
          facebook._share(url, (err, response) => {
            if (err) {
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
    _isLoading (label) {
      var fb = this
      fb._loadings.setKey(label, true)
      fb.loading.val = true
    },
    _isNotLoading (label) {
      var fb = this
      fb._loadings[label] && fb._loadings[label].remove()
      fb.loading.val = !isEmpty(fb._loadings)
    },
  }
}
