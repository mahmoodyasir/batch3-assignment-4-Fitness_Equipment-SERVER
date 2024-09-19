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


export const ProductControllers = {
    createProduct,
}