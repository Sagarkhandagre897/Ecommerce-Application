const express = require("express");
const { createBlog, getBlog, getAllBlog, updateBlog, deleteBlog, likeTheBlog, dislikeTheBlog } = require("../controllers/blogController");
const { authMiddleware, isAdmin } = require("../Middlewares/authMiddleware");
const router = express.Router();

router.post("/createBlog" ,  authMiddleware, isAdmin ,createBlog);
router.get("/getBlog/:id" ,getBlog);
router.get("/getAllBlog" , getAllBlog);
router.put("/updateBlog/:id" ,  authMiddleware, isAdmin ,updateBlog);
router.delete("/deleteBlog/:id" ,  authMiddleware, isAdmin ,deleteBlog);
router.put("/like" ,  authMiddleware, isAdmin ,likeTheBlog);
router.put("/dislike" ,  authMiddleware, isAdmin ,dislikeTheBlog);

module.exports = router;