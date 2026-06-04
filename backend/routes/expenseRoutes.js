const express =
require("express");

const router =
express.Router();

const {

addExpense,

getExpenses,

deleteExpense,

updateExpense

}

=

require(
"../controllers/expenseController"
);

router.post(
"/add",
addExpense
);

router.get(
"/list",
getExpenses
);

router.delete(
"/delete/:id",
deleteExpense
);

router.put(
"/update/:id",
updateExpense
);

module.exports=
router;