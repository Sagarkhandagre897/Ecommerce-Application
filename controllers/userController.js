const User = require("../models/userModels");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Coupon  = require("../models/coupenModel");
const Cart   = require("../models/cartModel")
const asyncHandler  = require("express-async-handler");
const { generateToken } = require("../config/jwt");
const validateId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt  = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("./emailcontroller");
const uniqid = require("uniqid");

const createUser = asyncHandler(async(req , res)=>{
    const email = req.body.email;
    const findUser  =await User.findOne(
        {email: email}
        );
  if(!findUser){
        //create new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    }else{
       throw new Error("User Already Exist");
    }
});
// login user
const userLogin = asyncHandler( async (req , res) =>{

    const {email , password } = req.body;
    console.log(email , password);

    const findUser  = await User.findOne({email : email});
    if(findUser &&   (await findUser.isPasswordMatched(password))  ){
       
        const refreshToken = await generateRefreshToken(findUser?.id);
        const updateuser  = await User.findByIdAndUpdate(findUser?.id , {
            refreshToken : refreshToken
        },{
            new : true
        }
        );
        res.cookie("refreshToken" , refreshToken , {
            httpOnly: true,
            maxAge : 24 * 60*60 *1000

        })
        res.json({
           Firstname :findUser?.Firstname,
           Lastname : findUser?.Lastname,
           email : findUser?.email,
           mobile : findUser?.mobile,
           token : generateToken(findUser?.id)
        });

    }else{
        throw new Error("Invalid Credentials");
    }
});

// login admin

const AdminLogin = asyncHandler( async (req , res) =>{

    const {email , password } = req.body;
    console.log(email , password);

    const findAdmin  = await User.findOne({email : email});
    if(findAdmin.role != "admin")throw new Error("User is not an Admin");
    if(findAdmin &&   (await findAdmin.isPasswordMatched(password))  ){
       
        const refreshToken = await generateRefreshToken(findAdmin?.id);
        const updateuser  = await User.findByIdAndUpdate(findAdmin?.id , {
            refreshToken : refreshToken
        },{
            new : true
        }
        );
        res.cookie("refreshToken" , refreshToken , {
            httpOnly: true,
            maxAge : 24 * 60*60 *1000

        })
        res.json({
           Firstname :findAdmin?.Firstname,
           Lastname : findAdmin?.Lastname,
           email : findAdmin?.email,
           mobile : findAdmin?.mobile,
           token : generateToken(findAdmin?.id)
        });

    }else{
        throw new Error("Invalid Credentials");
    }
});

// handler refresh token 

const handleRefreshToken = asyncHandler(async(req , res) => {

 const cookie  = req.cookies;
 if(!cookie?.refreshToken)throw new Error("No Refresh Token in Cookies");
 const refreshToken  = cookie.refreshToken;
 const user  = await User.findOne({refreshToken});
 if(!user)throw new Error("No user is present");
     jwt.verify(refreshToken , "mysecret" , (err , decoded)=>{
    if(err || user.id !== decoded.id){
        throw new Error("There is something wrong with refresh token");
    }
    const accessToken  = generateToken(user?.id);
    res.json({accessToken});
 })
})


// logout handler

const logout = asyncHandler(async(req , res) =>{

    const cookie  = req.cookies;
 if(!cookie?.refreshToken)throw new Error("No Refresh Token in Cookies");
 const refreshToken  = cookie.refreshToken;
 const user  = await User.findOne({refreshToken});
 if(!user){
    res.clearCookie("refreshToken" , {
        httpOnly: true,
        secure : true
    })
    return res.sendStatus(204);
 }

 await User.findOneAndUpdate(refreshToken , {
    refreshToken : ""
 });

 res.clearCookie("refreshToken" , {
    httpOnly: true,
    secure : true
})

res.sendStatus(204);
})

// get all users

const getAllUsers = asyncHandler(async(req , res ) =>{

    try{
        const findUsers = await  User.find();
        res.json(findUsers);
    }catch(err){
        throw new Error(err);
    }
    
});

// get single user

const getUser = asyncHandler( async(req , res)=>{

    const {id} = req.params; 
    validateId(id);

    try{
        const user  = await User.findById(id)
        res.json({
            user
        });
    }catch(err){
        throw new Error(err);
    }
}

);

