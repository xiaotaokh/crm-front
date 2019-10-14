'use strict'
const path = require('path')

module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // 跨域拦截请求   设置跨域重启项目(npm start)
    proxyTable: {
      '/api':{
        target: "http://192.168.3.40:8099/",
        changeOrigin:true,
        pathRewrite:{
            '^/api':''
        }
      }
    },

    host: 'localhost', 
    port: 8080, 
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, 

    devtool: 'cheap-module-eval-source-map',

    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    productionSourceMap: true,
    devtool: '#source-map',

    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    bundleAnalyzerReport: process.env.npm_config_report
  },
  module: {
    rules: [
        // {
        //     test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        //     loader: 'url-loader',
        //     options: {
        //         limit: 10000,
        //     }
        // }
    ]
  }
}
