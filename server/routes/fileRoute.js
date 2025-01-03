// import express from 'express';
// import multer from 'multer';
// import fs from 'fs';
// import csv from 'csv-parser';
// import File from '../model/file.js';

// const router = express.Router();

// // Multer Storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
// });
// const upload = multer({ storage });

// // Upload Endpoint
// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

//     const filePath = req.file.path;
//     const jsonData = [];

//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', (row) => {
//         if (!row.name || !row.email) throw new Error('Required fields missing');
//         jsonData.push(row);
//       })
//       .on('end', async () => {
//         const newFile = new File({
//           fileName: req.file.originalname,
//           filePath,
//           jsonData,
//         });
//         await newFile.save();
//         res.status(200).json({ message: 'File uploaded successfully', data: newFile });
//       });
//   } catch (err) {
//     res.status(500).json({ message: 'File processing error', error: err.message });
//   }
// });

// export default router;

// import express from 'express';
// import multer from 'multer';
// import fs from 'fs';
// import csv from 'csv-parser';
// import File from '../model/file.js';

// const router = express.Router();

// // Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
// });
// const upload = multer({ storage });

// // Helper function for validating user ID and email
// const validateUserData = (userData) => {
//   const { user_id, email } = userData;
  
//   if (!user_id || !email) {
//     throw new Error('User ID and email are required');
//   }

//   // Validate email format
//   const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
//   if (!emailPattern.test(email)) {
//     throw new Error('Invalid email format');
//   }
// };

// // Upload Endpoint
// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

//     const filePath = req.file.path;
//     const jsonData = [];

//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', (row) => {
//         try {
//           validateUserData(row); // Validate user data for required fields
//           jsonData.push(row);
//         } catch (err) {
//           // Continue processing the rest of the data even if one row is invalid
//           console.log(`Invalid data row: ${err.message}`);
//         }
//       })
//       .on('end', async () => {
//         const newFile = new File({
//           fileName: req.file.originalname,
//           filePath,
//           jsonData,
//         });
//         await newFile.save();
//         res.status(200).json({ message: 'File uploaded successfully', data: newFile });
//       });
//   } catch (err) {
//     res.status(500).json({ message: 'File processing error', error: err.message });
//   }
// });

// export default router;
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import File from '../model/file.js';

const router = express.Router();

// Get the correct path for the uploads folder on Windows
const uploadsDir = path.resolve('uploads'); // Use path.resolve to ensure proper handling of path

// Ensure the uploads directory exists on the server
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads directory created on the server');
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir), // Save file in the server's uploads directory
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`), // Generate a unique filename
});
const upload = multer({ storage });

// Helper function for validating user ID and email
const validateUserData = (userData) => {
  const { user_id, email } = userData;

  if (!user_id || !email) {
    throw new Error('User ID and email are required');
  }

  // Validate email format
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(email)) {
    throw new Error('Invalid email format');
  }
};

// Upload Endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const filePath = req.file.path;
    const jsonData = [];
    const errors = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          validateUserData(row); // Validate user data for required fields
          jsonData.push(row);
        } catch (err) {
          errors.push({ row, error: err.message }); // Capture errors for invalid rows
        }
      })
      .on('end', async () => {
        if (errors.length > 0) {
          return res.status(400).json({
            message: 'File uploaded with errors',
            fileName: req.file.originalname,
            errors,
          });
        }

        const newFile = new File({
          fileName: req.file.originalname,
          filePath,
          jsonData,
        });
        await newFile.save();
        res.status(200).json({ message: 'File uploaded successfully', data: newFile });
      })
      .on('error', (error) => {
        res.status(500).json({
          message: 'File processing error',
          fileName: req.file.originalname,
          error: error.message,
        });
      });
  } catch (err) {
    res.status(500).json({
      message: 'File uploading failed',
      fileName: req.file?.originalname || 'Unknown file',
      error: err.message,
    });
  }
});

export default router;
