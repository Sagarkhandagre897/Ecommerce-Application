const bodyParser = require("body-parser");
const express = require("express");
const app =express();
const dbConn = require("./config/dbConn");
const { notFound, errorHandler } = require("./Middlewares/userhandler");
const dotenv  = require("dotenv").config();
const PORT  = process.env.PORT || 4000;
dbConn();
const morgan  = require("morgan");

const authRouter = require("./Routes/authRoute");
const productRouter = require("./Routes/ProductRoute");
const blogRouter = require("./Routes/blogRoute");
const prodCategoryRouter = require("./Routes/prodCategoryRoute");
const blogCategoryRouter = require("./Routes/blogCategoryRoute");
const brandCategoryRouter = require("./Routes/brandRoute");
const coupenRouter = require("./Routes/coupenRoute");

const cookieParser  = require("cookie-parser");

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser());

app.use("/api/user" , authRouter);
app.use("/api/product" , productRouter);
app.use("/api/blog" , blogRouter);
app.use("/api/prodCategory" , prodCategoryRouter);
app.use("/api/blogCategory" , blogCategoryRouter);
app.use("/api/brandCategory" , brandCategoryRouter);
app.use("/api/coupon" , coupenRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT , ()=>{
    console.log(`server is listening on port ${PORT}`);
})
