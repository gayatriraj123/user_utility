

const FileUploadController = async (req, res) => {
    const FUNCTION_NAME='FileUploadController.....'
    try{
        const file = req.file;

        console.log("file---",file);
        if (!file) {
            return res.status(400).json({message: 'Please upload a file!'});
        }
        return res.status(200).json({message: 'File uploaded successfully!'});

    }catch(error) {
        console.log(`ERROR: ${FUNCTION_NAME} ->`, error);
        res.status(500).json({message: error.message});
    }
}


module.exports = FileUploadController;