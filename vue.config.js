const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {

    port: 8080,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8888/api/private/v1/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    // disableHostCheck: true

  }
})
