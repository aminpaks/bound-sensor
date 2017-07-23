const path = require('path');
const {
  DefinePlugin,
  NamedModulesPlugin,
  NoEmitOnErrorsPlugin,
  SourceMapDevToolPlugin,
  HotModuleReplacementPlugin,
} = require('webpack');
const precss = require('precss');

module.exports = {

  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      loader: [
        {
          loader: 'awesome-typescript-loader',
          options: {
            transpileOnly: true,
            useTranspileModule: true,
          }
        },
        'angular2-template-loader',
      ],
    }, {
      test: /\.scss$/,
      exclude: /component\.scss$/i,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader', options: { modules: true, importLoaders: 1 } },
        { loader: 'sass-loader' },
      ],
    }, {
      test: /component\.scss$/,
      use: [
        'exports-loader?module.exports.toString()',
        { loader: 'css-loader', options: { modules: false, importLoaders: 1 } },
        { loader: 'sass-loader' },
      ],
    }],
  },

  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.DEBUG': JSON.stringify(true)
    }),
    new NamedModulesPlugin(),
    new HotModuleReplacementPlugin(),
    new SourceMapDevToolPlugin({
      "filename": "[file].map[query]",
      "moduleFilenameTemplate": "[resource-path]",
      "fallbackModuleFilenameTemplate": "[resource-path]?[hash]",
      "sourceRoot": "webpack:///"
    }),
  ],

  devServer: {
    hot: true,
    compress: true,
    publicPath: '/',
    historyApiFallback: true,
    contentBase: [path.resolve(process.cwd(), 'dist'), process.cwd()],
    stats: {
      hash: false,
      cached: true,
      assets: false,
      timings: true,
      children: false,
      performance: true,
      chunkModules: false,
    },
  }

}
