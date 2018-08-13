const utils = require('./utils')
const config = require('../config')
const sourceMapEnabled = utils.isProduction ? config.build.productionSourceMap : config.dev.cssSourceMap

module.exports = {
    loaders: utils.cssLoaders({
        sourceMap: sourceMapEnable,
        extract: utils.isProduction
    }),
    cssSourceMap: sourceMapEnabled,
    cacheBusting: config.dev.cacheBusting,
    // 转换 video 标签的 src、poster; source 标签的 src; img 标签的src; image 标签 的 xlink:href 为 自动require
    transformToRequire: {
        video: ['src', 'poster'],
        source: 'src',
        img: 'src',
        image: 'xlink:href'
    }
}
