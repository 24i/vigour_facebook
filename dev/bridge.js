var Bridge = require('vigour-wrapper/lib/bridge')

var fakeMethods = {
  init () {
    setTimeout(() => {
      devBridge.ready(null, true, 'Facebook')
    })
  },
  login (callback) {
    console.log('fake login!')
    // go to facebook app
    setTimeout(() => {
      if (!window.facebookFail) {
        // got a token!
        var token = 'someToken'
        callback(null, token)
      } else {
        // failed!
        callback('failed to get token!')
      }
    })
  },
  share (shared, callback) {
    console.log('fake share!')
    // go to facebook app
    setTimeout(() => {
      if (!window.facebookFail) {
        // shared successfully!
        callback(null)
      } else {
        // failed!
        callback('failed to share!')
      }
    })
  }
}

var devBridge = module.exports = new Bridge({
  define: {
    send (pluginId, fnName, opts, cb) {
      if (pluginId !== 'Facebook') {
        throw new Error('this is for fake Facebook ya bum!')
      }
      return fakeMethods[fnName](opts, cb)
    }
  }
})
