/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src/frontend')
    }
    return config
  }
}

module.exports = nextConfig
