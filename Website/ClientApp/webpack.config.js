const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlReplaceWebpackPlugin = require("html-replace-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const mode = process.env.NODE_ENV;
const isDevBuild = mode !== 'production';

const CONFIG = {
  entry: './src/scripts/index.js',
  mode,
  output: {
    filename: 'scripts/main.js',
    path: path.resolve(__dirname, './build'),
  },
  optimization: {
    minimize: !isDevBuild,
    minimizer: !isDevBuild ? [
      // Prod
      new TerserWebpackPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      }),
    ] : [
      // Dev
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      minify: {
        collapseWhitespace: true,
        minifyCSS: true,
        removeComments: true,
      },
    }),
    new HtmlReplaceWebpackPlugin([
      {
        pattern:
          '<script type="text/javascript" src="./scripts/main.js"></script>',
        replacement: "",
      },
      {
        pattern: '<link rel="stylesheet" href="./styles/main.css">',
        replacement: "",
      },
    ]),
    // new CopyWebpackPlugin([
    //   {
    //     from: './ClientApp/images/',
    //     to: 'images/',
    //   },
    //   {
    //     from: './ClientApp/*.txt',
    //     to: './[name].[ext]',
    //     toType: 'template',
    //   },
    //   {
    //     from: './ClientApp/fonts/',
    //     to: 'fonts/',
    //   },
    // ]),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: './ClientApp/fonts/',
    //       to: 'fonts/',
    //     },
    //   ],
    // }),
    new MiniCssExtractPlugin({
      filename: 'styles/main.css',
    }),
    new CleanWebpackPlugin(),
  ].concat(isDevBuild ? [
    // Dev
    new CaseSensitivePathsPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      moduleFilenameTemplate: path.relative('./build', '[resourcePath]'),
    }),
  ] : [
    // Prod
  ]),
  module: {
    rules: [
      {
        test: /\.js$/,
        // include: /ClientApp/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              compact: true,
              plugins: [
              ],
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "src"),
    compress: true,
    port: 3001,
    hot: true,
    watchContentBase: true,
    noInfo: true,
  },
};

module.exports = CONFIG;
