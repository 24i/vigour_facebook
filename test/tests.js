'use strict'
const SHARE_URL = 'http://vigour.io'
module.exports = function (inject, type) {
  var facebook

  it('require facebook', function () {
    facebook = require('../lib')
  })

  if (inject) {
    it('create instance with mock properties', function () {
      facebook = new facebook.Constructor(inject)
    })
  }

  it('it must call \'init\' when setting the value', function (done) {
    facebook.ready.is(true, function () {
      done()
    })
    facebook.val = true
  })

  it('log in', function (done) {
    facebook.user.once(function () {
      expect(facebook.status.val).equals('connected')
      expect(facebook.user.token.val).is.a('string')
      expect(facebook.user.id.val).is.a('string')
      done()
    })
    facebook.user.val = true
  })

  it('share a url', function (done) {
    facebook.share.once(function () {
      expect(this.val).equals(SHARE_URL)
      done()
    })
    facebook.share.val = SHARE_URL
  })

  it('log out', function (done) {
    facebook.user.token.once(function () {
      if (!this.val) done()
    })
    facebook.user.val = 0
  })

  it('share a url when logged out', function (done) {
    facebook.share.once(function () {
      expect(this.val).equals(SHARE_URL)
      done()
    })
    facebook.share.val = SHARE_URL
  })
}
