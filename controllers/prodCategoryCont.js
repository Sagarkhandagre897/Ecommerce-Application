const ProdCategory = require("../models/prodCategoryModels");
const asyncHandler  = require("express-async-handler");
const validateId = require("../utils/validateMongodbId");


// create prod category 

const createProdCategory = asyncHandler(async(req , res) =>{
    try{

        const prodCategory = await ProdCategory.create(req.body);
        res.json(prodCategory);

    }catch(err){
        throw new Error(err);
    }
    
})

const getProdCategory = asyncHandler(async(req , res) =>{

    const {id} = req.params;
    validateId(id);
    try{

        const prodCategory = await ProdCategory.findById(id);
        res.json(prodCategory);
        
    }catch(err){
        throw new Error(err);
    }
    
})

const getAllProdCategory = asyncHandler(async(req , res) =>{

   
    try{

        const prodCategory = await ProdCategory.find();
        res.json(prodCategory);
        
    }catch(err){
        throw new Error(err);
    }
    
})

const updateProdCategory = asyncHandler(async(req , res) =>{

    const {id} = req.params;
    validateId(id);
    try{

        const prodCategory = await ProdCategory.findByIdAndUpdate(id , req.body);
        res.json(prodCategory);
        
    }catch(err){
        throw new Error(err);
    }
    
})

const deleteProdCategory = asyncHandler(async(req , res) =>{

    const {id} = req.params;
    validateId(id);
    try{

        const prodCategory = await ProdCategory.findByIdAndDelete(id);
        res.json({
            message : " deleted successfully"
        });
        
    }catch(err){
        throw new Error(err);
    }
    
})

module.exports = {getAllProdCategory , getProdCategory , updateProdCategory , createProdCategory , deleteProdCategory}


