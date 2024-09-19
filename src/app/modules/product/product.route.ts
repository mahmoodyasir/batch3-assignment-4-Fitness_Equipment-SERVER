import express from 'express';
import { upload } from '../../middlewares/upload';
import validateRequest from '../../middlewares/validateRequests';
import { ProductValidation } from './product.validation';
import { ProductControllers } from './product.controller';

const router = express.Router();

router.post('/create-product',
    upload.array('images'),
    validateRequest(ProductValidation.productValidationSchema),
    ProductControllers.createProduct
);


router.put('/update-product/:id',
    upload.array('images'),
    validateRequest(ProductValidation.productUpdateValidationSchema),
    ProductControllers.updateProduct
);

router.get('/all_products', ProductControllers.getAllProducts);

router.delete('/delete-product/:id', ProductControllers.deleteProduct);

export const ProductRoutes = router;