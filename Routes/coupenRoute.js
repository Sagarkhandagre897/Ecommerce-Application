const express = require("express");
const { createCoupen, getCoupen, getAllCoupen, updateCoupen, deleteCoupen } = require("../controllers/coupenController");
const { authMiddleware, isAdmin } = require("../Middlewares/authMiddleware");
const router = express.Router();

router.post("/" , authMiddleware , isAdmin , createCoupen);
router.get("/:id" ,  authMiddleware , isAdmin ,getCoupen);
router.get("/" ,  authMiddleware , isAdmin ,getAllCoupen);
router.put("/:id" , authMiddleware , isAdmin , updateCoupen);
router.delete("/:id" , authMiddleware , isAdmin , deleteCoupen);

module.exports = router;