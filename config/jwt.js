const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign(
        {id}, 
        "mysecret",
        {expiresIn : "1d"}
    );
};

module.exports = {generateToken};