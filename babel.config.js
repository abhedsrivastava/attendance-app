module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // other plugins (if any) go here
    'react-native-reanimated/plugin' // <-- MUST be last
  ],
};
