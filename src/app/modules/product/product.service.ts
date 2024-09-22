import axios from "axios";
import mongoose, { FilterQuery } from "mongoose";
import config from "../../config";
import { Product } from "./product.model";
import { TProduct } from "./product.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";


interface FilterParams {
    search?: string;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price' | 'name';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    allItems?: string;
}


const createProductIntoDB = async (data: any, files?: Express.Multer.File[]) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const { name, price, description, stock_quantity, category, featured } = data;

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
                featured,
            };
        }

        else {
            newProduct = {
                name,
                price,
                description,
                stock_quantity,
                category,
                featured,
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

        
        const product = await Product.findById(id).session(session);
        
        if (!product) {
            throw new AppError(httpStatus.NOT_FOUND, 'Product Not Found !');
        }
        
        const { name, price, description, stock_quantity, category, featured, deletedImages } = data;
        
        const updatedData: Partial<TProduct> = {
            name: name || product.name,
            price: price || product.price,
            description: description || product.description,
            stock_quantity: stock_quantity || product.stock_quantity,
            category: category || product.category,
            images: product.images,
            featured: featured || product.featured || false,
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



const getAllProductsFromDB = async (options: FilterParams) => {

    const {
        search,
        categories,
        minPrice,
        maxPrice,
        sortBy = 'price',
        sortOrder,
        page = 1,
        limit = 10,
        allItems
    } = options;

    const query: FilterQuery<any> = {};

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    if (categories && categories.length > 0) {
        query.category = { $in: categories };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) query.price.$gte = minPrice;
        if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    const sortOptions: any = {};
    if (sortOrder) {
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }
    else {
        sortOptions['createdAt'] = -1;
    }

    const skip = (page - 1) * limit;

    const totalCount = await Product.countDocuments().exec();


    const products = await Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(allItems === 'true' ? totalCount : limit)
        .exec();


    const result = {
        data: products,
        total_product: totalCount,
        page: page,
        total_pages: Math.ceil(totalCount / (allItems === 'true' ? totalCount : limit))
    }

    return result;
};


const getProductsByIDFromDB = async (id: string) => {

    const product = await Product.findById(id);

    if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product Not Found !');
    };

    return product;
};


const deleteProductFromDB = async (id: string) => {

    const product = await Product.findById(id);

    if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product Not Found !');
    };

    const result = await Product.findByIdAndDelete(id);

    return result;

}


const getAllUniqueCategoriesFromDB = async (): Promise<string[]> => {
    const categories = await Product.distinct('category');
    return categories;
};

export const ProductServices = {
    createProductIntoDB,
    updateProductInDB,
    getAllProductsFromDB,
    deleteProductFromDB,
    getProductsByIDFromDB,
    getAllUniqueCategoriesFromDB,
}