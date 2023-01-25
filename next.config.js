/** @type {import('next').NextConfig} */

const imageDomains = ['de', 'com']

const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: imageDomains.map((domain) => ({
      protocol: 'https',
      hostname: `pre-www.audi.${domain}`,
      port: '',
      pathname: '/content/dam/**'
    })),
  },
  env: {
    conf: {
      pagePath: '/content/dam/live-preview/en/landing-page-example',
      featureApps: [
        {
          path: '/content/dam/live-preview/en/content-fragment',
          component: 'ParallaxTeaser'
        },
        {
          path: '/content/dam/live-preview/en/feature-app-2-example',
          component: 'SequenceScroll'
        }
      ]
    },
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
