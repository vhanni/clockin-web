const path = require('path');
const fs = require('fs');
const loaderUtils = require('loader-utils');
const sass = require('node-sass');

class SassThemesPlugin {
  constructor (opts = {}) {
    this.cwd = opts.cwd = opts.cwd ? path.resolve(opts.cwd) : process.cwd();
    this.filename = opts.filename || '[name].css';
    this.includePaths = (opts.includePaths || []).map(function (includePath) {
      return path.resolve(this.cwd, includePath);
    }, this);
    this.varsFile = opts.varsFile;
    this.themeDir = opts.themeDir;
    this.treeRemoval = opts.treeRemoval || false;
    this.varsRemoval = opts.varsRemoval || false;
    this.finalThemeFiles = {};
  }

  apply (compiler) {
    const cssFile = /([^.]+).*\.css$/;
    compiler.hooks.emit.tapAsync(this.constructor.name, (compilation, callback) => {
      // Loop through all compiled assets,
      // adding a new line item for each filename.
      for (const filename in compilation.assets) {
        if (cssFile.test(filename)) {
          // Process CSS
          const asset = compilation.assets[filename];
          const source = asset.source();
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
          const defaultSource = sass.renderSync({
            data: source,
            varsFile: this.varsFile,
            themeFile: this.varsFile,
            includePaths: this.includePaths,
            treeRemoval: false,
            varsRemoval: false,
            template: false
          }).css.toString();
          compilation.assets[filename] = {
            source () { return defaultSource; },
            size () { return defaultSource.length; }
          };
          this.finalThemeFiles['default'] = filename;

          // Then loop theme dir
          const themeFiles = fs.readdirSync(this.themeDir);
          themeFiles.forEach((themeFile, index) => {
            const themeName = themeFile.slice(0, -5);

            // Process theme CSS
            try {
              themeFile = path.resolve(this.themeDir, themeFile);
              const defaultThemeData = fs.readFileSync(this.varsFile, 'utf-8');
              const themeData = fs.readFileSync(themeFile, 'utf-8');
              const newSource = fs.readFileSync(path.resolve(this.themeDir, '../common.scss'), 'utf-8');
              const combinedSource = `${source}\n${defaultThemeData}\n${themeData}\n${newSource}`;
              const themeSource = sass.renderSync({
                data: combinedSource, // sassVarsOnly.replace(/\/\/ ruleset/g, ''), // hacky removal of "same-line removed node comments"
                includePaths: this.includePaths
              }).css.toString();

              const themeOutput = this.filename.replace('[name]', themeName).replace(/\[(?:(\w+):)?contenthash(?::([a-z]+\d*))?(?::(\d+))?\]/ig, (...args) => loaderUtils.getHashDigest(themeSource, args[1], args[2], parseInt(args[3], 10)));
              // Save theme CSS
              compilation.assets[themeOutput] = {
                source () { return themeSource; },
                size () { return themeSource.length; }
              };
              this.finalThemeFiles[themeName] = themeOutput;
            } catch (err) {
              throw Error(err);
            }
          });
        }
      }
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(this.constructor.name, (htmlPluginData, cb) => {
        const newTag = {
          tagName: 'script',
          closeTag: true,
          attributes: {
            type: 'text/javascript'
          },
          innerHTML: `var themes = ${JSON.stringify(this.finalThemeFiles)};`
        };
        htmlPluginData.head.unshift(newTag);
        cb(null, htmlPluginData);
      });
      callback();
    });
  }
}

module.exports = SassThemesPlugin;
