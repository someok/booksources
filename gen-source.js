#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const destJson = path.join(__dirname, 'docs', 'data.json');

const srcJsonList = fs
    .readdirSync(srcDir)
    .filter((filename) => filename.endsWith('json'))
    .map((filename) => {
        return JSON.parse(
            fs.readFileSync(path.join(srcDir, filename)).toString()
        );
    });

fs.writeFileSync(destJson, JSON.stringify(srcJsonList, null, 4));
console.log('Over!');
