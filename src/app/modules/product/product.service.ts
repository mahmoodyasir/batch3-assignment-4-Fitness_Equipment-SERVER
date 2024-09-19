import axios from "axios";
import mongoose from "mongoose";
import config from "../../config";
import { Product } from "./product.model";
import { TProduct } from "./product.interface";

const createProductIntoDB = async (data: any, files?: Express.Multer.File[]) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const { name, price, description, stock_quantity, category } = data;

        let newProduct: TProduct;

        if (files) {
            const imageUploadPromises = files.map(file => {
                const formData = new FormData();
                formData.append('image', file.buffer.toString('base64'));

                return axios.post('https://api.imgbb.com/1/upload', formData, {
                    params: { key: config.imgbb_api_key },
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            });

            const imgbbResponses = await Promise.all(imageUploadPromises);
            const imageUrls = imgbbResponses.map(response => response.data.data.url);

            newProduct = {
                name,
                price,
                description,
                images: imageUrls,
                stock_quantity,
                category,
            };
        }

        else {
            newProduct = {
                name,
                price,
                description,
                stock_quantity,
                category
            };
        };

        const result = await Product.create(newProduct);

        await session.commitTransaction();
        await session.endSession();

        return result;

    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error('Failed to create product');
    }

}


export const ProductServices = {
    createProductIntoDB,
}