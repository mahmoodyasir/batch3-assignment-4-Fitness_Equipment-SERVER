import { z } from 'zod';

export const productValidationSchema = z.object({
    name: z.string(),
    price: z.number(),
    description: z.string(),
    stock_quantity: z.number(),
    category: z.string(),
    featured: z.boolean().optional(),
});

export const productUpdateValidationSchema = z.object({
    name: z.string().optional(),
    price: z.number().optional(),
    description: z.string().optional(),
    stock_quantity: z.number().optional(),
    category: z.string().optional(),
    featured: z.boolean().optional(),
  });

export const ProductValidation = {
    productValidationSchema,
    productUpdateValidationSchema,
}