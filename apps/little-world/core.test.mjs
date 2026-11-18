import test from 'node:test';
import assert from 'node:assert/strict';
import {AGENTS,freshState,loadState,assignTask,tick,exportWorld} from './core.mjs';
import {instantReport} from './reports.mjs';
test('all nine crew are distinct, selectable and can complete visits',()=>{assert.equal(AGENTS.length,9);assert.equal(new Set(AGENTS.map(a=>a.id)).size,9);const s=freshState();for(const a of AGENTS)assert.ok(assignTask(s,a.id,'organize'));for(let i=0;i<60;i++)tick(s);assert.equal(s.completed.length,9);assert.equal(s.coins,135);});
test('old three-person save migrates without losing progress',()=>{const s=freshState();s.version=1;s.agents=s.agents.slice(0,3);s.coins=75;s.day=9;s.selected='byte';const loaded=loadState(JSON.stringify(s));assert.equal(loaded.agents.length,9);assert.equal(loaded.coins,75);assert.equal(loaded.day,9);assert.equal(loaded.selected,'byte');assert.equal(loaded.version,2);});
test('invalid saves and pause remain safe',()=>{assert.equal(loadState('bad').agents.length,9);const s=freshState();s.speed=0;const before=exportWorld(s);tick(s,20);assert.equal(exportWorld(s),before);});
test('instant brief and caption outputs are honestly labeled and include input',()=>{for(const mode of ['brief','captions']){const out=instantReport(mode,'AFTER WANTING untuk mahasiswa');assert.match(out,/AFTER WANTING/);assert.match(out,/not AI generation/);assert.ok(out.length>300);}});
test('budget calculations reject malformed inputs and keep rupiah exact',()=>{const out=instantReport('budget','Kaos | 3 | 95000\nPack | 3 | 12000');assert.match(out,/321\.000/);assert.throws(()=>instantReport('budget','Kaos | 3 | 95.000'));assert.throws(()=>instantReport('brief',''));});
