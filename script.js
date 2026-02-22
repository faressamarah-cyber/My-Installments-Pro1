let customers = JSON.parse(localStorage.getItem("customers")) || [];

function save(){
localStorage.setItem("customers",JSON.stringify(customers));
}

function setTheme(primary,secondary){
document.documentElement.style.setProperty('--primary',primary);
document.documentElement.style.setProperty('--secondary',secondary);
}

function addCustomer(){

let name=document.getElementById("name").value;
let phone=document.getElementById("phone").value;
let sale=parseFloat(document.getElementById("sale").value);
let down=parseFloat(document.getElementById("down").value);
let monthly=parseFloat(document.getElementById("monthly").value);
let months=parseInt(document.getElementById("months").value);
let startDate=new Date(document.getElementById("startDate").value);

if(!name || !phone || !monthly || !months){
alert("«·—Ã«¡  ⁄»∆… Ã„Ì⁄ «·ÕﬁÊ·");
return;
}

let installments=[];

for(let i=1;i<=months;i++){
let due=new Date(startDate);
due.setMonth(due.getMonth()+i);

installments.push({
dueDate:due.toISOString().split("T")[0],
amount:monthly,
paid:false
});
}

customers.push({name,phone,sale,down,monthly,installments});
save();
render();
clearForm();
}

function clearForm(){
document.querySelectorAll("input").forEach(input=>input.value="");
}

function render(){
let table=document.getElementById("customerTable");
if(!table) return;

table.innerHTML="";

let totalPaid=0;
let totalRemaining=0;
let late=0;

customers.forEach((c,index)=>{

let remaining=0;

c.installments.forEach(i=>{
if(i.paid){
totalPaid+=i.amount;
}else{
remaining+=i.amount;
let today=new Date().toISOString().split("T")[0];
if(i.dueDate<today) late++;
}
});

totalRemaining+=remaining;

table.innerHTML+=`
<tr>
<td>${c.name}</td>
<td>${remaining}</td>
<td>
<button onclick="showDetails(${index})"> ›«’Ì·</button>
<button onclick="exportPDF(${index})">PDF</button>
<button onclick="sendWhats(${index})">Ê« ”«»</button>
</td>
</tr>
`;
});

updateStats(totalPaid,totalRemaining,late);
save();
}

function updateStats(paid,remaining,late){
if(document.getElementById("totalPaid"))
document.getElementById("totalPaid").innerText=paid;

if(document.getElementById("totalRemaining"))
document.getElementById("totalRemaining").innerText=remaining;

if(document.getElementById("lateCount"))
document.getElementById("lateCount").innerText=late;
}

function showDetails(index){
let c=customers[index];
let details="”Ã· «·œ›⁄« :\n\n";

c.installments.forEach((i,iIndex)=>{
details+=`${i.dueDate} - ${i.amount} - ${i.paid?"? „œ›Ê⁄":"€Ì— „œ›Ê⁄"}\n`;
});

alert(details);
}

function markPaid(cIndex,iIndex){
customers[cIndex].installments[iIndex].paid=true;
save();
render();
}

function sendWhats(index){
let c=customers[index];
let msg=`„—Õ»« ${c.name} ?? ‰–ﬂ—ﬂ„ »ÊÃÊœ √ﬁ”«ÿ „” Õﬁ….`;
window.open(`https://wa.me/${c.phone}?text=${encodeURIComponent(msg)}`);
}

function exportPDF(index){
const { jsPDF } = window.jspdf;
let doc=new jsPDF();
let c=customers[index];

doc.text("Installment Report",70,20);
doc.text("Name: "+c.name,20,40);
doc.text("Phone: "+c.phone,20,50);

let y=70;
c.installments.forEach(i=>{
doc.text(`${i.dueDate} | ${i.amount} | ${i.paid?"Paid":"Unpaid"}`,20,y);
y+=10;
});

doc.save("Installment_Report.pdf");
}

document.addEventListener("DOMContentLoaded",render);