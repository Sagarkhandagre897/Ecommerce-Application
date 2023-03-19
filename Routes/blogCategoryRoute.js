const express = require("express");
const { createBlogCategory, getBlogCategory, getAllBlogCategory, updateBlogCategory, deleteBlogCategory } = require("../controllers/blogCategoryCont");
const { authMiddleware, isAdmin } = require("../Middlewares/authMiddleware");
const router = express.Router();

router.post("/" ,authMiddleware, isAdmin  , createBlogCategory);
router.get("/:id"   , getBlogCategory);
router.get("/"   , getAllBlogCategory);
router.put("/:id" ,authMiddleware, isAdmin  , updateBlogCategory);
router.delete("/:id" ,authMiddleware, isAdmin  ,  deleteBlogCategory);

module.exports = router;