import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors,
    });
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Unique constraint failed' });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Record not found' });
    }
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Only log 500 errors in tests, or all errors in production
  if (process.env.NODE_ENV !== 'test' || status >= 500) {
    console.error(err.stack);
  }

  res.status(status).json({
    error: message,
  });
};
