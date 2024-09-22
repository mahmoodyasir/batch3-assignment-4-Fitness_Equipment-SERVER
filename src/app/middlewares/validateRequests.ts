import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const body = { ...req.body };

    if (body.price) {
      body.price = parseFloat(body.price);
    }

    if (body.stock_quantity) {
      body.stock_quantity = parseInt(body.stock_quantity, 10);
    }

    if (body.featured) {
      const value = body.featured;
      const lowerCaseValue = value.toLowerCase();
      body.featured = lowerCaseValue === 'true';
    }


    try {
      await schema.parseAsync(body);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error,
      });
    }
  });
};

export default validateRequest;
