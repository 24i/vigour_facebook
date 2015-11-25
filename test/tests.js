module.exports = function runTests () {
  var facebook

  it('should get initial login in state on init', (done) => {
    facebook = window.vigour_facebook
    facebook.init()
    facebook.connectionStatus.once('data', function onConnectionStatus() {
      facebook.connectionStatus.off(onConnectionStatus)
      // alert('connectionStatus: ' + facebook.connectionStatus.val)
      done()
    })
  })

  it('should be able to change login state', (done) => {
    var loginState = facebook.login.val

    if (loginState) {
      // alert('logging out!')
      facebook.login.val = false
      expect(facebook.token.val).to.be.false
      expect(facebook.userId.val).to.be.false
      done()
    } else {
      // alert('logging in!')
      let cnt = 0
      facebook.login.val = true
      facebook.login.once('data', function onLogin() {
        facebook.login.off(onLogin)
        expect(facebook.login.val).to.equal('success')
        if(++cnt === 2) {
          done()
        }
      })
      facebook.token.once('data', function onToken() {
        facebook.token.off(onToken)
        expect(facebook.token.val).to.be.ok
        if(++cnt === 2) {
          done()
        }
      })
    }
  })

  it('should be able to share', (done) => {
    facebook.share.val = 'http://www.google.com'
    facebook.share.once('data', function onShared() {
      facebook.share.off(onShared)
      expect(facebook.share.val).to.equal('success')
      done()
    })
  })

  it('should be able to log out', (done) => {
    facebook.login.val = false
    expect(facebook.token.val).to.be.false
    if(facebook.loading.val) { // if loading wait till done
      facebook.loading.once('data', function onLoading() {
        facebook.loading.off(onLoading)
        done()
      })
    } else {
      done()
    }
  })

  it('should be able to share from non logged in state', (done) => {
    facebook.share.val = 'http://www.vigour.io'
    facebook.share.once('data',  function onShare() {
      facebook.share.off(onShare)
      expect(facebook.share.val).to.equal('success')
      expect(facebook.token.val).to.be.ok
      done()
    })
  })
}
