import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

// Doing protected route with middlewares and JWT

export const requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
    console.log(error)
  }
};

//To access by admin advantages
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id)
        if(user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: 'bro, you know you cant be here, right?'
            })
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: 'The admin middleware has an error, pay attention',
            error
        })
    }
}