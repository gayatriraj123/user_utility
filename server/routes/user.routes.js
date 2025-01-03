const Router = require('express').Router();
const multer = require('multer');

const FileUploadController = require('../controllers/user.controller');


const upload = multer({ dest: 'uploads/' }); 

Router.post('/upload-file', upload.single('file'),FileUploadController);


module.exports = Router;