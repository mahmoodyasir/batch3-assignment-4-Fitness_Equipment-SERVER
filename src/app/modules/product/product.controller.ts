import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { ProductServices } from "./product.service";
import sendResponse from "../../utils/sendResponse";


const createProduct = catchAsync(async (req, res) => {

    const files = req.files as Express.Multer.File[];

    const result = await ProductServices.createProductIntoDB(req.body, files);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Products created successfully",
        data: result
    });
});


const updateProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];

    const result = await ProductServices.updateProductInDB(id, req.body, files);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product updated successfully",
        data: result
    });
});


const getAllProducts = catchAsync(async (req, res) => {
    const { page, limit } = req.query;

    const paginationParams = {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
    };

    const result = await ProductServices.getAllProductsFromDB(paginationParams);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Products retrieved successfully",
        data: result,
    });
});


const deleteProduct = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await ProductServices.deleteProductFromDB(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Products deleted successfully",
        data: result,
    });
});


export const ProductControllers = {
    createProduct,
    updateProduct,
    getAllProducts,
    deleteProduct
}