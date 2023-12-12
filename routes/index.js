const express = require('express');
const FileController = require('../controllers/FileController');
const router = express.Router();
const upload = require('../middlewares/upload');

router.post('/files', upload.single('file_name'), new FileController().uploadFile);
router.get('/files/:publicKey', new FileController().downloadFile);
router.delete('/files/:privateKey', new FileController().removeFile);

module.exports = router;
