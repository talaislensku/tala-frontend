var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var cssModulesLoader = 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'

module.exports = {
  devtool: 'cheap-module-eval-source-map',

  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      path.resolve(__dirname, './app/index.js')
    ]
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015,presets[]=stage-0'],
      }, {
        test: /\.css$/,
        loader: 'style-loader!' + cssModulesLoader
      }
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'tala.is',
      template: 'index.dev.html',
      inject: 'body'
    })
  ],
};
