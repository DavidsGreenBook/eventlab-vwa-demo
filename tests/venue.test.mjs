import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createVenueModel,ZONES,SEAT_COUNT} from '../venue-model.js';
test('the large venue contains 480 audience seats and four navigable work areas',()=>{
 const m=createVenueModel();const seats=m.items.filter(x=>x.type==='box'&&x.color==='#3c5470'&&x.s[0]===.95&&x.s[1]===.16&&x.s[2]===.92);
 assert.equal(seats.length,480);assert.equal(m.seats,SEAT_COUNT);assert.deepEqual(new Set(m.targets.map(x=>x.target)),new Set(['stage','audience','control','media']));
 for(const t of m.targets){assert.ok(ZONES[t.target]);assert.ok(m.items.some(x=>x.type==='label'&&x.target===t.target));}
 for(const z of Object.values(ZONES)){assert.equal(z.p.length,3);assert.ok(z.p.every(Number.isFinite));assert.notDeepEqual(z.p,z.target);}
});
test('stage furniture and audience poses change without corrupting venue geometry',()=>{
 const base=createVenueModel({layout:'talkshow',audience:'listen'}),changed=createVenueModel({layout:'podium',audience:'question',light:'warm'});
 assert.ok(base.items.some(x=>x.color==='#bec4c6'));assert.ok(!changed.items.some(x=>x.color==='#bec4c6'));
 assert.ok(changed.items.some(x=>x.text==='Tôi có một câu hỏi'));
 for(const m of [base,changed,createVenueModel({audience:'applause',streaming:true})])for(const item of m.items){assert.ok(item.p.every(Number.isFinite));assert.ok(item.s.every(x=>Number.isFinite(x)&&x>0));}
});
