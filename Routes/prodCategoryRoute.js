const express = require("express");
const { createProdCategory, getProdCategory, getAllProdCategory, updateProdCategory, deleteProdCategory } = require("../controllers/prodCategoryCont");
const { authMiddleware, isAdmin } = require("../Middlewares/authMiddleware");
const router = express.Router();

router.post("/" ,authMiddleware, isAdmin  , createProdCategory );
router.get("/:id"   , getProdCategory);
router.get("/"   ,getAllProdCategory);
router.put("/:id" ,authMiddleware, isAdmin  , updateProdCategory );
router.delete("/:id" ,authMiddleware, isAdmin  , deleteProdCategory );

module.exports = router;