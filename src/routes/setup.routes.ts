import express from 'express';
import { getSetups, createSetup, updateSetup, deleteSetup } from '../controllers/setup.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getSetups)
  .post(createSetup);

router.route('/:id')
  .put(updateSetup)
  .delete(deleteSetup);

export default router;
