import User, { UserDoc } from '../models/userModel';
import { Request, Response } from 'express';

export const getUserBalance = (req: Request, res: Response) => {
  const user = User.findByUserId(req.currentUser?.id!);
  checkApiKey(user);
};

const checkApiKey = (user: UserDoc) => {
  if (user.apiKey && user.secretKey) {
    return;
  }

  throw new NoApiKeyError();
};
