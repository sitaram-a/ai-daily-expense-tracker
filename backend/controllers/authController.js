const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


// REGISTER
const register = async (req, res) => {

try {

const {
name,
email,
password
} = req.body;


// Validation
if(
!name ||
!email ||
!password
){

return res
.status(400)
.json({
message:
"All fields are required"
});

}


// Check user
const userExists =
await User.findOne({
email
});

if(userExists){

return res
.status(400)
.json({
message:
"User already exists"
});

}


// Encrypt
const hash =
await bcrypt.hash(
password,
10
);


// Save
const user =
await User.create({

name,

email,

password: hash

});

return res.status(201).json({

message:
"Registration Success",

user:{

id:
user._id,

name:
user.name,

email:
user.email

}

});

}

catch(err){

console.log(
"REGISTER ERROR:",
err
);

return res
.status(500)
.json({

message:
"Server Error"

});

}

};



// LOGIN
const login =
async (

req,
res

)=>{

try{

console.log(
"LOGIN BODY:",
req.body
);

const {
email,
password
}
=
req.body;


// Validation
if(
!email ||
!password
){

return res
.status(400)
.json({

message:
"Email and password required"

});

}


const user =
await User.findOne({
email
});

if(!user){

return res
.status(400)
.json({

message:
"User not found"

});

}


// Compare
const match =
await bcrypt.compare(
password,
user.password
);

if(!match){

return res
.status(400)
.json({

message:
"Wrong Password"

});

}


// Generate Token
const token =
jwt.sign(

{
id:user._id
},

process.env.JWT_SECRET,

{
expiresIn:"7d"
}

);


// Success
return res.json({

message:
"Login Success",

token,

user:{

id:
user._id,

name:
user.name,

email:
user.email

}

});

}

catch(err){

console.log(
"LOGIN ERROR:",
err
);

return res
.status(500)
.json({

message:
"Server Error"

});

}

};



module.exports = {

register,

login

};