import * as path from 'path';
import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const config: webpack.Configuration = {
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
    extensions: ['.ts', '.js', '.less', '.css', '.html'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          { loader: 'ts-loader', options: { configFileName: './tsconfig.json' } },
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
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve('static', 'index.template'),
      inject: 'body',
    }),
  ],
  devServer: {
    hot: true,
    inline: true,
    compress: true,
    contentBase: path.join(__dirname, 'static')
  }
};

export default config;
