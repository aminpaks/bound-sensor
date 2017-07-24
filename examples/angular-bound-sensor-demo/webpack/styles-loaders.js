const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = function ({ production = false, sourceMap = false, minimizeCss = false } = {}) {
  const lessVariables = {
    'gvs-svgs-path': JSON.stringify('/assets/svgs'),
    'gvs-fonts-path': JSON.stringify('/assets/fonts'),
  };

  const postcssPlugins = function () {
    // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
    const importantCommentRe = /@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i;
    const minimizeOptions = {
      autoprefixer: false,
      safe: true,
      mergeLonghand: false,
      discardComments: { remove: (comment) => !importantCommentRe.test(comment) }
    };
    return [
      autoprefixer(),
    ].concat(minimizeCss ? [cssnano(minimizeOptions)] : []);
  };

  const stylesLoaders = [{
    loader: 'css-loader',
    options: {
      sourceMap,
    }
  }, {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: postcssPlugins,
    }
  }, {
    loader: 'less-loader',
    options: {
      sourceMap,
      modifyVars: lessVariables,
    }
  }];

  const extractStyles = production ? ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: stylesLoaders,
  }) : undefined;


  return {
    stylesLoaders,
    extractStyles,
  }
};
