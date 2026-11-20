export const TASKS = [
 ['Kiểm tra micro diễn giả','Bật MIC 1, đặt âm lượng từ 30% và bấm Kiểm tra tín hiệu.'],
 ['Chuẩn bị màn hình LED','Chọn nội dung Giới thiệu trên bảng LED.'],
 ['Thiết lập ánh sáng','Chọn cảnh Ánh sáng ấm để chuẩn bị phần phát biểu.'],
 ['Báo sẵn sàng','Kiểm tra lại ba hạng mục, sau đó báo sẵn sàng cho đạo diễn.'],
 ['Thực hiện cue mở màn','Nhận lệnh GO và bấm Chạy mở màn.'],
 ['Chẩn đoán sự cố','Khi mất tiếng, bấm Kiểm tra tín hiệu để xác định kênh lỗi.'],
 ['Khôi phục âm thanh','Bật MIC 2 dự phòng và tắt MIC 1 bị lỗi.']
];
export class Scenario {
 constructor(now=()=>Date.now()){this.now=now;this.reset();}
 reset(){this.started=false;this.finished=false;this.step=0;this.mic1=false;this.mic2=false;this.volume=.65;this.slide='standby';this.light='off';this.tested=false;this.ready=false;this.live=false;this.fault=false;this.diagnosed=false;this.recovered=false;this.errors=0;this.hints=0;this.startedAt=null;this.liveAt=null;this.faultAt=null;this.recoveredAt=null;this.completedAt=null;this.log=[];this.message='Đạo diễn đang chờ kiểm tra kỹ thuật.';}
 record(text,type='info'){this.log.push({at:this.now(),text,type});}
 start(){this.started=true;this.startedAt=this.now();this.record('Bắt đầu lượt thực hành.');return this.ok('Kiểm tra MIC 1 trước khi tổng duyệt.');}
 ok(message){this.message=message;return{ok:true,message};}
 fail(message){this.errors++;this.record(message,'warning');this.message=message;return{ok:false,message};}
 update(){
  if(!this.started||this.finished)return;
  if(this.step===0&&this.tested)this.step=1;
  if(this.step===1&&this.slide==='intro')this.step=2;
  if(this.step===2&&this.light==='warm')this.step=3;
  if(this.step===3&&this.ready)this.step=4;
  if(this.step===4&&this.live)this.step=5;
  if(this.step===5&&this.diagnosed)this.step=6;
  if(this.step===6&&this.mic2&&!this.mic1&&this.volume>=.3){this.recovered=true;this.recoveredAt=this.now();this.step=7;this.record('Khôi phục âm thanh: dùng MIC 2, tắt MIC 1 lỗi.','success');this.message='Tốt. Âm thanh đã khôi phục. Kết thúc phiên để rút kinh nghiệm.';}
 }
 act(action,value){
  if(!this.started)return this.fail('Bắt đầu lượt thực hành trước khi thao tác.');
  if(this.finished)return{ok:false,message:'Lượt thực hành đã kết thúc. Chọn Luyện lại để bắt đầu lượt mới.'};
  switch(action){
   case 'mic1':this.mic1=!this.mic1;this.record(`MIC 1: ${this.mic1?'bật':'tắt'}.`);break;
   case 'mic2':this.mic2=!this.mic2;this.record(`MIC 2 dự phòng: ${this.mic2?'bật':'tắt'}.`);break;
   case 'volume':this.volume=Math.max(0,Math.min(1,Number(value)));this.record(`Âm lượng chính: ${Math.round(this.volume*100)}%.`);break;
   case 'test':
    if(this.fault){this.diagnosed=true;this.record('Chẩn đoán: MIC 1 mất tín hiệu.','success');this.message='MIC 1 mất tín hiệu. Chuyển sang MIC 2 dự phòng và tắt kênh lỗi.';break;}
    if(!this.mic1||this.volume<.3)return this.fail('Chưa có tín hiệu kiểm tra. Bật MIC 1 và đặt âm lượng từ 30%.');
    this.tested=true;this.record('Kiểm tra MIC 1: tín hiệu tốt.','success');this.message='Tín hiệu micro tốt. Tiếp tục chuẩn bị LED và ánh sáng.';break;
   case 'slide':this.slide=value;this.record(`LED: ${value==='intro'?'giới thiệu':value==='live'?'đang diễn ra':'chờ'}.`);break;
   case 'light':this.light=value;this.record(`Ánh sáng: ${value==='warm'?'ấm':value==='show'?'sự kiện':'tắt'}.`);break;
   case 'ready':
    if(!(this.tested&&this.mic1&&this.volume>=.3&&this.slide==='intro'&&this.light==='warm'))return this.fail('Chưa sẵn sàng. Cần MIC 1 đã kiểm tra và đang bật, âm lượng từ 30%, LED Giới thiệu và ánh sáng ấm.');
    this.ready=true;this.record('Báo sẵn sàng cho đạo diễn.','success');this.message='Đạo diễn: GO! Chạy cue mở màn khi bạn sẵn sàng.';break;
   case 'go':
    if(this.live)return this.ok('Chương trình đang chạy. Theo dõi tín hiệu micro.');
    if(!(this.ready&&this.mic1&&this.volume>=.3&&this.slide==='intro'&&this.light==='warm'))return this.fail('Kiểm tra lại cấu hình và báo sẵn sàng trước khi chạy mở màn.');
    this.live=true;this.liveAt=this.now();this.slide='live';this.light='show';this.record('GO: nhạc, LED và ánh sáng mở màn.','success');this.message='Đạo diễn: Mở màn tốt. Chuyển sang phần phát biểu; theo dõi âm thanh.';break;
   case 'hint':this.hints++;this.record('Sử dụng gợi ý cho bước hiện tại.');return this.ok(this.step<7?TASKS[this.step][1]:'Âm thanh đã khôi phục. Chọn Kết thúc phiên.');
   case 'finish':
    if(!(this.recovered&&this.mic2&&!this.mic1&&this.volume>=.3))return this.fail('Hoàn thành xử lý sự cố và giữ cấu hình âm thanh hoạt động trước khi kết thúc.');
    this.finished=true;this.completedAt=this.now();this.record('Kết thúc lượt thực hành.','success');return this.ok('Đã hoàn thành bài thực hành.');
   default:return{ok:false,message:'Thao tác không hợp lệ.'};
  }
  this.update();return{ok:true,message:this.message};
 }
 injectFault(){if(!this.live||this.fault||this.finished)return false;this.fault=true;this.faultAt=this.now();this.record('Sự cố mô phỏng: MIC 1 mất tín hiệu.','warning');this.message='Đạo diễn: Không nghe thấy diễn giả! Kiểm tra micro và báo phương án xử lý.';return true;}
 report(){return{version:'0.1',role:'Kỹ thuật điều hành sân khấu',finished:this.finished,completedSteps:this.step,totalSteps:7,durationSeconds:this.startedAt===null?0:Math.round(((this.completedAt??this.now())-this.startedAt)/1000),recoverySeconds:this.recoveredAt===null?null:Math.round((this.recoveredAt-this.faultAt)/1000),invalidActions:this.errors,hintsUsed:this.hints,log:this.log};}
}
