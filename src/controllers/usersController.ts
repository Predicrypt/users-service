import User, { UserDoc } from '../models/userModel';
import { Request, response, Response } from 'express';
import {
  BadRequestError,
  BinanceClient,
  NoApiKeyError,
} from '@Predicrypt/common';
import { KeysUpdatedPublisher } from '../events/publishers/UserRegisteredPublisher';
import { natsWrapper } from '../natsWrapper';

export const getUserBalances = async (req: Request, res: Response) => {
  const user = await User.findOne({ userId: req.currentUser?.id! });

  const client = new BinanceClient(user.apiKey, user.secretKey);
  const accountBalances = await client.accountInfo({ timestamp: Date.now() });

  res.status(200).send(accountBalances.data.balances);
};

export const getTrades = async (req: Request, res: Response) => {
  const { symbol } = req.params;
  console.log(req.params)
  const user = await User.findOne({ userId: req.currentUser?.id! });

  checkApiKey(user);
  console.log(symbol)
  const client = new BinanceClient(user.apiKey, user.secretKey);
  const tradeList = await client.accountTradeList({
    symbol,
    timestamp: Date.now(),
  });

  res.status(200).send(tradeList.data);
};

export const setApiKeys = async (req: Request, res: Response) => {
  const { apiKey, secretKey } = req.body;
  const all = await User.find({});
  const user = await User.findOne({ userId: req.currentUser?.id! });
  console.log(all);
  if (apiKey && secretKey) {
    user.apiKey = apiKey;
    user.secretKey = secretKey;

    await user.save();
    new KeysUpdatedPublisher(natsWrapper.client).publish({
      userId: req.currentUser?.id!,
      apiKey,
      secretKey,
    });
  } else {
    throw new BadRequestError('Api key or secret null');
  }

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
