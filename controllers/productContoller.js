const Product = require("../models/productModel");
const asyncHander =  require("express-async-handler");
const slugify = require("slugify");
const User  = require("../models/userModels");

// create Product 

const createProduct  = asyncHander(async(req , res)  => {

     try{
      if(req.body.title){
        req.body.slug = slugify(req.body.title);
      }
      const newProduct  = await Product.create(req.body);
      res.json(newProduct);

     }catch(err){
        throw new Error(err);
     }
});

//get Product 

const getProduct = asyncHander(async(req , res) =>{

    const {id} = req.params;
    try{

    const product  = await Product.findById(id);
    res.json({product});

    }catch(err){
        throw new Error(err);
    }
});
// get all product 



// delete product 

const deleteProduct = asyncHander(async(req , res) =>{

    const {id} = req.params;
    try{

    const deleteproduct  = await Product.findByIdAndDelete(id);
    res.json({
        message : "Product deleted successfully"
    });

    }catch(err){
        throw new Error(err);
    }
});

// update product 

const updateProduct = asyncHander(async(req , res) =>{

    const {id} = req.params;
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
          }
    const updatedproduct  = await Product.findByIdAndUpdate(id ,req.body , 
    {
        new : true
    });
    res.json({updatedproduct});

    }catch(err){
        throw new Error(err);
    }
});

// filter products 

const getAllProduct = asyncHander(async(req , res) =>{

    try{
          
        const queryObj = {...req.query};
        const excludeFields  = ["page" , "sort","limit","fields"];
        excludeFields.forEach((elements) => delete queryObj[elements]);
        console.log(queryObj);
        let queryStr  = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g , (match) => `$${match}`);
        console.log(queryStr);

        let query = Product.find(JSON.parse(queryStr));

        // sorting 
         
        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        }else{
            query = query.sort("-createdAt");
        }
       
        //limiting the fields 

        if(req.query.fields){
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }else{
            query = query.select("-__v");
        }
        
        const products =await query;
        res.json(products);

    }catch(err){
        throw new Error(err);
    }
})

const addToWishlist = asyncHander(async(req , res) =>{

    const {id} = req.user;
    const {prodId} = req.body;

    try{

        const user  = await User.findById(id);
        const alreadyAdded = await user.wishlist?.find( (id) => id.toString() === prodId.toString() );
        if(alreadyAdded){
           
            let user  = await User.findByIdAndUpdate( id , 
                {
                    $pull : {wishlist : prodId} 
                }, 
                {new : true}
                )
                res.json(user);
        }else{

            let user  = await User.findByIdAndUpdate( id , 
                {
                    $push : {wishlist : prodId} 
                }, 
                {new : true}
                )
                res.json(user);
        }

    }catch(err){
        throw new Error(err);
    }
})

const ratings  = asyncHander(async(req , res) =>{

    const {id} = req.user;
    const {star , prodId , comment } = req.body;
    console.log(id , star , prodId);
    
    try{

       const product = await Product.findById(prodId);
       console.log(product);
       let alreadyRated  =   product.ratings.find((userId) => userId.postedby.toString() === id.toString());
       console.log(alreadyRated);
       if(alreadyRated){

        const updateRating  = await Product.updateOne(
            {
                ratings : {$elemMatch : alreadyRated}
            },
            {
                $set : {"ratings.$.star" : star , "ratings.$.comment" : comment}
            },
            {
                new : true
            }
            
            );
         
       }else{

        const rateProduct  = await Product.findByIdAndUpdate(prodId , 
           
           {
            $push : {ratings : 
                {
                   star : star,
                   comment :comment ,
                   postedby : id
                }
        }
           }
             )

           
       }

       const getallratings  = await Product.findById(prodId);
       let totalRating  = getallratings.ratings.length;
       let ratingSum = getallratings.ratings
       .map((item) => item.star)
       .reduce((prev , curr) => prev + curr , 0);
       let actualrating = Math.round(ratingSum/totalRating);
       let finalProduct  = await Product.findByIdAndUpdate(prodId,
        {
            totalrating : actualrating 
        },
        {new : true}
        );

        res.json(finalProduct);
       
    }catch(err){
        throw new Error(err);
    }
})


module.exports = {createProduct , getProduct , updateProduct , deleteProduct , getAllProduct , addToWishlist , ratings};