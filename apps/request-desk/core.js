(function(root){
'use strict';
function validateItem(item){
 const name=String(item.name??'').trim(),unit=String(item.unit??'').trim(),specification=String(item.specification??'').trim(),quantity=Number(item.quantity);
 if(!name||name.length>120)throw Error('Nama barang wajib diisi, maksimal 120 karakter.');
 if(!Number.isFinite(quantity)||quantity<=0||quantity>1000000)throw Error('Jumlah harus lebih dari 0 dan maksimal 1.000.000.');
 if(!unit||unit.length>30)throw Error('Satuan wajib diisi, maksimal 30 karakter.');
 if(specification.length>1000)throw Error('Spesifikasi maksimal 1.000 karakter.');
 return {name,quantity,unit,specification};
}
function cell(v){let s=String(v);if(/^[\s]*[=+@-]/.test(s)||/^[\t\r\n]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
function toCSV(items){return '\uFEFF'+[['Nama barang','Jumlah','Satuan','Spesifikasi'],...items.map(validateItem).map(i=>[i.name,i.quantity,i.unit,i.specification])].map(r=>r.map(cell).join(',')).join('\r\n');}
function summary(items){return {lines:items.length,units:new Set(items.map(i=>i.unit.toLowerCase())).size};}
const api={validateItem,toCSV,summary};if(typeof module==='object')module.exports=api;else root.RequestDesk=api;
})(globalThis);
