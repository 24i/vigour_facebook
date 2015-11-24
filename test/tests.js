module.exports = function runTests () {
  var facebook

  it('should get initial login in state on init', (done) => {
    facebook = window.vigour_facebook
    facebook.init()
    facebook.connectionStatus.once(function onConnectionStatus() {
      alert('connectionStatus: ' + facebook.connectionStatus.val)
      facebook.connectionStatus.off(onConnectionStatus)
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
        facebook.login.off(onLogin)
        console.log('login once')
        expect(facebook.login.val).to.equal('success')
        if(++cnt === 2) {
          console.error('call done')
          done()
        }
      })
      facebook.token.once(function onToken() {
        facebook.token.off(onToken)
        console.log('token once!', facebook.token.val)
        expect(facebook.token.val).to.be.ok
        if(++cnt === 2) {
          console.error('call done')
          done()
        }
      })
    }
  })

  it('should be able to share', (done) => {
    facebook.share.val = 'http://www.google.com'
    facebook.share.once( function onShared() {
      facebook.share.off(onShared)
      console.log('shared!', facebook.share.val)
      expect(facebook.share.val).to.equal('success')
      done()
    })
  })

  it('should be able to log out', (done) => {
    console.error('logging out!')
    facebook.login.val = false
    expect(facebook.token.val).to.be.false
    if(facebook.loading.val) {
      facebook.loading.once(function onLoading() {
        facebook.loading.off(onLoading)
        console.log('loading change after logout', facebook.loading.val)
        done()
      })
    } else {
      done()
    }    
  })

  it('should be able to share from non logged in state', () => {
    console.error('sharing from logged out state out!')
    facebook.share.val = 'http://www.vigour.io'
    facebook.share.once( function onShare() {
      facebook.share.off(onShare)
      console.log('shared!', facebook.share.val)
      expect(facebook.share.val).to.equal('success')
      expect(facebook.token.val).to.be.ok
      done()
    })
  })
}
