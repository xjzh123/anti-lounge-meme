const pinyin = require('node-pinyin')
const { Remarkable } = require('remarkable')
const { convert } = require('html-to-text')
const purify = require('./purify')

const markdownOptions = {
    html: false,
    xhtmlOut: false,
    breaks: true,
    langPrefix: '',
    linkTarget: '_blank" rel="noreferrer',
    typographer: true,
    quotes: `""''`
};

const md = new Remarkable('full', markdownOptions)

const validationRegex = /(j[i1][ \-\|\*\.\,。，]*ba(?=n[aeiou]))|(j[i1][ \-\|\*\.\,。，]*ba(?![noi]))/gi

const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf\u2f00-\u2fd5\u2e80-\u2ef3\uf900-\ufad9\u31c0-\u31e3\u2ff0-\u2ffb\u3105-\u312f\u31a0-\u31bf\u3007]/g

const cnEnRegex = /[\u4e00-\u9fff\u3400-\u4dbf\u2f00-\u2fd5\u2e80-\u2ef3\uf900-\ufad9\u31c0-\u31e3\u2ff0-\u2ffb\u3105-\u312f\u31a0-\u31bf\u3007a-zA-Z]/g

const merge = new Map([
    ['又鸟', '鸡'],
    ['凡', '几'],
    ['⼏', '几'],
    ['丿乁', '几'],
    ['口巴', '吧'],
    ['扌巴', '把'],
    ['只因', '几'],
    ['扌八', '扒'],
    ['口八', '叭'],
    ['土贝', '坝']
])

/**
 * 
 * @param {String} text 
 * @returns {String}
 */
function radicalMerge(text) {
    for (let [before, after] of merge) {
        text = text.replace(new RegExp(before, 'g'), after)
    }
    return text
}

/**
 * 
 * @param {String} text 
 * @returns {String}
 */
function pyString(text) {
    return pinyin(text, { style: 'normal' }).join(' ')
}

/**
 * 
 * @param {String} text 
 * @returns {boolean}
 */
function validate(text) {
    text = convert(md.render(text))
    text = purify(text)
    if (
        pyString(text).match(validationRegex) ||
        pyString(text).split('').reverse().join('').match(validationRegex) ||
        pyString((text.match(chineseRegex) || []).join('')).match(validationRegex) ||
        pyString((text.match(cnEnRegex) || []).join('')).match(validationRegex) ||
        pyString(radicalMerge(text)).match(validationRegex)
    ) {
        return true
    } else {
        return false
    }
}

module.exports = validate
