import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    // Enable detailed profile output in development
    if (dev) {
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
      };

      config.profile = true;

      // Improve webpack watching performance
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }

    return config;
  },
  // Enable build stats
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

export default withBundleAnalyzer(nextConfig);
