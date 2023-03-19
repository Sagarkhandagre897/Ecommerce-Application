const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
    return jwt.sign(
        {id}, 
        "mysecret",
        {expiresIn : "1d"}
    );
};

module.exports = {generateRefreshToken};