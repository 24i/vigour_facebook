'use strict'

var pkg = require('../package.json')
var defaults = pkg.vigour

var isEmpty = window.isempty = require('vigour-js/lib/util/is/empty')

module.exports = {
  key: pkg.name,
  inject: defaults,
  connectionStatus: false,
  loading: false,
  ready: false,
  appId: false,
  token: false,
  _loadings: {},
  login: {
    val: false,
    on: {
      value () {
        var plugin = this.parent
        var val = this.val
        if (val === true) { // log in
          plugin._login((err) => {
            if (err) {
              this.val = 'error'
            } else {
              this.val = 'success'
            }
          })
        } else if (val === false) { // log out
          plugin._logout()
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
    }
  }
}
