var webpack = require('webpack')
var path = require("path") //如果不希望这里涉及到的路径和执行webpack命令时的具体路径相关，而是希望相对于配置文件的路径的话，就需要使用path模块,
//path.resolve右往左被处理的，后面每个 path 被依次解析，直到构造完成一个绝对路径。 例如，给定的路径片段的序列为：/foo、/bar、baz，则调用 path.resolve('/foo', '/bar', 'baz') 会返回 /bar/baz
//如果处理完全部给定的 path 片段后还未生成一个绝对路径，则当前工作目录会被用上
// “__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')

//分离CSS和JS文件
var Ex = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    // entry 有三种类型字符串，数组和对象
    // entry:"xxx/index.js",
    // entry:["xxx/index.js","xxx/index2.js"],
    // entry:{
    // index:"xxx/index.js",
    // index2:"xxx/index2.js"
    // },

    entry: {
        // key可以是简单的字符串，比如：'app', 'main', 'a/b'则直接为路径，生成文件名为b。对应着output.filename配置中的[name]变量
        // value如果是字符串，必须是合理的noderequire内部函数参数字符串。比如文件路径：'./app.js'即(require('./app.js'))；比如安装的npm模块：'lodash'即(require('lodash'))
        // value如果是数组，则数组中元素需要是上面描述的合理字符串值。数组中的文件一般是没有相互依赖关系的，但是又处于某些原因需要将它们打包在一起。
        'main': path.resolve(__dirname, './main.js'),
        'jsx/testReact': path.resolve(__dirname, './testReact.jsx'),
        // vendor: ['jquery', 'lodash']
    },
    output: {
        //把js和图片打包成不同的文件夹,使用webpack命令之后会生成文件
        filename: 'js/[name]_[chunkhash:8].js', //打包后输出文件的文件名
        path: path.resolve(__dirname, "build"), //打包后的文件存放的地方
        //publicPath:'/web/',//资源的发布地址，加上该属性后，打包文件中所有通过相对路径引用的资源都会被配置的路径所替换。
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
        new UglifyJSPlugin(), //JS压缩
        new webpack.HotModuleReplacementPlugin(), //Hot Module Replacement 热替换
        new HtmlWebpackPlugin(),
        // new Ex('./build/[name].[chunkhash:8].css')
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