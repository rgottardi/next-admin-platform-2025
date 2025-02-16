/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark these packages as external to prevent bundling issues
      config.externals.push('pino', 'pino-pretty', 'thread-stream')
    }
    return config
  },
}

module.exports = nextConfig 