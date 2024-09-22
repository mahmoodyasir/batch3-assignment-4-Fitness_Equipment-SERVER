import { model, Schema } from "mongoose";
import { TProduct } from "./product.interface";
import { boolean } from "zod";

const productSchema = new Schema<TProduct>(
    {
        name: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        description: {
            type: String
        },

        images: [{
            type: String,
        }],

        stock_quantity: {
            type: Number,
            required: true
        },

        category: {
            type: String
        },
        featured: {
            type: Boolean
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Product = model<TProduct>('Product', productSchema);