const schedule = require('node-schedule');
var FileController = require('../controllers/FileController');

function cleanStorage() {
    try {
        schedule.scheduleJob(process.env.STORAGE_CLEAN_JOB_SCHEDULE || '0 30 17 * * *', async () => {            
          new FileController().removeUnusedFiles()
          console.log('Job done at - ', new Date());
        });
    } catch (e) {
        console.log('Job error - ', e);
    }
}

module.exports = cleanStorage