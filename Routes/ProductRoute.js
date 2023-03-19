const express = require("express");
const { createProduct, getProduct, getAllProduct, deleteProduct, updateProduct, addToWishlist, ratings } = require("../controllers/productContoller");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../Middlewares/authMiddleware");

router.post("/createProduct" ,authMiddleware , isAdmin , createProduct);
router.get("/getProduct/:id" ,   getProduct);
router.get("/getAllProduct" ,  getAllProduct);
router.put("/deleteProduct/:id" , authMiddleware , isAdmin ,deleteProduct);
router.put("/updateProduct/:id" , authMiddleware , isAdmin ,updateProduct);
router.put("/wishlist" , authMiddleware  ,addToWishlist);
router.put("/rating" , authMiddleware  ,ratings);

module.exports = router;