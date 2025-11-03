const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "@": __dirname + "/src",
};

config.watchFolders = [__dirname + "/src"];

module.exports = config;
