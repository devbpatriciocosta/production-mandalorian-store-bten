import productsDetailsModel from "../models/productsDetailsModel.js";
import productsCategoriesModel from "../models/productsCategoriesModel.js";
import orderModel from "../models/orderModel.js";

import slugify from "slugify";
import fs from "fs";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

//Payment gateway integration (sandbox)
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const addNewProductController = async (req, res) => {
    try {
        const {name, description, price, category, quantity, isAvailable, shipping, rating, slug} = req.fields
        const {photo} = req.files

        //Validation using switch case statement
        switch(true) {
            case !name:
                return res.status(500).send({error: 'Necessário inserir o nome do produto'})
                case !description:
                    return res.status(500).send({error: 'Necessário inserir a descrição do produto'})
                    case !price:
                        return res.status(500).send({error: 'Necessário inserir o preço do produto'})
                        case !category:
                            return res.status(500).send({error: 'Necessário inserir a categoria do produto'})
                            case !quantity:
                                return res.status(500).send({error: 'Necessário inserir a quantidade do produto'})
                                // case !isAvailable:
                                //     return res.status(500).send({error: 'Necessário inserir a disponibilidade do produto'})
                                    case !photo && photo.size > 1000000:
                                        return res.status(500).send({error: 'Necessário inserir o frete do produto'})
                                        // case !rating:
                                        //     return res.status(500).send({error: 'Necessário inserir a avaliação do produto'})
        }

        const products = new productsDetailsModel({...req.fields, slug:slugify(name)})
        
        if(photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: 'Um novo produto foi adicionado com sucesso',
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error, 
            message: 'Erro ao adicionar um novo produto'
        })
    }
};

//Controller to UPDATE product
// Controller to UPDATE product
export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, isAvailable, shipping, rating, slug } = req.fields;
        const { photo } = req.files;

        // Validation using switch case statement
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Necessário inserir o nome do produto' });
            case !description:
                return res.status(500).send({ error: 'Necessário inserir a descrição do produto' });
            case !price:
                return res.status(500).send({ error: 'Necessário inserir o preço do produto' });
            case !category:
                return res.status(500).send({ error: 'Necessário inserir a categoria do produto' });
            case !quantity:
                return res.status(500).send({ error: 'Necessário inserir a quantidade do produto' });
        }

        const products = await productsDetailsModel.findByIdAndUpdate(req.params.pid, {
            ...req.fields,
            slug: slugify(name),
        }, { new: true });

        if (photo) {
            if (photo.size > 1000000) {
                return res.status(500).send({ error: 'O tamanho da imagem excede o limite permitido' });
            }
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save();

        res.status(201).send({
            success: true,
            message: 'O produto foi atualizado com sucesso',
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Erro ao atualizar o produto',
        });
    }
};


//Controller to GET all products
export const getProductsController = async (req, res) => {
    try {
        const products = await productsDetailsModel.find({}).populate('category').select("-photo").limit(36).sort({createdAt:-1})
        res.status(200).send({
            success: true,
            counTotal: products.length,
            message: "Todos os produtos disponíveis",
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Erro ao mostrar todos os produtos",
            error: error.message
        })
    }
};

//Controller to Get a SINGLE product
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productsDetailsModel.findOne({slug:req.params.slug}).select("-photo").populate("category")
        res.status(200).send({
            success: true,
            message: 'O produto escolhido foi selecionado',
            product,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Erro ao mostrar um produto",
            error: error.message
        })
    }
};

//Controller to get the product photo
export const getProductPhotoController = async (req, res) => {
    try {
        const product = await productsDetailsModel.findById(req.params.pid).select("photo")
        if(product.photo.data) {
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Erro ao mostrar a foto do produto",
            error: error.message
        })
    }
};

// Controller to delete a product 
export const deleteProductController = async (req, res) => {
    try {
        await productsDetailsModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: 'O produto foi deletado',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Erro ao deletar um produto",
            error: error.message
        })
    }
};

// Controller to filter products
export const productsFiltersController = async (req, res) => {
    try {
        const {checked, radio} = req.body
        let args = {}
        if(checked.length > 0) args.category = checked
        if(radio.length) args.price = {$gte: radio[0], $lte: radio[1] }
        const products = await productsDetailsModel.find(args);
        res.status(200).send({
            success: true,
            products,
          });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Erro ao filtrar equipamentos",
            error: error.message
        })
    }
};

// Product count to do the pagination using GET method
export const productCountController = async (req, res) => {
    try {
      const total = await productsDetailsModel.find({}).estimatedDocumentCount();
      res.status(200).send({
        success: true,
        total,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Erro na contagem de produtos",
        error,
      });
    }
  };
  
  // Controller of product initial list on a page
  export const productListController = async (req, res) => {
    try {
      const perPage = 8;
      const page = req.params.page ? req.params.page : 1;
      const products = await productsDetailsModel
        .find({})
        .select("-photo")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Erro na quantidade de produtos por página",
        error,
      });
    }
  };

  // Controller to search product
export const searchProductController = async (req, res) => {
    try {
      const { keyword } = req.params;
      const results = await productsDetailsModel
        .find({
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        })
        .select("-photo");
      res.json(results);
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Erro ao pesquisar um equipamento na API",
        error,
      });
    }
  };
  
  // Controller to get similar products
  export const realatedProductController = async (req, res) => {
    try {
      const { pid, cid } = req.params;
      const products = await productsDetailsModel
        .find({
          category: cid,
          _id: { $ne: pid },
        })
        .select("-photo")
        .limit(8)
        .populate("category");
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Erro ao puxar os equipamentos similares",
        error,
      });
    }
  };
  
  // Controller to get products by category
  export const productCategoryController = async (req, res) => {
    try {
      const category = await productsCategoriesModel.findOne({ slug: req.params.slug });
      const products = await productsDetailsModel.find({ category }).populate("category");
      res.status(200).send({
        success: true,
        category,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        error,
        message: "Erro ao pegar os equipamentos",
      });
    }
  };


  //payment gateway api
  //For token
  export const braintreeTokenController = async (req, res) => {
    try {
      gateway.clientToken.generate({}, function (err, response) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  //For payment
  export const brainTreePaymentController = async (req, res) => {
    try {
      const { nonce, cart } = req.body;
      let total = 0;
      cart.map((i) => {
        total += i.price;
      });
      let newTransaction = gateway.transaction.sale(
        {
          amount: total,
          paymentMethodNonce: nonce,
          options: {
            submitForSettlement: true,
          },
        },
        function (error, result) {
          if (result) {
            const order = new orderModel({
              products: cart,
              payment: result,
              buyer: req.user._id,
            }).save();
            res.json({ ok: true });
          } else {
            res.status(500).send(error);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };