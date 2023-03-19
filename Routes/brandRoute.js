const express = require("express");
const { createBrandCategory, getBrandCategory, getAllBrandCategory, updateBrandCategory, deleteBrandCategory } = require("../controllers/brandController");
const { authMiddleware, isAdmin } = require("../Middlewares/authMiddleware");
const router = express.Router();

router.post("/" ,authMiddleware, isAdmin  , createBrandCategory);
router.get("/:id"   , getBrandCategory);
router.get("/"   , getAllBrandCategory);
router.put("/:id" ,authMiddleware, isAdmin  , updateBrandCategory);
router.delete("/:id" ,authMiddleware, isAdmin  ,  deleteBrandCategory);

module.exports = router;