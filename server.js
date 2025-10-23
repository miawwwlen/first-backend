import express from 'express';
import dotenv from 'dotenv';
import router from './src/auth/auth-router.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/auth', router);

app.get('/', (req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.send(`Number of views: ${req.session.views}`);
});

app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`);
});
