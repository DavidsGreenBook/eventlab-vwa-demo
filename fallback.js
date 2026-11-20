// Canvas illustration keeps the rehearsal usable on browsers without WebGL.
// It is explicitly labelled as an illustration, not an immersive VR session.
export function createIllustration(host,getState){
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');host.append(canvas);let mode='tech',yaw=0,pitch=0,start=null,frame=0;
 const camera={p:[0,2.4,8],target:[0,2,-9]};
 const sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>{const n=Math.hypot(...a);return a.map(x=>x/n);};
 let right,up,forward,scale,w,h,polys=[];
 function point(p){const v=sub(p,camera.p),z=dot(v,forward);if(z<.1)return null;return[w/2+dot(v,right)*scale/z,h*.48-dot(v,up)*scale/z,z];}
 function poly(points,color,stroke){const ps=points.map(point);if(ps.some(p=>!p))return;polys.push({ps,color,stroke,z:ps.reduce((s,p)=>s+p[2],0)/ps.length});}
 function box(x,y,z,bw,bh,bd,color){const X=bw/2,Y=bh/2,Z=bd/2;poly([[x-X,y-Y,z-Z],[x+X,y-Y,z-Z],[x+X,y+Y,z-Z],[x-X,y+Y,z-Z]],color);poly([[x-X,y-Y,z+Z],[x+X,y-Y,z+Z],[x+X,y+Y,z+Z],[x-X,y+Y,z+Z]],color);poly([[x-X,y+Y,z-Z],[x+X,y+Y,z-Z],[x+X,y+Y,z+Z],[x-X,y+Y,z+Z]],color);poly([[x-X,y-Y,z-Z],[x-X,y-Y,z+Z],[x-X,y+Y,z+Z],[x-X,y+Y,z-Z]],color);poly([[x+X,y-Y,z-Z],[x+X,y-Y,z+Z],[x+X,y+Y,z+Z],[x+X,y+Y,z-Z]],color);}
 function drawText(text,p,size,color,weight=500){const pos=point(p);if(!pos)return;ctx.font=`${weight} ${Math.max(5,size*scale/pos[2])}px Arial`;ctx.fillStyle=color;ctx.textAlign='center';ctx.fillText(text,pos[0],pos[1]);}
 function line(a,b,color,width=1){const p=point(a),q=point(b);if(!p||!q)return;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
 function draw(){
  const s=getState();const rect=host.getBoundingClientRect();w=rect.width;h=rect.height;if(!w||!h)return;const ratio=Math.min(devicePixelRatio,1.5);if(canvas.width!==Math.round(w*ratio)||canvas.height!==Math.round(h*ratio)){canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);}ctx.setTransform(ratio,0,0,ratio,0,0);
  const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#0c1120');bg.addColorStop(.6,'#20263d');bg.addColorStop(1,'#111a2d');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  if(mode==='stage'){camera.p=[0,2,-8];camera.target=[yaw*8,1.5+pitch*7,8];}else if(mode==='wide'){camera.p=[10,7,10];camera.target=[yaw*8,1.5+pitch*7,-7];}else{const viewpoints={content:[[-7,2.1,4],[0,3,-10]],director:[[2.5,2.5,7.8],[0,2,-9]],backstage:[[8.5,2,-5],[0,2,-9]],planning:[[7,2.1,8],[0,2,-8]]};const v=viewpoints[mode]??[[0,2.5,8],[0,2.2,-9]];camera.p=v[0];camera.target=[v[1][0]+yaw*10,v[1][1]+pitch*8,v[1][2]];}
  forward=norm(sub(camera.target,camera.p));right=norm(cross(forward,[0,1,0]));up=cross(right,forward);scale=Math.min(w*.88,h*1.45);polys=[];
  poly([[-14,0,-14],[14,0,-14],[14,0,16],[-14,0,16]],'#1b2539');
  poly([[-14,0,-14],[14,0,-14],[14,10,-14],[-14,10,-14]],'#172137');
  poly([[-14,0,-14],[-14,0,16],[-14,10,16],[-14,10,-14]],'#1b2337');poly([[14,0,-14],[14,0,16],[14,10,16],[14,10,-14]],'#172035');
  for(let z=-12;z<15;z+=3)for(const x of [-13.7,13.7])box(x,3,z,.1,4,.15,'#615381');
  box(0,.35,-10,16,.7,6,'#34405a');box(0,.1,-6.15,6,.2,.7,'#4a566e');box(0,.03,-5.55,7,.06,.6,'#35435d');
  box(0,3.7,-12,10.5,4.8,.2,'#131824');
  const screen=s.slide==='standby'?'#263552':s.slide==='intro'?'#37315e':'#4c386b';poly([[-5.05,1.48,-11.87],[5.05,1.48,-11.87],[5.05,5.95,-11.87],[-5.05,5.95,-11.87]],screen);
  for(const x of [-6.7,6.7])box(x,3.2,-12,1.3,4.6,.25,'#32364e');
  for(const z of [-11.5,-7.5]){box(0,7.2,z,17,.1,.1,'#53617a');box(0,7.65,z,17,.1,.1,'#53617a');}
  for(const x of [-8.5,8.5])box(x,3.7,-10.5,.12,7.4,.12,'#53617a');
  for(let i=0;i<6;i++){const x=-6.3+i*2.5;box(x,6.95,-7.5,.45,.35,.5,'#111722');}
  for(const x of [1.1,3.1]){box(x,1.0,-9.5,.9,.18,.8,'#a49bb6');box(x,1.4,-9.85,.9,.8,.14,'#776b8b');}
  box(-3.3,1.28,-8.4,.8,1.15,.65,'#b6c5ce');box(-3.3,1.88,-8.4,.95,.07,.8,'#293246');box(-3.3,1.7,-9.2,.4,1,.3,s.light==='off'?'#525a70':'#c4cad7');box(-3.3,2.39,-9.2,.3,.35,.3,'#c39b86');
  const people=[];for(let row=0;row<6;row++)for(let col=0;col<10;col++){const x=(col<5?col-5.8:col-3.2)*1.08,z=-3.5+row*1.45;box(x,.5,z,.82,.15,.8,'#3a3852');box(x,.86,z+.34,.82,.8,.12,'#45415b');box(x,.83,z,.46,.55,.3,['#40516b','#65516c','#3e5e61'][(row+col)%3]);people.push([x,1.22,z]);}
  if(mode!=='wide')box(0,1.0,6.3,2.8,.17,1.2,'#263449');
  polys.sort((a,b)=>b.z-a.z);for(const f of polys){ctx.beginPath();f.ps.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=f.color;ctx.fill();ctx.strokeStyle='#09122225';ctx.lineWidth=.6;ctx.stroke();}
  // Details over the main surfaces keep the illustration readable.
  for(const p of people){const q=point(p);if(!q)continue;ctx.beginPath();ctx.ellipse(q[0],q[1],.16*scale/q[2],.185*scale/q[2],0,0,Math.PI*2);ctx.fillStyle='#b09587';ctx.fill();ctx.beginPath();ctx.ellipse(q[0],q[1]-.07*scale/q[2],.16*scale/q[2],.11*scale/q[2],0,Math.PI,0);ctx.fillStyle='#27283b';ctx.fill();}
  if(mode!=='stage'){
   for(let i=0;i<6;i++){const x=-6.3+i*2.5;if(s.light!=='off'){const a=point([x,6.8,-7.5]),b=point([x-1.5,.75,-9.4]),c=point([x+1.5,.75,-9.4]);if(a&&b&&c){ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(c[0],c[1]);ctx.closePath();ctx.fillStyle=s.light==='warm'?'#ffd49c12':i%2?'#b293ff20':'#f69fdb18';ctx.fill();}}}
   for(let i=0;i<16;i++){const x=-8+i;line([x,7.2,-7.5],[x+.6,7.65,-7.5],'#68778d',.8);}line([-7.9,.73,-7],[7.9,.73,-7],'#b7a3fc',2);
   drawText('HỌC VIỆN PHỤ NỮ VIỆT NAM',[0,5.35,-11.8],.21,'#c6ee98');drawText(s.slide==='wrong'?'NGÀY HỘI SÁNG TẠO':s.slide==='standby'?'MỌI TRẢI NGHIỆM':'TRUYỀN THÔNG',[0,4.4,-11.8],.57,'#f1edfc',700);drawText(s.slide==='wrong'?'BẢN V1 · SAI NỘI DUNG':s.slide==='standby'?'BẮT ĐẦU TỪ ĐÂY.':'CÓ TRÁCH NHIỆM.',[0,3.65,-11.8],.57,'#f1edfc',700);drawText(s.slide==='live'?'TALKSHOW · ĐANG DIỄN RA':'TALKSHOW · KẾT NỐI TRI THỨC',[0,2.85,-11.8],.2,'#d5c7f0');drawText('EventLab VWA',[0,1.95,-11.8],.16,'#b1bbd2');for(const x of [-6.7,6.7])drawText('VWA',[x,4.45,-11.78],.28,'#c6ee98');
   if(mode==='tech'){for(let i=0;i<3;i++)for(let j=0;j<8;j++){const q=point([-1.1+j*.3,1.11,5.9+i*.22]);if(q){ctx.fillStyle=(j+i)%3?'#7388a5':'#c6ee98';ctx.fillRect(q[0]-2,q[1]-2,4,3);}}}
  }
  if(s.audience==='hand'){line([2.38,.9,-3.5],[2.45,1.65,-3.5],'#d9b39a',4);}if(s.audience==='applause'){drawText('CẢM ƠN · HỎI ĐÁP ĐÃ KHÉP LẠI',[0,3,6],.25,'#c6ee98');}
  const shade=ctx.createLinearGradient(0,0,0,h);shade.addColorStop(0,'#0c101940');shade.addColorStop(.35,'#0c101900');shade.addColorStop(1,'#0c101940');ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
 }
 function view(v){mode=v;yaw=0;pitch=0;draw();}
 canvas.addEventListener('pointerdown',e=>start={x:e.clientX,y:e.clientY,yaw,pitch});canvas.addEventListener('pointermove',e=>{if(!start)return;yaw=Math.max(-.75,Math.min(.75,start.yaw-(e.clientX-start.x)*.002));pitch=Math.max(-.35,Math.min(.35,start.pitch-(e.clientY-start.y)*.002));draw();});window.addEventListener('pointerup',()=>start=null);new ResizeObserver(draw).observe(host);draw();return{draw,view};
}
