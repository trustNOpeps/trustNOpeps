const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
// Evaluate the production calculation function without binding browser controls.
const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const defs=source.slice(source.indexOf('const defs='),source.indexOf(';let turn='));
const calc=source.slice(source.indexOf('function calculate('),source.indexOf('function render('));
const calculate=vm.runInNewContext(defs+';'+calc+';calculate');
const p={w:600,d:400,h:700,s:30,t:2,stock:6000,kerf:3,rho:7850};
test('default geometry, volume and mass',()=>{const q=calculate(p);assert.equal(q.parts.length,12);assert.equal(q.total,6320);assert.equal((30*30-26*26)*q.total,1415680);assert.ok(Math.abs(q.mass-11.113088)<1e-9);});
test('stock allocation conserves lengths and kerf',()=>{const q=calculate(p);assert.equal(q.bins.flatMap(b=>b.cuts).length,12);assert.ok(q.bins.every(b=>b.used<=p.stock));assert.equal(q.bins.reduce((s,b)=>s+b.used,0),q.total+12*p.kerf);});
test('reject invalid geometry and stock',()=>{for(const patch of [{t:10,s:15},{w:NaN},{stock:1000,w:2400},{h:250,s:100},{rho:0},{kerf:-1}])assert.throws(()=>calculate({...p,...patch}));});
test('material mass scales with density',()=>{assert.ok(Math.abs(calculate({...p,rho:2700}).mass/calculate(p).mass-2700/7850)<1e-12);});
