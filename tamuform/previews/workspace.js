const status=document.querySelector('#preview-status');
const cards=[...document.querySelectorAll('.lead-card')];
const filter=document.querySelector('#preview-filter');
function applyFilter(){
  const query=filter.elements.q.value.trim().toLowerCase();
  const stage=filter.elements.status.value;
  let visible=0;
  for(const card of cards){
    const match=card.querySelector('.lead-head').textContent.toLowerCase().includes(query)&&(!stage||card.querySelector('.lead-update select').value===stage);
    card.hidden=!match;if(match)visible++;
  }
  status.textContent=visible+' example inquiries shown.';
}
filter.addEventListener('submit',event=>{event.preventDefault();applyFilter();});
for(const card of cards){
  card.querySelector('.lead-update').addEventListener('submit',event=>{
    event.preventDefault();
    const stage=event.currentTarget.elements.status.value;
    const badge=card.querySelector('.stage');badge.textContent=stage;badge.className='stage stage-'+stage;
    const stages=cards.map(item=>item.querySelector('.lead-update select').value);
    const counts=[cards.length,stages.filter(s=>s==='new').length,stages.filter(s=>['contacted','qualified','proposal'].includes(s)).length,stages.filter(s=>s==='won').length];
    document.querySelectorAll('.metric-grid strong').forEach((el,i)=>el.textContent=counts[i]);
    applyFilter();status.textContent='Example updated in this tab. Reload to reset.';
  });
}
document.querySelector('#export-example').addEventListener('click',()=>{
  const quote=value=>'"'+String(value).replace(/^[\s]*[=+@-]/,"'$&").replaceAll('"','""')+'"';
  const rows=cards.map(card=>[card.querySelector('h2').textContent,card.querySelector('.lead-update select').value,card.querySelector('[name=followup_date]').value,card.querySelector('[name=notes]').value].map(quote).join(','));
  const url=URL.createObjectURL(new Blob(['Property,Stage,Follow-up,Notes\r\n'+rows.join('\r\n')],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='tamuform-fictional-examples.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  status.textContent='Exported fictional example records.';
});
