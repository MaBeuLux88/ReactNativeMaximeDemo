# React Native Todo Sample App

This application was developed for a live coding demo for WebExpo 2021.

You can find the different steps in the different branches of this repo.

- `step_1` contains the Todo App without Realm or any for of storage.
- `step_2` contains the finished project with Realm & Sync.

# Some Commands

- Set up the project from scratch

```sh
npx react-native init ReactNativeMaximeDemo
cd ReactNativeMaximeDemo
npm i realm
npm i @realm.io/react
npm i react-native-get-random-values
npm install
```

- Start this bad boy (you will need an AVD).

```sh
# shell 1 - Install the deps
npm install

# shell 2 - Start Metro
npx react-native start

# shell 3 Android - Compile the android app and starts it in the AVD
npx react-native run-android

# shell 3 iOS - Compile the iOS app and starts it in the iOS simulator
npx react-native run-ios
```

## iOS

For iOS, the commands needed are:

```sh
# shell 1 - Install the deps
npm install

# shell 2 iOS - Install Cocoapods third-party dependencies
npx pod-install

# shell 3 - Start Metro
npx react-native start

# shell 3 iOS - Compile the iOS app and starts it in the iOS simulator
npx react-native run-ios
```

# Author

Maxime Beugnet <maxime@mongodb.com>
