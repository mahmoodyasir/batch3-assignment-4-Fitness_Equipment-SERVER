import axios from "axios";
import mongoose from "mongoose";
import config from "../../config";
import { Product } from "./product.model";
import { TProduct } from "./product.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";



const extractImageIdFromUrl = (url: string): string => {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1].split('.')[0]; // Extract ID part from the URL
};



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


const updateProductInDB = async (id: string, data: any, files?: Express.Multer.File[]) => {

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // Fetch the existing product
        const product = await Product.findById(id).session(session);
        if (!product) {
            throw new AppError(httpStatus.NOT_FOUND, 'Product Not Found !');
        }

        const { name, price, description, stock_quantity, category, deletedImages } = data;

        const updatedData: Partial<TProduct> = {
            name: name || product.name,
            price: price || product.price,
            description: description || product.description,
            stock_quantity: stock_quantity || product.stock_quantity,
            category: category || product.category,
            images: product.images 
        };

        if (deletedImages) {
           
            const deleteImages = JSON.parse(deletedImages)

            if (deleteImages && deleteImages.length > 0) {

                const remainingImages = product?.images?.filter(img => !deleteImages.includes(img));

                updatedData.images = remainingImages;
            }
        }


        if (files && files.length > 0) {
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

            updatedData.images = [...(updatedData.images || []), ...imageUrls]; 
        }

   
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true, session });

        await session.commitTransaction();
        await session.endSession();

        return updatedProduct;

    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error('Failed to update product');
    }
};


export const ProductServices = {
    createProductIntoDB,
    updateProductInDB
}