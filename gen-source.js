#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {fetchRemoteSources} = require('./remote');

const srcDir = path.join(__dirname, 'src');
const destJson = path.join(__dirname, 'docs', 'data.json');

// 读取远程书源
const sources = [
    // 一程书源 https://gitee.com/vpq/yd
    'https://shuyuan.miaogongzi.net/shuyuan/1633024206.json',
    // 'https://namofree.gitee.io/yuedu3/legado3_booksource_by_Namo.json',
];

function loadLocalSources() {
    return fs
        .readdirSync(srcDir)
        .filter((filename) => filename.endsWith('json'))
        .map((filename) => {
            return JSON.parse(
                fs.readFileSync(path.join(srcDir, filename)).toString(),
            );
        })
        .reduce((previousValue, currentValue) => {
            return {
                ...previousValue,
                [currentValue['bookSourceName']]: currentValue,
            };
        }, {});
}

/**
 * 合并远程和本地书源,如果key值一样,则用本地覆盖远程
 */
async function mergeRemoteAndLocal() {
    const remoteSources = await fetchRemoteSources(sources);

    const localSources = loadLocalSources();
    console.info(
        `ℹ️ local source data size: ${Object.keys(localSources).length}`,
    );

    const mergedSources = {...remoteSources, ...localSources};
    console.info(
        `ℹ️ merged source data size: ${Object.keys(mergedSources).length}`,
    );

    fs.writeFileSync(
        destJson,
        JSON.stringify(Object.values(mergedSources), null, 4),
    );
    console.log('🤖 Over!');
}

mergeRemoteAndLocal();
