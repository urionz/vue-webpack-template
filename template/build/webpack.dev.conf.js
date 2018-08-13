const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portFinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.dev.cssSourceMap,
            usePostCSS: true
        })
    },
    devtool: config.dev.devtool,
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: {
            rewrites: [
                {
                    from: /.*/,
                    to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
                }
            ]
        },
        hot: true,
        contentBase: false,
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverly ? {
            warnings: false,
            errors: true
        } : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true,
        watchOptions: {
            poll: config.dev.poll
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': require('../config/dev.env')
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'template.html',
                inject: true
            }),
            new CopyWebpackPlugin([
                from: path.resolve(__dirname, '../dist'),
                to: config.dev.assetsSubDirectory,
                ignore: ['.*']
            ])
        ]
    }
})

module.exports = new Promise((resolve, reject) => {
    portFinder.basePort = process.env.PORT || config.dev.port
    portFinder.getPort((error, port) => {
        if (error) {
            reject(error)
        } else {
            process.env.PORT = port
            devWebpackConfig.devServer.port = port

            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    message: [`应用正运行于 http://${devWebpackConfig.devServer.host}:${port}`]
                },
                onErrors: config.dev.notifyOnErrors ? utils.createNotifierCallback() : undefined
            }))
            resole(devWebpackConfig)
        }
    })
})