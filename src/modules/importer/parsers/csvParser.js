const fs = require('fs');
const csv = require('csv-parser');
const iconv = require('iconv-lite');

const parse = (filePath, options = {}) => {
    const { separator = ',', encoding = 'utf8' } = options;
    
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(iconv.decodeStream(encoding))
            .pipe(csv({ separator: separator }))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

module.exports = {
    parse
};