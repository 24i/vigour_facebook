'use strict'
exports.platform = {
  on: {
    init: {
      facebook () {
        setTimeout(() => {
          this.handleResponse()
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
          user: {
            token: '12345qwerty',
            id: 'helloworld'
          }
        })
      } else {
        this.parent.set({
          status: 'unknown',
          user: {
            token: false,
            id: false
          }
        })
      }
    }
  }
}
