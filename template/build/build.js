require('./check-version')()

// 初始化环境变量
process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('正在构建生产环境....')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), error => {
    if (error) throw error

    webpack(webpackConfig, (error, stats) => {
        spinner.stop()
        if (error) throw error
        process.stdout.write(stats.toString({
            colors: true,
            modules.false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        if (stats.hasErrors()) {
            console.log(chalk.red(' 构建失败.\n'))
            process.exit(1)
        }

        console.log(chalk.cyan(' 构建完成.\n'))
        console.log(chalk.yellow(
            ' 提示: 构建后文件需要运行在HTTP服务下.\n' +
            ' 直接打开 index.html 通过 file:// 将不会工作.\n'
        ))
    })
})
