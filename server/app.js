import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import fileRoutes from './routes/fileRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/files', fileRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the file upload API');
});
// MongoDB Connection
mongoose.connect("mongodb+srv://gayatrirajguru2002:FMYGOEGby1po1G9z@cluster0.3bdvj.mongodb.net/")
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;