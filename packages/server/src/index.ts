import express, { Request, Response } from 'express';
import { connectDB } from './lib/db';

connectDB();

const app = express();
const port = process.env.PORT || 8080;

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello, Express!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
