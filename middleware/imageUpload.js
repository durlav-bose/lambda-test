const multer = require('multer');
const path = require('path');
const mime = require('mime-types');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    let ext = mime.extension(file.mimetype);
    cb(null, `${+new Date()}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  console.log('file :>> ', file);
  //reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer(
  {
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 150,
  },
  fileFilter: fileFilter,
});

module.exports = {
  uploadImages: upload.array('file', 10),
};
