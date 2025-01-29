const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
  
module.exports = withNativeWind(config, { input: './global.css' });
module.exports = async () => {
  const config = await getDefaultConfig();
  config.resolver.assetExts.push('glb');  // Voeg 'glb' toe aan de ondersteunde bestandsextensies
  return config;
};
