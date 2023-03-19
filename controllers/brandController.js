const BrandCategory = require("../models/brandModel");
const asyncHandler  = require("express-async-handler");
const validateId = require("../utils/validateMongodbId");


// create brand category 

const createBrandCategory = asyncHandler(async(req , res) =>{
    try{

        const brandCategory = await BrandCategory.create(req.body);
        res.json(brandCategory);

    }catch(err){
        throw new Error(err);
    }
    
})

const getBrandCategory = asyncHandler(async(req , res) =>{
    
    const {id} = req.params;
    validateId(id);
    try{

        const brandCategory = await BrandCategory.findById(id);
        res.json(brandCategory);

    }catch(err){
        throw new Error(err);
    }
    
})

const getAllBrandCategory = asyncHandler(async(req , res) =>{
    try{

        const brandCategory = await BrandCategory.find();
        res.json(brandCategory);

    }catch(err){
        throw new Error(err);
    }
    
})

const  updateBrandCategory = asyncHandler(async(req , res) =>{
    
    const {id} = req.params;
    validateId(id);
    try{

        const brandCategory = await BrandCategory.findByIdAndUpdate(id , req.body , {new : true});
        res.json(brandCategory);

    }catch(err){
        throw new Error(err);
    }
    
})

const  deleteBrandCategory = asyncHandler(async(req , res) =>{
    
    const {id} = req.params;
    validateId(id);
    try{

        const brandCategory = await BrandCategory.findByIdAndDelete(id);
        res.json({
            message : " deleted successfully "
        });

    }catch(err){
        throw new Error(err);
    }
    
})


module.exports = {getAllBrandCategory , getBrandCategory , updateBrandCategory , deleteBrandCategory , createBrandCategory};