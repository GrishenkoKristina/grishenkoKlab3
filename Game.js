import { Player } from './Player.js';
import { Input } from './input.js';
import { overlaps } from './collision.js';

const W=960,H=540;
export class Game {
  constructor(canvas){
    this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.input=new Input(canvas);
    this.state='ready'; this.frameId=null; this.lastTime=null; this.score=0; this.best=this.readBest(); this.time=0;
    this.ui={score:document.querySelector('#score'),best:document.querySelector('#best'),overlay:document.querySelector('#overlay'),title:document.querySelector('#overlay-title'),text:document.querySelector('#overlay-text'),start:document.querySelector('#start-btn'),pause:document.querySelector('#pause-btn')};
    this.ui.best.textContent=this.best; this.buildLevel();
    this.ui.start.addEventListener('click',()=>this.state==='paused'?this.resume():this.start());
    this.ui.pause.addEventListener('click',()=>this.state==='playing'?this.pause():this.resume());
    document.querySelector('#restart-btn').addEventListener('click',()=>this.start());
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&this.state==='playing')this.pause();this.input.clear();});
    this.render();
  }
  buildLevel(){
    this.platforms=[
      {x:0,y:472,w:190,h:68}, {x:165,y:397,w:150,h:18}, {x:350,y:326,w:145,h:18},
      {x:530,y:255,w:150,h:18}, {x:710,y:184,w:150,h:18}, {x:842,y:120,w:118,h:18}
    ];
    this.player=new Player(58,428);
    this.items=[{x:245,y:360,type:0,collected:false},{x:422,y:289,type:1,collected:false},{x:606,y:218,type:2,collected:false}];
    this.hazard={x:190,y:486,w:652,h:54}; this.exit={x:884,y:55,w:44,h:65}; this.hint=0;
  }
  readBest(){try{return Number(localStorage.getItem('artifact-platformer-best')||0)}catch{return 0}}
  saveBest(){try{localStorage.setItem('artifact-platformer-best',String(this.best))}catch{}}
  start(){this.stopLoop();this.buildLevel();this.score=0;this.updateScore();this.state='playing';this.input.active=true;this.input.clear();this.ui.pause.disabled=false;this.ui.pause.textContent='Пауза';this.hideOverlay();this.lastTime=null;this.frameId=requestAnimationFrame(t=>this.loop(t));}
  pause(){if(this.state!=='playing')return;this.state='paused';this.input.clear();this.showOverlay('Передышка у костра','Экспедиция приостановлена. Когда будешь готова — продолжай путь.','Продолжить');this.ui.pause.textContent='Продолжить';this.lastTime=null;}
  resume(){if(this.state!=='paused')return;this.state='playing';this.input.active=true;this.input.clear();this.hideOverlay();this.ui.pause.textContent='Пауза';this.lastTime=null;this.frameId=requestAnimationFrame(t=>this.loop(t));}
  stopLoop(){if(this.frameId!==null)cancelAnimationFrame(this.frameId);this.frameId=null;}
  loop(t){if(this.state!=='playing')return;const dt=this.lastTime===null?0:Math.min((t-this.lastTime)/1000,.033);this.lastTime=t;this.time+=dt;this.update(dt);this.render();if(this.state==='playing')this.frameId=requestAnimationFrame(n=>this.loop(n));}
  update(dt){this.player.update(dt,this.input.getAxis(),this.input.consumeJump(),this.platforms);
    for(const item of this.items){if(!item.collected&&overlaps(this.player,{x:item.x-14,y:item.y-16,w:28,h:32})){item.collected=true;this.score++;this.updateScore();}}
    if(overlaps(this.player,this.hazard)||this.player.y>H+30){this.finish(false,'Путь прерван','Лава поглотила тропу. Соберись и попробуй пройти маршрут ещё раз.');return;}
    if(overlaps(this.player,this.exit)){if(this.score===3)this.finish(true,'Реликвии возвращены!','Ты собрала три древних артефакта и открыла врата Хранителей.');else this.hint=1.6;}
    this.hint=Math.max(0,this.hint-dt);
  }
  finish(win,title,msg){this.state=win?'won':'lost';this.input.active=false;this.input.clear();this.stopLoop();if(win&&this.score>this.best){this.best=this.score;this.saveBest();this.ui.best.textContent=this.best;}this.ui.pause.disabled=true;this.showOverlay(title,msg,'Заново');}
  updateScore(){this.ui.score.textContent=`${this.score} / 3`;}
  hideOverlay(){this.ui.overlay.classList.add('hidden');}
  showOverlay(title,msg,button){this.ui.title.textContent=title;this.ui.text.textContent=msg;this.ui.start.textContent=button;this.ui.overlay.classList.remove('hidden');}
  render(){const c=this.ctx;c.clearRect(0,0,W,H);this.drawBackdrop(c);this.drawArchitecture(c);this.drawPlatforms(c);this.drawLava(c);this.drawBanners(c);this.drawItems(c);this.drawGate(c);this.player.draw(c);this.drawSceneDetails(c);}
  drawBackdrop(c){let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#111a2b');g.addColorStop(.55,'#263247');g.addColorStop(1,'#493b3a');c.fillStyle=g;c.fillRect(0,0,W,H);
    // moon and stars
    c.save();c.shadowColor='#f5dfad';c.shadowBlur=35;c.fillStyle='#f1dfb9';c.beginPath();c.arc(790,83,34,0,Math.PI*2);c.fill();c.restore();
    for(let i=0;i<65;i++){let x=(i*157+31)%W,y=(i*71+19)%270;c.globalAlpha=.25+(i%4)*.12;c.fillStyle='#f6e7c5';c.fillRect(x,y,2,2);}c.globalAlpha=1;
    // distant mountains
    c.fillStyle='#202c3a';for(let i=0;i<8;i++){let x=i*145-50;c.beginPath();c.moveTo(x,390);c.lineTo(x+75,205+(i%3)*35);c.lineTo(x+160,390);c.fill();}
    // distant castle towers
    c.fillStyle='#182334';for(let i=0;i<6;i++){let x=i*190+15;c.fillRect(x,260,72,150);c.fillRect(x+17,218,38,48);c.beginPath();c.moveTo(x+10,220);c.lineTo(x+36,174);c.lineTo(x+62,220);c.fill();}
    c.fillStyle='rgba(235,190,115,.08)';c.fillRect(0,410,W,130);
  }
  drawArchitecture(c){
    // side pillars and gothic arches
    for(let x of [20,925]){c.fillStyle='#4d4a4a';c.fillRect(x,95,18,300);c.fillStyle='#777064';c.fillRect(x-7,95,32,12);c.fillRect(x-7,390,32,12);c.fillStyle='#282e3a';c.beginPath();c.moveTo(x-18,96);c.lineTo(x+9,45);c.lineTo(x+36,96);c.fill();}
    // warm windows
    for(let x of [115,475,790]){c.fillStyle='#171f2c';c.beginPath();c.moveTo(x,300);c.lineTo(x,245);c.quadraticCurveTo(x+24,205,x+48,245);c.lineTo(x+48,300);c.fill();c.fillStyle='rgba(235,160,77,.32)';c.fillRect(x+8,258,32,40);}
  }
  drawPlatforms(c){for(const p of this.platforms){c.fillStyle='#292d35';c.fillRect(p.x,p.y+5,p.w,p.h+9);c.fillStyle='#777064';c.fillRect(p.x,p.y,p.w,p.h);c.fillStyle='#b5a17b';c.fillRect(p.x,p.y,p.w,5);c.fillStyle='#4b4b4b';for(let x=p.x+12;x<p.x+p.w-6;x+=34){c.fillRect(x,p.y+8,3,7);c.fillStyle='#a18b68';c.fillRect(x+8,p.y+8,2,5);c.fillStyle='#4b4b4b';}c.fillStyle='rgba(255,232,180,.12)';c.fillRect(p.x+3,p.y+2,p.w-6,2);}}
  drawLava(c){let g=c.createLinearGradient(0,480,0,540);g.addColorStop(0,'#a8442e');g.addColorStop(.45,'#e47a38');g.addColorStop(1,'#612b2b');c.fillStyle=g;c.fillRect(this.hazard.x,486,this.hazard.w,54);c.strokeStyle='#ffb15d';c.lineWidth=3;c.beginPath();for(let x=this.hazard.x;x<this.hazard.x+this.hazard.w;x+=18){let y=489+Math.sin(x*.07+this.time*4)*4;if(x===this.hazard.x)c.moveTo(x,y);else c.lineTo(x,y);}c.stroke();for(let i=0;i<18;i++){let x=(i*53+this.time*28)%(this.hazard.w)+this.hazard.x,y=505+Math.sin(this.time*2+i)*18;c.fillStyle='rgba(255,213,125,.55)';c.fillRect(x,y,3,3);}}
  drawBanners(c){const banners=[{x:90,y:140,color:'#762f36',mark:'♜'},{x:285,y:112,color:'#294b58',mark:'✦'},{x:625,y:120,color:'#6e5636',mark:'☼'},{x:825,y:150,color:'#47334f',mark:'♛'}];for(const b of banners){c.save();c.translate(b.x,b.y);c.fillStyle='#b69b6b';c.fillRect(0,-10,5,75);c.fillStyle=b.color;c.beginPath();c.moveTo(5,-6);c.lineTo(74,-6);c.lineTo(74,54);c.lineTo(40,43);c.lineTo(5,54);c.closePath();c.fill();c.strokeStyle='#d7bd85';c.lineWidth=2;c.stroke();c.fillStyle='#e7d3a4';c.font='30px Georgia';c.textAlign='center';c.fillText(b.mark,40,31);c.restore();}}
  drawItems(c){for(const it of this.items){if(it.collected)continue;c.save();c.translate(it.x,it.y+Math.sin(this.time*3+it.x)*4);c.shadowColor='#f3c66f';c.shadowBlur=20;c.fillStyle='#c38b38';c.beginPath();c.arc(0,0,16,0,Math.PI*2);c.fill();c.strokeStyle='#f8df9d';c.lineWidth=3;c.stroke();c.shadowBlur=0;
      if(it.type===0){c.fillStyle='#5d9ba0';c.beginPath();c.moveTo(0,-11);c.lineTo(9,0);c.lineTo(0,11);c.lineTo(-9,0);c.fill();c.strokeStyle='#e9d69b';c.stroke();}
      if(it.type===1){c.fillStyle='#f4d47e';c.beginPath();c.moveTo(0,-12);c.lineTo(4,-4);c.lineTo(12,0);c.lineTo(4,4);c.lineTo(0,12);c.lineTo(-4,4);c.lineTo(-12,0);c.lineTo(-4,-4);c.closePath();c.fill();}
      if(it.type===2){c.fillStyle='#8e79b8';c.beginPath();c.moveTo(0,-12);c.lineTo(8,-3);c.lineTo(6,8);c.lineTo(0,13);c.lineTo(-6,8);c.lineTo(-8,-3);c.closePath();c.fill();c.strokeStyle='#ead7ff';c.stroke();}c.restore();}}
  drawGate(c){c.save();const x=this.exit.x+22,y=this.exit.y+32;c.shadowColor='#f1d08a';c.shadowBlur=22;c.strokeStyle='#c9a86d';c.lineWidth=8;c.beginPath();c.arc(x,y,25,Math.PI,0);c.lineTo(x+25,y+34);c.lineTo(x-25,y+34);c.closePath();c.stroke();c.shadowBlur=12;c.fillStyle='rgba(111,167,174,.32)';c.beginPath();c.arc(x,y,19,Math.PI,0);c.lineTo(x+19,y+32);c.lineTo(x-19,y+32);c.closePath();c.fill();c.fillStyle='#e9d49b';c.font='17px Georgia';c.textAlign='center';c.fillText('✧',x,y+12);c.restore();}
  drawSceneDetails(c){ // chains, stones and glints
    c.strokeStyle='rgba(198,174,128,.32)';c.lineWidth=2;for(let x of [205,510,700]){c.beginPath();c.moveTo(x,0);c.lineTo(x,72);c.stroke();}
    c.fillStyle='rgba(238,211,157,.65)';for(let i=0;i<8;i++){let x=(i*131+this.time*9)%W,y=320+(i%3)*38;c.fillRect(x,y,2,2);}
    if(this.hint>0){c.fillStyle='rgba(17,22,31,.82)';c.fillRect(320,18,320,38);c.fillStyle='#f2dfb6';c.font='15px Georgia';c.textAlign='center';c.fillText('Собери все три реликвии, чтобы открыть врата',480,42);}
  }
}
