import './sales.mjs';
import {roomShell} from './architecture.mjs';
import {activity,resetWork} from './work.mjs';
import { AGENTS, PLACES, TASKS, freshState, loadState, formatTime, scheduleLabel, addLog, assignTask, tick, exportWorld } from './core.mjs';

const STORAGE_KEY = 'trustnopeps-little-world-v1';
let world; try { world = loadState(localStorage.getItem(STORAGE_KEY)); } catch { world = freshState(); }
const $ = (q) => document.querySelector(q);
const canvas = $('#world'), ctx = canvas.getContext('2d');
const origin = { x: 457, y: 174 }, tileW = 70, tileH = 35;
const hover = { id: null, type: null };
let frame = 0;

function projectUrl(place) { return place.href; }
function persist() { try { localStorage.setItem(STORAGE_KEY, exportWorld(world)); } catch { /* Storage may be disabled. Export still works. */ } }
function iso(x,y,z=0) { return { x: origin.x + (x-y)*tileW/2, y: origin.y + (x+y)*tileH/2-z }; }
function polygon(points, fill, stroke='#3f3358',line=2) { ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.lineWidth=line;ctx.strokeStyle=stroke;ctx.stroke();} }
function rect(x,y,w,h,color,stroke) { ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.strokeRect(Math.round(x),Math.round(y),w,h);} }
function textAt(text,x,y,size=14,color='#29203e',align='center') {ctx.font=`700 ${size}px monospace`;ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(text,x,y);}
function desk(x,y,color,icon,label) {
  const p=iso(x,y);
  function top(dx,dy,z){return iso(x+dx,y+dy,z);}
  for(const [dx,dy] of [[-1,-.46],[1,-.46],[-1,.46],[1,.46]]){
    const leg=top(dx,dy,0);rect(leg.x-2,leg.y-22,5,22,'#7c695e');
  }
  const corners=[[-1.15,-.55],[1.15,-.55],[1.15,.55],[-1.15,.55]];
  polygon(corners.map(([dx,dy])=>top(dx,dy,23)),'#f2e8d2','#8e776a',1);
  polygon([top(1.15,-.55,23),top(1.15,.55,23),top(1.15,.55,18),top(1.15,-.55,18)],'#a9988b');
  polygon([top(-1.15,.55,23),top(1.15,.55,23),top(1.15,.55,18),top(-1.15,.55,18)],color);
  const papers=top(-.76,-.12,24);
  rect(papers.x-8,papers.y-4,14,8,'#e6d3ae','#aa9688');
  rect(papers.x-7,papers.y-6,14,7,'#fffae6');
  rect(p.x-16,p.y-64,33,24,'#2c2443','#1a1730');rect(p.x-12,p.y-60,25,16,'#e7f6df');
  textAt(icon,p.x,p.y-47,12,'#44335a');rect(p.x-2,p.y-39,5,9,'#33304c');
  textAt(label,p.x,p.y-80,12,'#312344');
}
function plant(x,y) { const p=iso(x,y);polygon([{x:p.x-10,y:p.y-6},{x:p.x+10,y:p.y-6},{x:p.x+7,y:p.y+12},{x:p.x-7,y:p.y+12}],'#ec9d83');rect(p.x-2,p.y-30,4,25,'#467e59');for(let i=0;i<4;i++){const dx=[-17,11,-12,8][i],dy=[-27,-35,-42,-48][i];rect(p.x+dx,p.y+dy,18,10,i%2?'#76bb85':'#4f9b78');}}
function vending(x,y) { const p=iso(x,y);rect(p.x-17,p.y-62,38,60,'#ee9ec9','#382848');rect(p.x-11,p.y-55,25,26,'#e2f4fb');for(let i=0;i<3;i++)rect(p.x-7+i*8,p.y-50,5,14,['#ffe495','#afebbb','#bd9afa'][i]);rect(p.x-9,p.y-19,18,7,'#694270');}
function chair(x,y) {const p=iso(x,y);rect(p.x-12,p.y-15,24,7,'#635179');rect(p.x-9,p.y-29,18,15,'#8c74ab');rect(p.x-8,p.y-8,4,15,'#40354e');rect(p.x+4,p.y-8,4,15,'#40354e');}
function person(x,y,color,name,bob,selected) {
  const p=iso(x,y),py=p.y-10+Math.sin(frame/14+bob)*2;
  if(selected){ctx.beginPath();ctx.ellipse(p.x,py+10,18,8,0,0,2*Math.PI);ctx.fillStyle='#f5e18e';ctx.fill();}
  rect(p.x-9,py-30,18,17,color,'#332547');rect(p.x-7,py-47,14,17,'#ffdcad','#332547');rect(p.x-8,py-49,16,6,'#43354f');rect(p.x-5,py-36,3,3,'#342745');rect(p.x+3,py-36,3,3,'#342745');rect(p.x-7,py-13,6,12,'#3b3453');rect(p.x+2,py-13,6,12,'#3b3453');textAt(name,p.x,py-57,11,'#2f2745');
}
const symbols={studio:'✳',lab:'∿',market:'▤',gallery:'▧',books:'B',fashion:'AW'};
const backdrop=document.createElement('canvas');
backdrop.width=canvas.width;backdrop.height=canvas.height;
roomShell(backdrop.getContext('2d'),iso);
function floor(){
  ctx.drawImage(backdrop,0,0);
  const objects=[];
  const put=(x,y,paint)=>objects.push({depth:x+y,paint});
  for(const [x,y] of [[.7,.8],[14.8,1],[1,9.6],[10.4,8.8]])put(x,y,()=>plant(x,y));
  put(.7,4.3,()=>vending(.7,4.3));
  for(const place of PLACES){
    const [x,y]=place.position;
    put(x,y,()=>{
      desk(x,y,place.color,symbols[place.id],place.short||place.name.split(' ')[0].toUpperCase());
      const p=iso(x,y);
      rect(p.x-17,p.y-28,22,5,'#564959');
      for(let j=0;j<5;j++)rect(p.x-15+j*4,p.y-27,2,1,'#dfd6cb');
      rect(p.x+15,p.y-33,6,9,'#e9ce8c');
    });
    put(x,y+1.05,()=>chair(x,y+1.05));
  }
  // The shared packing bench separates the sales desks from the workstations.
  put(11,8.8,()=>{
    const x=11,y=8.8,at=(u,v,z)=>iso(x+u,y+v,z);
    for(const u of [-1.5,1.5])for(const v of [-.52,.52]){
      const q=at(u,v,0);rect(q.x,q.y-24,5,25,'#806957');
    }
    polygon([at(-1.6,-.65,25),at(1.6,-.65,25),at(1.6,.65,25),at(-1.6,.65,25)],'#bd9b79','#806757');
    for(let i=0;i<3;i++){
      const q=at(i*.78-.9,0,26);const c=['#6d7b8d','#b07885','#d7b489'][i];
      rect(q.x-10,q.y-13,23,13,c,'#796958');rect(q.x-2,q.y-13,6,13,'#ead4ac');
    }
  });
  const people=world.agents.map((a,i)=>({...a,info:AGENTS[i]})).sort((a,b)=>a.x+a.y-b.x-b.y);
  people.forEach((a,i)=>{
    const working=activity?.agent===a.id;
    const [x,y]=working?[a.info.work[0],a.info.work[1]+1]:[a.x,a.y];
    put(x,y+.15,()=>{person(x,y,a.info.color,a.info.name,i*2,a.id===world.selected);
    if(working){
      const p=iso(x,y),beat=Math.floor(frame/4)%2;
      rect(p.x-18,p.y-93,36,17,'#2c2443');
      textAt(activity.stage==='loading'?'LOAD':'TYPE',p.x,p.y-81,10,'#adf9ce');
      rect(p.x+7,p.y-34+beat*2,10,4,a.info.color);
    }
    });
  });
  objects.sort((a,b)=>a.depth-b.depth).forEach(o=>o.paint());

}
function hitAt(px,py) {
  const d=canvas.getBoundingClientRect();const x=(px-d.left)*canvas.width/d.width,y=(py-d.top)*canvas.height/d.height;
  let closest=null,best=46;
  for(const place of PLACES){const p=iso(...place.position);const distance=Math.hypot(x-p.x,(y-(p.y-35))*1.2);if(distance<best){closest={type:'place',id:place.id};best=distance;}}
  for(const a of world.agents){const pos=activity?.agent===a.id?AGENTS.find(info=>info.id===a.id).work:null;const p=pos?iso(pos[0],pos[1]+1):iso(a.x,a.y);const distance=Math.hypot(x-p.x,y-(p.y-27));if(distance<best){closest={type:'agent',id:a.id};best=distance;}}
  return closest;
}
canvas.addEventListener('click',e=>{const hit=hitAt(e.clientX,e.clientY);if(!hit)return;if(hit.type==='agent'){world.selected=hit.id;addLog(world,`Selected ${AGENTS.find(a=>a.id===hit.id).name}.`);}else{const p=PLACES.find(p=>p.id===hit.id);addLog(world,`Opened desk: ${p.name}.`);window.open(projectUrl(p),'_blank','noopener,noreferrer');}persist();renderUI();});
canvas.addEventListener('pointermove',e=>{const hit=hitAt(e.clientX,e.clientY);canvas.style.cursor=hit?'pointer':'crosshair';canvas.title=hit?(hit.type==='place'?PLACES.find(p=>p.id===hit.id).name:AGENTS.find(a=>a.id===hit.id).name):'Explore the office';});

