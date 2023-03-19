const express = require("express");
const { createUser, userLogin, getAllUsers, getUser, deleteUser, updateUser, blockUser, unBlockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetpassword, AdminLogin, getWishList, saveAddress, userCart, getUserCart, emptyCart, applyCoupen, createOrder, getOrder, updateOrderStatus } = require("../controllers/userController");
const { authMiddleware, isAdmin } = require("../Middlewares/authMiddleware");
const router = express.Router();

router.post("/register" , createUser);
router.post("/login" , userLogin);
router.post("/addCart" , authMiddleware, userCart);
router.post("/cart/cash-order" , authMiddleware, createOrder);
router.get("/cart/get-cash-order" , authMiddleware, getOrder);
router.put("/cart/update-cash-order/:id" , authMiddleware, isAdmin ,  updateOrderStatus);
router.get("/getcart" , authMiddleware, getUserCart);
router.post("/cart/applycoupon" , authMiddleware , applyCoupen);
router.delete("/empty" , authMiddleware , emptyCart);
router.post("/loginAdmin" , AdminLogin);
router.get("/getAllUsers" , getAllUsers);
router.get("/getUser/:id" , authMiddleware, isAdmin, getUser);
router.delete("/deleteUser/:id",authMiddleware, isAdmin, deleteUser);
router.put("/updateUser/:id" ,authMiddleware, isAdmin, updateUser);
router.put("/block-user/:id",authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id" ,authMiddleware, isAdmin, unBlockUser);
router.get("/refresh" , handleRefreshToken);
router.get("/wishlist" , authMiddleware, isAdmin, getWishList);
router.put("/save-address" , authMiddleware, isAdmin, saveAddress);
router.get("/logout" , logout);
router.put("/updatePassword/:id", authMiddleware , updatePassword);
router.post("/forgot-password-token" , forgotPasswordToken);
router.put("/resetpassword/:token" , resetpassword);
module.exports = router;

