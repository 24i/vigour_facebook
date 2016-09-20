'use strict'

const https = require('https')

module.exports = (state, opts, payload) => new Promise((resolve, reject) => {
  opts.method = opts.method || 'GET'
  opts.host = 'graph.facebook.com'
  console.log('fb request opts', opts)
  const req = https.request(opts, res => {
    var data = ''
    res.on('data', chunk => { data += String(chunk) })
    res.on('end', () => {
      if (res.statusCode < 300) {
        res.data = jsonParse(data, state)
        resolve(res)
      } else {
        const err = new Error(`[fb] error response (${opts.path})`)
        err.opts = opts
        err.data = data
        err.payload = payload
        state.emit('error', err)
        reject(err)
      }
    })
  }).on('error', (err) => {
    err = new Error(`[fb] request error (${opts.path}) $err`)
    err.opts = opts
    err.payload = payload
    state.emit('error', err)
    reject(err)
  })
  payload && req.write(payload)
  req.end()
})

function jsonParse (data, state, reject) {
  try {
    data = JSON.parse(data)
    return data
  } catch (err) {
    state.emit('error', { message: '[fb] failed to parse response', err })
    reject(err)
    return Error
  }
}
