const { default: mongoose } = require("mongoose");

const dbConn = async() =>{

    try{
        const conn = await mongoose.connect("mongodb://localhost:27017/EcommerceDB");
        console.log("Database connected successfully");
    }catch(err){
        console.log("Database Error"+err);
    }
};

module.exports = dbConn;