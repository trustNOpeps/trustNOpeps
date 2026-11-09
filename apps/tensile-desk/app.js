'use strict';
const $=id=>document.getElementById(id);let rows=[],synthetic=false;
const format=n=>new Intl.NumberFormat('id-ID',{maximumSignificantDigits:6}).format(n);
function clear(){rows=[];$('export').disabled=true;$('results').replaceChildren();['peak','strain'].forEach(id=>$(id).textContent='—');$('count').textContent='0';$('chart').className='empty';$('chart').textContent='Input berubah. Hitung kembali untuk memperbarui hasil.';$('source').textContent='BELUM DIHITUNG';}
function plot(data){
 const ns='http://www.w3.org/2000/svg';const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 640 360');svg.setAttribute('role','img');svg.setAttribute('aria-label','Kurva tegangan teknik MPa terhadap regangan persen. Data lengkap tersedia pada tabel di bawah.');
 const maxX=Math.max(...data.map(r=>r.strain*100))||1,maxY=Math.max(...data.map(r=>r.stress))||1;
 function add(tag,attrs,text){const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(text)e.textContent=text;svg.append(e);return e;}
 for(let i=0;i<=4;i++){let y=300-i*65,x=75+i*132.5;add('line',{x1:75,y1:y,x2:605,y2:y,stroke:'#dce4d8'});add('text',{x:65,y:y+4,'text-anchor':'end','font-size':11,fill:'#516654'},format(maxY*i/4));add('text',{x,y:322,'text-anchor':'middle','font-size':11,fill:'#516654'},format(maxX*i/4));}
 add('text',{x:75,y:22,'font-size':12,fill:'#24352f'},'Tegangan / MPa');add('text',{x:605,y:349,'text-anchor':'end','font-size':12,fill:'#24352f'},'Regangan / %');
 add('polyline',{points:data.map(r=>`${75+(r.strain*100/maxX)*530},${300-(r.stress/maxY)*260}`).join(' '),fill:'none',stroke:'#26754e','stroke-width':2.5});
 data.forEach(r=>add('circle',{cx:75+(r.strain*100/maxX)*530,cy:300-(r.stress/maxY)*260,r:2.5,fill:'#b76635'}));$('chart').className='';$('chart').replaceChildren(svg);
}
function calculate(){try{rows=Tensile.analyse($('data').value,Number($('area').value),Number($('length').value));$('error').textContent='';$('peak').textContent=format(Math.max(...rows.map(r=>r.stress)));$('strain').textContent=format(Math.max(...rows.map(r=>r.strain*100)));$('count').textContent=rows.length;$('source').textContent=synthetic?'CONTOH SINTETIS':'INPUT PENGGUNA';$('results').replaceChildren();const fragment=document.createDocumentFragment();rows.forEach(r=>{const tr=document.createElement('tr');[r.force,r.extension,r.stress,r.strain*100].forEach(v=>{const td=document.createElement('td');td.textContent=format(v);tr.append(td)});fragment.append(tr)});$('results').append(fragment);plot(rows);$('export').disabled=false;}catch(e){clear();$('error').textContent=e.message;}}
$('form').addEventListener('submit',e=>{e.preventDefault();calculate()});
$('form').addEventListener('input',()=>{synthetic=false;clear();$('error').textContent=''});
$('sample').onclick=()=>{synthetic=true;$('area').value=10;$('length').value=50;$('data').value='force_N,extension_mm\n0,0\n200,0.01\n400,0.02\n600,0.03\n800,0.05\n1000,0.1\n1200,0.3\n1100,0.5';calculate()};
$('export').onclick=()=>{if(!rows.length)return;const csv='force_N,extension_mm,stress_MPa,strain,strain_percent,area_mm2,length_mm,data_source\n'+rows.map(r=>[r.force,r.extension,r.stress,r.strain,r.strain*100,$('area').value,$('length').value,synthetic?'synthetic_example':'user_input'].join(',')).join('\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='tensile-results.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
