const csvParser = require('./parsers/csvParser');
const fs = require('fs/promises');

// Dosya türüne göre doğru parser'ı seçer
const processFile = async (filePath, fileMimeType, options = {}) => {
    let data;
    
    switch (fileMimeType) {
        case 'text/csv':
            data = await csvParser.parse(filePath, options);
            break;
        case 'application/json':
            // Gelecekte ekleyeceğiniz JSON parser'ı burada çağırabilirsiniz
            throw new Error('JSON dosyaları şu anda desteklenmiyor.');
        default:
            throw new Error('Desteklenmeyen dosya türü.');
    }

    await fs.unlink(filePath); // Dosyayı okuduktan sonra sil

    return data;
};

module.exports = {
    processFile
};