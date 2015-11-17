'use strict'

require('./style.less')
var uikit = require('vigour-uikit')
var Element = uikit.Element
var Facebook = require('../lib/')

var plain = require('vigour-js/lib/methods/plain')
Object.getPrototypeOf(Facebook.prototype).inject(plain)

var facebook = window.fb = new Facebook({
  appId: '1224035690956856'
})

var TopBar = new uikit.Topbar({
  css: 'topbar',
  header: new uikit.Header[2]()
}).Constructor

var ShareInput = new Element({
  css: 'input-group',
  label: new uikit.Label({
    node: 'span'
  }),
  message: new uikit.Input({
    node: 'input'
  })
}).Constructor

var app = new Element({
  node: document.body,
  topbar: new TopBar({
    header: {
      text: 'Facebook example app'
    }
  }),
  state: {
    text: JSON.stringify(facebook.plain(), false, 2)
  },
  loginButton: {
    node: 'button',
    text: 'Login',
    on: {
      click () {
        console.log('Login clicked!')
        facebook.login((err, response) => {
          console.log('LOGIN CALLBACK!', err ? err : '')
          console.log('response', response)
          console.log('facebook.token.val', facebook.token.val)
        })
      }
    }
  },
  logoutButton: {
    node: 'button',
    text: 'Logout',
    on: {
      click () {
        facebook.logout(() => {
          console.log('LOGOUT DONE!')
        })
      }
    }
  },
  sharing: {
    message: new ShareInput({
      label: {
        text: {
          val: 'write a Message:'
        }
      }
    }),
    validate: new uikit.Button({
      node: 'button',
      text: 'Share',
      on: {
        click () {
          var message = app.sharing.message.message.input.node.value
          console.log('lol share that', message)
          facebook.share(message, function (err) {
            if (!err) {
              console.log('---- shared dat!!', err)
            } else {
              console.error('SHARE ERROR', err)
            }
          })
        }
      }
    }),
    reset: new uikit.Button({
      node: 'button',
      text: 'Reset',
      on: {
        click () {
          app.sharing.message.message.input.node.value = ''
        }
      }
    })
  }
})

facebook.on('error', function (err) {
  console.error(err)
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
