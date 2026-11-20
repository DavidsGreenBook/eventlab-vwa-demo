import * as THREE from './vendor/three.module.js';
const V=THREE.Vector3,M=THREE.Matrix4;
const cube=[[-.5,-.5,-.5],[.5,-.5,-.5],[.5,.5,-.5],[-.5,.5,-.5],[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]];
const faces=[[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]];
const lightDir=new V(-.4,.85,.3).normalize();
function transform(item){return new M().compose(new V(...item.p),new THREE.Quaternion().setFromEuler(new THREE.Euler(item.rx||0,item.ry||0,item.rz||0)),new V(item.s[0],item.s[1],item.s[2]??1));}
function canvasLabel(item,state){
 const c=document.createElement('canvas');c.width=item.kind==='led'?1440:768;c.height=Math.round(c.width*item.s[1]/item.s[0]);const x=c.getContext('2d'),w=c.width,h=c.height;
 const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,item.bg||'#183e4d');g.addColorStop(1,item.kind==='led'?(state.theme==='community'?'#326461':'#423e77'):'#284756');x.fillStyle=g;x.fillRect(0,0,w,h);
 if(item.kind==='led'){
  x.strokeStyle='#b5dbdd35';x.lineWidth=3;for(let i=0;i<13;i++){x.beginPath();x.moveTo(w*.65+i*23,-20);x.bezierCurveTo(w*.32+i*29,h*.35,w*1.1-i*10,h*.65,w*.75+i*20,h+20);x.stroke();}
  x.fillStyle='#c6ee98';x.font='500 27px Arial';x.fillText('HỌC VIỆN PHỤ NỮ VIỆT NAM',90,65);x.fillStyle='#f2f4fa';x.font='bold 85px Arial';const title=state.theme==='conference'?['KẾT NỐI TRI THỨC','KIẾN TẠO TƯƠNG LAI']:state.theme==='community'?['TIẾNG NÓI PHỤ NỮ','VÌ CỘNG ĐỒNG']:['TRUYỀN THÔNG','CÓ TRÁCH NHIỆM'];title.forEach((t,i)=>x.fillText(t,85,220+i*100));x.font='25px Arial';x.fillStyle='#d3ddef';x.fillText(state.theme==='conference'?'HỘI THẢO CHUYÊN ĐỀ':'TALKSHOW · KẾT NỐI VÀ CHIA SẺ',90,410);x.fillStyle='#c6ee98';x.fillRect(90,461,100,4);x.font='24px Arial';x.fillText('EventLab VWA  /  Không gian thực hành sự kiện',90,510);
 }else if(item.kind==='program'){
  x.fillStyle='#396175';x.fillRect(w*.08,h*.12,w*.84,h*.6);x.fillStyle='#9fc8ce';x.fillRect(w*.28,h*.22,w*.44,h*.3);x.fillStyle='#e4c6af';for(const px of [.38,.62]){x.beginPath();x.arc(w*px,h*.42,h*.06,0,7);x.fill();x.fillRect(w*px-h*.05,h*.48,h*.1,h*.15);}x.fillStyle=state.streaming?'#ec9c93':'#c6ee98';x.font=`bold ${Math.min(h*.12,45)}px Arial`;x.fillText(state.streaming?'LIVE · MÔ PHỎNG':'PROGRAM · CAM 01',w*.08,h*.88);
 }else if(item.kind==='audio'){
  x.fillStyle='#c6ee98';for(let i=0;i<15;i++)x.fillRect(w*.12+i*w*.05,h*.68-(i%5)*h*.06,w*.023,h*.1+(i%5)*h*.06);x.font=`bold ${h*.14}px Arial`;x.fillStyle='#d6edef';x.fillText(state.mic1?'MIC 1 · ON':'MIC 1 · OFF',w*.1,h*.23);x.fillText(state.mic2?'MIC 2 · ON':'MIC 2 · OFF',w*.1,h*.43);
 }else{
  const ls=item.text.split('\n'),font=Math.min(h/(ls.length+1)*.7,w/Math.max(...ls.map(t=>t.length))*1.65);x.textAlign='center';x.textBaseline='middle';x.font=`600 ${Math.max(16,font)}px Arial`;x.fillStyle=item.color;ls.forEach((l,i)=>x.fillText(l,w/2,h/2+(i-(ls.length-1)/2)*font*1.5,w*.9));if(item.kind==='poster'){x.strokeStyle='#8bcab66b';for(let i=0;i<4;i++){x.beginPath();x.arc(w*.75,h*.75,w*(.15+i*.05),0,7);x.stroke();}}
 }
 return c;
}
function shade(color,n,glass=false){const c=new THREE.Color(color);const f=.57+.43*Math.max(0,n.dot(lightDir));c.multiplyScalar(f).convertLinearToSRGB();return `rgba(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)},${glass?.2:1})`;}
export class VenueRenderer{
 constructor(host,onTarget){
  this.host=host;this.onTarget=onTarget;this.zone='overview';this.yaw=0;this.pitch=0;this.p=new V();this.target=new V();this.model=null;this.state={};this.hotspots=[];this.pending=false;
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#0c192a');this.scene.fog=new THREE.Fog('#15253a',65,135);this.camera=new THREE.PerspectiveCamera(57,1,.12,220);this.rig=new THREE.Group();this.rig.add(this.camera);this.scene.add(this.rig);
  this.scene.add(new THREE.HemisphereLight('#dceafa','#3d4b51',2.8));const sun=new THREE.DirectionalLight('#f1e0cc',3.2);sun.position.set(-20,40,30);this.scene.add(sun);const fill=new THREE.DirectionalLight('#8ca6f7',1.6);fill.position.set(10,15,-25);this.scene.add(fill);
  try{this.gl=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.gl.setPixelRatio(Math.min(devicePixelRatio,1.6));this.gl.outputColorSpace=THREE.SRGBColorSpace;this.gl.toneMapping=THREE.ACESFilmicToneMapping;this.gl.toneMappingExposure=1;this.el=this.gl.domElement;this.mode='WebGL';}catch(e){this.el=document.createElement('canvas');this.ctx=this.el.getContext('2d');this.mode='Canvas';}
  this.el.setAttribute('aria-label','Mô hình hội trường 3D; dùng bảng khu vực hoặc kéo chuột để điều hướng');this.el.tabIndex=0;host.append(this.el);this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);if(this.gl)this.gl.setAnimationLoop(time=>{if(this.state.light==='show'){this.dynamicLights?.forEach((l,i)=>l.target.position.x=Math.sin(time*.0005+i*2)*8);this.beamMeshes?.forEach((b,i)=>b.rotation.z=Math.sin(time*.0005+i)*.1);}if(this.gl.xr.isPresenting)this.gl.render(this.scene,this.camera);else if(this.state.light==='show')this.draw();});
  let start=null;this.el.addEventListener('pointerdown',e=>{this.el.focus({preventScroll:true});start={x:e.clientX,y:e.clientY,yaw:this.yaw,pitch:this.pitch};this.el.setPointerCapture(e.pointerId);});
  this.el.addEventListener('pointermove',e=>{if(!start)return;this.yaw=start.yaw-(e.clientX-start.x)*.003;this.pitch=Math.max(-.65,Math.min(.65,start.pitch-(e.clientY-start.y)*.002));this.request();});
  this.el.addEventListener('pointerup',e=>{if(start&&Math.hypot(e.clientX-start.x,e.clientY-start.y)<6)this.pick(e.clientX,e.clientY);start=null;});
  this.el.addEventListener('wheel',e=>{e.preventDefault();this.move(0,Math.sign(e.deltaY)*-1.6);},{passive:false});
  this.el.addEventListener('keydown',e=>{if(/^(w|a|s|d|ArrowUp|ArrowDown|ArrowLeft|ArrowRight)$/i.test(e.key)){e.preventDefault();const key=e.key.toLowerCase();this.move(key==='a'||key==='arrowleft'?-1:key==='d'||key==='arrowright'?1:0,key==='w'||key==='arrowup'?1:key==='s'||key==='arrowdown'?-1:0);}});
 }
 rebuild(model,state){
  this.model=model;this.state={...state};if(this.root){this.scene.remove(this.root);this.root.traverse(o=>{o.geometry?.dispose();if(o.material){o.material.map?.dispose();o.material.dispose();}});}this.root=new THREE.Group();this.scene.add(this.root);this.dynamicLights=[];this.beamMeshes=[];this.compiled=[];this.targetMeshes=[];this.cache=new Map();
  const batches=new Map();
  for(const item of model.items){
   const matrix=transform(item);
   if(item.type==='label'){
    const source=canvasLabel(item,state);const texture=new THREE.CanvasTexture(source);texture.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(item.s[0],item.s[1]),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));mesh.position.set(...item.p);mesh.rotation.set(item.rx||0,item.ry||0,item.rz||0);this.root.add(mesh);if(item.billboard)mesh.userData.billboard=true;if(item.target){mesh.userData.target=item.target;this.targetMeshes.push(mesh);}const corners=[[-.5,.5,0],[.5,.5,0],[.5,-.5,0],[-.5,-.5,0]].map(p=>new V(...p).applyMatrix4(matrix));if(item.billboard)this.compiled.push({type:'label',points:corners,center:new V(...item.p),source,item});else{const nx=Math.max(1,Math.ceil(item.s[0]/1.7)),ny=Math.max(1,Math.ceil(item.s[1]/1.7));const point=(u,v)=>corners[0].clone().lerp(corners[1],u).lerp(corners[3].clone().lerp(corners[2],u),v);for(let ix=0;ix<nx;ix++)for(let iy=0;iy<ny;iy++){const u=ix/nx,v=iy/ny,U=(ix+1)/nx,W=(iy+1)/ny;const sub=[point(u,v),point(U,v),point(U,W),point(u,W)],center=sub.reduce((a,b)=>a.add(b),new V()).multiplyScalar(.25);this.compiled.push({type:'label',points:sub,center,source,item,uv:[[u*source.width,v*source.height],[U*source.width,v*source.height],[U*source.width,W*source.height],[u*source.width,W*source.height]]});}}continue;
   }
   if(item.type==='beam'){
    if(state.light==='off')continue;const geo=new THREE.ConeGeometry(item.s[0],item.s[1],12,1,true),mat=new THREE.MeshBasicMaterial({color:item.color,transparent:true,opacity:.075,depthWrite:false,side:THREE.DoubleSide});const mesh=new THREE.Mesh(geo,mat);mesh.position.set(...item.p);this.root.add(mesh);this.beamMeshes.push(mesh);this.compiled.push({type:'beam',item,center:new V(...item.p)});continue;
   }
   const key=[item.type,item.color,item.roof,item.cutaway,item.glass].join('|');if(!batches.has(key))batches.set(key,[]);batches.get(key).push(item);
   if(item.type==='sphere'){this.compiled.push({type:'sphere',item,center:new V(...item.p)});continue;}
   const points=cube.map(p=>new V(...p).applyMatrix4(matrix));
   for(const ids of faces){if(item.labelBacking&&ids===faces[1])continue;const ps=ids.map(i=>points[i]);const normal=new V().subVectors(ps[1],ps[0]).cross(new V().subVectors(ps[2],ps[0])).normalize();const a=ps[0].distanceTo(ps[1]),b=ps[1].distanceTo(ps[2]);const nx=Math.max(1,Math.ceil(a/3)),ny=Math.max(1,Math.ceil(b/3));const point=(u,v)=>ps[0].clone().lerp(ps[1],u).lerp(ps[3].clone().lerp(ps[2],u),v);for(let ix=0;ix<nx;ix++)for(let iy=0;iy<ny;iy++){const sub=[point(ix/nx,iy/ny),point((ix+1)/nx,iy/ny),point((ix+1)/nx,(iy+1)/ny),point(ix/nx,(iy+1)/ny)];const center=sub.reduce((a,b)=>a.add(b),new V()).multiplyScalar(.25);this.compiled.push({type:'face',points:sub,normal,center,color:shade(item.color,normal,item.glass),item});}}
  }
  for(const entries of batches.values()){
   const first=entries[0],geo=first.type==='sphere'?new THREE.SphereGeometry(1,10,7):new THREE.BoxGeometry(1,1,1),mat=new THREE.MeshStandardMaterial({color:first.color,roughness:.76,metalness:.08,transparent:!!first.glass,opacity:first.glass?.18:1,depthWrite:!first.glass});const mesh=new THREE.InstancedMesh(geo,mat,entries.length);entries.forEach((item,i)=>mesh.setMatrixAt(i,transform(item)));mesh.instanceMatrix.needsUpdate=true;mesh.userData={roof:first.roof,cutaway:first.cutaway};this.root.add(mesh);
  }
  // Stage light gives the LED and stage more depth on WebGL devices.
  const stage=new THREE.PointLight(state.light==='warm'?'#ffe0aa':'#a5b1ff',160,50,1.4);stage.position.set(0,10,-23);this.root.add(stage);if(state.light==='show')for(let i=0;i<2;i++){const spot=new THREE.SpotLight(i?'#a997ff':'#8bd8e6',800,45,.36,.7,1.5);spot.position.set(i?9:-9,11.5,-20);spot.target.position.set(i?4:-4,1.5,-27);this.root.add(spot,spot.target);this.dynamicLights.push(spot);}this.request();
 }
 setView(zone,data){this.zone=zone;this.p.set(...data.p);this.target.set(...data.target);this.yaw=this.pitch=0;this.baseP=this.p.clone();this.baseTarget=this.target.clone();if(this.gl?.xr.isPresenting)this.xrPosition(data.walk,data.target);this.request();}
 move(side,forward){if(this.gl?.xr.isPresenting)return;this.syncCamera();const dir=new V();this.camera.getWorldDirection(dir);const right=new V().crossVectors(dir,new V(0,1,0)).normalize();const delta=dir.multiplyScalar(forward*1.2).add(right.multiplyScalar(side*1.2));this.p.add(delta);this.target.add(delta);this.p.x=THREE.MathUtils.clamp(this.p.x,-24,50);this.p.z=THREE.MathUtils.clamp(this.p.z,-34,55);this.p.y=THREE.MathUtils.clamp(this.p.y,1.4,40);this.request();}
 syncCamera(){if(this.gl?.xr.isPresenting)return;const dir=new V().subVectors(this.target,this.p);const distance=dir.length();const spherical=new THREE.Spherical().setFromVector3(dir);spherical.theta+=this.yaw;spherical.phi=THREE.MathUtils.clamp(spherical.phi-this.pitch,.18,Math.PI-.18);const look=new V().setFromSpherical(spherical).add(this.p);this.rig.position.set(0,0,0);this.rig.rotation.set(0,0,0);this.camera.position.copy(this.p);this.camera.lookAt(look);this.camera.updateMatrixWorld();this.camera.matrixWorldInverse.copy(this.camera.matrixWorld).invert();this.distance=distance;}
 resize(){const r=this.host.getBoundingClientRect();this.w=r.width;this.h=r.height;if(!this.w||!this.h)return;this.camera.aspect=this.w/this.h;this.camera.updateProjectionMatrix();if(this.gl&&!this.gl.xr.isPresenting)this.gl.setSize(this.w,this.h);if(!this.gl){const ratio=Math.min(devicePixelRatio,1.6);this.el.width=Math.round(this.w*ratio);this.el.height=Math.round(this.h*ratio);this.ratio=ratio;}this.request();}
 request(){if(this.pending)return;this.pending=true;requestAnimationFrame(()=>{this.pending=false;this.draw();});}
 draw(){if(!this.model||!this.w)return;this.syncCamera();if(this.gl){this.root.children.forEach(o=>{o.visible=!(o.userData.roof&&(this.zone==='overview'||this.zone==='media'))&&!(o.userData.cutaway&&(this.zone==='overview'||this.zone==='media'));if(o.userData.billboard)o.quaternion.copy(this.camera.quaternion);});this.gl.render(this.scene,this.camera);}else this.drawSoftware();}
 project(point){const a=point.clone().applyMatrix4(this.camera.matrixWorldInverse);const z=-a.z;if(z<.12)return null;const f=this.h/(2*Math.tan(this.camera.fov*Math.PI/360));return [this.w/2+a.x*f/z,this.h/2-a.y*f/z,z];}
 drawSoftware(){
  const ctx=this.ctx,w=this.w,h=this.h;ctx.setTransform(this.ratio,0,0,this.ratio,0,0);const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#101e30');bg.addColorStop(1,'#304351');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);const output=[],view=this.camera.matrixWorldInverse,f=h/(2*Math.tan(this.camera.fov*Math.PI/360));this.hotspots=[];
  for(const c of this.compiled){const item=c.item;if(item.roof&&(this.zone==='overview'||this.zone==='media')||item.cutaway&&(this.zone==='overview'||this.zone==='media'))continue;
   const center=c.center.clone().applyMatrix4(view),z=-center.z;
   if(c.type==='sphere'){const p=this.project(c.center);if(p&&p[0]>-20&&p[0]<w+20&&p[1]>-20&&p[1]<h+20)output.push({...c,p,z});continue;}
   if(c.type==='beam'){const p1=this.project(new V(item.p[0],item.p[1]+item.s[1]/2,item.p[2]+2)),p2=this.project(new V(item.p[0]-item.s[0],1.4,item.p[2]-1)),p3=this.project(new V(item.p[0]+item.s[0],1.4,item.p[2]-1));if(p1&&p2&&p3)output.push({...c,ps:[p1,p2,p3],z});continue;}
   if(c.type==='face'&&c.normal.dot(new V().subVectors(this.camera.position,c.center))<=0)continue;
   let ps;
   if(c.type==='label'&&item.billboard){const p=this.project(c.center);if(!p)continue;const ww=item.s[0]*f/p[2],hh=item.s[1]*f/p[2];ps=[[p[0]-ww/2,p[1]-hh/2],[p[0]+ww/2,p[1]-hh/2],[p[0]+ww/2,p[1]+hh/2],[p[0]-ww/2,p[1]+hh/2]];}
   else{
    let vs=c.points.map(p=>p.clone().applyMatrix4(view));
    if(c.type==='label'){if(vs.some(p=>p.z>-.15))continue;}
    else{const clipped=[];for(let i=0;i<vs.length;i++){const a=vs[i],b=vs[(i+1)%vs.length],ia=a.z<=-.15,ib=b.z<=-.15;if(ia)clipped.push(a);if(ia!==ib){const t=(-.15-a.z)/(b.z-a.z);clipped.push(a.clone().lerp(b,t));}}vs=clipped;if(vs.length<3)continue;}
    ps=vs.map(p=>[w/2+p.x*f/-p.z,h/2-p.y*f/-p.z]);
   }
   if(ps.every(p=>p[0]<0)||ps.every(p=>p[0]>w)||ps.every(p=>p[1]<0)||ps.every(p=>p[1]>h))continue;
   output.push({...c,ps,z:z-(c.type==='label'?.38:0)});
   if(item.target&&c.type==='label'){const p=this.project(c.center);if(p)this.hotspots.push({x:p[0],y:p[1],r:Math.max(18,item.s[0]*f/p[2]*.5),id:item.target});}
  }
  output.sort((a,b)=>b.z-a.z);
  for(const o of output){
   if(o.type==='sphere'){const r=Math.max(.5,o.item.s[0]*f/o.p[2]);const grad=ctx.createRadialGradient(o.p[0]-r*.3,o.p[1]-r*.4,r*.1,o.p[0],o.p[1],r);grad.addColorStop(0,'#d8bca6');grad.addColorStop(1,o.item.color);ctx.fillStyle=grad;ctx.beginPath();ctx.arc(o.p[0],o.p[1],r,0,7);ctx.fill();continue;}
   if(o.type==='label'){if(o.uv){this.triangle(o.source,[o.uv[0],o.uv[1],o.uv[2]],[o.ps[0],o.ps[1],o.ps[2]]);this.triangle(o.source,[o.uv[0],o.uv[2],o.uv[3]],[o.ps[0],o.ps[2],o.ps[3]]);}else this.texturedQuad(o.source,o.ps);continue;}
   ctx.beginPath();o.ps.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=o.type==='beam'?o.item.color+'12':o.color;ctx.fill();
   if(o.type==='face'&&!o.item.glass){ctx.strokeStyle='#0d18241a';ctx.lineWidth=.35;ctx.stroke();}
  }
  // Minimal depth haze softens the far end without replacing any 3D geometry.
  const vignette=ctx.createRadialGradient(w*.5,h*.48,h*.2,w*.5,h*.48,w*.8);vignette.addColorStop(0,'#07101c00');vignette.addColorStop(1,'#07101c40');ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
 }
 texturedQuad(image,ps){if(ps.length!==4)return;const [p0,p1,p2,p3]=ps;const dx1=p1[0]-p2[0],dx2=p3[0]-p2[0],dx3=p0[0]-p1[0]+p2[0]-p3[0],dy1=p1[1]-p2[1],dy2=p3[1]-p2[1],dy3=p0[1]-p1[1]+p2[1]-p3[1],den=dx1*dy2-dx2*dy1;const g=Math.abs(den)>1e-8?(dx3*dy2-dx2*dy3)/den:0,h=Math.abs(den)>1e-8?(dx1*dy3-dx3*dy1)/den:0;const a=p1[0]-p0[0]+g*p1[0],b=p3[0]-p0[0]+h*p3[0],d=p1[1]-p0[1]+g*p1[1],e=p3[1]-p0[1]+h*p3[1];const project=(u,v)=>[(a*u+b*v+p0[0])/(g*u+h*v+1),(d*u+e*v+p0[1])/(g*u+h*v+1)];const n=6;for(let y=0;y<n;y++)for(let x=0;x<n;x++){const u=x/n,v=y/n,U=(x+1)/n,V=(y+1)/n;this.triangle(image,[[u*image.width,v*image.height],[U*image.width,v*image.height],[U*image.width,V*image.height]],[project(u,v),project(U,v),project(U,V)]);this.triangle(image,[[u*image.width,v*image.height],[U*image.width,V*image.height],[u*image.width,V*image.height]],[project(u,v),project(U,V),project(u,V)]);}}
 triangle(image,uv,p){const ctx=this.ctx;const [u0,u1,u2]=uv,[p0,p1,p2]=p;const den=u0[0]*(u1[1]-u2[1])+u1[0]*(u2[1]-u0[1])+u2[0]*(u0[1]-u1[1]);if(!den)return;const solve=(a,b,c)=>[(a*(u1[1]-u2[1])+b*(u2[1]-u0[1])+c*(u0[1]-u1[1]))/den,(a*(u2[0]-u1[0])+b*(u0[0]-u2[0])+c*(u1[0]-u0[0]))/den,(a*(u1[0]*u2[1]-u2[0]*u1[1])+b*(u2[0]*u0[1]-u0[0]*u2[1])+c*(u0[0]*u1[1]-u1[0]*u0[1]))/den];const a=solve(p0[0],p1[0],p2[0]),b=solve(p0[1],p1[1],p2[1]);ctx.save();ctx.beginPath();ctx.moveTo(...p0);ctx.lineTo(...p1);ctx.lineTo(...p2);ctx.closePath();ctx.clip();ctx.transform(a[0],b[0],a[1],b[1],a[2],b[2]);ctx.drawImage(image,0,0);ctx.restore();}
 preview(canvas,mode='wide'){if(!canvas)return;canvas.width=400;canvas.height=225;const old={ctx:this.ctx,camera:this.camera,w:this.w,h:this.h,ratio:this.ratio,hotspots:this.hotspots};this.ctx=canvas.getContext('2d');this.w=400;this.h=225;this.ratio=1;this.camera=new THREE.PerspectiveCamera(mode==='speaker'?42:57,400/225,.12,220);this.camera.position.set(...(mode==='speaker'?[0,4,-17]:[0,7,12]));this.camera.lookAt(new V(0,4,-26));this.camera.updateMatrixWorld();this.camera.matrixWorldInverse.copy(this.camera.matrixWorld).invert();this.drawSoftware();Object.assign(this,old);}
 pick(x,y){const r=this.el.getBoundingClientRect();if(this.gl){const point=new THREE.Vector2((x-r.left)/r.width*2-1,-(y-r.top)/r.height*2+1),ray=new THREE.Raycaster();ray.setFromCamera(point,this.camera);const hit=ray.intersectObjects(this.targetMeshes)[0];if(hit)this.onTarget(hit.object.userData.target);}else{const hit=this.hotspots.find(p=>Math.hypot(x-r.left-p.x,y-r.top-p.y)<p.r);if(hit)this.onTarget(hit.id);}}
 xrPosition(walk,target){this.rig.position.set(walk[0],walk[1]-1.7,walk[2]);this.rig.rotation.set(0,Math.atan2(walk[0]-target[0],walk[2]-target[2]),0);this.camera.position.set(0,1.7,0);this.camera.rotation.set(0,0,0);}
 async enableXR(button,onChange){
  if(!this.gl){button.textContent='VR cần WebGL và kính';return;}
  this.gl.xr.enabled=true;this.gl.xr.setReferenceSpaceType('local-floor');if(!navigator.xr){button.textContent='VR cần kính tương thích';return;}
  try{button.disabled=!(await navigator.xr.isSessionSupported('immersive-vr'));button.textContent=button.disabled?'VR cần kính tương thích':'Vào VR';}catch{button.textContent='VR chưa khả dụng';return;}
  for(let i=0;i<2;i++){const c=this.gl.xr.getController(i);const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new V(),new V(0,0,-1)]),new THREE.LineBasicMaterial({color:'#c6ee98'}));line.scale.z=20;c.add(line);this.rig.add(c);c.addEventListener('selectstart',()=>{const mat=new M().extractRotation(c.matrixWorld),o=new V().setFromMatrixPosition(c.matrixWorld),dir=new V(0,0,-1).applyMatrix4(mat),ray=new THREE.Raycaster(o,dir);const hit=ray.intersectObjects(this.targetMeshes)[0];if(hit)this.onTarget(hit.object.userData.target);});}
  this.gl.xr.addEventListener('sessionstart',()=>{document.body.classList.add('xr-active');button.textContent='Thoát VR';onChange(true);});this.gl.xr.addEventListener('sessionend',()=>{document.body.classList.remove('xr-active');button.textContent='Vào VR';this.rig.position.set(0,0,0);this.rig.rotation.set(0,0,0);this.request();onChange(false);});
  this.gl.setAnimationLoop(time=>{if(this.state.light==='show'){this.dynamicLights.forEach((l,i)=>l.target.position.x=Math.sin(time*.0005+i*2)*8);this.beamMeshes.forEach((b,i)=>b.rotation.z=Math.sin(time*.0005+i)*.1);}if(this.gl.xr.isPresenting)this.gl.render(this.scene,this.camera);else if(this.state.light==='show')this.draw();});
  button.onclick=async()=>{try{if(this.gl.xr.isPresenting){await this.gl.xr.getSession().end();return;}const session=await navigator.xr.requestSession('immersive-vr',{requiredFeatures:['local-floor']});await this.gl.xr.setSession(session);}catch{onChange('error');}};
 }
}
