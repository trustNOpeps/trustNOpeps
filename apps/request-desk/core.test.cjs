const {test}=require('node:test');const a=require('node:assert/strict');const {validateItem,toCSV,summary}=require('./core.js');
const item={name:'Cable',quantity:2,unit:'roll',specification:'Cat 6'};
test('normalises a valid request item',()=>a.deepEqual(validateItem({...item,name:' Cable '}),item));
for(const [name,change] of [['blank name',{name:' '}],['zero quantity',{quantity:0}],['invalid quantity',{quantity:NaN}],['missing unit',{unit:''}],['oversized name',{name:'a'.repeat(121)}]])test('rejects '+name,()=>a.throws(()=>validateItem({...item,...change})));
test('CSV quotes commas, quotes and newlines',()=>a.match(toCSV([{...item,specification:'a,"b"\nc'}]),/"a,""b""\nc"/));
test('neutralises spreadsheet formulas',()=>a.match(toCSV([{...item,name:'=1+1'}]),/"'=1\+1"/));
test('summary counts lines and distinct units without mixing quantities',()=>a.deepEqual(summary([item,{...item,unit:'piece'}]),{lines:2,units:2}));
