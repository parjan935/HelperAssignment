import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';

import mongoose from 'mongoose';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const MONGO_URI: string=process.env.MONGO_URI as string

mongoose.connect(MONGO_URI)
.then(()=>console.log('mongodb connection successfull!'))
.catch((err)=>console.log('error - ',err))

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
