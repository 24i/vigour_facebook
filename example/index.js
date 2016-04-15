'use strict'

var Observable = require('vigour-observable')
var Element = require('vigour-element')

require('./style.less')
var app = window.app = new Element({
  DOM: document.body
})
var facebook = require('../lib/')

var status = new Observable('disconnected')

facebook.set({
  val: true, // activate facebook
  status: {
    on: {
      data: {
        example () {
          console.log('######## STATUS HAS CHANGED=====> ', this.val)
          status.set(this.val)
        }
      }
    }
  },
  user: {
    token: {
      on: {
        data: {
          example () {
            console.log('######## TOKEN HAS CHANGED=====> ', this.val)
          }
        }
      }
    }
  }
})

status.set(facebook.status.val)

app.set({
  title: {
    node: 'h1',
    text: 'Facebook Test!'
  },
  loginButton: {
    node: 'button',
    text: 'Login To Facebok',

    on: {
      click () {
        facebook.user.val = true
      }
    }
  },
  logoutButton: {
    node: 'button',
    text: 'Logout',
    on: {
      click () {
        facebook.user.val = 0
      }
    }
  },
  facebookDetails: {
    status: {
      text: status
    }
  },
  shareContainer: {
    css: 'input-group',
    label: {
      node: 'span',
      text: 'URL'
    },
    message: {
      style: {
        height: '80px',
        width: 350
      },
      attributes: {
        type: 'text'
      },
      node: 'input'
    },
    submit: {
      node: 'button',
      text: 'Share this URL',
      on: {
        click () {
          if (facebook.user.val === true) {
            facebook.share.val = this.lookUp('message').node.value
          }
        }
      }
    }
  }
})

facebook.on('error', function (err) {
  console.error(err)
})

facebook.ready.on(() => {
  console.log('---- facebook.ready!')
  writeStatus()
})

facebook.status.on(() => {
  console.log('---- facebook.connectionStatus!', facebook.status.val)
  writeStatus()
})

facebook.user.token.on(() => {
  console.log('---- facebook.token!', facebook.user.token.val)
  writeStatus()
})

function writeStatus () {
  console.warn('FACEBOOK STATUS ====>', JSON.stringify(facebook.serialize(), false, 2))
}

// var ShareInput = new Element({
//   css: 'input-group',
//   label: {
//     node: 'span'
//   },
//   message: {
//     node: 'input'
//   }
// }).Constructor
//
// var app = new Element({
//   node: document.body,
//   topbar: {
//     header: {
//       text: 'Facebook example app'
//     }
//   },
//   state: {
//     text: JSON.stringify(facebook.plain(), false, 2)
//   },
//   loginButton: {
//     node: 'button',
//     text: 'Login',
//     on: {
//       click () {
//         console.log('Login clicked!')
//         app.log.text.val = 'logging in!'
//         facebook.user.val = true
//       }
//     }
//   },
//   logoutButton: {
//     node: 'button',
//     text: 'Logout',
//     on: {
//       click () {
//         app.log.text.val = 'logging out!'
//         facebook.user.val = false
//       }
//     }
//   },
//   sharing: {
//     message: new ShareInput({
//       message: {
//         text: 'http://www.google.com'
//       },
//       label: {
//         text: {
//           val: 'write a link to share:'
//         }
//       }
//     }),
//     validate: {
//       node: 'button',
//       text: 'Share',
//       on: {
//         click () {
//           var message = app.sharing.message.message.node.value
//           console.log('lol share that', message)
//
//           app.log.text.val = 'sharing...'
//           facebook.share.val = 'http://google.com'
//         }
//       }
//     },
//     reset: {
//       node: 'button',
//       text: 'Reset',
//       on: {
//         click () {
//           app.sharing.message.message.node.value = ''
//         }
//       }
//     }
//   },
//   log: {
//     text: 'everything is ok'
//   }
// })
//
// facebook.on('error', function (err) {
//   console.error(err)
// })
//
// facebook.ready.on(() => {
//   console.log('---- facebook.ready!')
//   writeStatus()
// })
//
// facebook.status.on(() => {
//   console.log('---- facebook.connectionStatus!', facebook.status.val)
//   writeStatus()
// })
//
// facebook.user.token.on(() => {
//   console.log('---- facebook.token!', facebook.user.token.val)
//   writeStatus()
// })
//
// function writeStatus () {
//   app.state.text.val = JSON.stringify(facebook.plain(), false, 2)
// }
