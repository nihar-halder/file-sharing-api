const httpCodes = require('http-status-codes');

class GoogleCloudProvider {
  constructor() {}
  
  uploadFile(req, res) {
    res.status(httpCodes.StatusCodes.NOT_IMPLEMENTED).send('Apologies, GCP is currently not supported.')
  }

  async downloadFile(publicKey, res) {
    res.status(httpCodes.StatusCodes.NOT_IMPLEMENTED).send('Apologies, GCP is currently not supported.')
  }

  async removeFile(privateKey, res) {
    res.status(httpCodes.StatusCodes.NOT_IMPLEMENTED).send('Apologies, GCP is currently not supported.')
  }
  async removeUnusedFiles() {
    //
  }
}

module.exports = GoogleCloudProvider;