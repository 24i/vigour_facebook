'use strict'
module.exports = {
  user: {
    on: {
      value: {
        condition (data, next, event) {
          if (data === true) {
            // login
            setTimeout(() => {
              next(false, {
                status: 'connected',
                user: {
                  id: '1234',
                  token: '4321'
                }
              })
            }, 10)
          } else {
            // logout
            setTimeout(() => {
              next(false, {
                status: 'unknown',
                user: {
                  id: false,
                  token: false
                }
              })
            }, 10)
          }
        }
      }
    }
  },
  share: {
    on: {
      data: {
        condition (data, next, event) {
          setTimeout(() => {
            next()
          }, 10)
        }
      }
    }
  }
}