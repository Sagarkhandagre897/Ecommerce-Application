const Coupen = require("../models/coupenModel");
const asyncHandler  = require("express-async-handler");
const validateId = require("../utils/validateMongodbId");


// create coupen 

const createCoupen = asyncHandler(async(req, res) =>{

    try{

       const  coupen = await Coupen.create(req.body);
       res.json(coupen);

    }catch(err){
        throw new Error(err);
    }
    
}) 

const getCoupen = asyncHandler(async(req, res) =>{

    const {id} = req.params;
    validateId(id);

    try{

       const  coupen = await Coupen.findById(id);
       res.json(coupen);
       
    }catch(err){
        throw new Error(err);
    }
    
}) 
const getAllCoupen = asyncHandler(async(req, res) =>{

    try{

       const  coupen = await Coupen.find();
       res.json(coupen);
       
    }catch(err){
        throw new Error(err);
    }
    
}) 

const updateCoupen = asyncHandler(async(req, res) =>{

    const {id} = req.params;
    validateId(id);

    try{

       const  coupen = await Coupen.findByIdAndUpdate(id , req.body);
       res.json(coupen);
       
    }catch(err){
        throw new Error(err);
    }
    
}) 

const deleteCoupen = asyncHandler(async(req, res) =>{

    const {id} = req.params;
    validateId(id);

    try{

       const  coupen = await Coupen.findByIdAndDelete(id);
       res.json({
        message : "coupen deleted successfully"
       });
       
    }catch(err){
        throw new Error(err);
    }
    
}) 
module.exports ={createCoupen , getAllCoupen , getCoupen , updateCoupen , deleteCoupen};
 