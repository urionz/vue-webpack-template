const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const HappyPack = require('happypack')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
})

const resolve = dir => {
    return path.join(__dirname, '..', dir)
}

{{#lint}}
const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: resolve('src'),
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
    }
})
{{/lint}}

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        app: './src/main.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: utils.isProduction ? config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    module: {
        rules: [
            {{#lint}}
            ...(config.dev.useEslint ? [createLintingRule()] : []),
            {{/lint}}
            {
                test: /\.vue$/,
                loader: 'happypack/loader?id=vue'
            },
            {
                test: /\.js$/,
                loader: 'happypack/loader?id=babel',
                include: [
                    resolve('src'),
                    resolve('node_modules/webpack-dev-server/client')
                ]
            },
            {
                test: /\.pug$/,
                loader: 'pug'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new HappyPack({
            id: 'vue',
            threadPool: happyThreadPool,
            loaders: [
                {
                    loader: 'vue-loader',
                    options: vueLoaderConfig
                }
            ]
        }),
        new HappyPack({
            id: 'babel',
            threadPool: happyThreadPool,
            loaders: [
                {
                    loader: 'babel-loader?cacheDirectory=true'
                }
            ]
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./vendor-manifest.json')
        }),
        new FriendlyErrorsPlugin()
    ],
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}
