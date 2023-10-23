import express from 'express';
import { registerController, loginController, testController, forgotPasswordController, getOrdersController, getAllOrdersController, orderStatusController } from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { updateProfileController } from './../controllers/authController.js';

// Object Router
const router = express.Router();


//What is going to be routed? 

//User Registration with POST method
router.post('/register', registerController);

// User Login with POST method and JWT
router.post('/login', loginController); 

// To Recover forgotten password using method POST
router.post('/forgot-password', forgotPasswordController);

//Testing Routes after middlewares implementation
router.get('/test', requireSignIn, isAdmin,  testController);


//Creating protected routes
    //User Auth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});

    //Admin Auth
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

//Route to update user profile
router.put("/profile", requireSignIn, updateProfileController);

//Route to go to orders
router.get("/orders", requireSignIn, getOrdersController);

//Route to get all existing orders - for admin
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// Route to update order status - only for admin
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController);

export default router