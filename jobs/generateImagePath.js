const path = require('path');
var fs = require('fs');

module.exports = (folderName, fileName) => {
  const dir = path.join(__dirname, '../../uploads/' + folderName);
  //check if the folder is exist, if not create one
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return dir + '/' + fileName;
};
