const path = require('path');
const WebpackMd5Hash = require('webpack-md5-hash');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const InlineChunkManifestHtmlWebpackPlugin = require('inline-chunk-manifest-html-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const tsconfig = path.resolve(process.cwd(), 'tsconfig.json');


module.exports = {

  entry: {
    vendor: ['./src/vendor.ts', './src/polyfills.ts'],
    styles: './src/styles.scss',
    main: './src/main.ts',
  },

  output: {
    filename: `[name].js`,
    chunkFilename: `[name].js`,
  },

  resolve: {
    extensions: ['.ts', '.js', '.scss', '.html'],
    plugins: [
      new TsConfigPathsPlugin({ tsconfig }),
    ],
  },

  module: {
    rules: [{
      test: /\.html$/,
      loader: 'raw-loader',
    }]
  },

  plugins: [
    new ProgressPlugin(),
    new WebpackMd5Hash(),
    new HtmlWebpackPlugin({
      chunks: 'all',
      hash: false,
      cache: true,
      minify: false,
      favicon: false,
      showErrors: true,
      template: path.resolve(process.cwd(), 'src/index.ejs'),
    }),
    new CommonsChunkPlugin({
      minChunks: Infinity,
      names: ['vendor', 'manifest'],
    }),
    new InlineChunkManifestHtmlWebpackPlugin({
      inlineManifest: true,
    }),
    new ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(process.cwd(), 'src')
    ),
  ],

}
