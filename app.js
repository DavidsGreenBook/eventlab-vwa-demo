import * as THREE from './vendor/three.module.js';
import { Scenario, TASKS } from './scenario.js';
import { createIllustration } from './fallback.js';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const sim=new Scenario();
let guide=true,sound=true,toastTimeout,faultTimeout,audioCtx,musicInterval,renderer,scene,camera,rig,led,ledTexture,missionTexture,missionCanvas,stageSpot,fillSpot,micLamp,deskButtons=[],sceneLights=[],sceneLightsTargets=[],beams=[],controls=[],seatPeople=[],isLoaded=false,lastSpeech='',illustration;
const viewport=$('#viewport');
const colors={lime:0xc6ee98,purple:0xa18bff,warm:0xffd3a0};

function toast(message,bad=false){const el=$('#toast');el.textContent=message;el.className=bad?'visible warning':'visible';clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.className='',4500);}
function mmss(seconds){return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
function tone(freq=440,duration=.12,gain=.06){if(!sound||!audioCtx)return;const o=audioCtx.createOscillator(),v=audioCtx.createGain();o.type='sine';o.frequency.value=freq;v.gain.setValueAtTime(gain*sim.volume,audioCtx.currentTime);v.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(v);v.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration);}
function ensureAudio(){try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();audioCtx.resume().catch(()=>{});}catch{}}
function speak(text){if(!sound||!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const voices=window.speechSynthesis.getVoices();const voice=voices.find(v=>v.lang.startsWith('vi'));if(!voice)return;const u=new SpeechSynthesisUtterance(text);u.lang='vi-VN';u.voice=voice;u.rate=1;u.volume=.75;window.speechSynthesis.speak(u);}
function music(){clearInterval(musicInterval);let beat=0;musicInterval=setInterval(()=>{if(sim.live&&!sim.finished&&sound){const notes=[261.63,329.63,392,523.25,392,329.63,293.66,392];tone(notes[beat++%notes.length],.22,.04);}},360);setTimeout(()=>clearInterval(musicInterval),5500);}

function paintTasks(){
 $('#tasks').replaceChildren();
 TASKS.forEach(([title,desc],i)=>{const li=document.createElement('li');li.className=`task ${i<sim.step?'done':i===sim.step?'current':''}`;const index=document.createElement('span');index.className='task-index';index.textContent=i<sim.step?'✓':String(i+1);const body=document.createElement('div'),h=document.createElement('h3');h.textContent=title;body.append(h);if(i===sim.step&&guide){const p=document.createElement('p');p.textContent=desc;body.append(p);}li.append(index,body);$('#tasks').append(li);});
}
function paintLog(){const box=$('#log');box.replaceChildren();for(const item of [...sim.log].reverse().slice(0,35)){const row=document.createElement('div');row.className=`log-entry ${item.type}`;const time=document.createElement('time');time.textContent=mmss(Math.max(0,Math.round((item.at-(sim.startedAt??item.at))/1000)));row.append(time,document.createTextNode(item.text));box.append(row);}$('#log-count').textContent=sim.log.length;}
function update(){
 $('#progress-value').textContent=`${sim.step} / 7`;$('#progress-bar').style.width=`${sim.step/7*100}%`;$('#timer').textContent=mmss(sim.report().durationSeconds);
 for(const n of [1,2]){const el=$(`#mic${n}`);el.classList.toggle('on',sim[`mic${n}`]);el.classList.toggle('broken',n===1&&sim.fault);el.setAttribute('aria-pressed',String(sim[`mic${n}`]));}
 $('#volume').value=Math.round(sim.volume*100);$('#volume-value').textContent=`${Math.round(sim.volume*100)}%`;
 const signal=$('#signal');const audible=sim.volume>=.3&&(sim.fault?sim.mic2:sim.mic1);
 signal.textContent=sim.fault?(audible?'MIC 2 HOẠT ĐỘNG':'MIC 1 MẤT TÍN HIỆU'):(sim.tested?'TÍN HIỆU TỐT':'CHƯA KIỂM TRA');signal.className='signal '+(sim.fault&&!audible?'bad':sim.tested?'good':'');
 $$('[data-slide]').forEach(b=>{b.classList.toggle('selected',b.dataset.slide===sim.slide);b.setAttribute('aria-pressed',String(b.dataset.slide===sim.slide));});
 $$('[data-light]').forEach(b=>{b.classList.toggle('selected',b.dataset.light===sim.light);b.setAttribute('aria-pressed',String(b.dataset.light===sim.light));});
 $('#ready').textContent=sim.ready?'Đã báo sẵn sàng':'Báo sẵn sàng';$('#go').innerHTML=sim.live?'Đang chạy chương trình':'<span class="play">▶</span>Chạy mở màn';$('#finish').disabled=!sim.recovered||sim.finished;
 const live=$('#live-status');live.textContent=sim.finished?'HOÀN THÀNH':sim.fault&&!sim.recovered?'SỰ CỐ ÂM THANH':sim.live?'ĐANG DIỄN RA':'TỔNG DUYỆT';live.className='live-status '+(sim.fault&&!sim.recovered?'fault':sim.live?'running':'');
 if(sim.started){$('#director').textContent=sim.message;if(sim.message!==lastSpeech){lastSpeech=sim.message;speak(sim.message);}}
 paintTasks();paintLog();paintLED();paintWorldMission();updateWorld();illustration?.draw();
}
function run(action,value){
 ensureAudio();if(!sim.started){$('#welcome').showModal();return;}
 const before=sim.step;const result=sim.act(action,value);
 if(!result.ok)toast(result.message,true);else if(action==='hint')toast(result.message);else if(action==='test')tone(sim.fault?180:660,.2,.09);
 if(action==='go'&&result.ok&&sim.live&&!faultTimeout&&!sim.fault){music();faultTimeout=setTimeout(()=>{faultTimeout=null;sim.injectFault();tone(180,.45,.1);update();toast('Sự cố: micro diễn giả mất tiếng. Kiểm tra tín hiệu.',true);},9500);}
 if(before!==sim.step&&sim.step!==5)tone(700,.08,.035);
 update();
 if(action==='finish'&&result.ok){clearInterval(musicInterval);showResults();}
}
function start(){ensureAudio();if(!sim.started)sim.start();$('#welcome').close();update();}
function reset(){clearTimeout(faultTimeout);faultTimeout=null;clearInterval(musicInterval);if('speechSynthesis'in window)window.speechSynthesis.cancel();lastSpeech='';sim.reset();$('#results').close();start();toast('Lượt thực hành mới đã sẵn sàng.');}
function showResults(){const r=sim.report();$('#result-grid').innerHTML=`<div class="metric"><strong>${r.completedSteps}/7</strong><span>Nhiệm vụ hoàn thành</span></div><div class="metric"><strong>${mmss(r.durationSeconds)}</strong><span>Thời gian thực hành</span></div><div class="metric"><strong>${r.recoverySeconds??0}s</strong><span>Thời gian khôi phục âm thanh</span></div><div class="metric"><strong>${r.invalidActions}</strong><span>Thao tác cần điều chỉnh</span></div>`;$('#feedback').textContent=r.invalidActions?`Bạn đã hoàn thành quy trình và khôi phục đúng cấu hình. Xem lại ${r.invalidActions} thao tác chưa phù hợp trong nhật ký, chú ý điều kiện sẵn sàng và cách kiểm tra tín hiệu trước khi chuyển kênh.`:'Bạn đã hoàn thành kiểm tra, nhận cue và cô lập kênh lỗi theo đúng trình tự. Ở lượt sau, thử tắt hướng dẫn để tự quyết định cách xử lý.';if(!renderer?.xr.isPresenting)$('#results').showModal();}

$$('[data-action]').forEach(b=>b.addEventListener('click',()=>run(b.dataset.action)));
$$('[data-slide]').forEach(b=>b.addEventListener('click',()=>run('slide',b.dataset.slide)));
$$('[data-light]').forEach(b=>b.addEventListener('click',()=>run('light',b.dataset.light)));
$('#volume').addEventListener('change',e=>run('volume',Number(e.target.value)/100));$('#volume').addEventListener('input',e=>$('#volume-value').textContent=`${e.target.value}%`);
$('#start').onclick=start;$('#help').onclick=()=>$('#welcome').showModal();$('#reset').onclick=reset;$('#again').onclick=reset;$('#hint').onclick=()=>run('hint');$('#repeat').onclick=()=>speak(sim.started?sim.message:$('#director').textContent);
$('#guide').onclick=()=>{guide=!guide;$('#guide').classList.toggle('on',guide);$('#guide').setAttribute('aria-pressed',String(guide));paintTasks();paintWorldMission();};
$('#sound').onclick=()=>{sound=!sound;$('#sound').textContent=sound?'Âm thanh bật':'Âm thanh tắt';$('#sound').setAttribute('aria-pressed',String(sound));if(!sound&&'speechSynthesis'in window)window.speechSynthesis.cancel();if(sound)ensureAudio();};
$$('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).close());
$('#export').onclick=()=>{const blob=new Blob([JSON.stringify(sim.report(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='EventLab_Nhat_ky_thuc_hanh.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};

// All geometry and textures are authored procedurally for this demo.
function mat(color,roughness=.6,metalness=0){return new THREE.MeshStandardMaterial({color,roughness,metalness});}
function box(w,h,d,material,x=0,y=0,z=0,parent=scene){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
function cyl(radius,height,material,x,y,z,parent=scene){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,height,12),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
function sphere(radius,material,x,y,z,parent=scene){const mesh=new THREE.Mesh(new THREE.SphereGeometry(radius,12,8),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function texture(c){const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function planeLabel(text,w,h,font=50,color='#dce9fb',bg='#142033'){const c=canvas(768,Math.round(768*h/w)),ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`600 ${font}px Arial`;ctx.fillStyle=color;ctx.fillText(text,c.width/2,c.height/2,c.width-35);const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture(c)}));return m;}
function wrap(ctx,text,x,y,maxWidth,lineHeight){const words=text.split(' ');let line='';for(const word of words){const test=line+word+' ';if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line.trim(),x,y);line=word+' ';y+=lineHeight;}else line=test;}ctx.fillText(line.trim(),x,y);return y+lineHeight;}
function buildHall(){
 const navy=mat(0x18223b),black=mat(0x111827),steel=mat(0x55617a,.35,.7),seatMat=mat(0x32344e),accent=new THREE.MeshBasicMaterial({color:0x9f82ee});
 box(28,.15,35,mat(0x192235,.45),0,-.12,-1).receiveShadow=true;
 const grid=new THREE.GridHelper(28,28,0x3b4b63,0x243046);grid.position.set(0,-.035,-1);scene.add(grid);
 box(28,10,.25,navy,0,5,-14);box(.25,10,35,navy,-14,5,-1);box(.25,10,35,navy,14,5,-1);box(28,.1,35,black,0,10,-1);
 for(let i=0;i<9;i++){for(const side of [-1,1]){box(.16,6,.9,mat(0x2a3550),side*13.75,3.4,-12+i*3.1);box(.04,3.4,.05,accent,side*13.61,3,-11.5+i*3.1);}}
 // Stage, steps, LED wall and side branding.
 const stage=box(16,.65,6,mat(0x28334c,.4),0,.32,-10);stage.receiveShadow=true;
 box(15.8,.035,.035,accent,0,.66,-7.02);
 box(6,.2,.75,mat(0x39455d),0,.1,-6.3);box(7,.12,.6,mat(0x2e3a51),0,.02,-5.8);
 box(10.6,5,.25,black,0,3.85,-12.1);
 const c=canvas(1536,768);ledTexture=texture(c);led=new THREE.Mesh(new THREE.PlaneGeometry(10.2,4.65),new THREE.MeshBasicMaterial({map:ledTexture}));led.position.set(0,3.85,-11.95);scene.add(led);
 for(const x of [-6.8,6.8]){box(1.3,4.6,.2,mat(0x252d46),x,3.2,-12);const logo=planeLabel('VWA',1.15,.7,170,'#c7ed9c','#252d46');logo.position.set(x,4.7,-11.85);scene.add(logo);box(.03,2.5,.03,accent,x,2.5,-11.8);}
 // Trusses and suspended lighting fixtures.
 for(const z of [-11.5,-7.5]){box(17,.12,.12,steel,0,7.2,z);box(17,.12,.12,steel,0,7.65,z);for(let x=-8;x<=8;x+=.8){const b=box(.06,.65,.06,steel,x,7.43,z);b.rotation.z=x%1.6===0?.8:-.8;}}
 for(const x of [-8.5,8.5]){box(.13,7,.13,steel,x,3.8,-10.5);box(.13,7,.13,steel,x+.4,3.8,-10.5);for(let y=1;y<7;y+=.7){const b=box(.6,.05,.06,steel,x+.2,y,-10.5);b.rotation.z=.6;}}
 for(let i=0;i<6;i++){const x=-6.3+i*2.5;const fixture=box(.45,.4,.5,black,x,6.9,-7.5);fixture.rotation.x=-.3;const light=new THREE.SpotLight(i%2?0x9b84ff:0xf1b8ff,0,30,.4,.7,1.4);light.position.set(x,6.65,-7.5);light.target.position.set(x*.7,.7,-9.4);scene.add(light,light.target);sceneLights.push(light);const beam=new THREE.Mesh(new THREE.ConeGeometry(1.3,6.1,24,1,true),new THREE.MeshBasicMaterial({color:i%2?0x9c8afe:0xe5a3ff,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));beam.position.set(x,3.6,-8);beam.rotation.z=Math.PI;scene.add(beam);beams.push(beam);}
 stageSpot=new THREE.SpotLight(0xffdbb6,0,35,.65,.6,1);stageSpot.position.set(-3,7,-4);stageSpot.target.position.set(0,1,-9);scene.add(stageSpot,stageSpot.target);
 fillSpot=new THREE.PointLight(0x9c8fff,7,20,1.7);fillSpot.position.set(0,4,-11);scene.add(fillSpot);
 // Speaker podium and presenters.
 box(.8,1.15,.65,mat(0xb7c1cb,.35),-3.3,1.22,-8.4);box(.95,.08,.8,black,-3.3,1.83,-8.4);const podiumLogo=planeLabel('VWA',.62,.3,150,'#13243b','#c7ed9c');podiumLogo.position.set(-3.3,1.4,-8.06);scene.add(podiumLogo);
 cyl(.025,.35,black,-3.22,2.03,-8.3);sphere(.055,black,-3.22,2.22,-8.3);
 const person=new THREE.Group();person.position.set(-3.3,.66,-9.1);sphere(.19,mat(0xcda184),0,1.6,0,person);const body=cyl(.24,.8,mat(0xc6d1e0),0,1.03,0,person);body.scale.z=.7;box(.14,.65,.17,black,-.13,.35,0,person);box(.14,.65,.17,black,.13,.35,0,person);scene.add(person);
 for(const x of [1.1,3.1]){box(.9,.18,.85,mat(0xb7afc5),x,1.02,-9.7);box(.9,.85,.16,mat(0x7d7891),x,1.4,-10.05);for(const dx of [-.35,.35])box(.06,.45,.06,steel,x+dx,.77,-9.7);}
 cyl(.5,.08,mat(0x25364c),2.1,1.1,-8.5);cyl(.05,.48,steel,2.1,.84,-8.5);
 // Audience: repeated simple geometry, separated by a center aisle.
 const skin=[0xbe9179,0xa47d69,0xd4ac92],clothes=[0x374b66,0x524864,0x365957,0x6c5968];
 for(let row=0;row<6;row++)for(let col=0;col<10;col++){
  const x=(col<5?col-5.8:col-3.2)*1.08,z=-3.5+row*1.45;
  box(.8,.15,.75,seatMat,x,.43,z);box(.8,.75,.12,seatMat,x,.85,z+.35);box(.05,.35,.05,steel,x-.3,.18,z);
  const g=new THREE.Group();g.position.set(x,0,z);sphere(.16,mat(skin[(col+row)%3]),0,1.17,.05,g);const torso=box(.45,.5,.3,mat(clothes[(col+2*row)%4]),0,.77,0,g);torso.rotation.x=.06;sphere(.165,mat(0x23222b),0,1.23,.08,g).scale.set(1,.55,1);scene.add(g);seatPeople.push(g);
 }
 // Aisle edge lights.
 for(const x of [-.75,.75])box(.025,.02,9,new THREE.MeshBasicMaterial({color:0x697e9e}),x,.02,.3);
 // Technical station: controller panel usable with a mouse or WebXR rays.
 box(2.7,.16,1.3,mat(0x161e2f),0,1.0,6);for(const x of [-1.15,1.15])box(.1,.94,.1,steel,x,.47,6.2);
 const board=new THREE.Group();board.position.set(0,1.08,5.95);board.rotation.x=-.95;scene.add(board);
 box(2.5,1.0,.06,mat(0x29354b),0,0,0,board);
 const definitions=[['MIC 1','mic1'],['MIC 2','mic2'],['KIỂM TRA','test'],['LED INTRO','slide','intro'],['SÁNG ẤM','light','warm'],['SẴN SÀNG','ready'],['MỞ MÀN','go'],['KẾT THÚC','finish'],['GỢI Ý','hint'],['ÂM LƯỢNG +','louder'],['ÂM LƯỢNG −','quieter'],['LUYỆN LẠI','reset']];
 definitions.forEach(([label,action,value],i)=>{const mesh=planeLabel(label,.54,.17,50,'#dce8f4',action==='go'?'#526d3f':'#34445e');mesh.position.set(-.88+(i%4)*.59,.3-Math.floor(i/4)*.26,.04);mesh.userData={action,value};board.add(mesh);deskButtons.push(mesh);});
 const monitor=new THREE.Group();monitor.position.set(1.8,1.75,5.65);monitor.rotation.y=-.28;scene.add(monitor);missionCanvas=canvas(1024,850);missionTexture=texture(missionCanvas);const panel=new THREE.Mesh(new THREE.PlaneGeometry(1.45,1.2),new THREE.MeshBasicMaterial({map:missionTexture}));monitor.add(panel);box(1.51,1.26,.07,black,0,0,-.04,monitor);
 micLamp=new THREE.Mesh(new THREE.SphereGeometry(.045,12,8),new THREE.MeshBasicMaterial({color:0x6e7d94}));micLamp.position.set(-1.1,1.22,5.8);scene.add(micLamp);
}
function paintLED(){if(!ledTexture)return;const c=ledTexture.image,ctx=c.getContext('2d'),w=c.width,h=c.height;const grad=ctx.createLinearGradient(0,0,w,h);grad.addColorStop(0,sim.slide==='standby'?'#17233e':'#292355');grad.addColorStop(.55,'#25294e');grad.addColorStop(1,sim.slide==='live'?'#5b386e':'#263754');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);for(let i=0;i<18;i++){ctx.beginPath();ctx.strokeStyle=`rgba(185,163,250,${.07+i*.004})`;ctx.lineWidth=3;ctx.moveTo(w*.6+i*19,-50);ctx.bezierCurveTo(w*.4+i*28,h*.4,w*.95-i*12,h*.5,w*.7+i*30,h+50);ctx.stroke();}ctx.fillStyle='#c6ee98';ctx.font='500 27px Arial';ctx.fillText('HỌC VIỆN PHỤ NỮ VIỆT NAM',90,92);ctx.fillStyle='#f3f1fc';ctx.font='bold 96px Arial';ctx.fillText(sim.slide==='standby'?'MỌI TRẢI NGHIỆM':'TRUYỀN THÔNG',86,275);ctx.fillText(sim.slide==='standby'?'BẮT ĐẦU TỪ ĐÂY.':'CÓ TRÁCH NHIỆM.',86,390);ctx.fillStyle='#d2c6eb';ctx.font='32px Arial';ctx.fillText(sim.slide==='standby'?'Đang chuẩn bị chương trình':sim.slide==='intro'?'TALKSHOW · KẾT NỐI TRI THỨC, LAN TỎA GIÁ TRỊ':'TALKSHOW · ĐANG DIỄN RA',90,485);ctx.fillStyle='#c6ee98';ctx.fillRect(90,563,86,5);ctx.font='24px Arial';ctx.fillStyle='#b4bbd3';ctx.fillText('EventLab VWA   /   Không gian thực hành sự kiện',90,675);ledTexture.needsUpdate=true;}
function paintWorldMission(){if(!missionCanvas)return;const ctx=missionCanvas.getContext('2d');ctx.fillStyle='#131e30';ctx.fillRect(0,0,1024,850);ctx.fillStyle='#c6ee98';ctx.font='bold 30px Arial';ctx.fillText('EVENTLAB · BÀN KỸ THUẬT',50,65);ctx.fillStyle='#9db0cf';ctx.font='25px Arial';ctx.fillText(sim.finished?'ĐÃ HOÀN THÀNH':`NHIỆM VỤ ${Math.min(sim.step+1,7)} / 7`,50,125);ctx.fillStyle='#f4f6fc';ctx.font='bold 43px Arial';let y=wrap(ctx,sim.finished?'Đã khôi phục âm thanh':TASKS[Math.min(sim.step,6)][0],50,205,910,58);ctx.font='29px Arial';ctx.fillStyle='#c0ccdf';if(guide&&!sim.finished)y=wrap(ctx,TASKS[Math.min(sim.step,6)][1],50,y+40,910,43);ctx.fillStyle='#b9a0ff';ctx.font='bold 25px Arial';ctx.fillText('BỘ ĐÀM · ĐẠO DIỄN',50,465);ctx.fillStyle='#ebedf5';ctx.font='28px Arial';wrap(ctx,sim.message,50,520,910,41);ctx.fillStyle='#8598b5';ctx.font='24px Arial';ctx.fillText(sim.finished?`Thời gian ${mmss(sim.report().durationSeconds)} · Chọn LUYỆN LẠI để bắt đầu`:'Dùng tia chỉ và nút cò để chọn công cụ.',50,785);missionTexture.needsUpdate=true;}
function updateWorld(){if(!stageSpot)return;stageSpot.intensity=sim.light==='warm'?42:sim.light==='show'?22:3;fillSpot.intensity=sim.light==='show'?18:7;sceneLights.forEach((l,i)=>l.intensity=sim.light==='show'?24:sim.light==='warm'?3:0);beams.forEach(b=>b.material.opacity=sim.light==='show'?.065:0);micLamp.material.color.setHex(sim.fault&&!sim.mic2?0xff735b:sim.tested?colors.lime:0x6e7d94);}

const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),rotation=new THREE.Matrix4(),tempOrigin=new THREE.Vector3(),tempDir=new THREE.Vector3();
function executeWorld(mesh){const{action,value}=mesh.userData;if(action==='reset'){reset();return;}if(action==='louder'){run('volume',sim.volume+.1);return;}if(action==='quieter'){run('volume',sim.volume-.1);return;}run(action,value);}
function controllerHit(controller){rotation.identity().extractRotation(controller.matrixWorld);tempOrigin.setFromMatrixPosition(controller.matrixWorld);tempDir.set(0,0,-1).applyMatrix4(rotation);raycaster.set(tempOrigin,tempDir);return raycaster.intersectObjects(deskButtons,false)[0];}
function setupXR(){
 renderer.xr.enabled=true;renderer.xr.setReferenceSpaceType('local-floor');
 for(let i=0;i<2;i++){const controller=renderer.xr.getController(i);const geometry=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,-1)]);const line=new THREE.Line(geometry,new THREE.LineBasicMaterial({color:i?0xb39aff:0xc6ee98}));line.scale.z=5;controller.add(line);const grip=renderer.xr.getControllerGrip(i);box(.035,.04,.11,mat(0xaab8ce),0,0,.025,grip);rig.add(controller,grip);controller.addEventListener('selectstart',()=>{const hit=controllerHit(controller);if(hit)executeWorld(hit.object);});controls.push(controller);}
 renderer.xr.addEventListener('sessionstart',()=>{document.body.classList.add('xr-active');$('#welcome').close();$('#results').close();if(!sim.started)start();rig.position.set(0,0,7);rig.rotation.set(0,0,0);camera.position.set(0,1.7,0);camera.rotation.set(0,0,0);$('#vr').textContent='Thoát VR';});
 renderer.xr.addEventListener('sessionend',()=>{document.body.classList.remove('xr-active');cameraView('tech');$('#vr').textContent='Vào VR';if(sim.finished)showResults();});
 const button=$('#vr');if(!navigator.xr){button.textContent='VR cần kính tương thích';button.title='Mở đường link trên trình duyệt của kính hỗ trợ WebXR.';return;}
 navigator.xr.isSessionSupported('immersive-vr').then(supported=>{button.disabled=!supported;button.textContent=supported?'Vào VR':'VR cần kính tương thích';}).catch(()=>{button.textContent='VR chưa khả dụng';});
 button.onclick=async()=>{try{ensureAudio();if(renderer.xr.isPresenting){await renderer.xr.getSession().end();return;}const session=await navigator.xr.requestSession('immersive-vr',{requiredFeatures:['local-floor'],optionalFeatures:['bounded-floor']});await renderer.xr.setSession(session);}catch(e){toast('Chưa thể vào VR. Kiểm tra quyền truy cập và trình duyệt trong kính.',true);console.warn('WebXR session:',e.message);}};
}
let currentCamera='tech',lookYaw=0,lookPitch=0,dragStart=null,didDrag=false;
function cameraView(mode){if(illustration){illustration.view(mode);$$('[data-camera]').forEach(b=>b.classList.toggle('selected',b.dataset.camera===mode));return;}if(!camera||renderer.xr.isPresenting)return;currentCamera=mode;lookYaw=0;lookPitch=0;rig.position.set(0,0,0);rig.rotation.set(0,0,0);if(mode==='stage'){camera.position.set(0,1.9,-7.3);camera.lookAt(0,1.4,7);}else if(mode==='wide'){camera.position.set(9,6.2,9);camera.lookAt(0,2,-7);}else{camera.position.set(0,2.05,7.4);camera.lookAt(0,2.65,-9);}camera.userData.baseQuat=camera.quaternion.clone();$$('[data-camera]').forEach(b=>b.classList.toggle('selected',b.dataset.camera===mode));}
$$('[data-camera]').forEach(b=>b.onclick=()=>cameraView(b.dataset.camera));
function resize(){if(!renderer||renderer.xr.isPresenting)return;const r=viewport.getBoundingClientRect();camera.aspect=r.width/Math.max(r.height,1);camera.updateProjectionMatrix();renderer.setSize(r.width,r.height);}
function init(){
 try{
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;viewport.append(renderer.domElement);
  scene=new THREE.Scene();scene.background=new THREE.Color(0x0d1422);scene.fog=new THREE.Fog(0x11182b,20,55);camera=new THREE.PerspectiveCamera(54,1,.05,90);rig=new THREE.Group();rig.add(camera);scene.add(rig);
  scene.add(new THREE.HemisphereLight(0xc1d8ff,0x363045,2.1));const ambient=new THREE.DirectionalLight(0x9eb5de,1.6);ambient.position.set(2,9,8);scene.add(ambient);
  buildHall();setupXR();cameraView('tech');resize();new ResizeObserver(resize).observe(viewport);
  renderer.domElement.addEventListener('pointerdown',e=>{dragStart={x:e.clientX,y:e.clientY,yaw:lookYaw,pitch:lookPitch};didDrag=false;});
  renderer.domElement.addEventListener('pointermove',e=>{if(!dragStart)return;const dx=e.clientX-dragStart.x,dy=e.clientY-dragStart.y;if(Math.abs(dx)+Math.abs(dy)>5)didDrag=true;if(didDrag){lookYaw=THREE.MathUtils.clamp(dragStart.yaw-dx*.002,-.8,.8);lookPitch=THREE.MathUtils.clamp(dragStart.pitch-dy*.002,-.35,.35);camera.quaternion.copy(camera.userData.baseQuat);camera.rotateY(lookYaw);camera.rotateX(lookPitch);}});
  window.addEventListener('pointerup',e=>{if(!dragStart)return;if(!didDrag&&e.target===renderer.domElement){const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(deskButtons,false)[0];if(hit)executeWorld(hit.object);}dragStart=null;});
  renderer.setAnimationLoop((time)=>{if(renderer.xr.isPresenting)controls.forEach(c=>{const hit=controllerHit(c);c.children[0].scale.z=hit?hit.distance:4;});if(sim.live&&!sim.finished&&sim.light==='show'){sceneLights.forEach((l,i)=>l.target.position.x=Math.sin(time*.0004+i)*4);seatPeople.forEach((p,i)=>{p.rotation.z=Math.sin(time*.001+i)*.012;});}renderer.render(scene,camera);});
  isLoaded=true;update();
 }catch(e){console.warn('WebGL chưa khả dụng; dùng chế độ minh họa.',e.message);const msg=$('#render-error');msg.hidden=false;msg.className='illustration-badge';msg.textContent='MINH HỌA 2D · TRÌNH DUYỆT CHƯA HỖ TRỢ WEBGL';illustration=createIllustration(viewport,()=>sim);$('#vr').textContent='VR cần WebGL & kính';$('#vr').disabled=true;$('#scene-note').textContent='Kéo chuột để đổi góc nhìn minh họa · Thao tác trên bảng điều khiển';paintTasks();}
}
init();paintTasks();setInterval(()=>{if(sim.started)$('#timer').textContent=mmss(sim.report().durationSeconds);},500);$('#welcome').showModal();
