#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const src = fs
    .readdirSync(srcDir)
    .filter((file) => file.endsWith('json'))
    .map((file) => {
        return JSON.parse(fs.readFileSync(path.join(srcDir, file)).toString());
    });

fs.writeFileSync(
    path.join(__dirname, 'docs', 'data.json'),
    JSON.stringify(src, null, 4)
);
console.log('Over!');
