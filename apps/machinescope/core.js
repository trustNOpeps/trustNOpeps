(function(root){
'use strict';
function parseCSV(text){
 text=text.replace(/^\uFEFF/,''); let rows=[],row=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){let c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell='';}else cell+=c;}
 if(quoted)throw Error('Tanda kutip CSV tidak ditutup.');row.push(cell);if(row.some(v=>v.trim()))rows.push(row);
 if(rows.length<2)throw Error('CSV perlu header dan minimal satu baris data.');
 let headers=rows.shift().map(s=>s.trim());if(headers.some(s=>!s)||new Set(headers).size!==headers.length)throw Error('Nama kolom harus unik dan tidak kosong.');
 if(rows.some(r=>r.length!==headers.length))throw Error('Jumlah kolom tidak konsisten. Periksa delimiter koma.');if(rows.length>50000)throw Error('Maksimal 50.000 baris.');return {headers,rows};
}
const numeric=v=>typeof v==='number'?Number.isFinite(v):typeof v==='string'&&v.trim()!==''&&Number.isFinite(Number(v));
function median(a){let b=[...a].sort((a,b)=>a-b),m=Math.floor(b.length/2);return b.length%2?b[m]:(b[m-1]+b[m])/2;}
function analyze(values,threshold=3.5,baselineCount=0){
 let valid=values.map((v,i)=>({v:numeric(v)?Number(v):null,i})).filter(p=>p.v!==null);if(valid.length<5)throw Error('Perlu minimal 5 nilai numerik valid.');
 let ref=(baselineCount?valid.filter(p=>p.i<baselineCount):valid).map(p=>p.v);if(ref.length<5)throw Error('Baseline perlu minimal 5 nilai numerik valid.');
 let center=median(ref),mad=median(ref.map(x=>Math.abs(x-center)));let points=valid.map(p=>({...p,score:mad===0?(p.v===center?0:Infinity):0.67448975*Math.abs(p.v-center)/mad}));
 let mean=valid.reduce((s,p)=>s+p.v,0)/valid.length;return {points,center,mad,mean,min:Math.min(...valid.map(p=>p.v)),max:Math.max(...valid.map(p=>p.v)),rms:Math.sqrt(valid.reduce((s,p)=>s+p.v*p.v,0)/valid.length),missing:values.length-valid.length,flags:points.filter(p=>p.score>threshold),referenceCount:ref.length};
}
function demo(){let rows=[];for(let i=0;i<240;i++){let spike=[73,74,151,198,199,200].includes(i);rows.push([String(i), (2.4+0.22*Math.sin(i*.71)+0.13*Math.cos(i*1.27)+(spike?2.3:0)).toFixed(3),(64+1.8*Math.sin(i*.08)+(spike?7:0)).toFixed(2),String(Math.round(1480+12*Math.sin(i*.13)))]);}return {headers:['time_s','vibration_mm_s','temperature_c','rpm'],rows};}
const api={parseCSV,numeric,median,analyze,demo};if(typeof module!=='undefined')module.exports=api;root.MachineCore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
