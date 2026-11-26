/* 續集預告的片種特效層：每部片一種「認得出來」的動態背景（全部程式繪製，不使用電影素材）
   FX.start(canvas, n, color) → 回傳 {stop(), level(v)}；level 控制整體強度 0–1 */
window.FX=(function(){
const TYPE={1:'ripple',2:'bokeh',3:'rain',4:'hud',5:'fold',6:'net',7:'sparkle',8:'pixel',9:'feed',10:'speed',11:'snow',12:'code',13:'dust',14:'scan',15:'branch',16:'spot',17:'loop',18:'warp',19:'flash',20:'silent',21:'clock',22:'eye'};
const R=Math.random, TAU=Math.PI*2;
function hexA(h,a){ const n=parseInt(h.slice(1),16); return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`; }
function make(type,W,H,C){
  const A=a=>hexA(C,a);
  switch(type){
  case 'code':{ const fs=22, cols=Math.ceil(W/fs), y=[...Array(cols)].map(()=>R()*-H), sp=[...Array(cols)].map(()=>2+R()*5), ch='01アイウエオカキクケコサシスセソタチツテトナニヌネノ$#%&';
    return (g)=>{ g.fillStyle='rgba(0,0,0,.14)'; g.fillRect(0,0,W,H); g.font=`${fs}px monospace`;
      for(let i=0;i<cols;i++){ g.fillStyle=R()<.04?'#e8ffe8':A(.85); g.fillText(ch[R()*ch.length|0],i*fs,y[i]); y[i]+=sp[i]*4; if(y[i]>H+40&&R()>.97) y[i]=-20; } }; }
  case 'rain':{ const d=[...Array(420)].map(()=>[R()*W,R()*H,8+R()*16,.2+R()*.5]);
    return (g,t)=>{ g.clearRect(0,0,W,H); const gr=g.createLinearGradient(0,H*.55,0,H); gr.addColorStop(0,'rgba(0,0,0,0)'); gr.addColorStop(1,A(.22)); g.fillStyle=gr; g.fillRect(0,0,W,H);
      g.strokeStyle='rgba(200,215,255,.35)'; g.lineWidth=1.2; g.beginPath(); d.forEach(p=>{ g.moveTo(p[0],p[1]); g.lineTo(p[0]-p[2]*.25,p[1]+p[2]*2.2); p[1]+=p[2]*1.8; p[0]-=p[2]*.2; if(p[1]>H){p[1]=-20;p[0]=R()*W*1.1;} }); g.stroke();
      for(let i=0;i<5;i++){ const x=(i*W/5+t*.02)%W; g.fillStyle=A(.05+.04*Math.sin(t/300+i)); g.fillRect(x,0,60,H); } }; }
  case 'stars': case 'sparkle': case 'eye':{ const s=[...Array(type==='eye'?260:340)].map(()=>[R()*W,R()*H,R()*1.8+.2,R()*TAU]);
    return (g,t)=>{ g.clearRect(0,0,W,H); s.forEach(p=>{ const a=.25+.75*Math.abs(Math.sin(t/900+p[3])); g.fillStyle=type==='sparkle'?A(a):`rgba(236,232,223,${a*.8})`; g.fillRect(p[0],p[1],p[2],p[2]); if(type==='sparkle'&&a>.97){ g.strokeStyle=A(.6); g.beginPath(); g.moveTo(p[0]-8,p[1]); g.lineTo(p[0]+8,p[1]); g.moveTo(p[0],p[1]-8); g.lineTo(p[0],p[1]+8); g.stroke(); } p[0]-=type==='eye'?.08:.15; if(p[0]<0)p[0]=W; });
      if(type==='eye'){ const r=90+8*Math.sin(t/600), cx=W*.5, cy=H*.5, gr=g.createRadialGradient(cx,cy,0,cx,cy,r*3.2); gr.addColorStop(0,'rgba(255,60,40,.55)'); gr.addColorStop(.25,'rgba(200,20,10,.18)'); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.fillRect(0,0,W,H);
        g.fillStyle='rgba(255,90,60,.9)'; g.beginPath(); g.arc(cx,cy,10,0,TAU); g.fill(); g.strokeStyle='rgba(220,220,220,.18)'; g.lineWidth=2; g.beginPath(); g.arc(cx,cy,r,0,TAU); g.stroke(); } }; }
  case 'warp':{ const s=[...Array(500)].map(()=>[(R()-.5)*W,(R()-.5)*H,R()*W]);
    return (g)=>{ g.fillStyle='rgba(0,0,0,.35)'; g.fillRect(0,0,W,H); g.strokeStyle='rgba(220,235,255,.8)'; g.lineWidth=1.4; g.beginPath();
      s.forEach(p=>{ const k=W/p[2], x=W/2+p[0]*k*.5, y=H/2+p[1]*k*.5; p[2]-=14; const k2=W/p[2], x2=W/2+p[0]*k2*.5, y2=H/2+p[1]*k2*.5; if(p[2]<20){ p[2]=W; return; } g.moveTo(x,y); g.lineTo(x2,y2); }); g.stroke(); }; }
  case 'speed':{ const s=[...Array(160)].map(()=>[R()*W,R()*H,40+R()*200,6+R()*18]);
    return (g,t)=>{ g.clearRect(0,0,W,H); s.forEach((p,i)=>{ g.strokeStyle=i%7===0?A(.85):'rgba(255,200,140,.3)'; g.lineWidth=i%7===0?3:1.2; g.beginPath(); g.moveTo(p[0],p[1]); g.lineTo(p[0]-p[2],p[1]); g.stroke(); p[0]+=p[3]*2; if(p[0]-p[2]>W){p[0]=-10;p[1]=R()*H;} });
      if((t/1000)%3<.08){ g.fillStyle='rgba(180,220,255,.5)'; g.fillRect(0,0,W,H); } }; }
  case 'snow': case 'dust':{ const s=[...Array(type==='snow'?260:180)].map(()=>[R()*W,R()*H,R()*2.6+.6,R()*TAU]);
    return (g,t)=>{ g.clearRect(0,0,W,H); if(type==='dust'){ const gr=g.createLinearGradient(W*.8,0,W*.3,H); gr.addColorStop(0,A(.28)); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.fillRect(0,0,W,H); }
      s.forEach(p=>{ g.fillStyle=type==='snow'?'rgba(240,244,255,.75)':A(.6); g.beginPath(); g.arc(p[0],p[1],p[2],0,TAU); g.fill(); p[1]+=type==='snow'?p[2]*.6:-.25; p[0]+=Math.sin(t/1200+p[3])*.5; if(p[1]>H)p[1]=-5; if(p[1]<0)p[1]=H; }); }; }
  case 'bokeh':{ const s=[...Array(46)].map(()=>[R()*W,R()*H,20+R()*90,R()*TAU]);
    return (g,t)=>{ g.clearRect(0,0,W,H); s.forEach(p=>{ const a=.06+.08*Math.sin(t/1500+p[3]); const gr=g.createRadialGradient(p[0],p[1],0,p[0],p[1],p[2]); gr.addColorStop(0,A(a+.08)); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.beginPath(); g.arc(p[0],p[1],p[2],0,TAU); g.fill(); p[1]-=.25; if(p[1]<-p[2])p[1]=H+p[2]; }); }; }
  case 'hud': case 'scan':{ return (g,t)=>{ g.clearRect(0,0,W,H); const cx=W/2, cy=H/2; g.strokeStyle=A(.55); g.lineWidth=1.5;
      for(let i=0;i<4;i++){ const r=120+i*70, a0=t/(900+i*300)*(i%2?-1:1); g.beginPath(); g.arc(cx,cy,r,a0,a0+TAU*(.25+i*.12)); g.stroke(); }
      for(let i=0;i<60;i++){ const a=i/60*TAU; g.beginPath(); g.moveTo(cx+Math.cos(a)*400,cy+Math.sin(a)*400); g.lineTo(cx+Math.cos(a)*(i%5?408:422),cy+Math.sin(a)*(i%5?408:422)); g.stroke(); }
      const y=(t*.35)%H; g.fillStyle=A(type==='scan'?.25:.12); g.fillRect(0,y,W,type==='scan'?6:2);
      if(type==='scan'){ for(let x=0;x<W;x+=48) for(let yy=0;yy<H;yy+=48){ g.fillStyle=A(.06); g.fillRect(x,yy,2,2);} } }; }
  case 'fold':{ return (g,t)=>{ g.clearRect(0,0,W,H); g.save(); g.translate(W/2,H/2); g.rotate(Math.sin(t/3000)*.25); const s=1+((t/4000)%1)*.6; g.scale(s,s); g.strokeStyle=A(.3); g.lineWidth=1;
      for(let i=-12;i<=12;i++){ g.beginPath(); g.moveTo(i*80,-H); g.lineTo(i*80*.2,0); g.lineTo(i*80,H); g.stroke(); g.beginPath(); g.moveTo(-W,i*50); g.lineTo(W,i*50); g.stroke(); } g.restore(); }; }
  case 'net':{ const p=[...Array(70)].map(()=>[R()*W,R()*H,(R()-.5)*.6,(R()-.5)*.6]);
    return (g)=>{ g.clearRect(0,0,W,H); p.forEach(a=>{ a[0]+=a[2]; a[1]+=a[3]; if(a[0]<0||a[0]>W)a[2]*=-1; if(a[1]<0||a[1]>H)a[3]*=-1; });
      for(let i=0;i<p.length;i++) for(let j=i+1;j<p.length;j++){ const d=Math.hypot(p[i][0]-p[j][0],p[i][1]-p[j][1]); if(d<170){ g.strokeStyle=A(.5*(1-d/170)); g.beginPath(); g.moveTo(p[i][0],p[i][1]); g.lineTo(p[j][0],p[j][1]); g.stroke(); } }
      p.forEach(a=>{ g.fillStyle=A(.9); g.beginPath(); g.arc(a[0],a[1],2.4,0,TAU); g.fill(); }); }; }
  case 'pixel':{ return (g,t)=>{ g.clearRect(0,0,W,H); const s=32; for(let i=0;i<70;i++){ const x=(R()*W/s|0)*s, y=(R()*H/s|0)*s; g.fillStyle=[A(.35),'rgba(80,200,255,.25)','rgba(255,255,255,.12)'][i%3]; g.fillRect(x,y,s-2,s-2); }
      if(R()<.12){ const y=R()*H; g.fillStyle=A(.35); g.fillRect(0,y,W,8+R()*30); } }; }
  case 'feed':{ const rows=[...Array(26)].map((_,i)=>[i*48,R()]);
    return (g,t)=>{ g.clearRect(0,0,W,H); rows.forEach(r=>{ r[0]-=3; if(r[0]<-48){ r[0]+=26*48; r[1]=R(); }
      g.fillStyle='rgba(236,232,223,.08)'; g.fillRect(W*.32,r[0],W*.36,38); g.fillStyle=A(.45); g.beginPath(); g.arc(W*.32+20,r[0]+19,11,0,TAU); g.fill();
      g.fillStyle='rgba(236,232,223,.22)'; g.fillRect(W*.32+42,r[0]+10,W*.36*(.3+r[1]*.55),6); g.fillRect(W*.32+42,r[0]+22,W*.36*(.2+r[1]*.3),5); }); }; }
  case 'ripple':{ const rs=[]; return (g,t)=>{ g.clearRect(0,0,W,H); if(R()<.03) rs.push([R()*W,H*(.35+R()*.5),0]);
      rs.forEach(r=>{ r[2]+=2.2; g.strokeStyle=A(Math.max(0,.6-r[2]/400)); g.lineWidth=1.5; g.beginPath(); g.ellipse(r[0],r[1],r[2],r[2]*.3,0,0,TAU); g.stroke(); }); while(rs.length&&rs[0][2]>420) rs.shift(); }; }
  case 'branch':{ let segs=[]; const grow=()=>{ segs=[[W*.5,H,-Math.PI/2,140,0]]; }; grow(); let k=0;
    return (g,t)=>{ g.fillStyle='rgba(0,0,0,.05)'; g.fillRect(0,0,W,H); const nx=[]; segs.forEach(s=>{ const x2=s[0]+Math.cos(s[2])*s[3]*.08, y2=s[1]+Math.sin(s[2])*s[3]*.08; g.strokeStyle=A(.7); g.lineWidth=1.4; g.beginPath(); g.moveTo(s[0],s[1]); g.lineTo(x2,y2); g.stroke();
      s[0]=x2; s[1]=y2; s[4]++; if(s[4]>12&&s[3]>20&&nx.length<400){ nx.push([x2,y2,s[2]-.45-R()*.2,s[3]*.78,0]); nx.push([x2,y2,s[2]+.45+R()*.2,s[3]*.78,0]); s[3]=0; } else if(s[3]>0) nx.push(s); }); segs=nx; if(++k>220||!segs.length){ k=0; grow(); } }; }
  case 'spot':{ const d=[...Array(120)].map(()=>[R(),R()*H,10+R()*14]);
    return (g,t)=>{ g.clearRect(0,0,W,H); const cx=W*.5+Math.sin(t/2000)*40; const gr=g.createLinearGradient(cx,0,cx,H); gr.addColorStop(0,'rgba(255,250,230,.22)'); gr.addColorStop(1,'rgba(255,250,230,.04)'); g.fillStyle=gr; g.beginPath(); g.moveTo(cx-40,0); g.lineTo(cx+40,0); g.lineTo(cx+220,H); g.lineTo(cx-220,H); g.fill();
      g.strokeStyle='rgba(200,220,255,.5)'; g.beginPath(); d.forEach(p=>{ const x=cx-30+p[0]*60+(p[1]/H)*(p[0]-.5)*360; g.moveTo(x,p[1]); g.lineTo(x,p[1]+p[2]); p[1]+=p[2]*1.6; if(p[1]>H)p[1]=-10; }); g.stroke();
      g.strokeStyle=A(.12); for(let x=0;x<W;x+=120){ g.beginPath(); g.moveTo(x,0); g.lineTo(x,H*.4); g.stroke(); } }; }
  case 'loop':{ return (g,t)=>{ g.fillStyle='rgba(0,0,0,.25)'; g.fillRect(0,0,W,H); const ph=(t%1600)/1600; g.strokeStyle=A(.6); g.lineWidth=2;
      for(let i=0;i<14;i++){ const y=(i/14*H+ph*H)%H; g.beginPath(); g.moveTo(0,y); g.lineTo(W,y+(R()-.5)*6); g.stroke(); }
      if(ph<.05){ g.fillStyle='rgba(255,255,255,.35)'; g.fillRect(0,0,W,H); } g.fillStyle=A(.5); g.font='bold 28px monospace'; g.fillText('RESET '+String(Math.floor(t/1600)+1).padStart(3,'0'),W-250,H-40); }; }
  case 'flash':{ return (g,t)=>{ g.clearRect(0,0,W,H); const k=Math.floor(t/900); const r=Math.sin(k*91.7)*.5+.5, x=W*(.15+r*.6), y=H*(.2+(Math.sin(k*13.1)*.5+.5)*.45), ph=(t%900)/900;
      g.save(); g.translate(x,y); g.rotate((r-.5)*.4); g.fillStyle=`rgba(236,232,223,${Math.max(0,.5-ph*.5)})`; g.fillRect(-90,-105,180,210); g.fillStyle=`rgba(0,0,0,${Math.max(0,.5-ph*.5)})`; g.fillRect(-78,-93,156,150); g.restore();
      if(ph<.06){ g.fillStyle='rgba(255,255,255,.45)'; g.fillRect(0,0,W,H); } }; }
  case 'silent':{ return (g,t)=>{ g.clearRect(0,0,W,H); for(let i=0;i<900;i++){ g.fillStyle=`rgba(255,255,255,${R()*.09})`; g.fillRect(R()*W,R()*H,1.5,1.5); }
      for(let i=0;i<3;i++){ if(R()<.5){ g.fillStyle='rgba(255,255,255,.18)'; g.fillRect(R()*W,0,1.2,H); } } g.fillStyle=`rgba(255,255,255,${.04+R()*.05})`; g.fillRect(0,0,W,H);
      g.strokeStyle='rgba(0,0,0,.6)'; g.lineWidth=60; g.beginPath(); g.ellipse(W/2,H/2,W*.62,H*.72,0,0,TAU); g.stroke(); }; }
  case 'clock':{ return (g,t)=>{ g.clearRect(0,0,W,H); const gear=(cx,cy,r,n,sp)=>{ g.save(); g.translate(cx,cy); g.rotate(t/1000*sp); g.strokeStyle=A(.45); g.lineWidth=2; g.beginPath();
        for(let i=0;i<n*2;i++){ const a=i/(n*2)*TAU, rr=i%2?r:r*1.12; g.lineTo(Math.cos(a)*rr,Math.sin(a)*rr); } g.closePath(); g.stroke(); g.beginPath(); g.arc(0,0,r*.35,0,TAU); g.stroke(); g.restore(); };
      gear(W*.2,H*.75,150,18,.3); gear(W*.2+250,H*.75-60,90,12,-.5); gear(W*.82,H*.25,180,22,-.22); gear(W*.82-280,H*.25+40,70,10,.6);
      const cx=W/2, cy=H/2; g.strokeStyle=A(.25); for(let i=0;i<12;i++){ const a=i/12*TAU; g.beginPath(); g.moveTo(cx+Math.cos(a)*300,cy+Math.sin(a)*300); g.lineTo(cx+Math.cos(a)*330,cy+Math.sin(a)*330); g.stroke(); } }; }
  }
  return ()=>{};
}
return { type:n=>TYPE[n], start(cv,n,C){ const W=cv.width=cv.clientWidth||1280, H=cv.height=cv.clientHeight||720, g=cv.getContext('2d'); const f=make(TYPE[n],W,H,C||'#e8d4a2'); let on=true, t0=performance.now();
  (function loop(now){ if(!on) return; f(g,now-t0); requestAnimationFrame(loop); })(t0); return { stop(){ on=false; } }; } };
})();