const list=$('#agent-list'),select=$('#task');
TASKS.forEach(t=>{const option=document.createElement('option');option.value=t.id;option.textContent=t.title;select.append(option);});
function renderUI() {
  $('#clock').textContent=`DAY ${String(world.day).padStart(2,'0')} · ${formatTime(world.minute)}`;
  $('#mood').textContent=scheduleLabel(world.minute);$('#coin').textContent=`◈ ${world.coins} coins`;
  list.replaceChildren();AGENTS.forEach(info=>{const a=world.agents.find(a=>a.id===info.id);const button=document.createElement('button');button.type='button';button.className='agent';button.setAttribute('aria-pressed',String(world.selected===a.id));button.innerHTML=`<span class="avatar" style="background:${info.color}">●</span><span><strong>${info.name}</strong><small>${activity?.agent===a.id?'AI · '+activity.stage.toUpperCase():a.task?'ON TASK · '+Math.round(a.progress)+'%':'AVAILABLE · '+info.role}</small></span>`;button.addEventListener('click',()=>{world.selected=a.id;persist();renderUI();});list.append(button);});
  const current=AGENTS.find(a=>a.id===world.selected),state=world.agents.find(a=>a.id===current.id);
  $('#agent-title').firstChild.textContent=current.name+' ';$('#agent-role').textContent=current.role;
  $('#energy').textContent=state.energy+'%';$('#energy-fill').style.width=state.energy+'%';
  $('#task-status').textContent=state.task?`Working on ${TASKS.find(t=>t.id===state.task).title} · ${state.progress}%`:'Ready for a simulated desk visit.';
  const log=$('#log');log.replaceChildren();world.log.slice(0,6).forEach(line=>{const li=document.createElement('li');li.textContent=line;log.append(li);});
  document.querySelectorAll('[data-speed]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.speed)===world.speed)));
}
$('#assign').addEventListener('click',()=>{assignTask(world,world.selected,select.value);persist();renderUI();});
document.querySelectorAll('[data-speed]').forEach(b=>b.addEventListener('click',()=>{world.speed=Number(b.dataset.speed);persist();renderUI();}));
$('#sound').addEventListener('click',()=>{$('#task-status').textContent='Sound is intentionally not included. Silent mode is always on.';});
$('#download').addEventListener('click',()=>{const blob=new Blob([exportWorld(world)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='little-world-state.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('#reset').addEventListener('click',()=>{if(!confirm('Reset your local Little World progress?'))return;resetWork();world=freshState();persist();renderUI();});
const projects=$('#project-grid');const symbol=symbols;
for(const p of PLACES){const card=document.createElement('a');card.className='project-card';card.href=projectUrl(p);card.target='_blank';card.rel='noopener noreferrer';card.innerHTML=`<div class="project-art" style="background:${p.color}">${symbol[p.id]}</div><span class="project-tag">${p.type.toUpperCase()} / ${p.id==='gallery'?'CASE STUDY':p.id==='books'?'BOOK PREVIEW':p.id==='fashion'?'SHOWROOM':'LIVE APP'}</span><h3>${p.name}</h3><p>${p.subtitle}. Open the project ↗</p>`;projects.append(card);}
let lastFrame=-1000;function animate(now){const rate=matchMedia('(prefers-reduced-motion: reduce)').matches?1000:100;if(!document.hidden && now-lastFrame>=rate){frame++;floor();lastFrame=now;}requestAnimationFrame(animate);}requestAnimationFrame(animate);renderUI();setInterval(()=>{tick(world,1);persist();renderUI();},1000);
