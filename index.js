import express from 'express';
import dotennv from 'dotenv';
import mongoose from 'mongoose';

dotennv.config();
const app = express();
app.use(express.json());

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
