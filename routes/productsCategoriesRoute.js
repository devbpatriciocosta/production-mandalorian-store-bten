import express from 'express';
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import { categoryController, deleteCategoryController, newCategoryController, singleCategoryController, updateCategoryController } from '../controllers/newCategoryController.js';

const router = express.Router()

//Routes
    //Creating Categories by POST method
router.post('/new-category', requireSignIn, isAdmin, newCategoryController);

    //Updating Categories by PUT method
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);

    // To get all categories created by GET method
router.get('/get-category', categoryController);

    // To get a single category by GET method
router.get('/single-category/:slug', singleCategoryController);

    // To delete a category by DELETE method
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);

export default router