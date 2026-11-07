import { landOnPlatforms } from './collision.js';
export class Player{
 constructor(x,y){this.startX=x;this.startY=y;this.w=32;this.h=44;this.speed=270;this.jumpSpeed=600;this.facing=1;this.walk=0;this.reset();}
 reset(){this.x=this.startX;this.y=this.startY;this.vx=0;this.vy=0;this.onGround=false;this.walk=0;}
 update(dt,axis,jumpPressed,platforms){this.vx=axis*this.speed;if(axis)this.facing=Math.sign(axis);if(jumpPressed&&this.onGround){this.vy=-this.jumpSpeed;this.onGround=false;}const previousBottom=this.y+this.h;this.x=Math.max(0,Math.min(960-this.w,this.x+this.vx*dt));this.vy+=1500*dt;this.y+=this.vy*dt;this.onGround=false;landOnPlatforms(this,platforms,previousBottom);if(this.onGround&&axis)this.walk+=dt*12;}
 draw(c){c.save();c.translate(this.x+16,this.y);c.scale(this.facing,1);const bob=this.onGround?Math.sin(this.walk)*1.5:0;c.translate(0,bob);
 // shadow
 c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(0,43,17,4,0,0,Math.PI*2);c.fill();
 // cloak
 c.fillStyle='#713b3e';c.beginPath();c.moveTo(-10,16);c.lineTo(10,16);c.lineTo(15,39);c.lineTo(-14,39);c.closePath();c.fill();c.fillStyle='#a45b4d';c.beginPath();c.moveTo(-7,18);c.lineTo(3,22);c.lineTo(-5,38);c.lineTo(-12,38);c.closePath();c.fill();
 // legs and boots
 c.fillStyle='#34333a';c.fillRect(-9,35,7,7);c.fillRect(3,35,7,7);c.fillStyle='#b28a54';c.fillRect(-11,40,10,4);c.fillRect(2,40,10,4);
 // tunic and belt
 c.fillStyle='#b49a6c';c.beginPath();c.moveTo(-9,16);c.lineTo(9,16);c.lineTo(11,35);c.lineTo(-11,35);c.closePath();c.fill();c.fillStyle='#4b4140';c.fillRect(-10,28,20,4);c.fillStyle='#e0c17e';c.fillRect(-2,28,5,4);
 // arm
 c.fillStyle='#c99d76';c.fillRect(8,19,5,13);c.fillStyle='#8b8c87';c.fillRect(7,26,7,7);
 // head
 c.fillStyle='#d7ae88';c.beginPath();c.arc(0,11,9,0,Math.PI*2);c.fill();
 // hair
 c.fillStyle='#4a3029';c.beginPath();c.arc(0,8,9,Math.PI,Math.PI*2);c.fill();c.fillRect(-9,7,4,7);
 // helmet rim and plume
 c.fillStyle='#8b9694';c.beginPath();c.arc(0,7,10,Math.PI,Math.PI*2);c.fill();c.fillStyle='#d4bd83';c.fillRect(-10,7,20,3);c.fillStyle='#8d3e42';c.beginPath();c.moveTo(0,-2);c.quadraticCurveTo(8,-14,3,-16);c.quadraticCurveTo(2,-8,-2,-3);c.fill();
 // face details
 c.fillStyle='#332b2a';c.fillRect(3,11,2,2);c.strokeStyle='#70483b';c.lineWidth=1;c.beginPath();c.moveTo(1,16);c.lineTo(5,16);c.stroke();
 // shoulder armor
 c.fillStyle='#9da39b';c.beginPath();c.arc(-8,19,5,0,Math.PI*2);c.fill();c.strokeStyle='#e2d2a6';c.stroke();c.fillStyle='#d7bd7d';c.fillRect(-2,19,4,8);
 c.restore();}
}
