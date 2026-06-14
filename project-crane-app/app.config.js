const androidMapsKey =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY
  || process.env.GOOGLE_MAPS_ANDROID_API_KEY;
const iosMapsKey =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY
  || process.env.GOOGLE_MAPS_IOS_API_KEY;

const mapsPluginConfig = {};

if (androidMapsKey) {
  mapsPluginConfig.androidGoogleMapsApiKey = androidMapsKey;
}

if (iosMapsKey) {
  mapsPluginConfig.iosGoogleMapsApiKey = iosMapsKey;
}

module.exports = ({ config }) => {
  const plugins = config.plugins || [];
  const hasMapsPlugin = plugins.some((plugin) => (
    Array.isArray(plugin) ? plugin[0] === 'react-native-maps' : plugin === 'react-native-maps'
  ));

  return {
    ...config,
    assetBundlePatterns: [
      'assets/icon.png',
      'assets/adaptive-icon.png',
      'assets/splash.png',
      'assets/logo_white.png',
    ],
    android: {
      ...config.android,
      config: {
        ...(config.android?.config || {}),
        googleMaps: androidMapsKey
          ? { apiKey: androidMapsKey }
          : config.android?.config?.googleMaps,
      },
    },
    plugins: hasMapsPlugin
      ? plugins
      : [
          ...plugins,
          [
            'react-native-maps',
            mapsPluginConfig,
          ],
        ],
  };
};
