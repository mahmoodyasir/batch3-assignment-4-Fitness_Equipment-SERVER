import mongoose from 'mongoose';
import { Order } from './order.model';
import { Product } from '../product/product.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

const createOrderIntoDB = async (orderData: any) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { user, items } = orderData;

        for (const item of items) {
            const product = await Product.findById(item.product).session(session);
            if (!product) {
                throw new AppError(httpStatus.NOT_FOUND, `Product not found for ID ${item.product}`);
            }
            if (product.stock_quantity < item.quantity) {
                throw new AppError(httpStatus.BAD_REQUEST, `Insufficient stock for product ${product.name}`);
            }

            product.stock_quantity -= item.quantity;
            await product.save({ session });
        }

        const newOrder = {
            user,
            items,
        };

        const result = (await Order.create(newOrder)).populate([
            {
                path: 'items.product'
            },
        ]);


        await session.commitTransaction();
        await session.endSession();

        return result;

    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error('Failed to create order');
    }
};

export const OrderServices = {
    createOrderIntoDB,
};
