# Facebook

## Install
- `npm i vigour-facebook`

## Updates via upstream remote
- `git remote add skeleton git@github.com:vigour-io/plugin.git`
- `git pull skeleton develop`

## Try it out
- `npm run ios`
- `npm run android`
- `npm run all`

## Usage
See [tests](test)

## Building native apps
See [wrapper](http://github.com/vigour-io/vigour-native)

## Native Plugin specs

Please refer to https://github.com/vigour-io/facebook/blob/develop/test/browser/bridge.js#L4
for expected behavior of the native plugin methods. These mock methods respond in a way to pass the tests, the comments will specify what other possibilities there are and how errors should be handled.
