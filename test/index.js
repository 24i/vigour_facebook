'use strict'
var facebook = require('../lib')

// mock
facebook.set({
  inject: require('vigour-wrapper/lib/bridge/inject')('vigour-test'),
  platform: {
    on: {
      init: {
        facebook () {
          setTimeout(() => {
            this.ready.val = true
          }, 10)
        }
      },
      login: {
        facebook () {
          setTimeout(() => {
            this.handleResponse(true)
          }, 10)
        }
      },
      logout: {
        facebook () {
          setTimeout(() => {
            this.handleResponse()
          }, 10)
        }
      },
      share: {
        facebook (data) {
          setTimeout(() => {
            this.shared.val = data
          }, 10)
        }
      }
    },
    define: {
      handleResponse (res) {
        if (res) {
          this.parent.set({
            status: 'connected',
            token: '12345qwerty',
            id: 'helloworld'
          })
        } else {
          this.parent.set({
            status: 'unknown',
            token: false,
            id: false
          })
        }
      }
    }
  }
})

describe('Facebook plugin', function () {
  it('log in', function (done) {
    this.timeout(10000)
    facebook.token.once(function () {
      expect(facebook.status.val).equals('connected')
      expect(facebook.id.val).is.a('string')
      expect(this.val).is.a('string')
      done()
    })
    facebook.val = true
  })

  it('share', function (done) {
    this.timeout(10000)
    facebook.shared.once(function () {
      expect(this.val).equals(facebook.share.val)
      done()
    })
    facebook.share.val = 'http://vigour.io'
  })

  it('log out', function (done) {
    this.timeout(5000)
    facebook.token.once(function () {
      if (!this.val) done()
    })
    facebook.val = false
  })
})
