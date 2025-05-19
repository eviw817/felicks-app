const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

if (!config.resolver) {
  config.resolver = {};
}
if (!config.resolver.assetExts) {
  config.resolver.assetExts = [];
}

config.resolver.assetExts.push('glb');

module.exports = withNativeWind(config, { input: "./global.css" });