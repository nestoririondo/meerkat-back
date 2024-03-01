import express from 'express';
import { getProfileImages, getBackgroundImages } from '../controllers/images.js';

const imageRouter = express.Router();

imageRouter.get('/profile', getProfileImages);
imageRouter.get('/background', getBackgroundImages);

export default imageRouter;