const path = require('path')
const fs = require('fs')
const spawn = require('child_process').spawn

console.log('spawn....', spawn)

const lintStyles = ['standard', 'airbnb', 'default']

exports.sortDependencies = function (data) {
    const packageJsonFile = path.join(
        data.inPlace ? '' : data.destDirName,
        'package.json'
    )

    const packageJson = JSON.parse(fs.readFileSync(packageJsonFile))
    packageJson.devDependencies = sortObject(packageJson.devDependencies)
    packageJson.dependencies = sortObject(packageJson.dependencies)
    fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson, null, 2) + '\n')
}

exports.installDependencies = function (cwd, executable = 'npm', color) {
    console.log(`\n\n# ${color('正在安装项目依赖 ...')}`)
    console.log('# ========================\n')
    return runCommand(executable, ['install'], {
        cwd
    })
}

exports.runLintFix = (cwd, data, color) => {
    if (data.lint && lintStyles.indexOf(data.lintConfig) !== -1) {
        console.log(
            `\n\n${color(
                '正在运行 eslint --fix 使用预设规则规范代码...'
            )}`
        )
        console.log('# ========================\n')
        const args = data.autoInstall === 'npm' || data.autoInstall === 'cnpm' ? ['run', 'lint', '--', '--fix'] : ['run', 'lint', '--fix']
        return runCommand(data.autoInstall, args, {
            cwd
        })
    }
    return Promise.resolve()
}

exports.printMessage = (data, { green, yellow }) => {
    const message = `
# ${green('项目初始化完成!')}
# ========================
开始:

    ${yellow(
        `${data.inPlace ? '' : `cd ${data.destDirName}\n    `}${installMsg(
            data
        )}${lintMsg(data)}npm run dev`
    )}
    `

    console.log(message)
}

const lintMsg = data => {
    return !data.autoInstall && data.lint && lintStyles.indexOf(data.lintConfig) !== -1
    ? 'npm|cnpm run lint -- --fix (或者使用yarn: yarn run lint --fix)\n ' : ''
}


const installMsg = data => {
    return !data.autoInstall ? 'npm|cnpm install (或者使用yarn: yarn)\n ' : ''
}

function runCommand(cmd, args, options) {
    return new Promise((resolve, reject) => {
        console.log('runCommand....', spawn)
        const spawn = spawn(
            cmd,
            args,
            Object.assign(
                {
                    cwd: process.cwd(),
                    stdio: 'inherit',
                    shell: true
                },
                options
            )
        )

        spawn.on('exit', () => {
            resolve()
        })
    })
}

const sortObject = object => {
    const sortedObject = {}
    Object.keys(object).sort().forEach(item => {
        sortedObject[item] = object[item]
    })
    return sortedObject
}
