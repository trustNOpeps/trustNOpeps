import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate, makeBlankDecision, makeDecision, TEMPLATES, compareRankings, stressTest, importDecision} from '../core.js';

test('sample decisions rank scores from highest to lowest within 0–100', () => {
  for (const sample of TEMPLATES) {
    const scores = calculate(makeDecision(sample));
    assert.equal(scores.length, sample.options.length);
    scores.forEach((row,i) => {
      assert.ok(row.score >= 0 && row.score <= 100);
      if (i) assert.ok(scores[i-1].score >= row.score);
    });
  }
});
test('weighted math and zero-weight fallback', () => {
  const d = makeBlankDecision('Compare');
  d.criteria = [{id:'a',weight:3},{id:'b',weight:1}];
  d.options = [{id:'x',scores:{a:10,b:0}},{id:'y',scores:{a:0,b:10}}];
  assert.equal(calculate(d)[0].score,75);
  assert.equal(calculate(d,{a:0,b:0})[0].score,50);
});
test('scenario updates can change the leading option', () => {
  const d=makeBlankDecision('Compare');
  d.criteria=[{id:'a',weight:100},{id:'b',weight:1}];
  d.options=[{id:'x',scores:{a:10,b:0}},{id:'y',scores:{a:0,b:10}}];
  assert.equal(compareRankings(d,{a:1,b:100}).changed,true);
});
test('deterministic sensitivity counts exactly 121 cases', () => {
  const d=makeDecision();
  const a=stressTest(d,{},20), b=stressTest(d,{},20);
  assert.deepEqual(a,b);
  assert.equal(Object.values(a.tally).reduce((x,y)=>x+y,0),121);
});
test('ties are not misattributed to the first option',()=>{
  const d=makeBlankDecision('Tie');
  const r=stressTest(d,{},20);
  assert.equal(r.tally.tie,121);
  assert.equal(r.tally[d.options[0].id],0);
});
test('imports retain coherent option and criterion identifiers',()=>{
  const d=makeDecision();
  const next=importDecision(d);
  assert.equal(calculate(next).length,d.options.length);
  assert.notEqual(next.criteria[0].id,d.criteria[0].id);
});
test('invalid import and ratings are handled safely',()=>{
  assert.throws(()=>importDecision({criteria:[],options:[]}));
  const d=makeBlankDecision('Clamp');
  d.options[0].scores[d.criteria[0].id]=200;
  assert.ok(calculate(d)[0].score<=100);
});
