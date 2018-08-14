require('./check-version')()

const config = require('../config')
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn')
const chalk = require('chalk')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('./webpack.dev.conf')

const port = process.env.PORT || config.dev.port
const host = process.env.HOST || config.dev.host
const autoOpenBrowser = !!config.dev.autoOpenBrowser

const proxyTable = config.dev.proxyTable

const app = express()

const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    serverSideRender: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: false
})

compiler.plugin('compilation', compilation => {
    compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
        hotMiddleware.publish({
            action: 'reload'
        })
        cb()
    })
})

app.use(hotMiddleware)

Object.keys(proxyTable).forEach(context => {
    let options = proxyTable[context]
    if (typeof options === 'string') {
        options = {
            target: options
        }
    }
    app.use(proxyMiddleware(options.filter || context, options))
})

app.use(require('connect-history-api-fallback')())

app.use(devMiddleware)

const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = `https://${host}:${port}`

let callResolve
const readyPromise = new Promise(resolve => {
    callResolve = resolve
})

console.log(chalk.cyan('> Starting dev server...'))
devMiddleware.waitUntilValid(() => {
    console.log(chalk.green('> Listening at ' + uri + '\n'))
    if (autoOpenBrowser) {
        opn(uri)
    }
    callResolve()
})

const server = app.listen(port, host)

module.exports = {
    ready: readyPromise,
    close: () => server.close()
}
