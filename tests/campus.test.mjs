import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PROGRAMMES,ROLES,EVENT_VIEWS,getProgramme} from '../campus-data.js';
import {createCampusModel,createEventModel} from '../campus-model.js';
test('all campus entrances resolve to a programme with six usable role viewpoints',()=>{
 const campus=createCampusModel();assert.equal(PROGRAMMES.length,3);
 assert.deepEqual(new Set(campus.targets.map(x=>x.target)),new Set(PROGRAMMES.map(x=>x.id)));
 assert.ok(campus.items.some(x=>x.avatar));
 for(const p of PROGRAMMES){assert.equal(getProgramme(p.id),p);for(const r of ROLES){const v=EVENT_VIEWS[p.id][r.view];assert.ok(v);assert.ok(v.p.every(Number.isFinite));assert.notDeepEqual(v.p,v.target);}}
 assert.equal(getProgramme('missing'),null);
});
test('three event settings retain valid geometry and common production areas',()=>{
 const models=PROGRAMMES.map(p=>createEventModel(p.id));assert.equal(new Set(models.map(m=>m.items.length)).size,3);
 for(const m of [createCampusModel(),...models])for(const x of m.items){assert.ok(x.p.every(Number.isFinite));assert.ok(x.s.every(v=>Number.isFinite(v)&&v>0));}
 for(const m of models){const labels=m.items.filter(x=>x.type==='label').map(x=>x.text).join(' ');assert.match(labels,/ĐIỀU KHIỂN/);assert.match(labels,/TRUYỀN THÔNG/);assert.match(labels,/LIVESTREAM/);}
 assert.ok(models[1].items.some(x=>x.text==='PHIÊN DỊCH'));assert.equal(models[2].environment,'night');assert.ok(models[2].items.some(x=>x.type==='beam'));
});
