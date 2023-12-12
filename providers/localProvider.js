const fs = require('fs');
const path = require('path');
const File = require('../models/File');
const httpCodes = require('http-status-codes');
var CryptoJS = require("crypto-js");
const mime = require('mime-types');
const mongoose = require('mongoose');

class LocalProvider {
  constructor() {
    this.uploadPath = process.env.LOCAL_BUCKET_NAME + '/files'
  }
  
  uploadFile(req, res) {
    const tempFilePath = req.file.path;
    const destinationDir = path.join(__dirname, '../', this.uploadPath);

    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, {recursive: true});
    }

    const destinationPath = path.join(destinationDir, req.file.filename);
    fs.rename(tempFilePath, destinationPath, (err) => {
      if (err) return res.status(httpCodes.StatusCodes.INTERNAL_SERVER_ERROR).send('Internal Server Error');
    });

    const doc = new File({
      path: path.join(this.uploadPath, req.file.filename),
      mimeType: req.file.mimetype,
      storage: "local",
    });

    doc.accessKeys.public = CryptoJS.AES.encrypt(`public-${doc._id}`, process.env.CRYPTO_KEY).toString()
    doc.accessKeys.private = CryptoJS.AES.encrypt(`private-${doc._id}`, process.env.CRYPTO_KEY).toString()
    doc.save()

    return res.status(httpCodes.StatusCodes.CREATED)
      .json({
        message: 'Upload success! Now you can download your file using public key and for deleting use the private key.',
        data: {
          publicKey: encodeURIComponent(doc.accessKeys.public),
          privateKey: encodeURIComponent(doc.accessKeys.private),
        }
      })
  }

  async downloadFile(publicKey, res) {
    try {
      const id  = CryptoJS.AES.decrypt(publicKey, process.env.CRYPTO_KEY).toString(CryptoJS.enc.Utf8).replace('public-', '');
      const doc = await File.findByIdAndUpdate(id, {$inc: {downloadCount: 1}})

      if(!doc) {
        return res.status(httpCodes.StatusCodes.NOT_FOUND).send('Not Found.')
      }

      const fileName = `file-${Date.now()}.${mime.extension(doc.mimeType)}`
      
      return res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
        .status(httpCodes.StatusCodes.OK)
        .sendFile(doc.path, { root: '.' }, (err) => {
          if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Internal Server Error');
          }
        })
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        return res.status(httpCodes.StatusCodes.BAD_REQUEST).send('Your key is not valid!')
      } else {
        return res.status(httpCodes.StatusCodes.INTERNAL_SERVER_ERROR).send('Internal Server Error')
      }   
    }
  }

  async removeFile(privateKey, res) {
    try {
      const id  = CryptoJS.AES.decrypt(privateKey, process.env.CRYPTO_KEY).toString(CryptoJS.enc.Utf8).replace('private-', '');
      const doc = await File.findById(id)  
      if(!doc) {
        return res.status(httpCodes.StatusCodes.NOT_FOUND).send('Not Found.')
      }
      const filePath = path.join(__dirname, '../', doc.path)

      fs.unlink(filePath, (err) => {});
      await doc.remove()
      return res.status(httpCodes.StatusCodes.OK)
      .json({
        message: 'Resource deleted!',
      })
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        return res.status(httpCodes.StatusCodes.BAD_REQUEST).send('Your key is not valid!')
      } else {
        return res.status(httpCodes.StatusCodes.INTERNAL_SERVER_ERROR).send('Internal Server Error')
      }
    }    
  }

  async removeUnusedFiles() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate(), parseInt(process.env.INACTIVE_FILE_PERIOD) || -30);
      const docs = await File.find().where('updatedAt').lt(thirtyDaysAgo)
      docs.forEach(async doc => {
        try {
          const filePath = path.join(__dirname, '../', doc.path)
          fs.unlink(filePath, (err) => {});
          await doc.remove()
        } catch (error) {
          console.log('removeUnusedFiles-1', error);
        }
      })    
    } catch (error) {
      console.log('removeUnusedFiles-2', error);
    }    
  }
}

module.exports = LocalProvider;