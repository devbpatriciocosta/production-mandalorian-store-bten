import productsCategoriesModel from "../models/productsCategoriesModel.js";
import slugify from "slugify";

//Controller to add a new category

export const newCategoryController = async (req, res) => {
    try {

        const {name} = req.body

        if(!name) { 
            return res.status(401).send({message: 'É necessário add um nome '})
        }

        const existingCategory = await productsCategoriesModel.findOne({name})

        if(existingCategory) {
            return res.status(200).send({
                success:true,
                message: 'Essa categoria já existe'
            })
        }

        const category = await new productsCategoriesModel({name, slug:slugify(name)}).save()
        res.status(201).send({
            success: true,
            message: 'Uma nova categoria foi criada',
            category,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false, 
            error, 
            message: 'Problemas ao inserir uma nova categoria'
        })
    }
};

//Controller to UPDATE a category
export const updateCategoryController = async (req, res) => {
    try {
        const {name} = req.body
        const {id} = req.params
        const category = await productsCategoriesModel.findByIdAndUpdate(id, {name, slug: slugify(name)}, {new: true})
        res.status(200).send({
            success: true,
            message: 'O nome da categoria foi atualizada',
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false, 
            error, 
            message: 'Não foi possível atualizar o nome dessa categoria de produtos'
        })
    }
};

//Controller to GET all categories
export const categoryController = async (req, res) => {
    try {
        const category = await productsCategoriesModel.find({})
        res.status(200).send({
            success: true,
            message: 'Aqui estão todos os nossos produtos divididos em categorias',
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message:'Desculpe, não conseguimos processar todas as categorias'
        })
    }
};

//Controller to get only one category 
export const singleCategoryController = async (req, res) => {
    try {
        const category = await productsCategoriesModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success: true,
            message: 'Aqui está a categoria desejada',
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message:'Desculpe, não conseguimos processar a categoria desejada'
        })
    }
};

//Controller to DELETE a category
export const deleteCategoryController = async (req, res) => {
    try {
        const {id} = req.params
        await productsCategoriesModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: 'A categoria selecionada foi deletada',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message:'Desculpe, não conseguimos deletar a categoria'
        })
    }
};