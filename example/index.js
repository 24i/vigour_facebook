'use strict'

require('./style.less')
console.log('window', window)
// inject plain
var plain = require('vigour-js/lib/methods/plain')
var Observable = require('vigour-js/lib/observable')
Observable.prototype.inject(plain)

var Element = require('vigour-element')
Element.prototype.inject(
  require('vigour-element/lib/property/text'),
  require('vigour-element/lib/property/transform'),
  require('vigour-element/lib/property/css'),
  require('vigour-element/lib/property/attributes'),
  require('vigour-element/lib/events/render')
)

/*

Require facebook

This will read appId from your package.json (pkg.vigour.facebook.appId):

These are some appId's you can used for web based on domain:

'1523998237921394' // localhost:8081
'1524010964586788' // localhost:8085
'1523994961255055' // 192.168.1.23:8081

*/
var facebook = require('../lib/')

facebook.login.on('data', function () {
  console.log('---- login callback!')
  console.log('val', this.val)
  console.log('facebook.token.val', facebook.token.val)
  var txt = 'login callback'
  if (this.val === 'success') {
    txt += ' success'
    if (!facebook.token.val) {
      txt += ' LOGIN FAILED, NO TOKEN SET'
    } else {
      txt += ' LOGIN SUCCEEDED!!!'
    }
  } else {
    txt += ' error, err: ' + this.val
  }

  app.log.text.val = txt
  console.log('---- LOGIN DONE!')
})
facebook.login.on('error', function () {
  console.log('login error', this)
})

// facebook.logout.on('data', function () {
//   console.log('---- logout callback!')
//   console.log('val', this.val)
//   console.log('facebook.token.val', facebook.token.val)
//   var txt = 'logout callback'
//   if (this.val === 'success') {
//     txt += ' success'
//     if (facebook.token.val) {
//       txt += ' LOGOUT FAILED, TOKEN STILL SET'
//     } else {
//       txt += ' LOGOUT SUCCEEDED'
//     }
//   }
//   app.log.text.val = txt
//   console.log('---- LOGOUT DONE!')
// })
// facebook.logout.on('error', function () {
//   console.log('logout error', this)
// })

facebook.share.on('data', function () {
  console.log('---- share callback!')
  console.log('val', this.val)
  if (this.val === 'success') {
    app.log.text.val = 'shared success! ' + JSON.stringify(this.val, false, 2)
    console.log('---- shared dat!!', this.val)
  } else {
    app.log.text.val = 'share fail! ' + this.val
    console.error('SHARE ERROR', this.val)
  }
  console.log('---- SHARING DONE!')
})
facebook.share.on('error', function () {
  console.log('share error', this)
})

var ShareInput = new Element({
  css: 'input-group',
  label: {
    node: 'span'
  },
  message: {
    node: 'input'
  }
}).Constructor

var app = new Element({
  node: document.body,
  topbar: {
    header: {
      text: 'Facebook example app'
    }
  },
  state: {
    text: JSON.stringify(facebook.plain(), false, 2)
  },
  loginButton: {
    node: 'button',
    text: 'Login',
    on: {
      click () {
        console.log('Login clicked!')
        app.log.text.val = 'logging in!'
        facebook.login.val = true
      }
    }
  },
  logoutButton: {
    node: 'button',
    text: 'Logout',
    on: {
      click () {
        console.log('Logout clicked!')
        app.log.text.val = 'logging out!'
        facebook.login.val = false
      }
    }
  },
  sharing: {
    message: new ShareInput({
      message: {
        text: 'http://www.google.com'
      },
      label: {
        text: {
          val: 'write a link to share:'
        }
      }
    }),
    validate: {
      node: 'button',
      text: 'Share',
      on: {
        click () {
          console.log('Share clicked!')
          var message = app.sharing.message.message.node.value
          console.log('sharing: ', message)

          app.log.text.val = 'sharing...'

          facebook.share.val = message
        }
      }
    },
    reset: {
      node: 'button',
      text: 'Reset',
      on: {
        click () {
          console.log('Reset clicked!')
          app.sharing.message.message.node.value = ''
        }
      }
    }
  },
  log: {
    text: 'everything is ok'
  }
})

facebook.on('error', function (err) {
  console.log('facebook error', err)
})

facebook.ready.on(() => {
  console.log('---- facebook.ready!')
  writeStatus()
})

facebook.connectionStatus.on(() => {
  console.log('---- facebook.connectionStatus!', facebook.connectionStatus.val)
  writeStatus()
})

facebook.token.on(() => {
  console.log('---- facebook.token!', facebook.token.val)
  writeStatus()
})

function writeStatus () {
  app.state.text.val = JSON.stringify(facebook.plain(), false, 2)
}
