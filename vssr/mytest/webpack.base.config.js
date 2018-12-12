
const path = require('path')
 
module.exports = {
    mode:"production",
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name]-[chunkhash].js'
    },
    module: {
        noParse: /es6-promise\.js$/,
        rules: [
            {
                test: /\.(js|vue)/,
                use: 'eslint-loader',
                enforce: 'pre',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                use: [
                  {
                    loader: 'cache-loader',
                    options: {
                      cacheDirectory: 'D:\\practice\\practice\\vssr\\node_modules\\.cache\\vue-loader',
                      cacheIdentifier: 'b4d4a6c4'
                    }
                  },
                  {
                    loader: 'vue-loader',
                    options: {
                      compilerOptions: {
                        preserveWhitespace: false
                      },
                      cacheDirectory: 'D:\\practice\\practice\\vssr\\node_modules\\.cache\\vue-loader',
                      cacheIdentifier: 'b4d4a6c4'
                    }
                  }
                ]
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'img/[name].[hash:7].[ext]'
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[hash:7].[ext]'
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.json/,
                use: 'json-loader'
            }
        ]
    },
    performance: {
        maxEntrypointSize: 300000,
        hints: 'warning'
    },
    
}