const express =
require("express");

const router =
express.Router();

const {
register,
login
}
=
require(
"../controllers/authController"
);

router.post(
"/register",
register
);

router.post(
"/login",
login
);

router.post("/test",(req,res)=>{

console.log(req.body);

res.json({
success:true,
data:req.body
});

});

module.exports =
router;