const Blog = require("../models/blogModel");
const validateId = require("../utils/validateMongodbId");
const asyncHandler = require("express-async-handler");

const createBlog = asyncHandler(async(req , res) => {

    try{
     
      const blog = await Blog.create(req.body);
      res.json(blog);
    }catch(err){
        throw new Error(err);
    }
})
const getBlog = asyncHandler(async(req , res) => {

    const {id} = req.params;
    validateId(id);
    try{

      const getblog = await Blog.findById(id).populate('likes').populate('dislikes');
      const updateViews = await Blog.findByIdAndUpdate(id , {
           $inc : {numViews : 1}
      } ,
      {new : true}
      )
      res.json(getblog);
    }catch(err){
        throw new Error(err);
    }
})

const getAllBlog = asyncHandler(async(req , res) => {


    try{

      const blogs = await Blog.find();
      res.json(blogs);
    }catch(err){
        throw new Error(err);
    }
})

const updateBlog  = asyncHandler(async(req ,res) =>{

    const {id} = req.params;
    validateId(id);
    try{

       const updatedBlog= await Blog.findByIdAndUpdate( id  , req.body , {new : true});
       res.json(updatedBlog);
    }catch(err){
        throw new Error(err);
    }

})

const deleteBlog  = asyncHandler(async(req ,res) =>{

    const {id} = req.params;
    validateId(id);
    try{

       const deleteBlog= await Blog.findByIdAndDelete(id);
       res.json({
        message : "deleted successfully"
       });

    }catch(err){
        throw new Error(err);
    }

})

const likeTheBlog = asyncHandler(async(req , res) =>{

    const {blogId} = req.body;

    const blog  = await Blog.findById(blogId);
    console.log(blog);
    //find the login user 
    const loginUserId  = req?.user?.id;
    //check if the user has liked the blog
    const isLiked  = blog?.isLiked;
    //check if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find( 
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    
    if(alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId , {
            $pull : {dislikes : loginUserId},
            isDisliked : false
        },
        {new : true}
        )
    }
    if(isLiked){
        const blog = await Blog.findByIdAndUpdate(blogId , {
            $pull : {likes : loginUserId},
            isLiked : false
        },
        {new : true}
        );

        res.json(blog);
    }else{

        const blog = await Blog.findByIdAndUpdate(blogId , {
            $push : {likes : loginUserId},
            isLiked : true
        },
        {new : true}
        );

        res.json(blog);
    }

})

const dislikeTheBlog = asyncHandler(async(req , res) =>{

    const {blogId} = req.body;

    const blog  = await Blog.findById(blogId);

    //find the login user 
    const loginUserId  = req?.user?.id;
    //check id the user has liked the blog
    const isDisLiked  = blog?.isDisLiked;
    //check id the user has disliked the blog
    const alreadyliked = blog?.likes?.find( 
        (userId) =>  userId?.toString() === loginUserId?.toString()
    );

    if(alreadyliked){
        const blog = await Blog.findByIdAndUpdate(blogId , {
            $pull : {likes : loginUserId},
            isLiked : false
        },
        {new : true}
        )
    }
    if(isDisLiked){
        const blog = await Blog.findByIdAndUpdate(blogId , {
            $pull : {dislikes : loginUserId},
            isDisLiked : false
        },
        {new : true}
        );

        res.json(blog);
    }else{

        const blog = await Blog.findByIdAndUpdate(blogId , {
            $push : {dislikes : loginUserId},
            isDisLiked : true
        },
        {new : true}
        );
        
        res.json(blog);
    }

})

module.exports = {createBlog , getAllBlog , getBlog , updateBlog , deleteBlog , likeTheBlog , dislikeTheBlog};