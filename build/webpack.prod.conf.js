const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const seo = require('./seo.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const SassThemesWebpackPlugin = require('./sass-themes-webpack-plugin/')
const PrerenderSpaPlugin = require('prerender-spa-plugin')
const Renderer = PrerendererWebpackPlugin.PuppeteerRenderer

const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env

const webpackConfig = merge(baseWebpackConfig, {
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
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
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
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
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
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.build.assetsSubDirectory,
      ignore: ['.*']
    }]),
      new PrerenderSPAPlugin({
      // Required - The path to the webpack-outputted app to prerender.
      staticDir: path.join(__dirname, '../dist'),
 
      // Optional - The path your rendered app should be output to.
      // (Defaults to staticDir.)
      outputDir: path.join(__dirname, 'prerendered'),
 
      // Optional - The location of index.html
      indexPath: path.join(__dirname, 'dist', 'index.html'),
 
      // Required - Routes to render.
      routes: [ '/timein'],
 
      // Optional - Allows you to customize the HTML and output path before
      // writing the rendered contents to a file.
      // renderedRoute can be modified and it or an equivelant should be returned.
      // renderedRoute format:
      // {
      //   route: String, // Where the output file will end up (relative to outputDir)
      //   originalRoute: String, // The route that was passed into the renderer, before redirects.
      //   html: String // The rendered HTML for this route.
      // }
      postProcess (renderedRoute) {
        // Ignore any redirects.
        renderedRoute.path = renderedRoute.originalPath
        // Basic whitespace removal. (Don't use this in production.)
        renderedRoute.html = renderedRoute.html.split(/>[\s]+</gmi).join('><')
 
        return renderedRoute
      },
 
      // Optional - Uses html-minifier (https://github.com/kangax/html-minifier)
      // To minify the resulting HTML.
      // Option reference: https://github.com/kangax/html-minifier#options-quick-reference
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        keepClosingSlash: true,
        sortAttributes: true
      },
 
      // The actual renderer to use. (Feel free to write your own)
      // Available renderers: https://github.com/Tribex/prerenderer/tree/master/renderers
      renderer: new Renderer({
        // Optional - The name of the property to add to the window object with the contents of `inject`.
        injectProperty: '__PRERENDER_INJECTED',
        // Optional - Any values you'd like your app to have access to via `window.injectProperty`.
        inject: {
          foo: 'bar'
        },
 
        // Optional - defaults to 0, no limit.
        // Routes are rendered asynchronously.
        // Use this to limit the number of routes rendered in paralell.
        maxConcurrentRoutes: 4,
 
        // Optional - Wait to render until the specified event is dispatched on the document.
        // eg, with `document.dispatchEvent(new Event('custom-render-trigger'))`
        renderAfterDocumentEvent: 'custom-render-trigger',
 
        // Optional - Wait to render until the specified element is detected using `document.querySelector`
        renderAfterElementExists: 'my-app-element',
 
        // Optional - Wait to render until a certain amount of time has passed.
        // NOT RECOMMENDED
        renderAfterTime: 5000 // Wait 5 seconds.
 
        // Other puppeteer options.
        // (See here: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)
        headless: false // Display the browser window when rendering. Useful for debugging.
      })
    })
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

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
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
