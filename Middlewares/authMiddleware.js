const User = require("../models/userModels");
const jwt  = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware  = asyncHandler(async(req , res , next) => {

    let token ;
    if(req?.headers?.authorization?.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];

        try{
            if(token){
                const decoded = jwt.verify(token , "mysecret");
                const user  = await User.findById(decoded?.id)
                req.user  = user;
                next();
            }
        }catch(err){
            throw new Error("Not Authorized token expired , login again");
        }
    }else{
        throw new Error("there is no token attached to header");
    }
});

const isAdmin  = asyncHandler(async(req , res , next) => {

    const {email} = req.user;
    const userAdmin  = await User.findOne({email});
    if(userAdmin?.role !== "admin"){
        throw new Error("You are not an admin")
    }else{
        next();
    }
})

module.exports  = {authMiddleware , isAdmin};