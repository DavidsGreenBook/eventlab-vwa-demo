import {PROGRAMMES,ROLES,getProgramme,CAMPUS_VIEW,EVENT_VIEWS} from './campus-data.js?v=04';
import {createCampusModel,createEventModel} from './campus-model.js?v=04';
import {VenueRenderer} from './venue-renderer.js?v=04';
const query=new URLSearchParams(location.search);
if(query.has('scenario'))location.replace('./practice.html'+location.search);
else if(query.has('zone')&&!query.has('event'))location.replace('./hall.html'+location.search);
else startCampus();
function startCampus(){
 const $=s=>document.querySelector(s),view=new VenueRenderer($('#world-canvas'),id=>selectProgramme(id));
 let selected=getProgramme(query.get('event')),inside=false,currentView='overview',tab='roles',activeRole=null,animation=0;
 function setCamera(data,id){view.camera.fov=inside?57:68;view.camera.updateProjectionMatrix();view.setView(id,data);view.resize();}
 function showMap(){
  animation++;inside=false;currentView='overview';activeRole=null;view.avatarOffset.set(0,0,0);document.body.classList.remove('event-mode','night-world');
  view.rebuild(createCampusModel(),{light:'warm'});setCamera(CAMPUS_VIEW,'campus');$('#world-kicker').textContent='EVENTLAB CAMPUS';$('#world-title').innerHTML='Chọn chương trình.<br>Khám phá vai trò của bạn.';$('#world-subtitle').textContent='Ba bối cảnh sự kiện, ba hành trình thực hành.';
  $('#camera-bar').hidden=true;$('#programme-list').hidden=false;$('#panel-title').textContent='Bạn muốn tham gia sự kiện nào?';$('#panel-subtitle').textContent='Mỗi chương trình mở ra một bối cảnh và nhóm nhiệm vụ khác nhau.';$('#guide-text').textContent=selected?selected.guide:'Chào bạn! Chọn một chương trình trên bản đồ hoặc ở danh sách bên cạnh, rồi tham gia không gian sự kiện.';$('#home').textContent='Bản đồ sự kiện';paintList();paintDetail();setShotLabel();history.replaceState(null,'',location.pathname);
 }
 function paintList(){
  $('#programme-list').replaceChildren();
  for(const p of PROGRAMMES){const b=document.createElement('button');b.type='button';b.className='programme-button'+(selected?.id===p.id?' selected':'');b.style.setProperty('--event-color',p.color);b.setAttribute('aria-label','Xem chương trình '+p.category);b.setAttribute('aria-pressed',String(selected?.id===p.id));b.innerHTML=`<span class="programme-badge">${p.id==='ceremony'?'▥':p.id==='forum'?'◈':'♫'}</span><span><b>${p.category}</b><small>${p.short}</small></span>`;b.onclick=()=>selectProgramme(p.id);$('#programme-list').append(b);}
 }
 function selectProgramme(id){
  const p=getProgramme(id);if(!p)return;if(inside)showMap();selected=p;$('#guide-text').textContent=p.guide;paintList();paintDetail();moveAvatar(p);setShotLabel();
 }
 function moveAvatar(p){
  const epoch=++animation,from=view.avatarOffset.clone(),to=from.clone().set(p.building[0],0,p.building[2]);let start;
  function step(t){if(epoch!==animation||inside)return;start??=t;const k=Math.min(1,(t-start)/1300),ease=k*k*(3-2*k);view.avatarOffset.copy(from).lerp(to,ease);view.request();if(k<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);
 }
 function paintDetail(){
  const host=$('#programme-detail');
  if(!selected){host.innerHTML='<span class="eyebrow">BẮT ĐẦU TỪ BỐI CẢNH</span><h3>Cùng học tổ chức sự kiện, trong nhiều không gian.</h3><p>Gặp hướng dẫn viên, chọn chương trình và khám phá vị trí của các thành viên trong ê kíp.</p><p class="hint">Chọn một toà nhà hoặc một chương trình để xem bối cảnh, mục tiêu học tập và tham gia.</p>';return;}
  const p=selected;host.style.setProperty('--event-color',p.color);
  if(!inside){host.innerHTML=`<span class="event-tag">${p.tag}</span><h3>${p.title}</h3><p>${p.setting}</p><p class="keyline">${p.subtitle}</p><button class="join-button" id="join-programme">Tham gia chương trình</button><p class="hint" style="margin-top:11px">Chọn chương trình để vào không gian và xem các vai trò thực hành.</p>`;$('#join-programme').onclick=joinProgramme;return;}
  host.innerHTML=`<div class="event-tabs"><button data-tab="roles" class="${tab==='roles'?'active':''}">Vai trò</button><button data-tab="scenario" class="${tab==='scenario'?'active':''}">Kịch bản</button><button data-tab="learning" class="${tab==='learning'?'active':''}">Học tập</button></div><div id="tab-content"></div>`;
  host.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;paintDetail();});const body=$('#tab-content');
  if(tab==='roles'){
   body.innerHTML='<span class="event-tag">BẠN SẼ PHỤ TRÁCH CÔNG VIỆC GÌ?</span><div class="role-list" style="margin-top:12px"></div>';
   for(const role of ROLES){const button=document.createElement('button');button.className='role-button'+(activeRole===role.id?' active':'');button.textContent=role.name;button.setAttribute('aria-pressed',String(activeRole===role.id));button.onclick=()=>{activeRole=role.id;chooseView(role.view);paintDetail();};body.querySelector('.role-list').append(button);}
   const role=ROLES.find(x=>x.id===activeRole),desc=document.createElement('p');desc.className=role?'role-description':'hint';desc.textContent=role?role.description:'Chọn một vai để đổi góc nhìn và tìm hiểu nhiệm vụ. Bản này minh hoạ ý tưởng nhập vai.';body.append(desc);
  }
  if(tab==='scenario')body.innerHTML=`<span class="event-tag">ĐỀ BÀI THỰC HÀNH DỰ KIẾN</span><h3>${p.title}</h3><p>${p.brief}</p><span class="eyebrow">MỘT TÌNH HUỐNG MINH HOẠ</span><p class="keyline">${p.situation}</p><p class="hint">Kịch bản dùng để thống nhất nội dung đào tạo; các thao tác xử lý sẽ được phát triển cùng giảng viên.</p>`;
  if(tab==='learning')body.innerHTML=`<span class="event-tag">GIÁ TRỊ HỌC TẬP</span><h3>Học từ bối cảnh đến phối hợp</h3><ul class="learning-list">${p.learning.map(x=>'<li>'+x+'</li>').join('')}</ul><p class="hint">Cùng một sự kiện có các vị trí sân khấu, khán giả, điều khiển và hậu trường. Mục tiêu và tình huống thay đổi theo thể loại.</p>`;
 }
 async function joinProgramme(){
  if(!selected)return;animation++;$('#transition').hidden=false;inside=true;currentView='overview';activeRole=null;tab='roles';view.avatarOffset.set(0,0,0);document.body.classList.add('event-mode');document.body.classList.toggle('night-world',selected.id==='show');
  view.rebuild(createEventModel(selected.id),{light:selected.id==='show'?'show':'warm'});setCamera(EVENT_VIEWS[selected.id].overview,'overview');
  $('#world-kicker').textContent=selected.category.toUpperCase();$('#world-title').textContent=selected.title;$('#world-subtitle').textContent=selected.subtitle;$('#panel-title').textContent=selected.name;$('#panel-subtitle').textContent='Khám phá bối cảnh, vai trò và đề bài thực hành.';$('#programme-list').hidden=true;$('#home').textContent='Về bản đồ';$('#camera-bar').hidden=false;paintViews();paintDetail();setShotLabel();
  history.replaceState(null,'','?event='+selected.id);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));$('#transition').hidden=true;
 }
 function paintViews(){
  const names=[['overview','Toàn cảnh'],['stage','Sân khấu'],['audience','Khán giả'],['control','Điều khiển'],['media','Hậu trường']];$('#camera-bar').replaceChildren();for(const [id,name]of names){const button=document.createElement('button');button.textContent=name;button.dataset.view=id;button.className=id===currentView?'active':'';button.onclick=()=>{activeRole=null;chooseView(id);paintDetail();};$('#camera-bar').append(button);}
 }
 function chooseView(id){if(!inside||!EVENT_VIEWS[selected.id]?.[id])return;currentView=id;setCamera(EVENT_VIEWS[selected.id][id],id==='mc'?'stage':id);paintViews();setShotLabel();}
 function setShotLabel(){const names={overview:'Toàn cảnh',stage:'Sân khấu',audience:'Khán giả',control:'Điều khiển',media:'Hậu trường',mc:'Góc nhìn MC'};$('#shot-label').replaceChildren();const text=document.createTextNode(inside?'EventLab VWA / '+selected.category+' / '+names[currentView]:'EventLab VWA / Bản đồ ba không gian sự kiện');const small=document.createElement('small');small.textContent='Ảnh chụp trực tiếp từ demo biểu đạt ý tưởng';$('#shot-label').append(text,small);}
 function present(value){document.body.classList.toggle('presenting',value);$('#exit-presentation').hidden=!value;$('#shot-label').hidden=!value;view.resize();requestAnimationFrame(()=>view.resize());}
 $('#home').onclick=showMap;$('#reset-view').onclick=()=>setCamera(inside?EVENT_VIEWS[selected.id][currentView]:CAMPUS_VIEW,inside?currentView:'campus');$('#presentation').onclick=()=>present(true);$('#exit-presentation').onclick=()=>present(false);window.addEventListener('keydown',e=>{if(e.key==='Escape')present(false);});$('#about').onclick=()=>$('#about-dialog').showModal();$('#close-about').onclick=()=>$('#about-dialog').close();$('#close-about-bottom').onclick=()=>$('#about-dialog').close();
 document.body.dataset.version='0.4';document.body.dataset.renderer=view.mode;$('#render-mode').textContent=view.mode==='WebGL'?'3D WEBGL':'3D CANVAS';
 const initial=selected;showMap();if(initial){selected=initial;joinProgramme();}
}
