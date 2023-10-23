import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { 
    addNewProductController, 
    getProductsController, 
    getSingleProductController, 
    getProductPhotoController, 
    deleteProductController, 
    updateProductController, 
    productsFiltersController, 
    productCountController, 
    productListController, 
    searchProductController, 
    realatedProductController, 
    productCategoryController, 
    brainTreePaymentController, 
    braintreeTokenController 
} from '../controllers/newProductsController.js';
import formidable from 'express-formidable';


const router = express.Router();

// Routes of products characteristics
    //Route to add product using POST method
router.post('/new-product', requireSignIn, isAdmin, formidable(), addNewProductController);

//Route to UPDATE product using UPDATE method
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);

    //Route to get products using GET method
router.get('/get-products', getProductsController);

    //Route to get only one product using GET method
router.get('/get-single-product/:slug', getSingleProductController);

    // Route to get the product photo using GET method
router.get('/get-product-photo/:pid', getProductPhotoController);

    // Route to delete product using DELETE method
router.delete('/delete-product/:pid', deleteProductController);

    // Route to filter products 
router.post('/filter-products', productsFiltersController);

    // Route to count products for pagination 
router.get('/product-count', productCountController);

    //Route to demonstrate product per page
router.get('/product-list/:page', productListController);

    //Route to search products
router.get("/search/:keyword", searchProductController);

    //Route to get similar products
router.get("/related-product/:pid/:cid", realatedProductController);

    //Route to get a category wise product
router.get("/product-category/:slug", productCategoryController);

    //payments routes
    //token
router.get("/braintree/token", braintreeTokenController);

    //payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;