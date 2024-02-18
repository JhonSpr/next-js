/** @type {import('next').NextConfig} */
import webpack from 'webpack'
const nextConfig = {
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'windowj.Query': 'jquery',
      })
    )
    return config
  },
}

export default nextConfig
