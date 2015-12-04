'use strict'
exports._platform = {
  on: {
    init: {
      facebook () {
        setTimeout(() => {
          this.parent.ready.val = true
        }, 10)
      }
    },
    login: {
      facebook (done) {
        setTimeout(() => {
          this.parent.set({
            status: 'connected',
            user: {
              token: '12345qwerty',
              id: 'helloworld'
            }
          })
          done()
        }, 10)
      }
    },
    logout: {
      facebook (done) {
        setTimeout(() => {
          this.parent.set({
            status: 'unknown',
            user: {
              token: false,
              id: false
            }
          })
          done()
        }, 10)
      }
    },
    share: {
      facebook (obj) {
        setTimeout(() => {
          obj.done()
        }, 10)
      }
    }
  }
}
