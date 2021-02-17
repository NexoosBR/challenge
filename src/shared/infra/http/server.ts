import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import AppError from '@shared/errors/AppError';

import { isCelebrateError } from 'celebrate';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  // App errors
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Celebrate errors
  if (isCelebrateError(err)) {
    // console.log('details ->', error.details)
    const queryMessage = err.details.get('query')?.message;
    const bodyMessage = err.details.get('body')?.message;
    return response.status(401).json({
      error: true,
      message: queryMessage || bodyMessage,
    });
  }

  // eslint-disable-next-line no-console
  console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

// eslint-disable-next-line no-console
app.listen(3333, () => console.log('Server listening on port: 3333'));