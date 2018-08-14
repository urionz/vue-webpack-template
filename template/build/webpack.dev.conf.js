const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SWPreCacheWebpackPlugin = require('sw-precache-webpack-plugin')

Object.keys(baseWebpackConfig.entry).forEach(name => {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.dev.cssSourceMap,
            usePostCSS: true
        })
    },
    devtool: config.dev.devtool,
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
            inject: true,
            serviceWorkerLoader: `<script>${fs.readFileSync(path.join(__dirname,
                './service-worker-dev.js'), 'utf-8')}</script>`
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.dev.assetsSubDirectory,
                ignore: ['.*']
            }
        ]),
        new SWPreCacheWebpackPlugin({
            cacheId: '{{ name }}',
            filename: 'service-worker.js',
            staticFileGlobs: ['dist/**/*.{js,html,css}'],
            minify: true,
            stripPrefix: 'dist/'
        })
    ]
})
