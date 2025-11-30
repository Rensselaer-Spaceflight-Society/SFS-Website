import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

const basePath = isProd ? '' : ''

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
}

export default nextConfig
