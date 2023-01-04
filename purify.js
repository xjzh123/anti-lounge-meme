/*
Source code from https://greasyfork.org/zh-CN/scripts/448302-让我康康你的标题正不正常啊 which is under GPL-3.0
By https://greasyfork.org/zh-CN/users/938264-neutralization
*/

const fiftyfive = require('./table')

function c(g) {
    let typ = 0;
    /* 
        1：大写为主
        0: 小写为主
        -1：没有大写
    */
    if (g.length == 1) {
        // A / a
        typ = 0;
    } else if (g.length == 2 && g.charAt(0) === g.charAt(0).toLowerCase()) {
        // aa / aA
        typ = -1;
    } else if (g.length == 2 && g.charAt(0) === g.charAt(0).toUpperCase() && g.charAt(1) === g.charAt(1).toLowerCase()) {
        // Aa
        typ = 0;
    } else if (g.length == 2 && g.charAt(0) === g.charAt(0).toUpperCase() && g.charAt(1) === g.charAt(1).toUpperCase()) {
        // AA
        typ = 1;
    } else if ([...g.matchAll(/[A-Z]/g)].length == 0) {
        // 没有大写
        typ = -1;
    } else if ([...g.matchAll(/[A-Z]/g)].length < [...g.matchAll(/[a-z]/g)].length) {
        // 小写多于大写
        typ = 0;
    } else if ([...g.matchAll(/[A-Z]/g)].length >= [...g.matchAll(/[a-z]/g)].length) {
        // 大写多于小写
        typ = 1;
    } else {
        typ = 0;
    }
    return typ;
}

function r(group) {
    const count = { '0': 0, '1': 0, '-1': 0 };
    const reg = [];
    for (let i = 0; i < group.length; i++) {
        count[c(group[i])] += 1;
    }
    for (let i = 0; i < group.length; i++) {
        const g = group[i];
        if (count[-1] >= group.length / 2) {
            reg.push(g.toLowerCase());
        } else if (count[1] >= group.length / 2) {
            reg.push(g.toUpperCase());
        } else {
            reg.push(g.charAt(0).toUpperCase() + g.slice(1).toLowerCase());
        }
    }
    return reg;
}

/**
 * 
 * @param {string} text 
 * @returns {string}
 */
function purify(text) {
    // fiftyfive：字母对照
    // classz：emoji
    /* eslint-disable */
    // 把使用字母+符号两个字符的变成带符号的字母一个字符
    const entity = text.normalize('NFC').replace(/\uFE0F/g, '');
    let nentity = entity;
    const m = new Map();
    for (const k in fiftyfive) {
        for (const c of fiftyfive[k]) {
            m.set(c, k);
        }
    }
    Array.from(m).forEach(([k, v]) => {
        nentity = nentity.replaceAll(k, v);
    });
    const group = [];
    const match = [...nentity.matchAll(/[a-zA-Z]+/g)];
    for (let i = 0; i < match.length; i++) {
        const text = match[i][0];
        if (entity.indexOf(text) != -1) {
            continue;
        } else {
            group.push(text);
        }
    }
    const reg = r(group);
    for (let i = 0; i < group.length; i++) {
        nentity = nentity.replace(group[i], reg[i]);
    }
    return nentity
}

module.exports = purify
