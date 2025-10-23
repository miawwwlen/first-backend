import express from 'express';
import dotenv from 'dotenv';
import router from './src/auth/dto/auth-router.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/auth', router);

app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`);
});
