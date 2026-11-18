import test from 'node:test';import assert from 'node:assert/strict';
import {fill,line,resizePixels,validateProject} from './core.mjs';
test('fill respects disconnected areas and edges',()=>{const p=[null,'#000000',null,null,'#000000',null,null,'#000000',null];fill(p,3,0,'#ff0000');assert.deepEqual(p,['#ff0000','#000000',null,'#ff0000','#000000',null,'#ff0000','#000000',null]);});
test('line fills fast pointer movement without gaps',()=>{let points=[];line(0,0,4,4,(x,y)=>points.push([x,y]));assert.deepEqual(points,[[0,0],[1,1],[2,2],[3,3],[4,4]]);});
test('resize preserves nearest pixels',()=>{assert.deepEqual(resizePixels(['#ffffff',null,null,'#000000'],2,1),['#ffffff']);assert.equal(resizePixels(Array(256).fill(null),16,64).length,4096);});
test('project import validates content and isolates arrays',()=>{const p={version:1,size:16,pixels:Array(256).fill(null)};const q=validateProject(p);q.pixels[0]='#ffffff';assert.equal(p.pixels[0],null);assert.throws(()=>validateProject({...p,size:500}));assert.throws(()=>validateProject({...p,pixels:Array(256).fill('javascript:bad')}));});
