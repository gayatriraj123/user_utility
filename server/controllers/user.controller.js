const startFileProcess = require('../repositories/user.repository');


const FileUploadController = async (req, res) => {
    const FUNCTION_NAME='FileUploadController.....'
    try{
        const file = req.file;
        console.log(`${FUNCTION_NAME} file:`, file);
        startFileProcess(file);
        res.status(200).json({message: 'File uploaded successfully'});
    }catch(error) {
        console.log(`ERROR: ${FUNCTION_NAME} ->`, error);
        res.status(500).json({message: error.message});
    }
}


module.exports = FileUploadController;