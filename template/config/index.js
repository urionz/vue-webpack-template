const path = require('path')

module.exports = {
    dev: {
        env: require('./dev.env'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {},
        host: 'localhost',
        port: 8080,
        autoOpenBrowser: false,
        errorOverly: true,
        notifyOnErrors: true,
        poll: false,
        {{#lint}}
        useEslint: true,
        showEslintErrorsInOverlay: false,
        {{/lint}}
        devtool: 'cheap-module-eval-source-map',
        cacheBusting: true,
        cssSourceMap: true
    },
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: true,
        devtool: '#source-map',
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzeReport: process.env.npm_config_report
    }
}
