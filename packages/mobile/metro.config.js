const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ensure Metro resolves modules from the mobile package root
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

// Resolve @services, @components, etc. path aliases
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@services': path.resolve(__dirname, 'src/services'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@styles': path.resolve(__dirname, 'src/styles'),
  '@store': path.resolve(__dirname, 'src/store'),
  '@assets': path.resolve(__dirname, 'src/assets'),
  'shared': path.resolve(__dirname, '../../shared'),
};

// Watch the src/ and shared/ directories for changes
config.watchFolders = [
  ...(config.watchFolders || []),
  path.resolve(__dirname, 'src'),
  path.resolve(__dirname, '../../shared'),
];

// Custom resolver to handle image imports from app/ to src/assets/images/
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle relative image imports that go from app/ up to src/assets/images/
  if (moduleName.match(/\.\.\/.*src\/assets\/images\//)) {
    const cleanedPath = moduleName.replace(/^.*src\/assets\/images\//, '');
    return context.resolveRequest(
      context,
      path.resolve(__dirname, 'src/assets/images', cleanedPath),
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
