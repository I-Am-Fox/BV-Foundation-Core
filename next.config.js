
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
})

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
})

module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];

      config.externals.push(({ request }, callback) => {
        if (request?.includes('content/submissions')) {
          return callback(null, 'commonjs ' + request);
        }
        callback();
      });
    }

    return config;
  },
};

