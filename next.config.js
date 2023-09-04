// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig
module.exports = {
    // ...other Next.js config options...
  
    webpack: (config) => {
      config.module.rules.push(
        {
          test: /\.(mp3)$/,
          use: {
            loader: 'file-loader',
            options: {
              publicPath: '/_next/static/sounds/',
              outputPath: 'static/sounds/',
              name: '[name].[ext]',
            },
          },
        },
        {
          test: /\.(wav)$/, // Add this rule for .wav files
          use: {
            loader: 'file-loader',
            options: {
              publicPath: '/_next/static/sounds/',
              outputPath: 'static/sounds/',
              name: '[name].[ext]',
            },
          },
        }
      );
  
      return config;
    },
  };
  
  