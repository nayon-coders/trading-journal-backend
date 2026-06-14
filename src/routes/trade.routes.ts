import express from 'express';
import { getTrades, createTrade, getTrade, updateTrade, deleteTrade } from '../controllers/trade.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTrades)
  .post(createTrade);

router.route('/:id')
  .get(getTrade)
  .put(updateTrade)
  .delete(deleteTrade);

export default router;
