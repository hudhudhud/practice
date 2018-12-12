const HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require("path")

module.exports = {
    entry: {
      "main":path.resolve(__dirname, './main.js'),
      'testReact': path.resolve(__dirname, './testReact.jsx'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'js/[name]_[chunkhash:8].js'
    },
    module: {
        // css-loader使你能够使用类似@import和url（...）的方法实现require的功能，style-loader将所有的计算后的样式加入页面中，二者组合在一起使你能够把样式表嵌入webpack打包后的js文件中

        // 有一点要注意的是：loader是有顺序的。webpack肯定是先将所有css模块依赖解析完得到计算结果再创建style标签。因此应该把style-loader放在css-loader的前面（webpack loader的执行顺序是从右到左）,顺序不对，会报错。
        rules: [
            //处理css
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
                // loader: Ex.extract({
                //     fallback: "style-loader",
                //     use: "css-loader"
                // })
            },

            //处理图片 需要同时安装url-loader和file-loader
            //url-loader与file-loader的工作方式相似，如果文件的体积比byte limit小，就能返回Data Url。如果图片比limit小,将直接以base64的形式内联在代码中。如果图片比limit（以bytes为单位）大，那么webpack就会使用file-loader去处理文件，并且所有的查询参数都会传递给file-loader。
            //1kb=1024byte
            {
                test: /\.(?:jpg|gif|png)$/,
                loader: 'url-loader?limit=102400&name=images/[name]-[hash:10].[ext]'
            },
            //webpack不能直接处理jsx，需要借助于babel.
            // babel堪称神器，被誉为下一代 JavaScript 语法的编译器。用它，你可以不用等浏览器的支持，就可以使用最新的标准的语法。使用它可以解析jsx的语法。
            {
                test: /\.js$|.jsx$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            favicon: 'img/V.ico'
        })
    ],
    mode: 'production', //'development',
    performance: {
        hints: "warning", // 枚举

        maxAssetSize: 300000, // 整数类型（以字节为单位）

        maxEntrypointSize: 500000, // 整数类型（以字节为单位）

        assetFilter: function(assetFilename) {
            // 提供资源文件名的断言函数

            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');

        }
    },
}