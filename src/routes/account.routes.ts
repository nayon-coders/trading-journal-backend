import express from 'express';
import { getAccounts, createAccount, getAccount, updateAccount, deleteAccount } from '../controllers/account.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAccounts)
  .post(createAccount);

router.route('/:id')
  .get(getAccount)
  .put(updateAccount)
  .delete(deleteAccount);

export default router;
