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

    const { search, categories, minPrice, maxPrice, sortOrder } = req.body;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const allItems = req.query.allItems as string

    const filterOptions = {
        search: search || '',
        categories: categories || [],
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sortOrder: sortOrder || undefined,
        page,
        limit,
        allItems
    };

    const result = await ProductServices.getAllProductsFromDB(filterOptions);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Products retrieved successfully",
        data: result,
    });
});



const getProductByID = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await ProductServices.getProductsByIDFromDB(id);

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



const getAllUniqueCategories  = catchAsync(async (req, res) => {

    const result = await await ProductServices.getAllUniqueCategoriesFromDB();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Categories fetched successfully",
        data: result,
    });
});


export const ProductControllers = {
    createProduct,
    updateProduct,
    getAllProducts,
    deleteProduct,
    getProductByID,
    getAllUniqueCategories,
}