// delete user 

const deleteUser  = asyncHandler(async(req , res ) => {

    const {id} = req.params;
    validateId(id);
    try{
        const deleteUser  = await User.findByIdAndDelete(id);
        res.json({deleteUser});
    }catch(err){
      throw new Error(err);
    }
    
});

// update user

const updateUser  = asyncHandler(async(req , res ) => {

    const {id} = req.params;
    validateId(id);
    
    try{

        const  updatedUser =  await User.findByIdAndUpdate(id ,
         {
          Firstname : req?.body?.Firstname,
          Lastname : req?.body?.Lastname,
          email : req?.body?.email,
          mobile : req?.body?.mobile, 
         }, 
         {new : true}
        );
        res.json(updatedUser);
    }catch(err){
        throw new Error(err);
    }
 })

 const blockUser  = asyncHandler(async(req ,res ) => {

    const {id} = req.params;
    validateId(id);
    try{
        const blockedUser  = await User.findByIdAndUpdate(id , {
            isBlocked : true
        } , {
            new : true
        });
        res.json({
            message : "User Blocked"
        });
    }catch(err){
        throw new Error(err);
    }
 })

 const unBlockUser  = asyncHandler(async(req ,res ) => {

    const {id} = req.params;
    validateId(id);
    try{
        const unBlockedUser  = await User.findByIdAndUpdate(id , {
            isBlocked : false
        } , {
            new : true
        });
        res.json({
            message : " User unBlocked"
        });
    }catch(err){
        throw new Error(err);
    }
 })


 const updatePassword  = asyncHandler(async(req , res) =>{

    const {id} = req.user;
    const {password} = req.body;
    console.log(id , password);
    validateId(id);
    const user  = await User.findById(id);
    console.log(user);
    if(password){
        user.password = password;
        const updatedPassword  = await user.save();
        res.json(updatedPassword);
    }else{
        res.json(user);
    } 

 })

 const forgotPasswordToken = asyncHandler(async(req , res) =>{

        const {email } = req.body;
        console.log(email);
        const user  = await User.findOne({email});
        if(!user)throw new Error("User not found with this email id");
        try{
            const token = await user.createPasswordResetToken();
            await user.save();
            const resetURL =  ` Hi , Please follow this link to reset your password , This link is valid till 10 minutes from now . <a href = 'http://localhost:4000/api/user/reset-password/${token}'> Click Here</> `;   
            const data ={
                to : email,
                text : "hey user ",
                subject : "Forgot password link",
                html : resetURL
            };

            sendEmail(data);
            res.json(token);

        }catch(err){
            throw new Error(err);
        }
 });

 const resetpassword = asyncHandler(async(req , res) =>{

    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user  = await User.findOne({
        passwordResetToken : hashedToken,
        passwordResetExpires : {$gt : Date.now()}
    });
    if(!user)throw new Error("Token Expired , Please Try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires =undefined;
    await user.save();
    res.json(user);
 })


 const getWishList = asyncHandler(async(req , res) =>{

    const {id} = req.user;
    try{

        const findUser  = await User.findById(id).populate('wishlist');
        res.json(findUser);

    }catch(err){
        throw new Error(err);
    }
 })

 const saveAddress  = asyncHandler(async(req , res) =>{

    const {id} = req.user;
    validateId(id);
    
    try{

        const  updatedUser =  await User.findByIdAndUpdate(id ,
         {
          address : req?.body?.address, 
         }, 
         {new : true}
        );
        res.json(updatedUser);
    }catch(err){
        throw new Error(err);
    }

 })

 const userCart = asyncHandler(async(req , res) =>{

      const {cart} = req.body;
      const {id} = req.user;
      validateId(id);
      try{
        let products = [];
        const user = await User.findById(id);
        const alreadyExistCart = await Cart.findOne({orderBy : user.id});
       if(alreadyExistCart){
        alreadyExistCart.remove();
       }

       for(let i =0; i<cart.length; i++){
         let object = {};
         object.product  = cart[i].id;
         object.count = cart[i].count;
         object.color = cart[i].color;
         let getPrice  = await Product.findById(cart[i].id).select("price").exec();
         object.price  = getPrice.price;
         products.push(object);
       }
     
     
        let cartTotal = 0;
        
        for(let  i =0; i<products.length; i++){
            cartTotal = cartTotal + products[i].price * products[i].count;
        }
       
        const newCart = await new Cart({
           products,
           cartTotal,
           orderBy : user?.id
        }).save();

        res.json(newCart);

      }catch(err){
        throw new Error(err);
      }
 })

 const getUserCart  =  asyncHandler(async(req , res) =>{

    const {id} = req.user;
    validateId(id);

try{

   const cart = await Cart.findOne({orderBy: id});
   res.json(cart);

}catch(err){
    throw new Error(err);
}

 })

 const emptyCart = asyncHandler(async(req , res) =>{

    const {id} = req.user;
    validateId(id);
    try{

        const user  = await User.findById(id);
        const cart  = await Cart.findOneAndRemove({orderBy : user?.id});
        console.log(cart);
        res.json({
            message : "Cart is empty now"
        })

    }catch(err){
        throw new Error(err);
    }
 });

 const applyCoupen  = asyncHandler(async(req , res) =>{

    const {coupon} = req.body;
    const {id} = req.user;
    console.log(coupon);
    validateId(id);
    const validCoupon = await Coupon.findOne({name : coupon});
    console.log(validCoupon);
    if(validCoupon === null ){
        throw new Error("Invalid Coupon ");
    }
    const user  = await User.findById(id);
    let {cartTotal} = await Cart.findOne({
        orderBy:user.id
    }).populate("products.product");

    let totalAfterDiscount = (
        cartTotal - 
        (cartTotal * validCoupon.discount) / 100).toFixed(2);

        await Cart.findOneAndUpdate({
            orderBy : user.id
        },
        {totalAfterDiscount },
        {new : true}
        
        );

        res.json(totalAfterDiscount);
 })

const createOrder = asyncHandler(async(req , res) =>{

    const {cod , couponApplied} = req.body;
    const {id} = req.user;
    validateId(id);

    try{

        if(!cod)throw new Error("Create cash order falied");
        const user  = await User.findById(id);
        let userCart = await Cart.findOne({orderBy : user.id});
        let finalAmount = 0;
        if(couponApplied && userCart.totalAfterDiscount){
            finalAmount = userCart.totalAfterDiscount;
        }else{
            finalAmount = userCart.cartTotal;
        }

      let newOrder  = await new Order({
        products: userCart.products,
        paymentIntent : {
            id : uniqid(),
            method : "COD",
            amount : finalAmount,
            status : "Cash On Delivery",
            created: Date.now(),
            currency : "Rupee"
        },
        orderBy: user.id,
        orderStatus : "Cash On Delivery"
      }).save();

      let update  =  userCart.products.map((item) =>{
        return {
            updateOne : {
                filter : {id : item.product.id},
                update : {$inc : {quantity : -item.count , sold : +item.count}}
            }
        }
      }) 

      const updated  = await Product.bulkWrite(update , {});
      res.json({
        message : "success"
      });

    }catch(err){
        throw new Error(err);
    }
})

const getOrder  = asyncHandler(async(req ,res) =>{

    const {id} = req.user;

    try{

        const orders  = await Order.findOne({orderBy : id});
        res.json(orders);

    }catch(err){
        throw new Error(err);
    }
});

const updateOrderStatus = asyncHandler(async(req , res) =>{

    const {status} = req.body;
    const {id} = req.params;
    validateId(id);
    try{

       const updatedOrder  = await Order.findByIdAndUpdate(id , 
        {
            orderStatus : status,
            paymentIntent : {
                status : status
            }
        },
        {new : true}
        );
        res.json(updatedOrder);

    }catch(err){
        throw new Error(err);
    }
})
module.exports = {updateOrderStatus ,   getOrder ,   createOrder ,   applyCoupen,   emptyCart ,  getUserCart, userCart ,  saveAddress ,   getWishList ,  AdminLogin ,  resetpassword,  forgotPasswordToken , createUser , userLogin , getAllUsers , getUser  , deleteUser , updateUser , blockUser , unBlockUser , handleRefreshToken , logout , updatePassword};