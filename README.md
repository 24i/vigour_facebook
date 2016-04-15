[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm version](https://badge.fury.io/js/vigour-facebook.svg)](https://badge.fury.io/js/vigour-facebook)
[![Build Status](https://travis-ci.org/vigour-io/facebook.svg?branch=develop)](https://travis-ci.org/vigour-io/facebook)

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

## Testing

Testing the native code is currently pretty messed up. The build script is expecting to find the facebook plugin Java code on Maven. So the example and test apps included in this repo won't get your Java changes until you publish to Maven... The solution for now is another example app specific to android to test only the Java stuff (doesn't use the bridge).

### Running the Android example app

- `cd native/android/plugin-facebook`
- `./gradlew installDebug`

If the Java part works and the js tests also pass, the next step should be testing everything together. Unfortunately, our present system doesn't allow this. So what we have to do is publish to maven, and then the example and test apps included in this repo can be run.

### Publishing the plugin to Maven

- `cd native/android/plugin-facebook/plugin-facebook`
- `open build.grale`
- Bump the version number (look for `libraryVersion = <version>`)
- `cd ..`
- `./gradlew install bintrayUpload`
