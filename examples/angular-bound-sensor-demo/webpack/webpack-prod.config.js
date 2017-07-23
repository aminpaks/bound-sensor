const path = require('path');
const { DefinePlugin, HashedModuleIdsPlugin } = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

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
    cssnano(minimizeOptions),
  ];
};

const stylesLoaders = [
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: postcssPlugins,
    }
  },
];

const extractStyles = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: stylesLoaders,
});

module.exports = {
  output: {
    filename: `[name].[chunkhash].bundle.js`,
    chunkFilename: `[name].[chunkhash].bundle.js`,
    path: path.resolve(process.cwd(), 'dist'),
  },

  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      loader: [
        {
          loader: 'awesome-typescript-loader',
          options: {}
        },
        'angular2-template-loader',
      ],
    }, {
      test: /\.css$/,
      exclude: /component\.css$/i,
      use: ['style-loader'].concat(stylesLoaders),
    }, {
      test: /component\.css$/,
      use: ['exports-loader?module.exports.toString()'].concat(stylesLoaders),
    }],
  },

  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.DEBUG': JSON.stringify(false)
    }),
    new UglifyJSPlugin(),
    new HashedModuleIdsPlugin(),
    new ExtractTextPlugin({
      allChunks: true,
      filename: '[name].[contenthash].css',
    }),
  ],

  stats: 'minimal',

}
