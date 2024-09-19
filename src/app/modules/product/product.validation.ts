import { z } from 'zod';

export const productValidationSchema = z.object({
    name: z.string(),
    price: z.number(),
    description: z.string(),
    stock_quantity: z.number(),
    category: z.string(),
});

export const ProductValidation = {
    productValidationSchema,
}