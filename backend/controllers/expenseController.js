const Expense =
require("../models/Expense");


// ADD
const addExpense =
async(

req,
res

)=>{

try{

const expense=

await Expense.create(

req.body

);

res.json({

message:
"Expense Added",

expense

});

}

catch(err){

res.status(500).json({

message:
err.message

});

}

};


// GET
const getExpenses =
async(

req,
res

)=>{

try{

const expenses=

await Expense.find()

.sort({

createdAt:-1

});

res.json(

expenses

);

}

catch(err){

res.status(500).json({

message:
err.message

});

}

};

const deleteExpense =
async(

req,
res

)=>{

try{

await Expense.findByIdAndDelete(

req.params.id

);

res.json({

message:
"Expense Deleted"

});

}

catch(err){

res.status(500).json({

message:
err.message

});

}

};

const updateExpense =
async(

req,
res

)=>{

try{

const expense=

await Expense.findByIdAndUpdate(

req.params.id,

req.body,

{

new:true

}

);

res.json({

message:
"Expense Updated",

expense

});

}

catch(err){

res
.status(500)
.json({

message:
err.message

});

}

};

module.exports={

addExpense,

getExpenses,

deleteExpense,

updateExpense

};