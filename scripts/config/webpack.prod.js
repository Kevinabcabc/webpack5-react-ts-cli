const { merge } = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
const common = require('./webpack.common')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const { PROJECT_PATH } = require('../constant')

module.exports = merge(common, {
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
    }),
  ],
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    path: path.resolve(PROJECT_PATH, './dist'),
    assetModuleFilename: 'images/[name].[contenthash:8].[ext]',
  },
  optimization: { // 专门用于存放优化打包的配置，minimizer属性存放一个数组，里可以存放用于代码压缩的插件，minimize 置 true 表示启用 minimizer 配置
    minimize: true,
    minimizer:[
      new CssMinimizerPlugin(),
      new TerserPlugin({
        extractComments: false, // 生产环境去掉所有注释
        terserOptions: {
          compress: { pure_funcs: ['console.log'] }, // 生产环境屏蔽函数
        }
      }),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 0,
    },
  },
  target: 'browserslist',
})
