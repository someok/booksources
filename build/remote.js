const http = require('http');
const https = require('https');

function fetchSource(source) {
    const url = new URL(source);
    const lib = url.protocol === 'https:' ? https : http;

    return new Promise((resolve, reject) => {
        const request = lib.get(source, (res) => {
            if (res.statusCode < 200 || res.statusCode > 300) {
                reject(new Error(`Status Code: ${res.statusCode}`));
            }

            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    // console.log(json);

                    // 列表转换成以 bookSourceName 为 key 的对象
                    if (!Array.isArray(json)) {
                        throw new Error('book source must be array');
                    }
                    const sourceMap = json.reduce(
                        (previousValue, currentValue) => {
                            return {
                                ...previousValue,
                                [currentValue['bookSourceName']]: currentValue,
                            };
                        },
                        {}
                    );
                    resolve(sourceMap);
                } catch (e) {
                    reject(e);
                }
            });
        });

        request.on('error', reject);
    });
}

exports.fetchRemoteSources = async function fetchRemoteSources(sources) {
    let result = {};
    for (let source of sources) {
        console.info(`🔥 Fetch book source: ${source}`);
        const map = await fetchSource(source);
        console.info(`ℹ️ source data size: ${Object.keys(map).length}`);

        result = { ...result, ...map };
    }

    return result;
};
