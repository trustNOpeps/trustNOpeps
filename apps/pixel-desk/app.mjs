import {validateProject,fill,line,resizePixels} from './core.mjs';
const $=s=>document.querySelector(s),canvas=$('#board'),ctx=canvas.getContext('2d'),key='haammkaki.pixel-pad.v2';
let size=32,pixels=Array(size**2).fill(null),color='#29203e',tool='pen',undo=[],redo=[],drawing=false,last=null,cursor=[0,0];
const palettes={studio:['#29203e','#875cc9','#b7a2ed','#ffc0dc','#ffe08d','#a6e7d0','#f67b69','#4d83a6','#784c65','#f5ecda','#ffffff','#000000'],sunset:['#2d194f','#704174','#ad4c75','#e46f74','#ff9c79','#ffc58c','#ffdf9b','#f6e8bc','#8498ae','#516c97','#ffffff','#000000'],forest:['#153b36','#245947','#438354','#6aa264','#99bc7c','#d3dc9d','#9b754e','#6b4c39','#a8ced0','#e5eee1','#ffffff','#000000'],mono:['#000000','#181818','#303030','#484848','#606060','#787878','#909090','#a8a8a8','#c0c0c0','#d8d8d8','#eeeeee','#ffffff']};
function message(s){$('#status').textContent=s;}
function snapshot(){undo.push({size,pixels:[...pixels]});if(undo.length>60)undo.shift();redo=[];}
function persist(){try{localStorage.setItem(key,JSON.stringify({version:1,size,pixels}));}catch{message('Browser storage unavailable. Download a project to keep your work.');}}
function render(){
 const unit=canvas.width/size;ctx.clearRect(0,0,canvas.width,canvas.height);
 pixels.forEach((c,i)=>{const x=i%size,y=Math.floor(i/size);ctx.fillStyle=c||((x+y)%2?'#eee9f2':'#fff');ctx.fillRect(x*unit,y*unit,unit,unit);});
 if($('#grid').getAttribute('aria-pressed')==='true'){ctx.strokeStyle='#29203e22';ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<=size;i++){ctx.moveTo(i*unit,0);ctx.lineTo(i*unit,768);ctx.moveTo(0,i*unit);ctx.lineTo(768,i*unit);}ctx.stroke();}
 if(document.activeElement===canvas){ctx.strokeStyle='#e84d7e';ctx.lineWidth=3;ctx.strokeRect(cursor[0]*unit+2,cursor[1]*unit+2,unit-4,unit-4);}
 $('#size').value=size;$('#dimensions').textContent=`${size} × ${size}`;$('#undo').disabled=!undo.length;$('#redo').disabled=!redo.length;
}
function setColor(c){color=c;$('#color').value=c;document.querySelectorAll('.swatch').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.color===c)));}
function palette(){const el=$('#palette');el.replaceChildren();for(const c of palettes[$('#palette-name').value]){const b=document.createElement('button');b.className='swatch';b.style.background=c;b.dataset.color=c;b.setAttribute('aria-label','Colour '+c);b.setAttribute('aria-pressed',String(c===color));b.onclick=()=>setColor(c);el.append(b);}}
function setTool(value){tool=value;document.querySelectorAll('[data-tool]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tool===tool)));}
function paint(x,y){const index=y*size+x,c=tool==='erase'?null:color;pixels[index]=c;if($('#mirror').checked)pixels[y*size+(size-1-x)]=c;}
function point(event){const r=canvas.getBoundingClientRect();return [Math.max(0,Math.min(size-1,Math.floor((event.clientX-r.left)/r.width*size))),Math.max(0,Math.min(size-1,Math.floor((event.clientY-r.top)/r.height*size)))];}
function apply(x,y){if(tool==='pick'){const c=pixels[y*size+x];if(c)setColor(c);message(c?'Picked '+c:'This pixel is transparent.');return;}
 if(tool==='fill'){fill(pixels,size,y*size+x,color);if($('#mirror').checked)fill(pixels,size,y*size+size-1-x,color);}else paint(x,y);}
canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();canvas.focus({preventScroll:true});cursor=point(e);if(tool!=='pick')snapshot();apply(...cursor);drawing=['pen','erase'].includes(tool);last=cursor;canvas.setPointerCapture(e.pointerId);render();if(!drawing)persist();});
canvas.addEventListener('pointermove',e=>{if(!drawing)return;const next=point(e);line(...last,...next,paint);last=next;cursor=next;render();});
function end(){if(drawing){drawing=false;persist();message('Stroke saved on this device.');}}
canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('lostpointercapture',end);
canvas.addEventListener('focus',render);canvas.addEventListener('blur',render);
canvas.addEventListener('keydown',e=>{const moves={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(moves[e.key]){e.preventDefault();cursor=cursor.map((v,i)=>Math.max(0,Math.min(size-1,v+moves[e.key][i])));render();}if(e.code==='Space'){e.preventDefault();if(tool!=='pick')snapshot();apply(...cursor);render();persist();}});
document.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>setTool(b.dataset.tool));$('#color').oninput=e=>setColor(e.target.value);$('#palette-name').onchange=palette;
$('#grid').onclick=()=>{$('#grid').setAttribute('aria-pressed',String($('#grid').getAttribute('aria-pressed')!=='true'));render();};
function travel(from,to){if(!from.length)return;to.push({size,pixels:[...pixels]});({size,pixels}=from.pop());cursor=[0,0];render();persist();}
$('#undo').onclick=()=>{travel(undo,redo);message('Undo.');};$('#redo').onclick=()=>{travel(redo,undo);message('Redo.');};
$('#size').onchange=e=>{const next=Number(e.target.value);snapshot();pixels=resizePixels(pixels,size,next);size=next;cursor=[0,0];render();persist();message('Canvas resized. Undo restores the previous size.');};
$('#clear').onclick=()=>{if(!confirm('Clear the canvas? You can undo this action.'))return;snapshot();pixels.fill(null);render();persist();message('Canvas cleared.');};
document.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{snapshot();pixels.fill(null);for(let y=0;y<size;y++)for(let x=0;x<size;x++){if(b.dataset.preset==='checker'){if((Math.floor(x/4)+Math.floor(y/4))%2===0)pixels[y*size+x]=color;}else{const a=(x/(size-1)-.5)*2.7,v=(.5-y/(size-1))*2.7;if((a*a+v*v-1)**3-a*a*v**3<=0)pixels[y*size+x]=color;}}render();persist();message('Pattern applied. Undo restores your previous art.');});
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('#export').onclick=()=>{const scale=Number($('#scale').value),out=document.createElement('canvas');out.width=out.height=size*scale;const c=out.getContext('2d');pixels.forEach((v,i)=>{if(v){c.fillStyle=v;c.fillRect(i%size*scale,Math.floor(i/size)*scale,scale,scale);}});out.toBlob(blob=>{if(blob){download(blob,'pixel-pad.png');message(`PNG exported at ${out.width} × ${out.height}.`);}else message('PNG export failed. Try saving a project file.');},'image/png');};
$('#save-project').onclick=()=>{download(new Blob([JSON.stringify({version:1,size,pixels})],{type:'application/json'}),'pixel-pad.json');message('Editable project exported.');};$('#open-project').onclick=()=>$('#file').click();
$('#file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>100000)throw Error('Project too large. Maximum 100 KB.');const project=validateProject(JSON.parse(await file.text()));snapshot();({size,pixels}=project);cursor=[0,0];render();persist();message('Project loaded. Undo restores the previous canvas.');}catch(error){message(error.message);}e.target.value='';};
try{const saved=localStorage.getItem(key);if(saved)({size,pixels}=validateProject(JSON.parse(saved)));}catch{message('Saved drawing unavailable. A blank canvas is ready.');}
palette();render();
