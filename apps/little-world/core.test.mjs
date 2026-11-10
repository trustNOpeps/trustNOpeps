import test from 'node:test';
import assert from 'node:assert/strict';
import { freshState, loadState, formatTime, scheduleLabel, assignTask, tick, exportWorld, AGENTS, TASKS } from './core.mjs';

test('initial world is deterministic and isolated',()=>{
 const first=freshState(),second=freshState();
 assert.equal(first.agents.length,3);assert.equal(first.minute,480);
 first.agents[0].x=15;assert.equal(second.agents[0].x,AGENTS[0].home[0]);
});
test('invalid or mismatched saves recover safely',()=>{
 assert.equal(loadState('{bad').day,1);
 assert.equal(loadState('{"version":99}').day,1);
 const state=freshState();state.day=10;state.coins=20;
 assert.deepEqual(loadState(exportWorld(state)).coins,20);
});
test('time labels and day rollover',()=>{
 const state=freshState();state.minute=1439;tick(state);
 assert.equal(state.day,2);assert.equal(formatTime(state.minute),'00:00');
 assert.equal(scheduleLabel(480),'Morning studio shift');
});
test('task assignment works and awards fictional points once',()=>{
 const state=freshState();assert.equal(assignTask(state,'nova','organize'),true);
 for(let i=0;i<35;i++)tick(state);
 assert.equal(state.agents[0].task,null);
 assert.equal(state.coins,TASKS.find(t=>t.id==='organize').points);
 assert.equal(state.completed.length,1);
});
test('pausing prevents time and task progress',()=>{
 const state=freshState();assignTask(state,'nova','organize');state.speed=0;
 const before=exportWorld(state);tick(state,60);
 assert.equal(exportWorld(state),before);
});
test('invalid tasks and exhausted agents are refused',()=>{
 const state=freshState();assert.equal(assignTask(state,'nobody','explore'),false);
 assert.equal(assignTask(state,'nova','missing'),false);
 state.agents[0].energy=1;assert.equal(assignTask(state,'nova','explore'),false);
});
