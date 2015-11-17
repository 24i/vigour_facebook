## Facebook

### JS API

```javascript
var Facebook = require('vigour-facebook')

var facebook = new Facebook({
	appId: 'APP_ID'
})
```

#### Methods

##### login(callback)

```javascript
facebook.login((err, response) => {
  console.log('login callback!', response)
  console.log('success?', facebook.token.val)
})
```

Log in with facebook, through:
1. native facebook app.
2. separate browser window in native browser app.

On `response`:
- __property management__
  - sets `facebook.connectionStatus` to `response.status`
  - When successfully logged in, sets:
    - `facebook.token.val` to `response.authResponse.accessToken`.
    - `facebook.userID.val` to `response.authResponse.userID`
- calls `callback` (if provided) with parameters:
  - `error`
  - `response`

`response` looks something like

```JSON
{
  "authResponse": {
    "accessToken": "BLABLATOKEN",
    "userID": "1716047381960811",
    "expiresIn": 6090,
    "signedRequest": "BIGHASH"
  },
  "status": "connected"
}
```

##### logout(callback)
```javascript
facebook.logout((err, response) => {
  console.log('logout callback!')
})
console.log(facebook.token.val) // logs false
```
Logs the user out of facebook

immediately does:
- __property management__
  - `facebook.token.val = false`
  - `facebook.userID.val = false`
  - `facebook.connectionStatus.val = 'unknown'`

On `response`
- calls `callback` (if provided) with arguments
  - `error`
  - `response`



##### share(link, callback)

Sharing a link on facebook!

```javascript
facebook.share(urlString, (err, response) => {
  if (response.error_message) {
    console.log('cancelled share?', response.error_message)
  } else {
    console.log('yay shared', urlString)
  }
})
```

#### Properties

##### ready
This property is based on the ready event from native, or the SDK initialized on web.

##### token
This property should be managed by the JS API based on the result of the native login method.

##### connectionStatus
Updated as soon as the status is knows, (i.e. when loginStatus is known)

##### userID
Just for fun, we store the facebook userID.


### Native

#### Methods

##### init(appId)

##### login(scope, callback)
In the JS interface, `scope` is assumed to be part of the app config, but for optimal flexibility of the Plugin methods, we want to be able to pass `scope` here.

##### logout(callback)
Same as JS, except no __property management__.

##### share(url, callback)
Same as JS, except no __property management__.


#### Events

##### loginState
Once the Plugin is initialized, it should check it's current status (was the user logged in with facebook when he/she closed the app).
Once this is know, it should emit the `loginState` event passing a `response` Object similar to the `response` of the `facebook.login` method.
