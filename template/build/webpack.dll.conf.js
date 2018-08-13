const path = require('path')
const webpack = require('webpack')
const config = require('../config')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

module.exports = {
    entry: {
        vendor: [
            'vue/dist/vue.esm.js',
            'vue-router',
            'vuex',
            'axios'
        ]
    },
    output: {
        path: path.resolve(__dirname, '../static/js'),
        filename: '[name].dll.js',
        library: '[name]_library'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(__dirname, '.', '[name]-manifest.json'),
            name: '[name]_library',
            context: __dirname
        }),
        new ParallelUglifyPlugin({
            uglifyJs: {
                output: {
                    // 最紧凑的输出
                    beautify: false,
                    // 删除注释
                    comments: true
                },
                compress: {
                    // 删除无用代码时不输出警告
                    warnings: false,
                    // 删除 console 语句，可以兼容IE
                    drop_console: true,
                    // 内嵌己定义但是只用到一次的变量
                    collapse_vars: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true,
                }
            }
        })
    ]
}
