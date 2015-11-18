'use strict'

require('./style.less')
var Element = require('vigour-element')
Element.prototype.inject(
  require('vigour-element/lib/property/text'),
  require('vigour-element/lib/property/transform'),
  require('vigour-element/lib/property/css'),
  require('vigour-element/lib/property/attributes'),
  require('vigour-element/lib/events/render')
)
var Facebook = require('../lib/')

var plain = require('vigour-js/lib/methods/plain')
Object.getPrototypeOf(Facebook.prototype).inject(plain)

var facebook = window.fb = new Facebook({
  appId: '1524010964586788'
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
        facebook.login((err, response) => {
          console.log('---- login callback!', err ? err : '')
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
          console.log('---- LOGOUT DONE!')
        })
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
          var message = app.sharing.message.message.node.value
          console.log('lol share that', message)
          facebook.share(message, function (err, response) {
            if (!err) {
              console.log('---- shared dat!!', response)
            } else {
              console.error('SHARE ERROR', err)
            }
          })
        }
      }
    },
    reset: {
      node: 'button',
      text: 'Reset',
      on: {
        click () {
          app.sharing.message.message.node.value = ''
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
