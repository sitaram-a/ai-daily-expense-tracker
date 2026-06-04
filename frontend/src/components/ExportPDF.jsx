import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ExportPDF({

expenses

}){

const download=()=>{

const doc=
new jsPDF();

doc.setFontSize(
20
);

doc.text(

"Expense Report",

20,

20

);

const rows=

expenses.map(

(item)=>([

item.title,

item.amount,

item.category

])

);

autoTable(

doc,

{

head:[

[

"Title",

"Amount",

"Category"

]

],

body:rows,

startY:40

}

);

doc.save(

"Expense_Report.pdf"

);

};

return(

<button

onClick=
{download}

>

Export PDF

</button>

);

}

export default ExportPDF;