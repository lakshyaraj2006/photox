import express from 'express';
import { connectDB } from './lib/db';
import { AuthRouter } from './routes/auth.route';

connectDB();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use('/api/auth', AuthRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
