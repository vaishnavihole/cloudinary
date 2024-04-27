import express from 'express';
import dotennv from 'dotenv';
import mongoose from 'mongoose';
import uploadCloudinary from './utils/cloudinary.js';
import fs from 'fs';
import multer from 'multer';

dotennv.config();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "./public/temp";
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});


const upload = multer({ storage });
const app = express();
app.use(express.json());

app.post('/upload', upload.single('file'), async (req, res) => {
    try {

        const localFilePath = req.file.path;
        const response = await uploadCloudinary(localFilePath);
        console.log(localFilePath);
        console.log(response);

        if (response) {
            res.status(200).json({ url: response.url });
        } else {
            res.status(500).json({ error: "Failed to upload file to Cloudinary" });
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;

try {
  mongoose.connect(process.env.MONGO_DB_URL);
  const db = mongoose.connection;
  db.on('error', (error) => console.error('❌ Error connecting to database:', error));
  db.once('open', () => console.log('Connected to DB 📦'));
} catch (err) {
  console.log(`❌ Error:  ${err?.message}`);
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} 🚀`);
});
