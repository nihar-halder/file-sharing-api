const LocalProvider = require('../providers/localProvider');
const GoogleCloudProvider = require('../providers/googleCloudProvider');

const providerType = process.env.PROVIDER || 'local';

let fileProvider;

if (providerType === 'google') {
  fileProvider = new GoogleCloudProvider();
} else {
  fileProvider = new LocalProvider();
}

class FileController {
  constructor() {}
  uploadFile(req, res) {
    fileProvider.uploadFile(req, res)
  }

  downloadFile(req, res) {
    fileProvider.downloadFile(req.params.publicKey, res)
  }

  removeFile(req, res) {
    fileProvider.removeFile(req.params.privateKey, res)
  }

  removeUnusedFiles() {
    fileProvider.removeUnusedFiles()
  }
}

module.exports = FileController;