const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = withNativeWind(
  {
    ...defaultConfig,
    resolver: {
      ...defaultConfig.resolver,
      assetExts: [
        ...defaultConfig.resolver.assetExts,
        "obj",
        "mtl",
        "vrx",
        "gltf",
        "glb",
        "bin",
        "arobject",
      ],
    },
  },
  { input: "./global.css" }
);
