module.exports = function runTests () {
  var facebook

  it('should get initial login in state on init', (done) => {
    facebook = window.vigour_facebook
    facebook.init()
    facebook.connectionStatus.once(() => {
      alert('connectionStatus: ' + facebook.connectionStatus.val)
      done()
    })
  })

  it('should be able to change login state', (done) => {

    var loginState = facebook.login.val

    if (loginState) {
      alert('logging out!')
      facebook.login.val = false
      expect(facebook.token.val).to.be.false
      expect(facebook.userId.val).to.be.false
      done()
    } else {
      alert('logging in!')
      let cnt = 0
      facebook.login.val = true
      facebook.login.once(function onLogin() {
        console.log('login once')
        expect(facebook.login.val).to.equal('success')
        if(++cnt === 2) {
          done()
        }
      })
      facebook.token.once(function() {
        console.log('token once!', facebook.token.val)
        expect(facebook.token.val).to.be.ok
        if(++cnt === 2) {
          done()
        }
        // facebook.token.off(onToken)
      })
    }
  })

  xit('should be able to share', (done) => {
    facebook.share.val = 'http://www.google.com'
    facebook.share.once(() => {
      console.log('shared!', facebook.share.val)
      expect(facebook.share.val).to.equal('success')
      done()
    })
  })

  xit('should be able to log out', (done) => {
    facebook.login.val = false
    expect(facebook.token.val).to.be.false
    facebook.loading.once(() => {
      console.log('loading change after logout', facebook.loading.val)
      done()
    })
    
  })

  xit('should be able to share from non logged in state', () => {
    facebook.share.val = 'http://www.vigour.io'
    facebook.share.once(() => {
      console.log('shared!', facebook.share.val)
      expect(facebook.share.val).to.equal('success')
      expect(facebook.token.val).to.be.ok
      done()
    })
  })
}
