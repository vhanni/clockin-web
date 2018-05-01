process.env.NODE_ENV = 'production';
const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const fs = require('fs');
const WebpackBar = require('webpackbar');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const env = config.build.env;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function resolve (dir) {
  return path.join(__dirname, '..', dir);
}

const webpackConfig = {
  mode: process.env.NODE_ENV,
  entry: {
    landing: ['./landing/main.js', './landing/style.css']
  },
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      }),
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true,
          discardComments: { removeAll: true }
        },
        canPrint: false
      })
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory',
        include: [resolve('landing')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: utils.assetsPath('img/landing/[name].[ext]') // [hash:7].
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,

  plugins: [
    new WebpackBar({ name: 'Landing Production', profile: true, color: 'cyan' }),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    // copy landing static images
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../landing/img'),
      to: utils.assetsPath('img/landing'),
      ignore: ['.*']
    }]),
    // copy flags
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static/img/flags'),
      to: utils.assetsPath('img/flags'),
      ignore: ['.*']
    }]),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '../node_modules/zxcvbn/dist/zxcvbn.js'),
      to: utils.assetsPath('js')
    }]),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '../node_modules/zxcvbn/dist/zxcvbn.js.map'),
      to: utils.assetsPath('js')
    }]),
    // copy error html
    new HtmlWebpackPlugin({
      filename: 'error.html',
      template: 'landing/error.html',
      inject: false,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    })
  ],
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000
  }
};

// Replace some language identification codes
const acceptLangs = {
  br: 'pt-br'
};
// Loop landing language files
const langs = [];
const dirname = 'static/locales/';
const files = fs.readdirSync(dirname);
files.forEach((filename, index) => {
  // Only files
  if (fs.lstatSync(path.resolve(dirname, filename)).isFile()) {
    // Get locale from file
    const content = fs.readFileSync(path.resolve(dirname, filename), 'utf-8');
    const lang = filename.slice(0, -5);

    // Add to array for htaccess
    if (lang !== 'en') {
      langs.push(lang);
    }

    // Make HTML with webpack
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        filename: `landing/${lang}.html`,
        template: 'landing/index.html',
        locale: JSON.parse(content),
        httpLang: (acceptLangs.hasOwnProperty(lang) ? acceptLangs[lang] : lang),
        lang,
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency'
      })
    );
  }
});

// Export webpack config
module.exports = webpackConfig;
