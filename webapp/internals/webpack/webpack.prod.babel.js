// Important modules this config uses
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { HashedModuleIdsPlugin } = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = require('./webpack.base.babel')({
  mode: 'production',

  // In production, we skip all hot-reloading stuff
  entry: {
    app: [
      require.resolve('react-app-polyfill/ie11'),
      path.join(process.cwd(), 'app/app.tsx')
    ],
    share: [
      require.resolve('react-app-polyfill/ie11'),
      path.join(process.cwd(), 'share/app.tsx')
    ]
  },

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: '[name].[chunkhash].js'
  },

  tsLoaders: [{
    loader: 'babel-loader'
  }],

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          compress: {
            comparisons: false,
            // 删除所有的 `console` 语句,还可以兼容ie浏览器
			drop_console: true,
			// 内嵌定义了但是只用到一次的变量
			collapse_vars: true,
			// 提取出出现多次但是没有定义成变量去引用的静态值
			reduce_vars: true,
          },
          parse: {},
          mangle: true,
          output: {
            // 删除所有的注释
            comments: false,
            ascii_only: true,
            // 最紧凑的输出
            beautify: false
          }
        },
        parallel: true,
        cache: true,
        sourceMap: true
      })
    ],
    nodeEnv: 'production',
    sideEffects: true,
    concatenateModules: true,
    splitChunks: {
      chunks: 'async',
      minSize: 5000,
      minChunks: 1,
      maxAsyncRequests: 10,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/](?!antd|jquery|three|bootstrap-datepicker|app|vendor)(.[a-zA-Z0-9.\-_]+)[\\/]/,
          // test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
        // main: {
        //   chunks: 'all',
        //   minChunks: 2,
        //   reuseExistingChunk: true,
        //   enforce: true
        // }
      }
    },
    runtimeChunk: true
  },

  plugins: [
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['app', 'runtime~app', 'app~share', 'vendor'],
      template: 'app/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'share.html',
      chunks: ['share', 'runtime~share', 'app~share', 'vendor'],
      template: 'app/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true
    }),

    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 1024,
      minRatio: 0.1
    }),

    new HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20
    }),

    new CaseSensitivePathsPlugin()

    // ,new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   analyzerHost: 'localhost',
    //   analyzerPort: 5000,
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: false,
    //   generateStatsFile: true,
    //   statsFilename: '../stats.json',
    //   statsOptions: null,
    //   logLevel: 'info'
    // })
  ],

  performance: {
    assetFilter: assetFilename =>
      !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)
  },

  htmlWebpackPlugin: {
    files: {
      js: ['app.js', 'share.js'],
      chunks: {
        app: {
          entry: 'app.js'
        },
        share: {
          entry: 'share.js'
        }
      }
    }
  }
})
