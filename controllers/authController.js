import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import userModel from '../models/userModel.js';
import orderModel from "../models/orderModel.js";
import JWT from 'jsonwebtoken';

export const registerController = async (req, res) => {
    try {
        const {id, name, email, password, phone, address, answer} = req.body

        //Validations needed to register a new user
        if (!name) { 
            return res.send({message: 'Name is required! '})
        }
        if (!email) { 
            return res.send({message: 'Email is required! '})
        }
        if (!password) { 
            return res.send({message: 'Password is required! '})
        }
        if (!phone) { 
            return res.send({message: 'Phone is required! '})
        }
        if (!address) { 
            return res.send({message: 'Address is required! '})
        }
        if (!answer) { 
            return res.send({message: 'Answer is required! '})
        }

        //Verification of existing users by email
        const existingUser = await userModel.findOne({email})
        if (existingUser) {
           return res.status(200).send({
            success: false, 
            message: 'This user is already registered, please login to buy!'
           }) 
        }

        //Verification to register users
        const hashedPassword = await hashPassword(password)
        const user = await new userModel({name, email, phone, address, password:hashedPassword, answer}).save()

        res.status(201).send({
            success: true,
            message: 'A new user was registered succesfully',
            user,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Shit, here we go again! Error in user registration',
            error
        })
    }
}; 

//Login with method POST and JWT
export const loginController = async (req, res) => {
    try {
        const {email, password} = req.body 

        // Validations needed to login
        if(!email || !password) {
            return res.status(404).send({
                success: false,
                message:'Shit, here we go again! Invalid email or password'
            });
        };
        // To check the user 
        const user = await userModel.findOne({email})
        if(!user) {
            return res.status(404).send({
                success: false,
                message:'Shit, bro! This email is not registered!'
            });
        };
        // To check if the password matched
        const match = await comparePassword(password, user.password)
        if(!match) {
            return res.status(200).send({
                success: false,
                message: 'Ihhhh, password is invalid! Try again!'
            });
        };
        // Token 
        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "4d",
        });
        res.status(200).send({
            success: true,
            message: 'Yeah, you did it! Login successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token, 
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Shit, here we go again! Error to login in!',
            error
        });
    };
};

// Controller for Forgotten Password
export const forgotPasswordController = async (req, res) => {
    try {
        const {email, answer, newPassword} = req.body
        if (!email) {
            res.status(400).send({message: 'É necessário um email'})
        }
        if (!answer) {
            res.status(400).send({message: 'A resposta de segurança é necessária'})
        }
        if (!newPassword) {
            res.status(400).send({message: 'A nova senha é necessária'})
        }

        //Check the requirements
        const user = await userModel.findOne({email, answer})

        //Validate the requirements
        if(!user) {
            return res.status(404).send({
                success: false,
                message: 'Algo de errado não está certo!'
            })
        }
        
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password: hashed})
        res.status(200).send({
            success: true,
            message: 'Alterada com sucesso a senha foi' 
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false, 
            message: 'Coisas erradas aí estão',
            error
        })
    }
}


//Testing controller 
export const testController = (req, res) => {
    res.send('protected route');
}

//Controller to update user profile
export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);
      
      if (password && password.length < 6) {
        return res.json({ error: "A senha é necessária e precisar ter no mínimo 6 dígitos" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Perfil atualizado com sucesso",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Erro pra atualizar o perfil",
        error,
      });
    }
  };

  //Controller to get desired orders by users
export const getOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({ buyer: req.user._id })
        .populate("products", "-photo")
        .populate("buyer", "name");
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Erro ao pegar as compras do usuário",
        error,
      });
    }
  };
  // Controller to get all orders - For Admin
  export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: "-1" });
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Erro ao pegar todas as compras",
        error,
      });
    }
  };
  
  //Controller to update order status - For admin only
  export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Erro ao tentar atualizar o status da compra",
        error,
      });
    }
  };