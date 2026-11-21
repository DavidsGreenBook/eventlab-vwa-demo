import {PROGRAMMES} from './campus-data.js';
function builder(){
 const items=[],targets=[];
 const box=(x,y,z,w,h,d,color,extra={})=>{const item={type:'box',p:[x,y,z],s:[w,h,d],color,...extra};items.push(item);return item;};
 const sphere=(x,y,z,r,color,extra={})=>{const item={type:'sphere',p:[x,y,z],s:[r,r,r],color,...extra};items.push(item);return item;};
 const label=(text,x,y,z,w,h,color='#14394d',bg='#eaf3ef',extra={})=>{const item={type:'label',text,p:[x,y,z],s:[w,h],color,bg,bgEnd:bg,...extra};items.push(item);return item;};
 function person(x,y,z,c='#547a81',seated=false,extra={}){
  const meta={...extra};box(x,y+(seated?1.03:1.3),z,.56,seated?.7:.88,.34,c,meta);sphere(x,y+(seated?1.6:2),z,.24,'#c6a68d',{person:true,...meta});box(x,y+(seated?1.77:2.17),z+.05,.44,.16,.38,'#29383e',meta);
  if(!seated){for(const dx of [-.15,.15])box(x+dx,y+.48,z,.2,.96,.23,'#374c59',meta);for(const dx of [-.38,.38])box(x+dx,y+1.26,z,.16,.85,.2,c,{...meta,rz:dx*.12});}
 }
 function chair(x,y,z,c='#708f9c'){box(x,y+.5,z,1,.16,.95,c);box(x,y+1,z+.42,1,.9,.14,c);box(x,y+.24,z,.12,.48,.12,'#5d7279');}
 function tree(x,z,r=2){box(x,1.5,z,.4,3,.4,'#90775b');sphere(x,3.8,z,r,'#67a458');sphere(x-r*.6,3.5,z+.3,r*.7,'#7fb36b');sphere(x+r*.6,3.5,z,r*.7,'#568c4e');}
 function desk(x,y,z,w=4){box(x,y+1,z,w,.15,1.6,'#a2b4b7');for(const dx of [-w*.4,w*.4])box(x+dx,y+.5,z,.1,1,.1,'#7a919b');}
 function screen(text,x,y,z,w=3,h=1.6,bg='#e3eceb'){box(x,y,z,w+.12,h+.12,.12,'#243f53',{labelBacking:true});return label(text,x,y,z+.08,w,h,'#224453',bg);}
 function stageScreen(text,x,y,z,w,h,c,bg){box(x,y,z,w+.3,h+.3,.18,'#1b334b',{labelBacking:true});return label(text,x,y,z+.11,w,h,c,bg,{bgEnd:bg});}
 function mediaStation(x,z,c='#2e7f8b'){
  box(x,.05,z,10,.1,13,'#d7e0de');box(x,2,z-6.3,10,4,.16,c,{labelBacking:true});label('TRUYỀN THÔNG\nPHỎNG VẤN NHANH',x,2.7,z-6.18,8,1.8,'#f1f7f4',c);
  for(const dx of [-2,2]){chair(x+dx,0,z-3,'#b2c5c8');person(x+dx,0,z-3,'#7d94a6',true);}
  box(x,1.1,z,.1,2.2,.1,'#6b818b');box(x,2.2,z,.6,.4,.7,'#233e53');desk(x,0,z+4,7);screen('NỘI DUNG\nLIVESTREAM',x,2,z+3.6,3,1.5);person(x,0,z+5.5,'#688ca2',true);
 }
 function controlStation(x,z,y=0){
  desk(x,y,z,12);for(const dx of [-4,0,4]){screen(dx?'PROGRAM\nCAM 01':'ÂM THANH\nMIC 1 · MIC 2',x+dx,y+2,z-.6,3.2,1.8,'#c9dfdb');box(x+dx,y+1.2,z+.3,3.5,.2,.8,'#3d5666',{console:true});for(let i=0;i<5;i++)box(x+dx-1.3+i*.6,y+1.35,z+.3,.18,.05,.5,'#a6c7c6',{console:true});person(x+dx,y,z+1.8,'#678399',true);}
  label('ĐIỀU KHIỂN',x,y+3.5,z-.6,8,.7,'#224557','#d9e9e5');
 }
 return {items,targets,box,sphere,label,person,chair,tree,desk,screen,stageScreen,mediaStation,controlStation};
}
export function createCampusModel(){
 const b=builder(),{box,sphere,label,person,tree}=b;
 box(0,-.3,-13,116,.6,116,'#cbdcd9');box(0,.025,10,28,.05,34,'#f1f3ed');
 // A central plaza, shallow reflecting pools and paths to three destinations.
 for(const side of [-1,1]){box(side*22,.03,4,11,.06,21,'#8bc2ce');box(side*22,.08,4,12,.1,.35,'#eef3ed');for(const z of [-6,14])box(side*22,.07,z,12,.1,.4,'#eef3ed');}
 box(0,.035,-17,11,.07,36,'#ecf0e9');for(const side of [-1,1])box(side*22,.035,-10,10,.07,45,'#e8ede5',{ry:side*.9});
 for(let i=0;i<7;i++){box(0,.09,20-i*4,.16,.035,1.2,'#5799a0');}
 // Planters establish the campus-like wayfinding language in the supplied reference.
 for(const [x,z]of [[-43,10],[43,10],[-47,-10],[47,-10],[-18,-30],[18,-30],[-16,24],[16,24]]){
  box(x,.5,z,8,1,7,'#f0f1e8');box(x,1.03,z,7.4,.08,6.4,'#82aa65');tree(x,z,2.8);
 }
 // Formal conference centre: portico and warm ceremonial facade.
 const x=-33,z=-28;box(x,5,z,25,10,15,'#b77d69');box(x,5,z+7.65,24,10,.3,'#d7b59d');box(x,10.5,z,27,1,17,'#735e57');
 for(const dx of [-9,-4.5,4.5,9]){box(x+dx,4,z+9,.65,8,.65,'#e8e4d6');box(x+dx,8.1,z+9,1,.35,1,'#eee9da');}
 box(x,8.8,z+9,24,1,2,'#d6ccba');box(x,1,z+10,25,2,5,'#c1c8bf');box(x,3.1,z+7.9,4.5,4.2,.14,'#397782');
 for(const dx of [-9,-6,6,9])for(const y of [3.5,6.2])box(x+dx,y,z+7.86,1.8,1.7,.08,'#82b4c5');
 label('TRUNG TÂM HỘI NGHỊ',x,9,z+10.1,22,1.1,'#6e3d30','#f0e9db');
 // International lecture centre: glass facade and a ribbed arch.
 box(0,5,-45,24,10,17,'#dbe9e7');box(0,4.7,-36.3,23,8.8,.13,'#8fb9c8');
 for(let i=0;i<11;i++)box(-11+i*2.2,4.7,-36.1,.12,8.8,.15,'#e9f0e9');for(let y=1;y<10;y+=2.5)box(0,y,-36,23,.12,.15,'#e9f0e9');
 for(let i=0;i<17;i++){const a=-Math.PI/2+i*Math.PI/16;box(Math.sin(a)*12,10+Math.cos(a)*4.5,-45,1.7,.3,18,'#d9e4de',{rz:-a*.25});}
 label('GIẢNG ĐƯỜNG QUỐC TẾ',0,9.5,-35.85,22,1.2,'#1e6577','#edf5ef');box(0,2.2,-35.8,5,4.4,.12,'#3f8594');
 // Performance park gate: an open canopy, LED and trusses.
 box(33,.55,-28,28,1.1,18,'#afb9ba');box(33,9.7,-28,30,.4,20,'#8e779d');
 for(const dx of [-14,14]){box(33+dx,5,-23,.3,10,.3,'#7b8c97');box(33+dx,5,-34,.3,10,.3,'#7b8c97');}
 box(33,7.4,-34,24,.3,.3,'#8b9aab');box(33,5,-34,21,6,.2,'#594d78',{labelBacking:true});label('ÂM NHẠC\nVÀ BIỂU DIỄN',33,5,-33.85,20,5.5,'#f4e8df','#594d78');
 for(const dx of [-11,11])for(let y=2;y<8;y+=1.5)box(33+dx,y,-33,1,1.2,1,'#35495e');
 // Three entrances and greeters, with readable in-world programme markers.
 for(const p of PROGRAMMES){const [cx,,cz]=p.building;box(cx,.12,cz+15,6,.25,5,'#7bada6');const mark=box(cx,.35,cz+14,1.3,.1,1.3,p.color,{target:p.id});b.targets.push(mark);label(p.category.toUpperCase(),cx,12.4,cz+9,22,1.35,'#194859','#edf4e9',{billboard:true,target:p.id});person(cx+3,0,cz+13,p.color);label('XEM CHƯƠNG TRÌNH',cx,1.4,cz+13,6,.8,'#f6f7ed',p.color,{billboard:true,target:p.id});}
 // A student avatar and a guide establish the entry point, as in the reference UX.
 person(0,0,14,'#a7b56c',false,{avatar:true});person(-4,0,3,'#2f7e87');box(-4,1.1,4.5,2.2,2.2,1,'#e5ece6');label('EventLab',-4,1.7,5.03,1.9,.5,'#2c7277','#e5ece6');
 label('CHỌN CHƯƠNG TRÌNH\nĐỂ BẮT ĐẦU KHÁM PHÁ',-4,4,4,11,1.6,'#21495c','#eff4e7',{billboard:true});
 for(const [px,pz]of [[-8,-8],[9,-15],[-25,-13],[24,-11],[3,-28]])person(px,0,pz,['#758f9e','#b89b84','#839e8e'][Math.abs(px)%3]);
 return {...b,environment:'day',avatarOrigin:[0,0,14],bounds:{minX:-60,maxX:60,minZ:-65,maxZ:65}};
}
export function createEventModel(id){
 const b=builder(),{box,sphere,label,person,chair,tree,desk,screen,stageScreen,mediaStation,controlStation}=b;
 if(id==='ceremony'){
  box(0,-.2,-2,42,.4,57,'#e0dfd5');box(0,7,-30,42,14,.3,'#d2d6ce',{wall:true});box(-21,7,-2,.3,14,57,'#d6d9d0');box(21,7,-2,.3,14,57,'#d6d9d0',{cutaway:true});
  for(const x of [-20.7,20.7])for(let z=-26;z<25;z+=6)box(x,5,z,.2,10,1,'#af8c65',{cutaway:x>0});
  box(0,.65,-23,29,1.3,11,'#ad9780');box(0,1.33,-17.5,29,.05,.1,'#c9ac72');for(let i=0;i<3;i++)box(0,.16+i*.17,-16-i*.55,7,.3+i*.34,.65,'#c4b9a2');
  for(const x of [-16,16])box(x,5.5,-26,2,10,8,'#934b42');
  stageScreen('DIỄN ĐÀN PHỤ NỮ\nVÀ TRUYỀN THÔNG\nLỄ KHAI MẠC',0,6,-28,24,8.6,'#fff6e6','#934a3d');
  box(0,2.25,-21,1.7,1.8,1.1,'#a78b66');label('VWA',0,2.4,-20.43,1.25,.65,'#f5ecd5','#8c674c');person(0,1.3,-22,'#5e7789');
  for(const x of [-12,12]){box(x,3.8,-24,.08,5,.08,'#ac9c7d');box(x+.75,4.6,-24,1.5,2,.05,'#ac4c44');}
  for(let row=0;row<12;row++)for(let block=0;block<3;block++)for(let col=0;col<6;col++){const x=[-13,0,13][block]+(col-2.5)*1.15,z=-10+row*2;chair(x,0,z,'#8f5e52');if((row+col)%6)person(x,0,z,['#677b88','#697f78','#8e7b86'][(row+col)%3],true);}
  for(const x of [-9,-3,3,9]){desk(x,0,-12.5,4.5);screen('ĐẠI BIỂU',x,1.3,-12.4,1.5,.35,'#e8e5d5');}
  controlStation(0,22);mediaStation(26,-15,'#9c6a55');label('BÁO CHÍ VÀ TRUYỀN THÔNG',25,4,0,13,1,'#5b4135','#eee5d6');
  person(-12,0,-14,'#5c8d8c');person(14,0,-15,'#6f8ca1');
 }
 if(id==='forum'){
  box(0,-.25,-4,40,.5,56,'#d9e6e1');box(0,7,-30,40,14,.3,'#d0e4e0');box(-20,7,-4,.3,14,56,'#e4ece5');box(20,7,-4,.3,14,56,'#c4dfdf',{cutaway:true});
  for(let z=-25;z<23;z+=6){box(-19.6,6,z,.12,10,.5,'#5e929c');box(19.6,6,z,.12,10,.5,'#5e929c',{cutaway:true});}
  box(0,.45,-22,25,.9,12,'#9eb9b9');stageScreen('TRUYỀN THÔNG\nTRONG KỶ NGUYÊN SỐ\nINTERNATIONAL FORUM',0,5.7,-28.5,23,8,'#f5f8ec','#2c7d8b');
  for(const x of [-6,-3,0,3,6]){chair(x,.9,-23,'#729aa6');person(x,.9,-23,['#7c8b9d','#a88d85','#6f989b'][Math.abs(x)%3],true);}
  desk(0,.8,-21,16);label('DIỄN GIẢ  /  SPEAKERS',0,2,-20.1,12,.7,'#2a6b7c','#d9ece4');
  for(let row=0;row<8;row++){
   const z=-9+row*3.8,y=row*.65;box(0,y/2,z+1,36,Math.max(.15,y),3.75,'#bbcfd0');
   for(const side of [-1,1])for(let col=0;col<7;col++){const x=side*(3.7+col*1.8);chair(x,y,z,'#548b9e');person(x,y,z,['#718b98','#ad9e7d','#7c9e8b'][(row+col)%3],true);box(x,y+.95,z-.65,1.5,.1,.65,'#b2bcb1');}
  }
  box(-14,6,21,9,.3,7,'#aec5cc');box(-14,7.8,21,9,3.5,.1,'#9dbfc9',{glass:true});label('PHIÊN DỊCH',-14,9.5,21,9,.7,'#216779','#e3eee4');person(-15,6,20,'#66889a',true);person(-12,6,20,'#839ba8',true);
  screen('VIỆT NAM\nNỘI DUNG TRÌNH BÀY',-15,5.5,-22,5,3,'#dae8e2');screen('ENGLISH\nPRESENTATION',15,5.5,-22,5,3,'#dae8e2');
  controlStation(9,22,5.2);mediaStation(25,-14,'#438694');
 }
 if(id==='show'){
  box(0,-.25,-3,84,.5,88,'#34554c');box(0,.02,-1,39,.04,48,'#4b6665');
  box(0,.9,-25,31,1.8,14,'#3c4565');box(0,1.84,-18,31,.06,.12,'#d1a3f0');
  stageScreen('KẾT NỐI\nSÁNG TẠO\nLIVE MUSIC AND PERFORMANCE',0,7,-30.8,25,9,'#f5eaf8','#73448b');
  for(const x of [-17,17]){box(x,7,-24,.3,14,.3,'#8d98ae');box(x+.5,7,-24,.25,14,.25,'#8d98ae');for(let y=3;y<12;y+=1.2)box(x,10-y*.4,-21,1.4,1,1.3,'#263249');}
  box(0,14,-24,35,.3,14,'#4a4862',{roof:true});for(const z of [-31,-18]){box(0,13.3,z,35,.18,.18,'#8997ad');for(let x=-16;x<16;x+=3){box(x,13,z,.6,.4,.6,'#29354d');b.items.push({type:'beam',p:[x,7,-23],s:[1.8,11,1.8],color:x%2?'#b69bef':'#82d6d5'});}}
  for(const x of [-10,-5,5,10])person(x,1.8,-23,['#b899c4','#d1a88c','#89a7c1'][Math.abs(x)%3]);
  for(const x of [-1,0,1]){box(x,2.4,-27,1,.7,.9,'#b975a6');sphere(x,3,-27,.4,'#ba8cba');}box(7,2.5,-26,4,.2,1,'#cbd4de');box(7,2,-26,.15,1,.15,'#818fa7');
  for(let row=0;row<12;row++)for(let col=0;col<16;col++){const x=(col-7.5)*1.7+(col>7?1.2:-1.2),z=-10+row*2;person(x,0,z,['#927faf','#7d9a9f','#b696a6','#a3b486'][(row+col)%4]);}
  for(const z of [-13,14]){box(0,1,z,36,.1,.1,'#a4b5bc');for(let x=-18;x<=18;x+=3)box(x,.5,z,.08,1,.08,'#a4b5bc');}
  box(0,3.8,19,17,.25,8,'#736982',{roof:true});for(const x of [-8,8])box(x,1.9,19,.15,3.8,.15,'#9aa8b3');controlStation(0,19);
  mediaStation(27,-9,'#76558d');box(27,4.2,-9,12,.25,16,'#e1d9e6',{roof:true});label('MEDIA  /  BACKSTAGE',27,4.4,0,12,.8,'#eedff2','#755484');
  for(const x of [-34,36])for(const z of [-20,8,25])tree(x,z,3);
 }
 return {...b,environment:id==='show'?'night':'interior',bounds:{minX:-35,maxX:40,minZ:-32,maxZ:35},eventId:id};
}
