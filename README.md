## Facebook

### JS API

#### Methods

##### login
Log in with facebook, through:
1. native facebook app.
2. separate browser window in native browser app.

When successful, should set `Facebook.token.val` to `token`.

###### parameters:
- possibly `callback`

###### callback parameters:
If callback is provided, it should be called with the following parameters:
- `error`
- `token`

##### share
Sharing on facebook to own wall or a friend's wall.

###### parameters:
- `url` to share
- preset `text`
- possibly `callback`

###### callback parameters:
If callback is provided, it should be called with the following parameters:
- `error`
- `token`

#### Properties

##### ready
This property is based on the ready event from native, or the SDK initialized on web.

##### token
This property should be managed by the JS API based on the result of the native login method.

### Native

#### Methods

##### login
The native side should launch the facebook app if available, otherwise the browser app with the facebook login page etc.

###### parameters:
- callback

###### callback parameters:
- `error`
- `token`

##### share

###### parameters:
- `url` to share
- preset `text`
- `callback`

###### callback parameters:
- `error`

#### Events

##### ready
