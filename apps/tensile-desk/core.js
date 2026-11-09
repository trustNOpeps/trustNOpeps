/* Pure calculation layer: browser + Node, no dependencies. */
(function(root){
'use strict';
function analyse(csv,area,length){
 if(!Number.isFinite(area)||area<=0||!Number.isFinite(length)||length<=0)throw Error('Luas dan panjang awal harus lebih besar dari nol.');
 const lines=String(csv).trim().split(/\r?\n/);
 if(lines.shift().trim()!=='force_N,extension_mm')throw Error('Header harus force_N,extension_mm. Gunakan titik untuk desimal.');
 if(!lines.length||lines.length>2000)throw Error('Masukkan 1–2000 baris data.');
 return lines.map((line,i)=>{
  const cells=line.split(',');
  if(cells.length!==2||cells.some(v=>!v.trim()))throw Error(`Baris ${i+2}: dua angka wajib diisi.`);
  const [force,extension]=cells.map(Number);
  if(!Number.isFinite(force)||!Number.isFinite(extension)||force<0||extension<0)throw Error(`Baris ${i+2}: gunakan angka nonnegatif yang valid.`);
  const stress=force/area,strain=extension/length;
  if(!Number.isFinite(stress)||!Number.isFinite(strain)||!Number.isFinite(strain*100))throw Error('Hasil melebihi rentang numerik. Periksa satuan dan input.');
  return {force,extension,stress,strain};
 });
}
const api={analyse};if(typeof module==='object')module.exports=api;else root.Tensile=api;
})(globalThis);
