const { merge } = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
const common = require('./webpack.common')
const { PROJECT_PATH, SERVER_HOST, SERVER_PORT } = require('../constant')

module.exports = merge(common, {
  devtool: 'cheap-module-source-map',
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    path: path.resolve(PROJECT_PATH, './dist')
  },
  devServer: {
    host: SERVER_HOST,
    port: SERVER_PORT,
    // stats: 'errors-only', //设为errors-only表示终端只打印错误类型的日志，不会打印warning以及其他信息影响阅读
    // clientLogLevel: 'none',   //设为none表示去除多余网页console信息
    compress: true,     //设为true表示启用gzip压缩，加快网站打开速度
    open: true,     //设为true表示第一次启动项目时自动打开默认浏览器           
    hot: true,    //设为true表示启用服务热替换配置
    // noInfo: true, //设为true表示去除启动项目时显示的打包信息
  },
  plugins: [
    // 实际上只开启 hot：true 就会自动识别有无声明该插件，没有则自动引入，但是怕有隐藏问题这里还是手动加上了
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    minimize: false,
    minimizer: [],
    splitChunks: {
      chunks: 'all',
      minSize: 0,
    },
  },
  target: 'web', //配置 browserslist 字段会导致 webpack-dev-server 的热更新功能直接失效，为了避免这种情况需要给 webpack 配上 target 属性
})
