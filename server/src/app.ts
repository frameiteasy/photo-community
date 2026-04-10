import express from 'express';
import cors from 'cors';
import { photosRouter } from './routes/photos';
import { galleryRouter } from './routes/gallery';
import { albumsRouter } from './routes/albums';
import { blogRouter } from './routes/blog';
import { postsRouter } from './routes/posts';
import { photoService, albumService, blogService, postService } from './container';

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/v1/photos',  photosRouter(photoService));
app.use('/api/v1/gallery', galleryRouter(photoService));
app.use('/api/v1/albums',  albumsRouter(albumService));
app.use('/api/v1/blog',    blogRouter(blogService));
app.use('/api/v1/posts',   postsRouter(postService));

app.get('/api/v1/health', (_req, res) => res.json({ ok: true }));

export default app;
