import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LESSONS,getLesson,DecisionScenario} from '../catalog.js';
const paths={
 led:['led-check','led-hold','led-load','led-preview','led-publish','led-log'],
 delay:['delay-verify','delay-bridge','delay-brief','delay-trim','delay-ready','delay-record'],
 lighting:['light-check','light-warm','light-camera','light-preview','light-go'],
 question:['qa-listen','qa-check','qa-clarify','qa-route','qa-close'],
 news:['news-hold','news-verify','news-correct','news-approve','news-publish'],
 planning:['plan-goal','plan-budget','plan-roles','plan-backup','plan-go'],
};
for(const [id,path] of Object.entries(paths))test(`${id}: complete the authored learning path and retain the final work product`,()=>{
 let now=1000;const s=new DecisionScenario(getLesson(id),()=>now);s.start();
 assert.equal(s.act('finish').ok,false);assert.equal(s.finished,false);
 for(const action of path){now+=1000;assert.equal(s.act('decision',action).ok,true,action);}
 assert.equal(s.step,path.length);assert.equal(s.recovered,true);assert.equal(s.finished,false);
 assert.equal(s.act('finish').ok,true);const r=s.report();assert.equal(r.totalSteps,path.length);assert.equal(r.completedSteps,path.length);assert.equal(r.role,getLesson(id).role);assert.equal(r.scenarioId,id);assert.ok(r.artifact.length>40);
 now+=9000;assert.equal(s.report().durationSeconds,path.length);assert.equal(s.act('decision',path[0]).ok,false);
});
test('wrong, future and repeated decisions cannot bypass a task or change the LED',()=>{
 const s=new DecisionScenario(getLesson('led'));assert.equal(s.act('decision','led-check').ok,false);s.start();
 assert.equal(s.act('decision','led-ignore').ok,false);assert.equal(s.step,0);assert.equal(s.slide,'wrong');
 assert.equal(s.act('decision','led-publish').ok,false);assert.equal(s.step,0);assert.equal(s.slide,'wrong');
 s.act('decision','led-check');assert.equal(s.act('decision','led-check').ok,false);assert.equal(s.step,1);
 s.act('decision','led-hold');assert.equal(s.slide,'standby');assert.equal(s.errors,3);
 assert.match(s.log.find(x=>x.type==='warning').text,/Bố cục đẹp/);
});
test('lighting changes both the stage preset and program camera before approval',()=>{
 const s=new DecisionScenario(getLesson('lighting'));s.start();assert.equal(s.light,'show');assert.equal(s.programCamera,'wide');
 s.act('decision','light-check');s.act('decision','light-warm');assert.equal(s.light,'warm');assert.equal(s.programCamera,'wide');
 s.act('decision','light-camera');assert.equal(s.programCamera,'speaker');assert.equal(s.recovered,false);
 s.act('decision','light-preview');s.act('decision','light-go');assert.equal(s.recovered,true);
});
test('reset clears decisions, hints, timing and previous role effects',()=>{
 let now=1000;const s=new DecisionScenario(getLesson('question'),()=>now);s.start();s.act('hint');s.act('decision','qa-listen');now+=5000;
 s.reset();assert.equal(s.started,false);assert.equal(s.step,0);assert.equal(s.hints,0);assert.equal(s.decisions.length,0);assert.equal(s.log.length,0);assert.equal(s.report().durationSeconds,0);assert.equal(s.audience,'hand');
});
test('report snapshots cannot mutate the stored decision evidence',()=>{
 const s=new DecisionScenario(getLesson('news'));s.start();s.act('decision','news-hold');const report=s.report();report.decisions[0].label='changed';report.log[0].text='changed';assert.notEqual(s.report().decisions[0].label,'changed');assert.notEqual(s.report().log[0].text,'changed');
});
test('library covers six roles with unique scenarios and safe step-specific choice IDs',()=>{
 assert.equal(new Set(LESSONS.map(x=>x.role)).size,6);assert.equal(new Set(LESSONS.map(x=>x.id)).size,LESSONS.length);
 for(const l of LESSONS.filter(x=>x.id!=='mic')){const ids=l.steps.flatMap(x=>x.choices.map(c=>c.id));assert.equal(new Set(ids).size,ids.length);for(const step of l.steps){assert.ok(step.choices.some(c=>c.valid));assert.ok(step.choices.some(c=>!c.valid));}}
});
