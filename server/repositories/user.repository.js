const fs = require('fs').promises; // Use promise-based fs API
const path = require('path');
const csvToJson = require('csvtojson');
const User = require('../models/user.model');

const startFileProcess = async (file) => {
    try {
        console.log("File Processing Started......");
        const filePath = path.join(__dirname, '..', 'uploads', file.filename);
        console.log("INFO: File Path: ", filePath);

        const fileContents = await ReadFileContents(filePath);

        if (!fileContents.isRead) {
            return { isFileProcessed: false, error: fileContents.error };
        }
        console.log("SUCCESS: File Read Successfully....");

        const FileConvertedContents = await fileConversionProcess(fileContents.data, file.originalname);

        if(!FileConvertedContents.isFileConverted){
            return { isFileProcessed: false, error: FileConvertedContents.error };
        }
        
        console.log("SUCCESS: File Processed Successfully....");

        const isValid = validateFile(FileConvertedContents.data);
        console.log("INFO: User data validation completed....",isValid);


        return { isFileProcessed: true, data: fileContents.data };
    } catch (error) {
        console.error("ERROR: ", error);
        return { isFileProcessed: false, error: error };
    }
};

const ReadFileContents = async (filePath) => {
    console.log("INFO: Reading file contents....");
    try {
        const data = await fs.readFile(filePath, 'utf8');
        // Optionally delete the file after reading
        try {
            await fs.unlink(filePath);
            console.log('Temporary file deleted.');
        } catch (unlinkErr) {
            console.error('Error deleting file:', unlinkErr);
        }

        return { isRead: true, data: data };
    } catch (error) {
        console.error('Error reading file:', error);
        return { isRead: false, error: error };
    }
};

const fileConversionProcess = async (fileContents, fileName) => {
    console.log("INFO: File Conversion Process Started....");
    try{
        if(fileName.includes('.json')){
            console.log("INFO: File is in json format.... No need to convert");
            return { isFileConverted: true, data: fileContents };
        }else if(fileName.includes('.csv')){
            console.log("INFO: File is in csv format.... Need to convert");
            // Convert the file into json
            const jsonData = await csvToJson().fromString(fileContents);
            console.log("INFO: File converted into json....");
            return { isFileConverted: true, data: jsonData };
        }else{
            console.log("INFO: File is in unknown format....");
            return { isFileConverted: false, error: "Unknown file format" };
        }
    }catch(error) {
        console.error("ERROR: ", error);
        return { isFileConverted: false, error: error };
    }
}

// convertFileToRequiredFormatvalues
// insertDatatoTables

const validateFile = (userData) => {
    try{

        const userValidations = userData.map((user) => {
            console.log("INFO: Validating user data.... for user ->",user.user_id);
            const userInstance = new User(user);

            const validationError = userInstance.validateSync();
            if (validationError) {
                console.error("ERROR: Validation failed for user data....",validationError);
                return { isValid: false, error: validationError };
            }
            return { isValid: true };
        });

        return userValidations;

    }catch(error) {
        console.error("ERROR: ", error);
        return { isValid: false, error: error };
    }
}

module.exports = startFileProcess;
