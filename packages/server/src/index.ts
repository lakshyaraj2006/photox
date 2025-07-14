import express from 'express';
import { connectDB } from './lib/db';
import { AuthRouter } from './routes/auth.route';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { UserRouter } from './routes/user.route';
import { PhotoRouter } from './routes/photo.route';
import { AlbumRouter } from './routes/album.route';
import { CollaboratorRouter } from './routes/collaborator.routes';
import cors from "cors";

connectDB();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use('/api/auth', AuthRouter);
app.use('/api/user', UserRouter);
app.use('/api/photos', PhotoRouter);
app.use('/api/albums', AlbumRouter);
app.use('/api/collaborators', CollaboratorRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
