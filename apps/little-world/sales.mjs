const form=document.querySelector('#sale-form'),key='haammkaki.sales.v1';
const money=new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0});
const status=document.querySelector('#sale-status');
function records(){return JSON.parse(localStorage.getItem(key)||'[]');}
function render(){
  const rows=records(),list=document.querySelector('#sales-list');list.replaceChildren();
  const total=rows.filter(r=>r.stage==='Confirmed').reduce((sum,r)=>sum+BigInt(r.qty)*BigInt(r.price),0n);
  document.querySelector('#sales-total').textContent=rows.length+' records · confirmed order value '+money.format(total);
  for(const row of rows.slice().reverse()){
    const li=document.createElement('li');
    li.textContent=row.dept+' · '+row.item+' × '+row.qty+' · '+money.format(row.qty*row.price)+' · '+row.stage;
    if(row.stage==='Enquiry'){
      const button=document.createElement('button');button.textContent='Confirm order';
      button.onclick=()=>change(rows=>rows.map(r=>r.id===row.id?{...r,stage:'Confirmed'}:r));
      li.append(button);
    }
    list.append(li);
  }
  document.querySelector('#sales-export').disabled=!rows.length;
}
function change(update){
  try{localStorage.setItem(key,JSON.stringify(update(records())));render();status.textContent='Saved on this browser.';}
  catch{status.textContent='Could not save to browser storage.';}
}
form.elements.dept.onchange=()=>{form.elements.item.value=form.elements.dept.value==='Publishing'?'Berpikir di Era AI':'';form.elements.price.value='';};
form.onsubmit=e=>{
  e.preventDefault();const data=new FormData(form),qty=Number(data.get('qty')),price=Number(data.get('price')),item=data.get('item').trim();
  if(!item||!Number.isSafeInteger(qty*price)||qty<=0||price<0)return;
  const row={id:crypto.randomUUID(),time:new Date().toISOString(),dept:data.get('dept'),item,qty,price,stage:data.get('stage')};
  change(rows=>[...rows,row]);
};
document.querySelector('#sales-export').onclick=()=>{
  const quote=value=>'"'+String(value).replace(/^[\s]*[=+@-]/,"'$&").replaceAll('"','""')+'"';
  const lines=records().map(r=>[r.time,r.dept,r.item,r.qty,r.price,r.qty*r.price,r.stage].map(quote).join(','));
  const url=URL.createObjectURL(new Blob(['\uFEFFDate,Department,Item,Quantity,Unit IDR,Total IDR,Stage\r\n'+lines.join('\r\n')],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='studio-sales.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
window.addEventListener('storage',e=>{if(e.key===key)render();});
try{render();}catch{status.textContent='Browser storage unavailable.';}
