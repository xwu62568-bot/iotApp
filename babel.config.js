module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 使用新的react-native-worklets插件替代旧的reanimated插件
      'react-native-worklets/plugin',
    ],
  };
};