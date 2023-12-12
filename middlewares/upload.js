const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { uuid } = require('uuidv4');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempPath = path.join(__dirname, '../', process.env.LOCAL_BUCKET_NAME || 'storage', 'temp');
    if(!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath, {recursive: true})
    }
    cb(null, tempPath)
  },
  filename: function (req, file, cb) {
    const file_path = Date.now()
      + '__'
      + uuid()
      + path.extname(file.originalname)
    cb(null, file_path);
  },
})

// 2 MB limit
const fileSize = parseInt(process.env.MAX_FILE_SIZE_LIMIT) || (2 * 1024 * 1024)

const upload = multer({
  storage,
  limits: { fileSize: fileSize},
  fileFilter: function (req, file, cb) {
      const mimeTypes = /image\/jpg|image\/jpeg|image\/png/;
      const test = mimeTypes.test(file.mimetype);
      if(test) {
        return cb(null, true);
      } else {
        return cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'));
      }
  },
});

module.exports = upload;