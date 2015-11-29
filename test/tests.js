'use strict'
module.exports = function (inject) {
  var facebook
  
  it('require facebook', function () {
    facebook = require('../lib')
  })

  if (inject) {
    it('create instance with mock properties', function () {
      facebook = new facebook.Constructor(inject)
    })
  }

  it('log in', function (done) {
    this.timeout(10000)
    facebook.user.token.once(function () {
      expect(facebook.status.val).equals('connected')
      expect(facebook.user.id.val).is.a('string')
      expect(this.val).is.a('string')
      done()
    })
    facebook.user.val = true
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
    facebook.user.token.once(function () {
      if (!this.val) done()
    })
    facebook.user.val = false
  })
}
