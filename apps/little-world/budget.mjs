export function budgetReport(input){
  const lines=input.trim().split(/\n+/);
  if(!input.trim())throw Error('Enter at least one budget item.');
  let total=0;
  const currency=new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0});
  const rows=lines.map((line,index)=>{
    const parts=line.split('|').map(x=>x.trim());
    if(parts.length!==3 || !parts[0] || !/^\d+$/.test(parts[1]) || !/^\d+$/.test(parts[2]))throw Error('Line '+(index+1)+': use item | quantity | unit price in whole rupiah.');
    const count=Number(parts[1]),price=Number(parts[2]),subtotal=count*price;
    if(count<1 || !Number.isSafeInteger(count)||!Number.isSafeInteger(price)||!Number.isSafeInteger(total+subtotal))throw Error('Invalid quantity or amount on line '+(index+1));
    total+=subtotal;
    return parts[0]+': '+count+' × '+currency.format(price)+' = '+currency.format(subtotal);
  });
  return '## Byte — Cost sheet\n\n'+rows.join('\n')+'\n\nTotal: '+currency.format(total)+'\n';
}
