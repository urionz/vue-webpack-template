const path = require('path')
const fs = require('fs')
const {
    sortDependencies,
    installDependencies,
    runLintFix,
    printMessage
} = require('./utils')
const pkg = require('./package.json')
const templateVersion = pkg.version

module.exports = {
    helpers: {
        if_or(v1, v2, options) {
            if (v1 || v2) {
                return options.fn(this)
            }

            return options.inverse(this)
        },
        template_version() {
            return templateVersion
        }
    },
    prompts: {
        name: {
            type: 'string',
            required: true,
            message: '项目名称'
        },
        description: {
            type: 'string',
            require: false,
            message: '项目描述',
            default: 'A Vue.js project'
        },
        author: {
            type: 'string',
            message: '作者'
        },
        lint: {
            type: 'confirm',
            message: '是否使用Eslint规范代码?'
        },
        lintConfig: {
            type: 'list',
            message: '请选择一个Eslint预设规则',
            choices: [
                {
                    name: 'Standard (https://github.com/standard/standard)',
                    value: 'standard',
                    short: 'Standard',
                },
                {
                    name: 'Airbnb (https://github.com/airbnb/javascript)',
                    value: 'airbnb',
                    short: 'Airbnb',
                },
                {
                    name: 'Default 默认预设Eslint规则',
                    value: 'default',
                    short: 'Default'
                },
                {
                    name: 'none 自定义配置',
                    value: 'none',
                    short: 'none'
                }
            ]
        },
        router: {
            type: 'confirm',
            message: '是否安装 vue-router?'
        },
        vuex: {
            type: 'confirm',
            message: '是否安装 vuex?'
        },
        pug: {
            type: 'confirm',
            message: '是否安装Pug(Jade)模板?'
        },
        autoInstall: {
            type: 'list',
            message: '请选择一个依赖安装器',
            choices: [
                {
                    name: '使用npm',
                    value: 'npm',
                    short: 'npm'
                },
                {
                    name: '使用cnpm',
                    value: 'cnpm',
                    short: 'cnpm'
                },
                {
                    name: '使用yarn',
                    value: 'yarn',
                    short: 'yarn'
                }
            ]
        }
    },
    filters: {
        '.eslintrc.js': 'lint',
        '.eslintignore': 'lint',
        'src/router/**/*': 'router'
    },
    complete: (data, { chalk }) => {
        const green = chalk.green
        sortDependencies(data, green)

        const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

        if (data.autoInstall) {
            installDependencies(cwd, data.autoInstall, green)
            .then(() => runLintFix(cwd, data, green))
            .then(() => printMessage(data, green))
            .catch(e => {
                console.log(chalk.red('Error:'), e)
            })
        } else {
            printMessage(data, chalk)
        }
    }
}
