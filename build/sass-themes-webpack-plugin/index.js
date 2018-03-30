var path = require('path')
var fs = require('fs')
var loaderUtils = require('loader-utils')
var sass = require('node-sass')

function SassThemesPlugin (opts) {
  // Setup the plugin instance with options...
  opts = opts || {}

  this.cwd = opts.cwd = opts.cwd ? path.resolve(opts.cwd) : process.cwd()
  this.filename = opts.filename || '[name].css'
  this.includePaths = (opts.includePaths || []).map(function (includePath) {
    return path.resolve(this.cwd, includePath)
  }, this)
  this.varsFile = opts.varsFile
  this.themeDir = opts.themeDir
  this.treeRemoval = opts.treeRemoval || false
  this.varsRemoval = opts.varsRemoval || false
  this.finalThemeFiles = {}
}

SassThemesPlugin.prototype.apply = function (compiler) {
  var cssFile = /([^.]+).*\.css$/

  compiler.plugin('emit', function (compilation, callback) {
    // Loop through all compiled assets,
    // adding a new line item for each filename.
    for (var filename in compilation.assets) {
      if (cssFile.test(filename)) {
        // Process CSS
        var asset = compilation.assets[filename]
        var source = asset.source()

        // First process SASS and get theme-vars only
        // var sassVarsOnly = Thematic.parseSassSync({
        //   data: source,
        //   varsFile: this.varsFile,
        //   includePaths: this.includePaths,
        //   treeRemoval: this.treeRemoval,
        //   varsRemoval: this.varsRemoval,
        //   template: false
        // })

        // Process default CSS (don't remove vars/trees here)
        var defaultSource = sass.renderSync({
          data: source,
          varsFile: this.varsFile,
          themeFile: this.varsFile,
          includePaths: this.includePaths,
          treeRemoval: false,
          varsRemoval: false,
          template: false
        }).css.toString()
        compilation.assets[filename] = {
          source: function () { return defaultSource },
          size: function () { return defaultSource.length }
        }
        this.finalThemeFiles['default'] = filename

        // Then loop theme dir
        var themeFiles = fs.readdirSync(this.themeDir)
        themeFiles.forEach(function (themeFile, index) {
          var themeName = themeFile.slice(0, -5)

          // Process theme CSS
          try {
            themeFile = path.resolve(this.themeDir, themeFile)
            var themeData = fs.readFileSync(themeFile, 'utf-8')
            var themeSource = sass.renderSync({
              data: themeData + source, // sassVarsOnly.replace(/\/\/ ruleset/g, ''), // hacky removal of "same-line removed node comments"
              includePaths: this.includePaths
            }).css.toString()

            var themeOutput = this.filename.replace('[name]', themeName).replace(/\[(?:(\w+):)?contenthash(?::([a-z]+\d*))?(?::(\d+))?\]/ig, function () {
              return loaderUtils.getHashDigest(themeSource, arguments[1], arguments[2], parseInt(arguments[3], 10))
            })
            // Save theme CSS
            compilation.assets[themeOutput] = {
              source: function () { return themeSource },
              size: function () { return themeSource.length }
            }
            this.finalThemeFiles[themeName] = themeOutput
          } catch (err) {
            throw Error(err)
          }
        }.bind(this))
      }
    }

    callback()
  }.bind(this))

  // Hook into the html-webpack-plugin processing
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-alter-asset-tags', function (htmlPluginData, callback) {
      const newTag = {
        tagName: 'script',
        closeTag: true,
        attributes: {
          type: 'text/javascript'
        },
        innerHTML: 'var themes = ' + JSON.stringify(this.finalThemeFiles) + ';'
      }
      htmlPluginData.head.unshift(newTag)
      callback(null, htmlPluginData)
    }.bind(this))
  }.bind(this))
}

module.exports = SassThemesPlugin
