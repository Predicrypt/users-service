import User, { UserDoc } from '../models/userModel';
import { Request, response, Response } from 'express';
import {
  BadRequestError,
  BinanceClient,
  NoApiKeyError,
} from '@Predicrypt/common';

export const getUserBalances = async (req: Request, res: Response) => {
  const user = User.findByUserId(req.currentUser?.id!);
  checkApiKey(user);

  const client = new BinanceClient(user.apiKey, user.secretKey);
  const accountBalances = await client.accountInfo({ timestamp: Date.now() });

  res.status(200).send(accountBalances.data.balances);
};

export const getTrades = async (req: Request, res: Response) => {
  const { symbol } = req.params;
  const user = User.findByUserId(req.currentUser?.id!);

  checkApiKey(user);
  const client = new BinanceClient(user.apiKey, user.secretKey);
  const tradeList = await client.accountTradeList({
    symbol,
    timestamp: Date.now(),
  });

  res.status(200).send(tradeList.data);
};

export const setApiKeys = async (req: Request, res: Response) => {
  const { apiKey, secretKey } = req.body;
  const user = await User.findByUserId(req.currentUser?.id!);
  console.log(user)
  user.apiKey = apiKey;
  user.secretKey = secretKey;

  await user.save();

  res.status(200).send({ status: 'success' });
};

export const deleteApiKeys = async (req: Request, res: Response) => {
  const user = User.findByUserId(req.currentUser?.id!);

  user.apiKey = '';
  user.secretKey = '';

  await user.save();

  res.send(200).send({ status: 'success' });
};

const checkApiKey = (user: UserDoc) => {
  if (user.apiKey && user.secretKey) {
    return;
  }

  throw new NoApiKeyError();
};
