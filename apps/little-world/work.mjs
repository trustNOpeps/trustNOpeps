import {instantReport} from './reports.mjs';
const form=document.querySelector('#job-form'),brief=form.elements.brief,mode=form.elements.mode;
const status=document.querySelector('#job-status'),output=document.querySelector('#job-output');
const run=form.querySelector('[type=submit]'),stop=document.querySelector('#stop-job'),download=document.querySelector('#save-job');
const note=document.querySelector('#engine-note'),key='little-world.work.v1';
const names={nova:'Nova',byte:'Byte',miso:'Miso'};
export let activity=null;
let worker=null,notes='',busy=false,watchdog,deadline,reportBrief='';
function showMode(){
 const ai=mode.value==='ai',budget=mode.value==='budget';
 note.textContent=ai?'Experimental local AI: first use may download about 786 MB. Requires a capable device and network access. Stops after 45 seconds without progress or 4 minutes overall. Instant modes remain available.':budget?'One item per line: name | quantity | unit price in whole rupiah, without separators.':'Runs immediately on this device using editable templates. No model download; this is not AI generation.';
 brief.placeholder=budget?'Kaos sampel | 3 | 95000\nPackaging | 3 | 12000':'Describe the project, audience, required output and constraints. Untuk hasil AI bebas, pilih Local AI.';
 run.textContent=ai?'START OPTIONAL LOCAL AI ↗':budget?'CALCULATE BUDGET ↗':'CREATE REPORT ↗';
}
mode.addEventListener('change',showMode);
function save(){output.textContent=notes;download.disabled=!notes;try{localStorage.setItem(key,JSON.stringify({brief:brief.value,mode:mode.value,notes,reportBrief}));}catch{}}
function finish(message){clearTimeout(watchdog);clearTimeout(deadline);worker?.terminate();worker=null;busy=false;activity=null;mode.disabled=false;run.disabled=false;stop.disabled=true;brief.readOnly=false;status.textContent=message;save();}
function armWatchdog(){clearTimeout(watchdog);watchdog=setTimeout(()=>finish('No progress for 45 seconds. Local AI stopped. Try an instant report or retry on a stronger device. Existing report retained.'),45000);}
try{const old=JSON.parse(localStorage.getItem(key));if(old){brief.value=old.brief||'';notes=old.notes||'';reportBrief=old.reportBrief||old.brief||'';mode.value=['brief','captions','budget'].includes(old.mode)?old.mode:'brief';save();}}catch{}
showMode();
form.addEventListener('submit',event=>{
 event.preventDefault();if(busy||!brief.value.trim())return;
 if(mode.value!=='ai'){
  try{const result=instantReport(mode.value,brief.value);notes=result;reportBrief=brief.value;finish('Complete. Report ready to read and download.');}catch(error){finish(error.message);}
  return;
 }
 if(!window.Worker){finish('This browser does not support local AI workers. Choose an instant report.');return;}
 busy=true;mode.disabled=true;run.disabled=true;stop.disabled=false;brief.readOnly=true;
 activity={agent:'nova',stage:'loading'};status.textContent='Loading local AI. Your previous report remains available until new output arrives.';
 let newNotes='';
 try{
  worker=new Worker(new URL('./work-worker.mjs',import.meta.url),{type:'module'});
  armWatchdog();deadline=setTimeout(()=>finish('Four-minute limit reached. Local AI stopped; completed output is available below. Use an instant mode for immediate results.'),240000);
  worker.onerror=()=>finish('Local AI could not run. The model host, memory or browser may be unavailable. Choose an instant report; existing output is retained.');
  worker.onmessage=({data:e})=>{
   if(e.stage==='done'){finish(newNotes?'Complete. AI draft ready; review before use.':'Model returned no text. Try an instant report.');return;}
   if(e.stage==='error'){finish('Local AI stopped: '+e.detail+'. Try an instant report.');return;}
   armWatchdog();activity={agent:e.agent,stage:e.stage};
   if(e.stage==='result'){newNotes+='## '+(names[e.agent]||'Crew')+' · '+e.title+'\n\n'+e.output+'\n\n';notes=newNotes;reportBrief=brief.value;save();status.textContent='Draft section received. You can download completed sections now.';}
   else status.textContent=e.stage==='loading'?'Loading local model: '+(e.detail||'connecting to model files'):(names[e.agent]||'Crew')+' is drafting. You can stop at any time.';
  };
  worker.postMessage({brief:brief.value.trim()});
 }catch(error){finish('Could not start Local AI: '+error.message);}
});
stop.onclick=()=>finish('Stopped. Existing or completed report remains available.');
download.onclick=()=>{
 if(!notes)return;
 const file=new Blob(['# Little World export\n\nBrief: '+reportBrief+'\n\n'+notes],{type:'text/markdown;charset=utf-8'});
 const url=URL.createObjectURL(file),link=document.createElement('a');link.href=url;link.download='office-report.md';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 status.textContent='Report download requested. Check your browser downloads.';
};
export function resetWork(){finish('Ready');brief.value='';notes='';reportBrief='';mode.value='brief';showMode();save();}
