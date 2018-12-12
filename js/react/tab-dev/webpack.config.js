var path = require('path')


module.exports = {
  entry: './index.jsx',
  output: {
    path: __dirname,
    filename: 'index.js'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015', 'stage-0']
      }
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader',
    }]
  }
}