const BlogCategory = require("../models/blogCategoryModels");
const asyncHandler  = require("express-async-handler");
const validateId = require("../utils/validateMongodbId");


// create prod category 

const createBlogCategory = asyncHandler(async(req , res) =>{
    try{

        const blogCategory = await BlogCategory.create(req.body);
        res.json(blogCategory);

    }catch(err){
        throw new Error(err);
    }
    
})

const getBlogCategory = asyncHandler(async(req , res) =>{
    
    const {id} = req.params;
    validateId(id);
    try{

        const blogCategory = await BlogCategory.findById(id);
        res.json(blogCategory);

    }catch(err){
        throw new Error(err);
    }
    
})

const getAllBlogCategory = asyncHandler(async(req , res) =>{
    try{

        const blogCategory = await BlogCategory.find();
        res.json(blogCategory);

    }catch(err){
        throw new Error(err);
    }
    
})

const  updateBlogCategory = asyncHandler(async(req , res) =>{
    
    const {id} = req.params;
    validateId(id);
    try{

        const blogCategory = await BlogCategory.findByIdAndUpdate(id , req.body , {new : true});
        res.json(blogCategory);

    }catch(err){
        throw new Error(err);
    }
    
})

const  deleteBlogCategory = asyncHandler(async(req , res) =>{
    
    const {id} = req.params;
    validateId(id);
    try{

        const blogCategory = await BlogCategory.findByIdAndDelete(id);
        res.json({
            message : " deleted successfully "
        });

    }catch(err){
        throw new Error(err);
    }
    
})


module.exports = {getAllBlogCategory , getBlogCategory , updateBlogCategory , deleteBlogCategory , createBlogCategory};