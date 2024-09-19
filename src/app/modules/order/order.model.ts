import { model, Schema, Types } from "mongoose";
import { TOrder } from "./order.interface";


const orderSchema = new Schema<TOrder>(
    {
        user: {
            name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
            delivery_address: {
                type: String,
                required: true,
            },

        },

        items: [
            {
                product: {
                    type: Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                total_price: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);


export const Order = model<TOrder>('Order', orderSchema);