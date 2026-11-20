// One architectural model drives both WebGL and the Canvas software renderer.
// Units describe an illustrative virtual venue, not a construction specification.
export const ZONES={
 overview:{name:'Toàn cảnh hội trường',title:'Một hội trường. Nhiều vị trí nghề nghiệp.',subtitle:'Sân khấu, khán giả, điều khiển và truyền thông trong cùng một không gian.',p:[43,28,44],target:[3,3,-6],walk:[0,1.7,23]},
 stage:{name:'Sân khấu',title:'Thiết kế trải nghiệm trên sân khấu.',subtitle:'Thay nội dung LED, cảnh sáng và bố trí theo kịch bản.',p:[-12,7,5],target:[0,4,-25],walk:[-6,2.7,-19]},
 audience:{name:'Khu khán giả',title:'Nhìn sự kiện từ phía khán giả.',subtitle:'Quan sát sân khấu, phản hồi và thực hành điều phối hỏi đáp.',p:[-5,3.4,4],target:[0,5,-24],walk:[-5.8,1.7,7]},
 control:{name:'Phòng điều khiển',title:'Giữ mọi tín hiệu cùng một nhịp.',subtitle:'Âm thanh, ánh sáng, camera và trình chiếu tại vị trí kỹ thuật.',p:[-9,4.1,34],target:[0,1.8,25],walk:[-5,1.7,29]},
 media:{name:'Truyền thông hậu trường',title:'Câu chuyện tiếp tục sau cánh gà.',subtitle:'Ấn phẩm, livestream, phỏng vấn nhanh và cập nhật bản tin.',p:[46,12,16],target:[29,1.8,-12],walk:[34,1.7,-3]}
};
export const SEAT_COUNT=480;
export function createVenueModel(state={}){
 const items=[],targets=[];
 const box=(x,y,z,w,h,d,color,extra={})=>{const a={type:'box',p:[x,y,z],s:[w,h,d],color,...extra};items.push(a);return a;};
 const label=(text,x,y,z,w,h,color='#f0f5ff',bg='#142c43',extra={})=>{const a={type:'label',text,p:[x,y,z],s:[w,h],color,bg,...extra};items.push(a);return a;};
 const sphere=(x,y,z,r,color,extra={})=>items.push({type:'sphere',p:[x,y,z],s:[r,r,r],color,...extra});
 const panel=(x,y,z,w,h,title,kind='screen')=>{box(x,y,z,w+.14,h+.14,.15,'#0b111b',{labelBacking:true});return label(title,x,y,z+.09,w,h,'#ddecf9','#142839',{kind});};
 const navy='#15263c',wood='#6d5144',edge='#75c1c4',floor='#223142',metal='#8996a7',seat='#3c5470';
 // Main hall and a cutaway production wing.
 box(0,-.22,1,46,.4,72,floor);box(30,-.22,-10,16,.4,42,'#263a48');box(0,-.48,1,46,.12,72,'#0c1726');
 box(0,8,-34,46,16,.5,navy,{wall:true});box(-23,8,1,.4,16,72,navy,{wall:true});
 box(23,8,15,.4,16,44,navy,{cutaway:true});box(38,3,-10,.3,6,42,navy,{cutaway:true});box(30,3,-31,16,6,.3,navy,{wall:true});
 box(0,16,1,46,.25,72,'#142035',{roof:true});
 for(let i=0;i<10;i++){
  const z=-31+i*6.8;box(-22.65,6,z,.14,11,1.6,wood);box(-22.54,6,z+.9,.05,9,.08,'#c2a887');
  if(i>5){box(22.65,6,z,.14,11,1.6,wood,{cutaway:true});box(22.54,6,z+.9,.05,9,.08,'#c2a887',{cutaway:true});}
  box(0,15.6,z,45,.18,.22,'#5a6d7f',{roof:true});box(0,15.35,z,28,.05,.12,'#becfd9',{roof:true});
 }
 // Aisles, floor divisions and step lighting.
 for(const x of [-21.7,-5.8,5.8,21.7])box(x,.025,3,.04,.03,36,'#72c5c2');
 for(let row=0;row<18;row++){const z=-13+row*2;box(-22.2,.04,z,.3,.03,.11,'#bedccc');box(22.2,.04,z,.3,.03,.11,'#bedccc');}
 for(const z of [-16,19,25])box(0,.02,z,44,.015,.035,'#597483');
 // Stage, grand LED, wings and trusses.
 box(0,.65,-26,32,1.3,13,'#34445a');box(0,1.33,-19.5,32,.04,.08,'#8ddbd2');
 for(let i=0;i<4;i++)box(0,.14+i*.14,-17.7-i*.48,8-i*.25,.28+i*.28,.55,'#526578');
 for(const x of [-17.1,17.1])box(x,5.2,-27,1.2,10,11,'#111d2d');
 box(0,6,-31,24,10,.45,'#080f1c',{labelBacking:true});panel(0,6,-30.72,23.5,9.5,'','led');
 for(const x of [-14,14]){panel(x,5.7,-30.3,2.7,8.6,'EVENT\nLAB','side');box(x,1.6,-30.15,2.7,.05,.05,'#91d2d0');}
 for(const z of [-30,-20]){
  box(0,12.4,z,35,.16,.16,metal);box(0,12.95,z,35,.16,.16,metal);
  for(let x=-17;x<17;x+=1.4){box(x,12.67,z,.07,.75,.07,metal,{rz:(Math.floor(x)%2?.65:-.65)});}
 }
 for(const x of [-17.5,17.5]){box(x,6.3,-25,.18,12,.18,metal);box(x+.48,6.3,-25,.18,12,.18,metal);}
 for(let i=0;i<10;i++){
  const x=-14+i*3.1;box(x,12.0,-20,.6,.65,.65,'#101827');box(x,11.64,-20,.4,.05,.4,state.light==='warm'?'#ffe2ab':i%2?'#a7a3ff':'#72d6ee');
  items.push({type:'beam',p:[x,6.4,-22],s:[1.8,10.8,1.8],color:state.light==='warm'?'#ffe2aa':i%2?'#a192ee':'#72cce2'});
 }
 for(const x of [-18.6,18.6])for(let j=0;j<4;j++)box(x,9-j*.75,-21,.95,.65,.8,'#0b1523');
 // Movable stage furniture and presenters.
 const stageTalk=state.layout!=='podium';
 if(stageTalk){
  for(const x of [-3,3]){box(x,1.93,-25,2.1,.45,1.8,'#bec4c6');box(x,2.7,-25.8,2.1,1.3,.25,'#9faeb8');for(const dx of [-1,1])box(x+dx,2.35,-25,.2,.7,1.8,'#b7c2c9');person(x,1.3,-25,'#d5b7c2',true);}
  box(0,1.72,-23.9,1.8,.12,1.1,'#9f9482');box(0,1.4,-23.9,.12,.6,.12,metal);sphere(0,1.98,-23.9,.2,'#b2c8ae');
 }else{box(-5,2.2,-24,1.5,1.8,1,'#b4c3d0');label('VWA',-5,2.5,-23.48,1.1,.6,'#24433c','#c6ee98');person(-5,1.3,-25,'#96b5c7');}
 for(const x of [-12,12])box(x,1.6,-21,1.7,.6,1.2,'#172132');
 // Three audience blocks, 384 main seats and 96 balcony seats.
 for(let row=0;row<16;row++)for(let block=0;block<3;block++)for(let col=0;col<8;col++){
  const x=[-15,0,15][block]+(col-3.5)*1.15,z=-13+row*1.95;chair(x,.1,z,seat);
  if((row+col)%7!==0)person(x,.08,z,['#657888','#566d86','#8a7883','#69847e'][(row+col+block)%4],true,{row,col,block});
 }
 // Balcony at the rear; raised structure and glass-front rail.
 box(0,6.3,23,43,.45,10,'#2b3c51');box(0,6.75,18,43,.12,.15,metal);box(0,6.1,18,43,1.25,.06,'#57858c',{glass:true});
 for(const x of [-19,-10,10,19])box(x,3,24,.5,6,.5,'#3b4d60');
 for(let row=0;row<4;row++)for(let block=0;block<3;block++)for(let col=0;col<8;col++){
  const x=[-15,0,15][block]+(col-3.5)*1.15,z=19.5+row*1.8,y=6.55+row*.18;chair(x,y,z,seat);if(col%3)person(x,y,z,'#667d8c',true);
 }
 label('KHÁN PHÒNG',-12,10.5,30,11,1,'#d9eeef','#1b3444',{});
 // Control room below the rear balcony with working desks and program monitors.
 box(0,.08,30,22,.16,10,'#182c3b');box(-11,2.4,30,.16,4.8,10,'#344e60');box(11,2.4,30,.16,4.8,10,'#344e60');
 box(0,2.4,35,22,4.8,.2,'#1d3448');box(0,1.1,25,22,.15,.1,metal);box(0,2.7,25,22,3,.07,'#6798a5',{glass:true});
 for(const x of [-7,0,7]){
  box(x,1.1,29.4,5.6,.15,2.4,'#41566a');box(x,1.23,29.55,5.4,.22,1.3,'#172839',{rx:.12,console:true});
  for(let i=0;i<8;i++){box(x-2.1+i*.59,1.38,29.55,.28,.04,.75,'#69798b',{console:true});box(x-2.1+i*.59,1.43,29.5,.2,.025,.12,i%3?'#8cd0c2':'#c6ee98',{console:true});}
  for(const dx of [-1.35,1.35]){box(x+dx,2.15,28.5,2.3,1.45,.12,'#091321',{labelBacking:true});label(dx<0?'AUDIO\nMIC 1     MIC 2':'PROGRAM\nCAM 01',x+dx,2.15,28.58,2.15,1.3,'#9ee4d2','#173748',{kind:dx<0?'audio':'program'});}
  chair(x,.05,31.3,'#202f40');person(x,.03,31.3,'#8798b1',true,{crew:true});
 }
 label('PHÒNG ĐIỀU KHIỂN',0,4.1,34.85,16,1.1,'#a9d9ce','#1c3444');
 // Media wing: design workstations, interview set, live desk and newsroom.
 box(30,.05,-10,15.8,.1,42,'#314652');box(23.2,2.6,-22,.12,5.2,17,'#2a3e50',{cutaway:true});box(30,2.6,-13,15.5,5.2,.16,'#2a3e50',{cutaway:true});
 label('TRUYỀN THÔNG HẬU TRƯỜNG',30,5.1,9.9,15,1.15,'#d6efea','#173f45',{});
 // Interviews.
 box(30,2.4,-29.5,12,4.8,.15,'#24505a',{labelBacking:true});label('EVENTLAB\nPHỎNG VẤN NHANH',30,3.2,-29.38,9,2,'#d9f4ea','#24505a');
 for(const x of [27.5,32.5]){chair(x,.08,-26,'#66828c');person(x,.05,-26,'#8eacc1',true);}
 box(30,1,-23,.2,2,.2,metal);box(30,2.05,-23,.65,.45,.7,'#172536');sphere(30,2,-23.37,.17,'#5b8d9f');
 for(const x of [25,35]){box(x,1.8,-24,.08,3.6,.08,metal);box(x,3.4,-24,1.1,.7,.1,'#b9c6d0');}
 // Desk with designer and three posters.
 box(27,1.05,-8,6,.15,2.1,'#7a8c94');box(27,1.9,-8.5,3.2,1.6,.12,'#102332',{labelBacking:true});label('THIẾT KẾ\n'+(state.theme==='community'?'CỘNG ĐỒNG':'TRUYỀN THÔNG'),27,1.9,-8.4,3,1.4,'#d2efdb','#245258',{kind:'poster'});chair(27,.05,-5.8,'#233d49');person(27,.03,-5.8,'#8b9db9',true,{crew:true});
 for(let i=0;i<3;i++)panel(24.3+i*3.7,3.4,-12.86,2.7,3.6,['TALKSHOW','HỘI THẢO','CỘNG ĐỒNG'][i],'poster');
 // Livestream desk.
 box(33.6,1.05,1.5,6,.15,2.2,'#617b87');for(const x of [32.1,35.1]){box(x,2.1,.8,2.6,1.6,.12,'#10202d',{labelBacking:true});label(state.streaming?'LIVE · MÔ PHỎNG':'PREVIEW\nLIVESTREAM',x,2.1,.9,2.4,1.4,'#a6e4d4','#173b48',{kind:'program'});}
 box(33.6,1.2,1.9,3.4,.12,.7,'#142d3c');chair(33.6,.05,3.5,'#263e4a');person(33.6,.03,3.5,'#8d9eb2',true,{crew:true});
 label('ẤN PHẨM  ·  LIVESTREAM  ·  BẢN TIN',30,4.2,8,13,1,'#d6ebe4','#21454b',{});
 // Portable camera positions in the hall.
 for(const x of [-20,20]){box(x,1.4,9,.12,2.8,.12,metal);box(x,2.85,9,.7,.4,.9,'#172536');for(const dx of [-.6,.6])box(x+dx,.6,9,.08,1.2,.08,metal,{rz:dx*.7});}
 // In-world navigation markers; the same meshes are controller ray targets.
 const spots=[['stage',-10,2.0,-17],['audience',-5.8,.7,7],['control',-8,.7,24],['media',24,.7,-2]];
 for(const [id,x,y,z]of spots){const marker=box(x,y,z,.65,.1,.65,'#c6ee98',{target:id});targets.push(marker);label(ZONES[id].name.toUpperCase(),x,y+1.2,z,4.5,.55,'#c6ee98','#153140',{billboard:true,target:id});}
 return {items,targets,seats:SEAT_COUNT};
 function chair(x,y,z,c){box(x,y+.5,z,.95,.16,.92,c);box(x,y+1,z+.4,.95,.95,.13,c);box(x,y+.21,z,.12,.42,.12,'#31414e');}
 function person(x,y,z,c,seated=false,meta={}){
  const sy=y+(seated?1.03:1.05);box(x,sy,z,.54,seated?.66:.9,.34,c,{person:meta});sphere(x,y+(seated?1.62:1.9),z,.23,'#c2a28f',{person:meta});
  box(x,y+(seated?1.77:2.06),z+.04,.42,.15,.37,'#283140');
  if(!seated){box(x-.14,y+.45,z,.18,.9,.2,'#283b4b');box(x+.14,y+.45,z,.18,.9,.2,'#283b4b');}
  if(state.audience==='applause'&&!meta.crew){box(x-.35,y+1.4,z-.16,.12,.6,.12,'#c2a28f',{rz:-.75});box(x+.35,y+1.4,z-.16,.12,.6,.12,'#c2a28f',{rz:.75});}
  if(state.audience==='question'&&meta.row===4&&meta.col===2&&meta.block===1){box(x+.33,y+1.8,z,.12,1.1,.12,'#c2a28f',{rz:-.2});label('Tôi có một câu hỏi',x,y+2.7,z,4,.7,'#172d3c','#d7edc6',{billboard:true});}
 }
}
