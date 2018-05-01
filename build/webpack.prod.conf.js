process.env.NODE_ENV = 'production';
const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const seo = require('./seo.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const SassThemesWebpackPlugin = require('./sass-themes-webpack-plugin/');
const PrerenderSpaPlugin = require('prerender-spa-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env;

const webpackConfig = merge(baseWebpackConfig, {
  mode: process.env.NODE_ENV,
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        }
      }
    },
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
  plugins: [
    new WebpackBar({ name: 'Main Production', profile: true }),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),

    // Make themes
    new SassThemesWebpackPlugin({
      cwd: __dirname,
      includePaths: ['../src', '../src/assets/style'],
      varsFile: 'src/assets/style/_theme.scss',
      themeDir: 'src/assets/style/themes/',
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.

    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html' : config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        minifyJS: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file

    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated

    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.build.assetsSubDirectory,
      ignore: ['.*']
    }]),
    new PrerenderSpaPlugin(
      path.join(__dirname, '../dist'),
      Object.keys(seo), {
        // Wait 2 seconds to make sure it's all loaded
        captureAfterTime: 2000,
        ignoreJSErrors: true,
        phantomOptions: '--web-security=false',
        phantomPageViewportSize: {
          width: 1280,
          height: 800
        },
        // Add title and meta desc to page
        postProcessHtml (context) {
          return context.html.replace(
            /<title>[^<]*<\/title>/i,
            `<title>${seo[context.route].title}</title><meta name="description" content="${seo[context.route].desc}"/>`
          );
        }
      }
    )
  ],
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000
  }
});

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin');

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        `\\.(${config.build.productionGzipExtensions.join('|')})$`
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
