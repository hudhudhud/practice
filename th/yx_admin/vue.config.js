// vue.config.js
module.exports = {
    // 修改的配置
    // 将baseUrl: '/api',改为baseUrl: '/',
    baseUrl: '/',
    productionSourceMap: false,
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {
            sass: {
                data: `
          @import "@/utils/them.scss";
        `
            }
        },
        // 启用 CSS modules for all css / pre-processor files.
    },
    devServer: {
        proxy: {
            '/api/test': {
                target: 'https://www.easy-mock.com/mock/5c19ec74bde1915e93ca1a92/example',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api/test': ''
                }
            },
            '/api': {
                target: 'http://seller-api-ht-test.chinakeguan.cn',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }

        }
    },
    // configureWebpack: config => {
    //     require('vux-loader').merge(config, {
    //         options: {},
    //         plugins: ['vux-ui']
    //     })
    // }
}
