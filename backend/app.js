import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { NotFoundError } from './expressError.js';
import { authenticateJWT } from './middleware/auth.js';
import usersRouter from './routes/users.js'; 
import authRouter from './routes/auth.js'; 
import itemsRouter from './routes/items.js'; 

const app = express();

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());
app.use(morgan('tiny'));
app.use(authenticateJWT);

app.use('/users', usersRouter);
app.use('/auth', authRouter); 
app.use('/items', itemsRouter); 

app.use((req, res, next) => next(new NotFoundError()));

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  res.status(status).json({ error: { message, status } });
});

export default app;
