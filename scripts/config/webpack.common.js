const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { PROJECT_PATH } = require('../constant')
const WebpackBar = require('webpackbar')
const { isDevelopment, isProduction } = require('../env')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");

const getCssLoaders = () => {
  const cssLoaders = [
    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader, 
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: "[local]--[hash:base64:5]"
        },
        sourceMap: isDevelopment,
      }
    }
  ]
  
  // 开发环境一般用chrom不会有问题，防止开发环境下看样式有一堆前缀影响查看，因此只在生产环境使用
  isProduction && cssLoaders.push({
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          isProduction && [
            'postcss-preset-env',
            {
              autoprefixer: {
                grid: true //开启自动添加前缀功能，有些功能是默认关闭的，如栅格样式一些浏览器不支持所以默认关闭了，这里手动打开
              }
            }
          ]
        ]
      }
    }
  })
  
  return cssLoaders
}

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    home: path.resolve(PROJECT_PATH, '/src/home/index.js'),
    live: path.resolve(PROJECT_PATH, '/src/live/index.tsx'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [...getCssLoaders()]
      },
      {
        test: /\.less$/,
        use: [
          ...getCssLoaders(),
          {
            loader: 'less-loader',
            options: {
              sourceMap: isDevelopment,
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          ...getCssLoaders(),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,
            }
          }
        ]
      },
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: /node_modules/,
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024,
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2?)$/,
        type: 'asset/resource',
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      'src': path.resolve(PROJECT_PATH, './src'),
      'components': path.resolve(PROJECT_PATH, './src/components'),
      'utils': path.resolve(PROJECT_PATH, './src/utils'),
    }
  },
  cache: {
    type: 'filesystem', //：缓存类型，值为 memory 或 filesystem，分别代表基于内存的临时缓存，以及基于文件系统的持久化缓存
    buildDependencies: {
      config: [__filename],
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
  	new HtmlWebpackPlugin({
      template: path.resolve(PROJECT_PATH, './public/index.html'),
      title: 'demo',
    }),
    new WebpackBar({
      name: 'start!!!', 
      color: '#52c41a' 
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(PROJECT_PATH, './tsconfig.json'),
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          context: 'public', //解释 fron 路径，具体作用未知
          from: '*', //定义要拷贝的源文件
          to: path.resolve(PROJECT_PATH, './dist/public'),  //定义粘贴的指定路径
          toType: 'dir', //确定粘贴路径的类型，dir表示路径为一个文件夹
          globOptions: { //允许使用全局匹配
            dot: true,
            gitignore: true,
            ignore: ['**/index.html'],		// **表示任意目录下
          },
        },
      ],
    })
  ]
}
