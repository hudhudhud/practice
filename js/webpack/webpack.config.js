const path = require('path')

module.exports = {
  entry: './index.js',
  output: {
    path: __dirname + '/output',
    filename: 'bundle.js',
  },
}