import express, { Router } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { json } from 'body-parser';
import { currentUser } from '@Predicrypt/common';


const app = express();

app.use(cors());
app.use(json());


if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

export default app;
