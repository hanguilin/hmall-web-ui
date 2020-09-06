const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.resolve.alias.set('@/', resolve('src'))
    // config.plugins.delete('prefetch')
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
        },
        javascriptEnabled: true,
      }
    }
  },

  devServer: {
    port: 8080,
    // 解决127.0.0.1指向其他域名出现“Invalid Host Header”
    disableHostCheck : true,
    proxy: {
      '/member': {
        target: process.env.VUE_MEMBER_SERVER_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/member': ''
        }
      },
      '/goods': {
        target: process.env.VUE_GOODS_SERVER_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/goods': ''
        }
      }
    }
  },

  lintOnSave: undefined
}