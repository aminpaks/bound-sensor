import * as path from 'path';
import { Configuration, ProgressPlugin, HotModuleReplacementPlugin } from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const config: Configuration = {
  devtool: 'source-map',
  entry: {
    main: './src/index',
    styles: './static/index.css',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.css', '.html'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          { loader: 'ts-loader', options: { logLevel: 'warn' } },
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      }, {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ]
      }
    ],
  },
  plugins: [
    new ProgressPlugin(),
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
    }),
    new HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve('static', 'index.ejs'),
      inject: 'body',
    }),
  ],
  devServer: {
    hot: true,
    inline: true,
    compress: true,
    stats: 'minimal',
    contentBase: path.join(__dirname, 'static')
  }
};

export default config;
