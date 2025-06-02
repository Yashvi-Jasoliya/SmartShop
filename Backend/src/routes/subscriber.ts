import express from 'express';
import { subscribeUser, getSubscribers } from '../controllers/subscriber.js';

const router = express.Router();

router.post('/', subscribeUser);
router.get('/', getSubscribers);

export default router;
