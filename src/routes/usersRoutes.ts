import { currentUser, requireAuth } from '@Predicrypt/common';
import { Router } from 'express';
import {
  deleteApiKeys,
  getTrades,
  getUserBalances,
  setApiKeys,
} from '../controllers/usersController';

const router = Router();

router.get('/api/users/balances', requireAuth, getUserBalances);
router.get('/api/users/trades', requireAuth, getTrades);
router.post('/api/users/:userId/keys',requireAuth, setApiKeys);
router.delete('/api/users/:userId/keys',requireAuth ,deleteApiKeys);

export { router as usersRouter };
