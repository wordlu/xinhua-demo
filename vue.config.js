/* eslint-disable */
const path = require('path')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const appConfig = require('./src/app.config')
// const proxyTable = require('./proxyTable');

function resolve(dir) {
  return path.join(__dirname, dir)
}
/** @type import('@vue/cli-service').ProjectOptions */
module.exports = {
  lintOnSave: 'error',
  assetsDir: 'assets',
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  configureWebpack: {
    // We provide the app's title in Webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: appConfig.title,
    // Set up all the aliases we use in our app.
    resolve: {
      alias: require('./aliases.config').webpack
    },
    performance: {
      // Only enable performance hints for production builds,
      // outside of tests.
      hints: process.env.NODE_ENV === 'production' && !process.env.VUE_APP_TEST && 'warning'
    }
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch')
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    config.plugin('stylelint').use(StyleLintPlugin, [
      {
        context: 'src',
        configFile: path.resolve(__dirname, 'stylelint.config.js'),
        files: ['**/*.{vue,css,sass,scss}'],
        fix: true,
        cache: false,
        emitErrors: true,
        failOnError: false
      }
    ])
  },
  css: {
    // Enable CSS source maps.
    sourceMap: true,
    loaderOptions: {
      sass: {
        data: `@import "@assets/scss/_variables.scss";`
      }
    }
  },
  // Configure Webpack's dev server.
  // https://cli.vuejs.org/guide/cli-service.html
  devServer: {
    hot: true,
    proxy: {
      '/yapi/api': {
        target: 'http://10.10.3.66:30000/',
        // target: 'http://172.16.3.157:30000/',
        changeOrigin: true,
        pathRewrite: {
          '^/yapi/api': ''
        }
      },
      '/yapi/manager': {
        target: 'http://10.10.3.66:50090',
        // target: 'http://172.16.3.157:50090',
        changeOrigin: true,
        pathRewrite: {
          '^/yapi/manager': ''
        }
      },
      '/loc': {
        target: 'http://172.16.2.90:50030/',
        // target:'http://172.16.2.90:50040/',
        // target: 'http://172.16.2.90:50090',
        // target: 'http://10.10.3.66:50090',
        changeOrigin: true,
        pathRewrite: {
          '^/loc': ''
        }
      }
    }
    // ...(process.env.API_BASE_URL
    //   ? // Proxy API endpoints to the production base URL.
    //     { proxy: { '/api': { target: process.env.API_BASE_URL } } }
    //   : // Proxy API endpoints a local mock API.
    //     { before: require('./tests/mock-api') }),
  }
}
