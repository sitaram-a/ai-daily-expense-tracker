function AIInsights({ expenses }) {

const total =
expenses.reduce(
(sum,item)=>
sum + Number(item.amount),
0
);

const categories = {};

expenses.forEach((item)=>{

const key =
item.category
.trim()
.toLowerCase();

categories[key] =
(
categories[key]
||
0
)
+
Number(item.amount);

});

const food =
categories["food"] || 0;

const travel =
categories["travel"] || 0;

let message = "";

if(total===0){

message =
"Add expenses to receive AI insights.";

}

else{

if(food >= total*0.30){

message +=
"🍔 Food spending is high. ";

}

if(travel >= total*0.40){

message +=
"🚗 Travel spending is high. ";

}

if(total>10000){

message +=
"💰 Total spending crossed ₹10000. ";

}

if(message===""){

message=
"✅ Spending looks balanced.";

}

}

return(

<div className="card">

<h2>

AI Insights

</h2>

<p>

{message}

</p>

</div>

);

}

export default AIInsights;