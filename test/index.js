'use strict'
var facebook = require('../lib')

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

  it('share a url', function (done) {
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
