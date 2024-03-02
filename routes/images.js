import express from 'express';
import { getProfileImages, getEventImages } from '../controllers/images.js';

const imageRouter = express.Router();

imageRouter.get('/profile', getProfileImages);
imageRouter.get('/event', getEventImages);

export default imageRouter;