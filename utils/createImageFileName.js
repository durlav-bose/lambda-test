const mime = require('mime-types')

module.exports = (fileName, mimetype, width) => {
    let ext = mime.extension(mimetype);
    let p = fileName.split('.').slice(0, -1).join('.');
    return `${p}_${width}.${ext}`;
}