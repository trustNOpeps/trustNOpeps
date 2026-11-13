import {budgetReport} from './budget.mjs';
const form=document.querySelector('#job-form'),brief=form.elements.brief;
const status=document.querySelector('#job-status'),output=document.querySelector('#job-output');
const run=form.querySelector('[type=submit]'),stop=document.querySelector('#stop-job'),download=document.querySelector('#save-job');
const key='little-world.work.v1',names={nova:'Nova',byte:'Byte',miso:'Miso'};
export let activity=null;
let worker=null,notes='';
const mode=form.elements.mode,note=document.querySelector('#engine-note');
const aiNote=note.textContent,aiHint=brief.placeholder;
function showMode(){
  const offline=mode.value==='budget';
  note.textContent=offline?'One item per line: name | quantity | unit price (IDR). Use whole numbers without separators.':aiNote;
  brief.placeholder=offline?'Kaos sampel | 3 | 95000\nPackaging | 3 | 12000':aiHint;
  run.textContent=offline?'CALCULATE BUDGET ↗':'START LOCAL AI ↗';
}
mode.onchange=showMode;
function show(text){status.textContent=text;}
function save(){
  output.textContent=notes;
  download.disabled=!notes;
  try{localStorage.setItem(key,JSON.stringify({brief:brief.value,mode:mode.value,notes}));}catch{}
}
try{const previous=JSON.parse(localStorage.getItem(key));if(previous){brief.value=previous.brief||'';mode.value=previous.mode==='budget'?'budget':'ai';showMode();notes=previous.notes||'';output.textContent=notes;download.disabled=!notes;}}catch{}
function finish(message){
  worker?.terminate();worker=null;activity=null;mode.disabled=false;run.disabled=false;stop.disabled=true;brief.readOnly=false;show(message);save();
}
form.addEventListener('submit',event=>{
  event.preventDefault();
  if(worker || !brief.value.trim())return;
  if(notes && !confirm('Replace the previous work report? Download it first to keep a copy.'))return;
  if(mode.value==='budget'){
    try{notes=budgetReport(brief.value);finish('Byte · calculation complete');}catch(error){show(error.message);}
    return;
  }
  notes='';mode.disabled=true;run.disabled=true;stop.disabled=false;brief.readOnly=true;save();
  activity={agent:'nova',stage:'loading'};show('Preparing local AI…');
  try{
    worker=new Worker(new URL('./work-worker.mjs',import.meta.url),{type:'module'});
    worker.onerror=()=>finish('Worker stopped. Check browser memory and network, then retry.');
    worker.onmessage=({data:e})=>{
      if(e.stage==='done'){finish('Complete · report ready');return;}
      if(e.stage==='error'){finish('Stopped · '+e.detail);return;}
      activity={agent:e.agent,stage:e.stage};
      if(e.stage==='result'){
        notes+='## '+names[e.agent]+' — '+e.title+'\n\n'+e.output+'\n\n';save();
        show(names[e.agent]+' delivered '+e.title.toLowerCase());
      }else show(e.stage==='loading'?'Loading local model · '+(e.detail||'preparing files'):names[e.agent]+' · '+e.title);
    };
    worker.postMessage({brief:brief.value.trim()});
  }catch(error){finish(error.message);}
});
stop.onclick=()=>finish('Stopped · completed sections retained');
download.onclick=()=>{
  const file=new Blob(['# Office work report\n\n'+brief.value+'\n\n'+notes],{type:'text/markdown;charset=utf-8'});
  const url=URL.createObjectURL(file),link=document.createElement('a');link.href=url;link.download='office-report.md';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
export function resetWork(){finish('Ready');brief.value='';notes='';save();}
