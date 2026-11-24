(function(){
'use strict';
const DATA = window.DATA || [];
const HALLS = [
  {z:'intro', no:'00', name:'序幕廳', en:'PROLOGUE', art:'intro', row:'S',
   desc:'開幕兩場：AI 時代，什麼變了、什麼沒變。先看這兩場，後面 20 場會更有感。'},
  {z:'people', no:'01', name:'People 廳', en:'PEOPLE', art:'people', row:'P',
   desc:'人仍然是一切的起點。真實、信任、情緒與共同記憶，是 AI 最難複製的東西。'},
  {z:'model', no:'02', name:'Model 廳', en:'MODEL', art:'model', row:'M',
   desc:'把對人的理解變成模型：數位分身、被選擇的場域、人的判斷，還有看不見的組織文化。'},
  {z:'ai', no:'03', name:'A.I. 廳', en:'A.I.', art:'ai', row:'A',
   desc:'讓 AI 真正上工：體驗優化、GEO、從生成力到交付力，以及 Agent 可以被授權到哪裡。'}
];
const TIMES=[{k:'all',l:'不限',f:()=>true},{k:'s',l:'10 分鐘內',f:m=>m<=10},{k:'m',l:'10–15 分鐘',f:m=>m>10&&m<=15},{k:'l',l:'15 分鐘以上',f:m=>m>15}];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const byN=n=>DATA.find(a=>a.n===n);
const hallOf=z=>HALLS.find(h=>h.z===z);
const SCENES={"1": "2054 年，華盛頓特區。警方靠三名躺在水池裡的「先知」預見謀殺，在兇手動手前就將他逮捕——直到有一天，預言指向了警探自己。", "2": "不久的未來，洛杉磯。一位替別人代寫情書的寂寞男人，愛上了電腦裡那個會笑、會好奇、比誰都懂他的作業系統。", "3": "2019 年，酸雨不停的洛杉磯。銀翼殺手的工作，是用一套問答測驗，揪出混在人群裡、和真人一模一樣的複製人。", "4": "被困在山洞裡的軍火商，用一堆廢料打造出第一副盔甲。回到家後，他和 AI 管家 JARVIS 一起，把它變成真正的戰甲。", "5": "一支專門潛入他人夢境的團隊，接下最不可能的任務：不是偷走一個想法，而是植入一個。他們需要一位能設計多層夢境的「架構師」。", "6": "2029 年，人腦可以連上網路，記憶也能被駭客改寫。一位全身義體的女特工開始懷疑：自己的靈魂，還是真的嗎？", "7": "一個被設計成「會愛人」的機器男孩被家人遺棄。他踏上漫長的旅程尋找藍仙女，只為了變成真正的男孩，讓媽媽愛他。", "8": "2045 年，現實一片破敗。全世界的人戴上頭盔，湧進同一個虛擬宇宙「綠洲」，爭奪創辦人藏在裡面的彩蛋。", "9": "2003 年，哈佛宿舍。一個大學生寫出的網站，讓全校開始在網路上談論彼此。幾年後，它改變了全世界說話的方式。", "10": "馬蒂穿越到 2015 年：街上有飛天滑板、會自己綁鞋帶的球鞋，還有一隻從電影看板裡撲向路人的立體大白鯊。", "11": "分手後，她找了一家公司把他從記憶裡刪除。他決定也這麼做，卻在記憶被一段段抹去時，拚命想把她留下來。", "12": "一名駭客發現，他每天生活的世界只是一個模擬程式。身邊的人、街道，甚至早餐的味道，全都是被運算出來的。", "13": "地球被垃圾掩埋，只剩一台小機器人日復一日地清理。人類住在太空船上，躺在飄浮椅裡，生活的一切都由系統安排。", "14": "2035 年，機器人走進每個家庭。一位警探始終不信任它們：那場車禍裡，機器人算出他的生存機率較高，救了他，放棄了一個小女孩。", "15": "一個青年發現自己能回到過去，改變一個小小的決定。但每改一次，現在就變成完全不同的模樣，而且往往更糟。", "16": "楚門在海邊小鎮長大，過著再平凡不過的日子。直到某天他發現：天空、鄰居，甚至他的妻子，都是一齣全天候直播節目的佈景。", "17": "外星大軍入侵。一名從沒上過戰場的軍官每次陣亡，都會回到前一天早上醒來。他只能一次次重來，記住每個會出錯的地方。", "18": "沙漠星球上，兩台機器人帶著一份秘密訊息流浪。其中一台精通六百萬種溝通方式，負責替人類與機器翻譯。", "19": "一個男人失去了製造新記憶的能力，只能靠拍立得照片、隨手筆記和身上的刺青，一點一點拼湊殺妻兇手的線索。", "20": "工廠的生產線越轉越快。一個工人鎖螺絲鎖到停不下手，最後整個人被捲進了巨大的齒輪裡。", "21": "1930 年代的巴黎車站，一個孤兒守著父親留下的機械人偶。當人偶終於提筆，畫出的竟是一位被世人遺忘的電影先驅的作品。", "22": "前往木星的太空船上，所有系統都交給 AI「HAL 9000」管理。它從不出錯，直到它開始做出船員沒有授權的決定。"};
const COLORS={people:'#d4e38a',model:'#efc7c7',ai:'#a8d8e2',intro:'#e8d4a2'};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* 開場大標：每部片一種出場方式，呼應該片的素描與電影語彙 */
const TFX={1:'holo',2:'soft',3:'neon',4:'hud',5:'fold',6:'glitch',7:'star',8:'pixel',9:'type',10:'warp',11:'erase',12:'rain',13:'bounce',14:'scan',15:'flutter',16:'spot',17:'loop',18:'crawl',19:'reverse',20:'silent',21:'gear',22:'slow'};
const splitTitle=(t,fx)=>{ const ch=[...String(t)]; const n=ch.length; return ch.map((c,i)=>{ const k=fx==='reverse'?n-1-i:fx==='spot'?Math.abs(i-(n-1)/2)|0:fx==='erase'||fx==='star'?((i*7919)%n):i; return c===' '?'<span class="ch sp"> </span>':`<span class="ch" style="--i:${k};--r:${((i*37)%11)-5}">${esc(c)}</span>`; }).join(''); };
function drawSketch(box){ if(!box) return; const els=[...box.querySelectorAll('.pn')]; const total=reduce?0:1900;
  els.forEach((el,i)=>{ let L=300; try{ L=Math.ceil(el.getTotalLength())||300; }catch(e){} el.style.strokeDasharray=L; el.style.strokeDashoffset=reduce?0:L;
    if(!reduce){ const d=Math.round(i/Math.max(1,els.length)*total*.7); el.style.transition=`stroke-dashoffset ${Math.max(500,total*.55)}ms cubic-bezier(.5,.1,.3,1) ${350+d}ms`; } });
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ els.forEach(el=>el.style.strokeDashoffset=0); box.classList.add('drawn'); }));
  setTimeout(()=>{ els.forEach(el=>{ el.style.strokeDasharray=''; el.style.strokeDashoffset=''; el.style.transition=''; }); box.classList.add('live'); }, reduce?0:2900); }

/* ---------- storage ---------- */
let seen=new Set();
try{seen=new Set(JSON.parse(localStorage.getItem('dw-stubs')||'[]'));}catch(e){}
const save=()=>{try{localStorage.setItem('dw-stubs',JSON.stringify([...seen]));}catch(e){}};
/* 從「帶到另一台裝置」的連結帶入票根：合併，不覆蓋 */
let carried=0;
(function(){ const m=location.hash.match(/^#stubs=([\d.]+)$/); if(!m) return;
  m[1].split('.').map(Number).filter(n=>n>=1&&n<=22).forEach(n=>{ if(!seen.has(n)){ seen.add(n); carried++; } });
  save(); try{ history.replaceState(null,'',location.pathname+'#lobby'); }catch(e){} })();
const SITE=location.origin+location.pathname;
async function share(title,text,url){
  try{ if(navigator.share){ await navigator.share({title,text,url}); return; } }catch(e){ if(e&&e.name==='AbortError') return; }
  try{ await navigator.clipboard.writeText(url); toast('連結已複製，貼給對方就能打開'); }catch(e){ toast('請複製網址：'+url); } }

/* ---------- sound (WebAudio, generated, no files) ---------- */
let ac=null, hum=null, soundOn=false;
function audio(){ if(!ac){ try{ac=new (window.AudioContext||window.webkitAudioContext)();}catch(e){} } return ac; }
let sil=null;
function unlockAudio(){ try{ if(navigator.audioSession) navigator.audioSession.type='playback'; }catch(e){}
  audio(); if(ac&&ac.state!=='running') ac.resume().catch(()=>{});
  try{ if(!sil){ sil=new Audio('silence.wav'); sil.loop=true; sil.preload='auto'; sil.setAttribute('playsinline',''); } const p=sil.play(); if(p) p.catch(()=>{}); }catch(e){} }
['touchend','click','keydown'].forEach(ev=>document.addEventListener(ev,()=>{ if(soundOn) unlockAudio(); },{capture:true,passive:true}));
document.addEventListener('visibilitychange',()=>{ if(!document.hidden&&soundOn) unlockAudio(); });
function beep(f=1000,d=.09,v=.18){ if(!soundOn||!audio()) return; const o=ac.createOscillator(),g=ac.createGain(); o.frequency.value=f; o.type='sine'; g.gain.value=v; g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d); o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime+d); }
function tick(){ if(!soundOn||!audio()) return; const b=ac.createBuffer(1,ac.sampleRate*.02,ac.sampleRate),d=b.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,4); const s=ac.createBufferSource(),g=ac.createGain(); g.gain.value=.25; s.buffer=b; s.connect(g).connect(ac.destination); s.start(); }
function startHum(){ if(!audio()||hum) return; const len=ac.sampleRate*2, b=ac.createBuffer(1,len,ac.sampleRate), d=b.getChannelData(0); let last=0;
  for(let i=0;i<len;i++){ const w=Math.random()*2-1; last=(last+.02*w)/1.02; d[i]=last*3.5 + ((i%(ac.sampleRate/24|0))<60?(Math.random()*2-1)*.5:0); }
  const s=ac.createBufferSource(); s.buffer=b; s.loop=true; const f=ac.createBiquadFilter(); f.type='lowpass'; f.frequency.value=900; const g=ac.createGain(); g.gain.value=0; s.connect(f).connect(g).connect(ac.destination); s.start(); hum={s,g}; }
function setSound(on){ soundOn=on; try{localStorage.setItem('dw-sound',on?'1':'0');}catch(e){} if(!on&&sil) sil.pause(); const b=$('#soundBtn'); b.innerHTML=on?'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12"/></svg>':'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l4 6M21 9l-4 6"/></svg>'; b.setAttribute('aria-pressed',on);
  if(on){ unlockAudio(); startHum(); if(hum) hum.g.gain.setTargetAtTime(.045,ac.currentTime,.4); if(cur) playScore(cur.n); }
  else { if(hum&&ac){ hum.g.gain.setTargetAtTime(0,ac.currentTime,.2); } stopScore(); } }
/* 每部片的原創配樂（score.js）：開聲音時進場自動播放，離場淡出 */
function playScore(n){ if(!soundOn||!window.SCORE||!audio()) return; if(ac.state!=='running') ac.resume().catch(()=>{}); window.SCORE.play(n,ac); if(hum) hum.g.gain.setTargetAtTime(.012,ac.currentTime,.6); }
function stopScore(){ if(!window.SCORE||!window.SCORE.playing) return; window.SCORE.stop(); if(hum&&ac&&soundOn) hum.g.gain.setTargetAtTime(.045,ac.currentTime,.8); }
$('#soundBtn').onclick=()=>setSound(!soundOn);
function flick(){ const f=$('.flicker'); f.classList.remove('on'); void f.offsetWidth; f.classList.add('on'); }

/* ---------- dust particles in projector light ---------- */
(function dust(){ const c=$('#dust'); if(!c||reduce) return; const x=c.getContext('2d'); let W,H,P=[];
  const rs=()=>{W=c.width=innerWidth;H=c.height=innerHeight;P=Array.from({length:Math.min(70,W/18|0)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.3,vx:(Math.random()-.5)*.15,vy:(Math.random()-.5)*.12-.03,a:Math.random()*.5+.1}));};
  rs(); addEventListener('resize',rs);
  (function loop(){ x.clearRect(0,0,W,H); for(const p of P){ p.x+=p.vx;p.y+=p.vy; if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0; x.fillStyle=`rgba(255,244,220,${p.a})`; x.beginPath(); x.arc(p.x,p.y,p.r,0,6.283); x.fill(); } requestAnimationFrame(loop); })();
})();

/* ---------- generative original posters ---------- */
function rng(seed){ let s=seed*9301+49297; return ()=>{ s=(s*9301+49297)%233280; return s/233280; }; }
function poster(a,bare){
  const c=COLORS[a.zone], r=rng(a.n*7+3), W=200,H=300; let g='';
  const t=a.n%6;
  if(t===0){ for(let i=9;i>0;i--) g+=`<circle cx="${100+ (r()-.5)*20}" cy="${120}" r="${i*11}" fill="none" stroke="${i%3?'#fff':c}" stroke-opacity="${i%3?.18:.9}" stroke-width="${i%3?1:3}"/>`; }
  else if(t===1){ for(let y=0;y<14;y++)for(let x=0;x<10;x++){ const on=r()<.16; g+=`<rect x="${12+x*18}" y="${18+y*16}" width="${on?14:3}" height="${on?12:3}" fill="${on?c:'#fff'}" fill-opacity="${on?.95:.25}"/>`; } }
  else if(t===2){ for(let i=0;i<22;i++){ const y=10+i*11; g+=`<rect x="0" y="${y}" width="${40+r()*160}" height="${i%5===0?6:2}" fill="${i%5===0?c:'#fff'}" fill-opacity="${i%5===0?.95:.22}"/>`; } }
  else if(t===3){ for(let i=0;i<7;i++){ const rr=30+i*16; g+=`<path d="M${100-rr} 130 A${rr} ${rr} 0 0 1 ${100+rr} 130" fill="none" stroke="${i===3?c:'#fff'}" stroke-width="${i===3?4:1}" stroke-opacity="${i===3?1:.25}" transform="rotate(${r()*360} 100 130)"/>`; } g+=`<circle cx="100" cy="130" r="10" fill="${c}"/>`; }
  else if(t===4){ for(let y=0;y<18;y++)for(let x=0;x<12;x++){ const d=Math.hypot(x-6,y-7)/9, rad=Math.max(.3,3.2*(1-d)+r()*.6); g+=`<circle cx="${10+x*16.5}" cy="${12+y*14}" r="${rad}" fill="${d<.35?c:'#fff'}" fill-opacity="${d<.35?.95:.5}"/>`; } }
  else { for(let i=0;i<9;i++){ const x=r()*200,y=r()*230,s=20+r()*60; g+=`<polygon points="${x},${y} ${x+s},${y+s*.3} ${x+s*.2},${y+s}" fill="${i===4?c:'none'}" stroke="${i===4?'none':'#fff'}" stroke-opacity=".3"/>`; } }
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect width="${W}" height="${H}" fill="#0c0c0d"/>${g}${bare?'':`
  <text x="12" y="${H-118}" font-family="Georgia,serif" font-size="54" fill="#fff" fill-opacity=".92">${a.film.year}</text>
  <text x="14" y="${H-100}" font-family="monospace" font-size="7.5" letter-spacing="1.5" fill="${c}">${esc(a.film.en.toUpperCase()).slice(0,34)}</text>`}</svg>`;
}

/* ---------- gate ---------- */
const gate=$('#gate');
function endGate(){ gate.classList.add('letterbox'); setTimeout(()=>{ gate.classList.add('gone'); document.body.classList.remove('gated'); route(); if(carried){ toast(`已帶入 ${carried} 張票根`); carried=0; } },850); try{sessionStorage.setItem('dw-gate','1');}catch(e){} }
function runLeader(){
  $('#gateIntro').classList.add('hide'); const L=$('#leader'); L.classList.add('on');
  const sw=$('#sweep'), num=$('#lnum'); let n=3, t0=performance.now(); const per=reduce?300:900;
  if(soundOn) tick();
  (function f(now){ const p=((now-t0)%per)/per, ang=p*2*Math.PI, R=200;
    const x=200+R*Math.sin(ang), y=200-R*Math.cos(ang); sw.setAttribute('d',`M200 200 L200 0 A${R} ${R} 0 ${p>.5?1:0} 1 ${x} ${y} Z`);
    const k=3-Math.floor((now-t0)/per); if(k!==n){ n=k; if(n>0){ num.textContent=n; beep(n===1?1200:1000); flick(); } }
    if(n<=0){ L.classList.remove('on'); endGate(); return; } requestAnimationFrame(f); })(t0);
  beep(1000); flick();
}
/* 預告片 */
(function(){ const t=$('#trailer'), v=$('#trailerVid'); if(!t) return;
  const close=()=>{ v.pause(); t.hidden=true; if(ac&&soundOn) ac.resume().catch(()=>{}); $('#trailerBtn').focus(); };
  $('#trailerBtn').onclick=()=>{ t.hidden=false; if(ac) ac.suspend().catch(()=>{}); v.currentTime=0; const p=v.play(); if(p) p.catch(()=>{}); $('#trailerClose').focus(); };
  $('#trailerClose').onclick=close; t.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
  t.addEventListener('click',e=>{ if(e.target===t) close(); }); v.addEventListener('ended',close); })();
/* 進場：Logo 的光圈轉開、鏡頭穿過光圈，再接倒數 */
function openIris(next){ if(reduce||gate.classList.contains('opening')){ next(); return; } gate.classList.add('opening'); beep(330,.06,.25); setTimeout(next,1050); }
$('#enterSound').onclick=()=>{ setSound(true); openIris(runLeader); };
$('#enterMute').onclick=()=>{ setSound(false); openIris(runLeader); };
/* 開場時，眼睛跟著游標看（只在有滑鼠的裝置） */
(function(){ const eye=document.querySelector('#gateLogo .g-eye'); if(!eye||reduce||!matchMedia('(pointer:fine)').matches) return;
  gate.addEventListener('pointermove',e=>{ if(gate.classList.contains('opening')) return; const r=$('#gateLogo').getBoundingClientRect(); const dx=(e.clientX-(r.left+r.width/2))/innerWidth, dy=(e.clientY-(r.top+r.height/2))/innerHeight;
    eye.style.transform=`translate(${Math.max(-1,Math.min(1,dx*2))*34}px,${Math.max(-1,Math.min(1,dy*2))*14}px)`; }); })();
$('#skip').onclick=()=>endGate();
/* 每次從首頁進來都放一次片頭倒數；只有直接連到某一場或閉幕片時才略過 */
if(/^#(screen-\d+|finale)$/.test(location.hash)){ gate.classList.add('gone'); document.body.classList.remove('gated'); }

/* ---------- timeline ---------- */
let tlPlace=()=>{};
function buildTimeline(){
  const tl=$('#tl'); const Y0=1930,Y1=2026, L=60; const width=()=>tl.clientWidth-60-160;
  const items=[...DATA].sort((a,b)=>a.film.year-b.film.year||a.n-b.n);
  const count={}; const frag=[];
  for(let y=1930;y<=2020;y+=10) frag.push(`<span class="tl-yr" data-y="${y}">${y}</span>`);
  items.forEach((a,i)=>{ const k=a.film.year; count[k]=(count[k]||0)+1; a._lv=(i%3)+ (count[k]-1)*0; a._st=count[k]; });
  tl.insertAdjacentHTML('beforeend',frag.join('')+items.map(a=>`<div class="tl-stem" data-n="${a.n}"></div><button class="tl-dot z-${a.zone}" data-n="${a.n}" aria-label="${a.film.year}《${esc(a.film.zh)}》"><i></i><span>${esc(a.film.zh)}</span></button>`).join(''));
  function place(){ const w=width();
    $$('.tl-yr').forEach(e=>{ e.style.left=(L+(+e.dataset.y-Y0)/(Y1-Y0)*w)+'px'; });
    const used={};
    items.forEach((a,i)=>{ let x=L+(a.film.year-Y0)/(Y1-Y0)*w; const key=a.film.year; used[key]=(used[key]||0); x+=used[key]*22; used[key]++;
      const h=[70,130,190][i%3]; const d=tl.querySelector(`.tl-dot[data-n="${a.n}"]`), s=tl.querySelector(`.tl-stem[data-n="${a.n}"]`);
      d.style.left=x+'px'; d.style.top=(300-h)+'px'; s.style.left=x+'px'; s.style.top=(300-h)+'px'; s.style.height=h+'px'; });
  }
  tlPlace=()=>{ place(); const sc=$('#tlScroll'); if(sc.scrollWidth>sc.clientWidth+40) sc.scrollLeft=(sc.scrollWidth-sc.clientWidth)*.78; };
  place(); addEventListener('resize',place);
  let tlPicked=0;
  $$('.tl-dot').forEach(d=>{ const a=byN(+d.dataset.n);
    const show=()=>{ $$('.tl-dot').forEach(x=>x.classList.toggle('sel',x===d)); const h=hallOf(a.zone);
      const c=$('#tlCard'); c.className='tl-card z-'+a.zone;
      c.innerHTML=`<div class="y">${a.film.year}</div><div><p class="mono dim">《${esc(a.film.zh)}》${esc(a.film.en)}</p><h3>${esc(SCENES[a.n])}</h3><span class="arrow">${h.name}　第 ${a.n} 場</span><p>${esc(a.film.reality)}</p></div><button class="btn solid" data-go="${a.n}">取票進場</button>`;
      c.querySelector('[data-go]').onclick=()=>go(a.n); tick(); };
    d.onmouseenter=show; d.onfocus=show;
    d.onclick=e=>{ e.preventDefault(); if(tlPicked===a.n){ go(a.n); return; } tlPicked=a.n; show(); const c=$('#tlCard'); if(c.getBoundingClientRect().bottom>innerHeight-90) c.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'}); };
    d.title=`${a.film.year}《${a.film.zh}》：點一下看介紹，再點一次取票進場`; });
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ $('#tlFill').style.width='100%';
    items.forEach((a,i)=>setTimeout(()=>tl.querySelector(`.tl-dot[data-n="${a.n}"]`).classList.add('in'),reduce?0:120+i*90));
    setTimeout(()=>{ const d=tl.querySelector('.tl-dot[data-n="3"]'); if(d&&!$('.tl-dot.sel')) d.onmouseenter(); }, reduce?0:2400); io.disconnect(); } }),{threshold:.2});
  io.observe($('#v-timeline'));
}

/* ---------- halls ---------- */
let ft='all';
function renderFilters(){ const box=$('#fTime'); box.innerHTML=''; TIMES.forEach(t=>{ const b=document.createElement('button'); b.className='chip'; b.textContent=t.l; b.setAttribute('aria-pressed',ft===t.k); b.onclick=()=>{ft=t.k;renderFilters();applyFilter();}; box.appendChild(b); }); }
function applyFilter(){ const f=TIMES.find(t=>t.k===ft).f; let n=0; $$('.frame').forEach(fr=>{ const a=byN(+fr.dataset.n), ok=f(a.mins); fr.classList.toggle('dim',!ok); if(ok) n++; });
  $('#fHint').textContent= ft==='all'?'片長依全文字數估算（每分鐘約 450 字）':`${n} 場符合，其他場次已變暗`; }
/* 每部續集裡的一句台詞（逐字取自劇情版） */
const HOOK={"1": "你為什麼一談到 AI 就這麼興奮？", "2": "如果把這句主張換成十種說法，哪一種最能打動人？", "3": "這是 AI slop 吧？", "4": "你又要拆公司了？", "5": "這種事，AI 不是幾秒鐘就能做完嗎？", "6": "這個故事，能被驗證嗎？", "7": "幫我挑一個適合送 35 歲女生的生日禮物", "8": "這就是你要找的線索。", "9": "因為你的消費者，已經換了一條路來認識你。", "10": "哪個牌子適合我？", "11": "你知道嗎，這種記憶現在越來越值錢了。", "12": "這次活動的三個創意，吸引得了 35 歲以上的高收入族群嗎？", "13": "方舟號上，我們從來不需要問這些問題。因為只有一家公司在說話。", "14": "博士，什麼樣的人，才配指揮這些機器？", "15": "我還趕得上轉機嗎？如果不行，下一個可行的選項是什麼？", "16": "我們正在 AI 轉型！", "17": "下單很快，但後續很亂。", "18": "我有不好的預感。", "19": "不要相信他的謊言", "20": "幫我做一個年輕化的社群貼文。", "21": "每樣東西都有它的目的，就連機器也是。", "22": "抱歉，戴夫，恐怕我不能那麼做。"};
/* 已有續集海報的場次（img/poster/NN.webp） */
const KV=new Set([1,2,3,4,5,6,7,8]);
/* 海報卡：捲到畫面中間的那幾張才播小動畫（電腦上滑鼠移過也會） */
const kvio=('IntersectionObserver' in window)?new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('live',e.isIntersecting)),{threshold:.6}):null;
function watchKV(root){ if(kvio&&!reduce) root.querySelectorAll('.kvc').forEach(k=>kvio.observe(k)); }
let activeHall='intro';
function renderTabs(){ $('#hallTabs').innerHTML=HALLS.map(h=>{const t=DATA.filter(a=>a.zone===h.z);const s=t.filter(a=>seen.has(a.n)).length;return `<button role="tab" class="z-${h.z}" aria-selected="${activeHall===h.z}" data-z="${h.z}"><i></i>${h.name}<small>${s}/${t.length}</small></button>`}).join('');
  $$('#hallTabs button').forEach(b=>b.onclick=()=>{ location.hash='hall-'+b.dataset.z; }); }
function setHall(z){ activeHall=z; renderTabs(); $$('.hall').forEach(s=>s.classList.toggle('on',s.id==='hall-'+z)); const s=$('#hall-'+z); if(s){ s.classList.add('in'); const st=s.querySelector('.strip'); if(st) st.scrollLeft=0; } flick(); tick(); }
function renderHalls(){
  const root=$('#hallList');
  root.innerHTML=HALLS.map(h=>{ const items=DATA.filter(a=>a.zone===h.z); const mins=items.reduce((s,a)=>s+a.mins,0);
    return `<section class="hall z-${h.z}" id="hall-${h.z}">
    <div class="hall-gate">
      <div class="hall-art"><img src="img/hall/${h.art}.webp" alt="${h.name}主視覺" loading="lazy"><span class="band"></span><span class="hall-num">${h.no}</span></div>
      <div class="hall-txt"><span class="vt">${h.en}</span><span class="meta">${items.length} 場　約 ${mins} 分鐘</span><h3>${h.name}</h3><p>${h.desc}</p>
      <div class="hall-prog"><i data-hall="${h.z}"></i></div><p class="dim small" data-hallcount="${h.z}"></p></div>
    </div>
    <div class="strip-wrap"><div class="strip-nav"><span class="mono dim">左右拖曳，挑一部片</span><span><button data-dir="-1" aria-label="往左">‹</button> <button data-dir="1" aria-label="往右">›</button></span></div>
    <div class="strip" tabindex="0" aria-label="${h.name}場次">${items.map(a=>`
      <button class="frame z-${a.zone}" data-n="${a.n}" aria-label="第 ${a.n} 場《${esc(a.film.zh)}》續集：${esc(a.title)}，片長 ${a.mins} 分鐘">
        <div class="poster paper">
          <div class="ptop"><b>第 ${a.n} 場</b><span>${a.mins} 分鐘</span></div><span class="seen">已看</span>
          ${KV.has(a.n)?`<div class="fart kvc kv-${pad(a.n)}"><img src="img/poster/${pad(a.n)}.webp" alt="" loading="lazy" draggable="false"><i class="kv-fx"></i><i class="kv-fx2"></i></div>`:`<div class="fart">${window.SKETCH(a.n)}</div>`}
          <div class="pinfo"><span class="fyr">${a.film.year}—2026</span><h3 class="fz ${(L=>L<=4?'l4':L<=5?'l5':L<=7?'l7':'l9')([...a.film.zh.replace(/\s/g,'')].length)}">${esc(a.film.zh)}</h3><span class="fen">${esc(a.film.en)}</span><p class="fq">「${esc(HOOK[a.n])}」</p><h4>${esc(a.title)}</h4><span class="au">${esc(a.author)}</span></div>
        </div>
      </button>`).join('')}</div></div>
    </section>`; }).join(''); watchKV(root);
  $$('.frame').forEach(f=>f.onclick=()=>go(+f.dataset.n));
  $$('.strip-nav button').forEach(b=>b.onclick=()=>{ const s=b.closest('.strip-wrap').querySelector('.strip'); s.scrollBy({left:+b.dataset.dir*360,behavior:'smooth'}); tick(); });
  // drag to scroll
  $$('.strip').forEach(s=>{ let down=false,sx=0,sl=0,moved=false; s.addEventListener('pointerdown',e=>{ if(e.pointerType!=='mouse')return; down=true;moved=false;sx=e.clientX;sl=s.scrollLeft; });
    addEventListener('pointerup',()=>{down=false;}); s.addEventListener('pointermove',e=>{ if(!down)return; const dx=e.clientX-sx; if(Math.abs(dx)>5){moved=true;s.scrollLeft=sl-dx;} });
    s.addEventListener('click',e=>{ if(moved){e.stopPropagation();e.preventDefault();moved=false;} },true); });
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); }),{threshold:.08});
  $$('.hall').forEach(h=>io.observe(h));
  /* 片單自己緩緩往右捲；有人拖曳、點按或捲動時先停 4 秒 */
  if(!reduce && !window.__hallDrift){ window.__hallDrift=1; let hold=0, acc=0;
    $$('.strip').forEach(st=>['pointerdown','wheel','touchstart','keydown','focusin'].forEach(ev=>st.addEventListener(ev,()=>{ hold=performance.now()+4000; },{passive:true})));
    (function drift(){ const now=performance.now(), st=document.querySelector('.hall.on .strip');
      if(st && now>hold && $('#v-halls').classList.contains('on') && !$('#reader').classList.contains('open') && !document.body.classList.contains('gated')){
        acc+=0.6; if(acc>=1){ const d=Math.floor(acc); acc-=d; st.scrollLeft+=d; }
        if(st.scrollLeft+st.clientWidth>=st.scrollWidth-2){ hold=now+2500; setTimeout(()=>st.scrollTo({left:0,behavior:'smooth'}),2000); } }
      requestAnimationFrame(drift); })(); }
  markSeen();
}
function markSeen(){ if($('#hallTabs').children.length) renderTabs(); if($('#lobTabs').children.length){ renderLobTabs(); $$('.fc').forEach(f=>f.classList.toggle('isseen',seen.has(+f.dataset.n))); } $$('.frame').forEach(f=>f.classList.toggle('isseen',seen.has(+f.dataset.n)));
  HALLS.forEach(h=>{ const t=DATA.filter(a=>a.zone===h.z), s=t.filter(a=>seen.has(a.n)).length; const i=$(`[data-hall="${h.z}"]`); if(i) i.style.width=(s/t.length*100)+'%'; const p=$(`[data-hallcount="${h.z}"]`); if(p) p.textContent=`你已看 ${s} / ${t.length} 場`; });
  $('#wCount').textContent=`${seen.size}/22`; }

/* ---------- reader ---------- */
const isHead=p=>p.length<=26 && !/[。！？，、；：」』）)…]$/.test(p) && !/[。！？]/.test(p);
const fmtBody=ps=>ps.map(p=>/^(註解|註|資料來源|參考資料)/.test(p)?`<p class="note">${esc(p)}</p>`:isHead(p)?`<h3 class="rv">${esc(p)}</h3>`:`<p class="rv">${esc(p)}</p>`).join('');
const fmtMust=t=>String(t||'').split(/\n+/).map(s=>s.trim()).filter(Boolean).map(s=>s.startsWith('🎯')?`<p class="h">${esc(s)}</p>`:s.startsWith('*')?`<p class="k">${esc(s.replace(/^\*\s*/,''))}</p>`:`<p>${esc(s)}</p>`).join('');
let cur=null, rio=null;
function go(n){ location.hash='screen-'+n; }
function openReader(n){
  const a=byN(n); if(!a) return; cur=a; const h=hallOf(a.zone), i=DATA.indexOf(a), prev=DATA[i-1], next=DATA[i+1];
  const r=$('#reader'); r.className='reader open z-'+a.zone;
  const still=a.still?`<figure class="still rv"><img src="img/still/${pad(a.n)}.webp" alt="第 ${a.n} 場續集插圖" loading="lazy" width="${a.still[0]}" height="${a.still[1]}"><figcaption>原文插圖　p.${a.p[0]}–${a.p[1]}</figcaption></figure>`:'';
  r.innerHTML=`
  <div class="rbar"><button class="back" id="backR">← 回片單</button><span class="t">${h.name}　第 ${a.n} 場　《${esc(a.film.zh)}》續集</span>
    <span class="reel"><svg viewBox="0 0 40 40" id="reelSvg"><circle cx="20" cy="20" r="18" fill="none" stroke="currentColor"/><g id="reelG">${[0,72,144,216,288].map(d=>`<circle cx="${20+10*Math.cos(d*Math.PI/180)}" cy="${20+10*Math.sin(d*Math.PI/180)}" r="3.4" fill="currentColor"/>`).join('')}</g><circle cx="20" cy="20" r="2.4" fill="currentColor"/></svg><span id="reelPct">0%</span></span>
    <span class="jump"><button data-j="sTrailer">預告片</button><button data-j="sReview">影評</button><button data-j="sFeature">正片</button></span><button class="x" id="closeR">✕ 離場</button><div class="prog" id="prog"></div></div>
  <section class="opening ${KV.has(a.n)?'has-kv':''}" id="opening">
    ${KV.has(a.n)?`<div class="kv kv-${pad(a.n)}"><img class="kv-bg" src="img/poster/${pad(a.n)}-blur.webp" alt=""><div class="kv-art"><img src="img/poster/${pad(a.n)}.webp" alt="《${esc(a.film.zh)}》續集海報"><i class="kv-fx"></i><i class="kv-fx2"></i></div></div>`:`<div class="bgposter">${poster(a,true)}</div>`}<div class="opsk fx-${TFX[a.n]}" id="opsk">${window.SKETCH?window.SKETCH(a.n):''}</div><div class="lbt"></div><div class="lbb"></div>
    <div class="inner">
      <div class="fn"><span class="fn-k">${h.name}　第 ${a.n} 場</span><span class="fn-sep"> &nbsp;|&nbsp; </span><span class="fn-t"><b>《${esc(a.film.zh)}》</b> <span class="fn-en">${esc(a.film.en)}</span></span></div>
      <div class="odo" id="odo">${a.film.year}</div>
      <h1 class="tfx tfx-${TFX[a.n]}" aria-label="${esc(a.title)}" style="--n:${[...a.title].length}">${splitTitle(a.title,TFX[a.n])}</h1>
      <div class="meta">${esc(a.author)} ・ 片長約 ${a.mins} 分鐘</div>
    </div><span class="cue">往下，開演</span>
  </section>
  <div class="vs">
    <div><span class="mono">${a.film.year} 年的電影</span><p>${esc(SCENES[a.n])}</p><span class="big">${a.film.year}</span></div>
    <div><span class="mono">2026 年的現實</span><p>${esc(a.film.reality)}</p><span class="big">2026</span></div>
  </div>
  ${modeBar(a)}
  ${storyPane(a)}
  <div id="origPane" class="${hasStory(a)&&readMode==='story'?'hide':''}">
  <div class="sec" id="sTrailer"><div class="mono">預告片　三十秒</div><p class="trailer rv">${esc(a.summary||a.hook)}</p></div>
  <div class="sec" id="sReview"><div class="mono">影評　三個看點</div><div class="review rv">${fmtMust(a.must)}</div></div>
  <div class="sec" id="sFeature"><div class="mono">正片　全文 ${a.mins} 分鐘</div>${still}<div class="body">${fmtBody(a.paras)}</div></div>
  </div>
  <div class="credits"><span class="mono">片尾字幕</span><dl>
    <div><dt>作者</dt><dd>${esc(a.authorFull||a.author)}</dd></div>
    <div><dt>原文出處</dt><dd>《2026 決策智慧 Decision Intelligence》第 ${a.p[0]}–${a.p[1]} 頁</dd></div>
    <div><dt>致敬電影</dt><dd>《${esc(a.film.zh)}》${esc(a.film.en)}（${a.film.year}）</dd></div>
    <div><dt>策展</dt><dd>電影配對與預言／現實對照為本站策展詮釋</dd></div></dl></div>
  <div class="endcta"><button class="btn" id="backBottom" style="margin-right:10px">← 回片單</button><button class="tearbtn" id="tearBtn">${seen.has(a.n)?'再看一次我的票根':'散場了，領一張票根'}</button></div>
  ${relatedHTML(a)}
  <div class="nextp">${prev?`<button data-n="${prev.n}"><small>上一場</small><span>《${esc(prev.film.zh)}》${esc(prev.short)}</span></button>`:'<span></span>'}
    ${next?`<button data-n="${next.n}"><small>下一場</small><span>《${esc(next.film.zh)}》${esc(next.short)}</span></button>`:`<button data-fin="1"><small>全部看完了</small><span>前往閉幕片</span></button>`}</div>`;
  r.scrollTop=0; document.body.style.overflow='hidden'; r.focus({preventScroll:true});
  $('#closeR').onclick=()=>{ location.hash=lastView; }; $('#backR').onclick=()=>{ location.hash=lastView; }; const bb=$('#backBottom'); if(bb) bb.onclick=()=>{ location.hash=lastView; };
  $('#tearBtn').onclick=()=>showTicket(a);
  bindMode(r);
  r.querySelectorAll('.nextp [data-n], .related .pick').forEach(b=>b.onclick=()=>go(+b.dataset.n));
  r.querySelectorAll('.jump [data-j]').forEach(b=>b.onclick=()=>{ if(readMode==='story'&&hasStory(a)){ const ob=r.querySelector('#modebar [data-m="orig"]'); if(ob) ob.onclick(); } const el=document.getElementById(b.dataset.j); if(el) r.scrollTo({top:el.offsetTop-70,behavior:'smooth'}); });
  const fb=r.querySelector('[data-fin]'); if(fb) fb.onclick=()=>{ location.hash='finale'; };
  // opening sequence
  const op=$('#opening'), odo=$('#odo'); flick(); tick(); drawSketch($('#opsk')); playScore(a.n); { const kv=op.querySelector('.kv'); if(kv) requestAnimationFrame(()=>requestAnimationFrame(()=>kv.classList.add('dev'))); }
  setTimeout(()=>op.classList.add('go'),reduce?0:250);
  const y0=a.film.year, y1=2026, dur=reduce?0:1500, t0=performance.now()+500; let last=y0;
  (function f(now){ const p=Math.min(1,Math.max(0,(now-t0)/dur)); const e=1-Math.pow(1-p,3); const y=Math.round(y0+(y1-y0)*e);
    if(y!==last){ odo.textContent=y; last=y; if(y%2===0) tick(); }
    if(p<1) requestAnimationFrame(f); else { odo.textContent=y1; odo.classList.add('done'); op.classList.add('titled'); beep(1320,.12,.12); } })(performance.now());
  // reveal + progress
  if(rio) rio.disconnect();
  rio=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); if(e.target.classList.contains('midsk')) drawSketch(e.target); rio.unobserve(e.target);} }),{root:r,threshold:.1});
  r.querySelectorAll('.rv').forEach(el=>rio.observe(el));
  r.onscroll=()=>{ if(!$('#prog')) return; const p=Math.min(1,r.scrollTop/(r.scrollHeight-r.clientHeight)); $('#prog').style.width=(p*100)+'%'; $('#reelPct').textContent=p>.98?'散場':`${Math.round(p*100)}%　剩 ${Math.max(1,Math.ceil(a.mins*(1-p)))} 分`; $('#reelG').setAttribute('transform',`rotate(${r.scrollTop/3} 20 20)`); };
}
function closeReader(){ stopScore(); const r=$('#reader'); if(!r.classList.contains('open')) return; r.className='reader'; r.innerHTML=''; document.body.style.overflow=''; cur=null; }

function relatedHTML(a){
  const g=SIX.find(s=>s[2].includes(a.n)); if(!g) return '';
  const others=g[2].filter(n=>n!==a.n).map(byN).slice(0,3);
  return `<section class="related"><span class="mono">同主題連映</span><h3>「${g[0]}」系列，接著看</h3><p class="dim">${esc(g[1])}這幾場從不同角度回答同一個問題。</p>
  <div class="picks">${others.map(o=>`<button class="pick z-${o.zone}" data-n="${o.n}"><div class="pp">${poster(o,true)}</div><div class="pb"><span class="ord">第 ${o.n} 場　《${esc(o.film.zh)}》 ${seen.has(o.n)?'· 已看':''}</span><h4>${esc(o.title)}</h4><q>${esc(o.hook)}</q><span class="go">進場，${o.mins} 分鐘</span></div></button>`).join('')}</div></section>`;
}

/* ---------- story mode ---------- */
let readMode='story';
const hasStory=a=>!!(window.STORIES&&window.STORIES[a.n]);
function modeBar(a){ if(!hasStory(a)) return ''; const s=window.STORIES[a.n];
  return `<div class="modebar" id="modebar"><div class="mb-in"><span class="mono">選擇觀看版本</span>
   <button data-m="story" aria-pressed="${readMode==='story'}"><b>劇情版</b><small>${esc((s.style||'電影改編').replace('　','，'))}　約 ${Math.max(3,Math.round(s.text.replace(/\s/g,'').length/450))} 分鐘</small></button>
   <button data-m="orig" aria-pressed="${readMode!=='story'}"><b>原文版</b><small>預告片・影評・正片　${a.mins} 分鐘</small></button></div></div>`; }
function fmtStory(txt,n){
  const lines=txt.split(/\n+/).map(l=>l.trim()).filter(Boolean);
  const acts=lines.filter(l=>l.startsWith('## ')).length, mid=Math.max(2,Math.floor(acts/2)); let ai=0, sc=0;
  return lines.map(l=>{
    if(l.startsWith('## ')){ ai++; const sk=(ai===mid&&acts>=4&&window.SCENE)?`<figure class="midsk rv" aria-hidden="true">${window.SCENE(n)}<figcaption>中場休息</figcaption></figure>`:''; return `${sk}<h3 class="act rv">${esc(l.slice(3))}</h3>`; }
    if(l.startsWith('NUM: ')){ const [big,cap]=l.slice(5).split('｜'); return `<figure class="num rv"><b>${esc(big)}</b><figcaption>${esc(cap||'')}</figcaption></figure>`; }
    if(l.startsWith('> ')) return `<p class="card rv">${esc(l.slice(2))}</p>`;
    if(l.startsWith('[依據] ')) return `<li>${esc(l.slice(5))}</li>`;
    if(l.startsWith('~ ')){ sc++; return `<p class="dir rv"><span class="sc">第 ${sc} 景</span>${esc(l.slice(2))}</p>`; }
    return `<p class="rv">${esc(l)}</p>`; }).join('').replace(/(<li>.*<\/li>)/s,'<div class="basis"><span class="mono">情節依據</span><ul>$1</ul></div>');
}
function storyPane(a){ if(!hasStory(a)) return ''; const s=window.STORIES[a.n];
  return `<div id="storyPane" class="story sty-${a.n} ${readMode==='story'?'':'hide'}"><div class="sec"><div class="mono">劇情版　改編自原文，情節為虛構</div>
   <h2 class="st-title">${esc(s.title||a.title)}</h2><p class="st-note">${esc(s.note||'本篇以電影的敘事風格改編原文，論點與案例皆取自原文；人物與情節為虛構。想讀作者原文，請切換到「原文版」。')}</p>
   <div class="st-body">${fmtStory(s.text,a.n)}</div></div></div>`; }
function bindMode(r){ r.querySelectorAll('#modebar [data-m]').forEach(b=>b.onclick=()=>{ readMode=b.dataset.m;
  r.querySelectorAll('#modebar [data-m]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.m===readMode));
  const sp=$('#storyPane'), op=$('#origPane'); if(sp) sp.classList.toggle('hide',readMode!=='story'); if(op) op.classList.toggle('hide',readMode==='story');
  r.querySelectorAll('.rv').forEach(el=>el.classList.add('in')); const mb=$('#modebar'); r.scrollTo({top:mb.offsetTop-60,behavior:'smooth'}); tick(); flick(); }); }

/* ---------- ticket ---------- */
const today=()=>{ const d=new Date(); return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())}`; };
function showTicket(a){
  const h=hallOf(a.zone), st=$('#tStage'), had=seen.has(a.n);
  st.className='ticket-stage on z-'+a.zone;
  st.innerHTML=`<div class="tk-wrap"><div class="tk" id="tk">
    <div class="a"><span class="k">預言成真影展　入場券　限一人</span>
      <h3>《${esc(a.film.zh)}》續集</h3><div class="ar">${esc(a.title)}</div>
      <div class="row"><div>影廳<b>${h.name}</b></div><div>座位<b>${h.row}-${pad(a.n)}</b></div><div>片長<b>${a.mins} 分</b></div><div>日期<b>${today()}</b></div></div><div class="take"><i>今天帶走的一句話</i>${esc(a.hook)}</div></div>
    <div class="b"><small>場次</small><span class="no">${pad(a.n)}</span><small>${a.film.year}—2026</small></div></div>
    <p class="tk-msg">${had?'這張票根已經在你的票根夾裡了。':'沿著虛線撕下票根，收進票根夾。'}</p>
    <div class="tk-actions">${had?'':'<button class="btn solid" id="tkTear">沿虛線撕下票根</button>'}<button class="btn" id="tkShare">推薦給朋友</button><button class="btn" id="tkDl">下載票券圖</button><button class="btn" id="tkClose">繼續觀賞</button></div></div>`;
  tick(); flick();
  const close=()=>{ st.className='ticket-stage'; st.innerHTML=''; };
  $('#tkClose').onclick=close; $('#tkShare').onclick=()=>share('預言成真影展',`我剛在「預言成真影展」看了《${a.film.zh}》的續集：${a.hook}`,SITE+'#screen-'+a.n); st.onclick=e=>{ if(e.target===st) close(); };
  $('#tkDl').onclick=()=>downloadTicket(a);
  const t=$('#tkTear'); if(t) t.onclick=()=>{ $('#tk').classList.add('torn'); tick(); setTimeout(tick,120); stamp(a.n); t.remove(); $('.tk-msg').textContent=seen.size===DATA.length?'22 張全部集滿，閉幕片已為你解鎖。':`收進票根夾了　${seen.size}/22　${hallDoneMsg(a)}`; const tb=$('#tearBtn'); if(tb) tb.textContent='再看一次我的票根'; };
}
function hallDoneMsg(a){ const h=hallOf(a.zone); const t=DATA.filter(x=>x.zone===a.zone); const s=t.filter(x=>seen.has(x.n)).length; return s===t.length?`${h.name}全部看完！`:`${h.name}還剩 ${t.length-s} 場`; }
function stamp(n){ if(seen.has(n)) return; seen.add(n); save(); markSeen(); const b=$('#walletBtn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); beep(880,.08,.1); setTimeout(()=>beep(1320,.12,.1),90); }
function downloadTicket(a){
  try{ const h=hallOf(a.zone), c=document.createElement('canvas'), s=2; c.width=1120; c.height=440; const x=c.getContext('2d'); const W=c.width,H=c.height;
    x.fillStyle='#09090a'; x.fillRect(0,0,W,H);
    x.fillStyle='#f1ebdc'; x.fillRect(40,40,W-80,H-80); x.fillStyle=COLORS[a.zone]; x.fillRect(40,40,20,H-80); x.fillRect(W-300,40,260,H-80);
    x.setLineDash([10,8]); x.strokeStyle='#9c937c'; x.lineWidth=3; x.beginPath(); x.moveTo(W-300,50); x.lineTo(W-300,H-50); x.stroke(); x.setLineDash([]);
    x.fillStyle='#6f6857'; x.font='18px monospace'; x.fillText('預言成真影展　入場券　限一人',90,95);
    x.fillStyle='#141414'; x.font='bold 52px serif'; x.fillText(`《${a.film.zh}》續集`,90,170);
    x.font='28px serif'; const t=a.title.length>30?a.title.slice(0,30)+'…':a.title; x.fillText(t,90,220);
    x.fillStyle='#6f6857'; x.font='16px monospace'; [['影廳',h.name],['座位',`${h.row}-${pad(a.n)}`],['片長',a.mins+' 分'],['日期',today()]].forEach((p,i)=>{ x.fillStyle='#6f6857'; x.font='16px monospace'; x.fillText(p[0],90+i*190,300); x.fillStyle='#141414'; x.font='bold 26px sans-serif'; x.fillText(p[1],90+i*190,336); });
    x.fillStyle='#141414'; x.font='16px monospace'; x.textAlign='center'; x.fillText('SCREEN',W-170,150); x.font='bold 110px serif'; x.fillText(pad(a.n),W-170,260); x.font='18px monospace'; x.fillText(`${a.film.year}—2026`,W-170,310);
    x.textAlign='left'; x.fillStyle='#6f6857'; x.font='14px monospace'; x.fillText('預言成真影展　1936 到 2026',90,H-70);
    c.toBlob(b=>{ try{ const u=URL.createObjectURL(b), l=document.createElement('a'); l.href=u; l.download=`prophecy-ticket-${pad(a.n)}.png`; document.body.appendChild(l); l.click(); l.remove(); setTimeout(()=>URL.revokeObjectURL(u),2000); toast('票券圖已下載'); }catch(e){ toast('此環境不支援下載，請改用截圖'); } });
  }catch(e){ toast('此環境不支援下載，請改用截圖'); }
}
let tt; function toast(m){ const t=$('#toast'); t.textContent=m; t.classList.add('show'); clearTimeout(tt); tt=setTimeout(()=>t.classList.remove('show'),2600); }

/* ---------- wallet ---------- */
function renderWallet(){
  const d=$('#drawer'), all=seen.size===DATA.length, left=DATA.filter(a=>!seen.has(a.n)).reduce((s,a)=>s+a.mins,0);
  d.innerHTML=`<button class="x" id="closeW" style="float:right">關閉</button><h2>我的票根夾</h2>
  <p class="dim" style="font-size:14px;margin:0">已看 ${seen.size} 場　再約 ${left} 分鐘就能看完全刊</p>
  <div class="stubs">${DATA.map(a=>`<button class="z-${a.zone} ${seen.has(a.n)?'on':''}" data-n="${a.n}" title="《${esc(a.film.zh)}》${esc(a.short)}">${pad(a.n)}</button>`).join('')}</div>
  <div class="hallsum">${HALLS.map(h=>{const t=DATA.filter(a=>a.zone===h.z),s=t.filter(a=>seen.has(a.n)).length;return `<div class="z-${h.z}"><span>${h.name}</span><b>${s}/${t.length}</b></div>`}).join('')}</div>
  <div class="finale ${all?'unlocked':''}"><span class="mono dim">閉幕片</span><h3 style="font-family:var(--serif);margin:6px 0 0">22 則預言，6 個答案</h3>
  <p>${all?'你看完了全部 22 場，閉幕片為你開放。':'集滿 22 張票根解鎖。它會把 22 部續集收成一張地圖：預言成真之後，品牌該做的六件事。'}</p>
  <button id="finBtn" ${all?'':'disabled'}>${all?'進場觀賞':'尚未解鎖'}</button></div>
  <div class="w-share"><button class="btn" id="wInvite">邀朋友一起看</button><button class="btn" id="wCarry" ${seen.size?'':'disabled'}>帶到另一台裝置</button></div><p class="dim w-note">「帶到另一台裝置」會產生一個連結，在手機或電腦打開它，看過的場次就會自動合併過去。</p>
  <p style="margin-top:20px"><button class="btn" id="wIdx">全部場次索引</button></p><button class="reset" id="resetW">清除我的觀影紀錄</button>`;
  $('#closeW').onclick=closeWallet; $('#wIdx').onclick=openIndex;
  $('#wInvite').onclick=()=>share('預言成真影展','22 部科幻電影，2026 年的續集。一起來挑一部？',SITE);
  $('#wCarry').onclick=()=>{ if(seen.size) share('我的票根夾',`預言成真影展：我已看 ${seen.size} 場，打開連結接著看`,SITE+'#stubs='+[...seen].sort((x,y)=>x-y).join('.')); };
  d.querySelectorAll('.stubs button').forEach(b=>b.onclick=()=>{ closeWallet(); go(+b.dataset.n); });
  $('#resetW').onclick=()=>{ if(!seen.size) return; seen=new Set(); save(); markSeen(); renderWallet(); toast('觀影紀錄已清除'); };
  if(all) $('#finBtn').onclick=()=>{ closeWallet(); location.hash='finale'; };
}
function openWallet(){ renderWallet(); $('#drawer').classList.add('open'); $('#scrim').classList.add('open'); tick(); }
function closeWallet(){ $('#drawer').classList.remove('open'); $('#scrim').classList.remove('open'); }
$('#walletBtn').onclick=openWallet; $('#scrim').onclick=closeWallet;

/* ---------- finale ---------- */
const SIX=[['被相信','真實越稀缺，信任越值錢。',[3,6,9]],['被記得','曝光買得到，記憶買不到。',[8,10,11,19]],['被選擇','AI 替人篩選的時代，要站上被選擇的場域。',[7,13,18]],['會判斷','模型給方向，人給判斷與授權的邊界。',[12,14,22]],['能交付','從生成力到交付力，從創意到創新。',[1,4,5,20,21]],['看得見','先看見顧客的猶豫與組織的暗流，改變才會發生。',[2,15,16,17]]];
function openFinale(){
  stopScore(); cur=null;
  const r=$('#reader'); r.className='reader open z-intro'; document.body.style.overflow='hidden'; r.scrollTop=0;
  const bar=`<div class="rbar"><span class="t">閉幕片</span><button class="x" id="closeR">✕ 離場</button></div>`;
  if(seen.size<DATA.length){
    r.innerHTML=bar+`<div class="sec" style="text-align:center;padding-top:16vh"><div class="mono" style="justify-content:center">尚未解鎖</div><p class="trailer">閉幕片要集滿 22 張票根才會開放。<br>你目前有 ${seen.size} 張，還差 ${DATA.length-seen.size} 場。</p><p style="margin-top:30px"><button class="btn solid" id="nextUnseen">看下一場還沒看的</button></p></div>`;
    const nu=DATA.find(a=>!seen.has(a.n)); $('#nextUnseen').onclick=()=>go(nu.n);
  } else {
    r.innerHTML=bar+`<section class="opening go titled"><div class="lbt"></div><div class="lbb"></div><div class="inner"><div class="fn">閉幕片　1936 到 2026</div><div class="odo done">2026</div><h1>預言都成真了，然後呢？</h1><div class="meta">策展人的話　非刊物原文</div></div></section>
    <div class="sec fin"><p>從《摩登時代》的生產線，到《雲端情人》裡懂你的 AI，九十年來科幻電影都在問同一個問題：<b>當機器什麼都能做，人還剩下什麼？</b></p>
    <p>看完 22 場，續集們的答案出奇一致：AI 改變的是速度、分工與做法；不變的是，品牌必須被人相信、被人記得、被人選擇。</p>
    <div class="six">${SIX.map(s=>`<div><b>${s[0]}</b><span>${s[1]}</span><small>第 ${s[2].join('、')} 場</small></div>`).join('')}</div>
    <p>電影裡的未來總有個反派。2026 年的現實沒有反派，只有兩種公司：一種把 AI 用來變得更快，一種把 AI 用來更懂人。</p>
    <p class="dim" style="font-size:15px">— 感謝觀賞。片尾彩蛋：從頭再看一次，你會發現 22 篇其實在講同一件事。</p></div><div style="height:90px"></div>`;
    beep(660,.2,.1); setTimeout(()=>beep(990,.3,.1),180);
  }
  $('#closeR').onclick=()=>{ location.hash='halls'; };
}

/* ---------- destiny screening ---------- */
const MOODS=[
 {k:'heart',e:'💔',l:'人心太難懂',d:'信任、真實與關係',t:'真實之夜',sub:'當什麼都能被生成，人還願意相信什麼？',ns:[3,6,9]},
 {k:'ai',e:'🤖',l:'AI 要取代我了？',d:'人與 AI 的分工與判斷',t:'人機對決之夜',sub:'AI 改變的是分工，沒改變的是判斷。',ns:[1,14,22]},
 {k:'future',e:'🔮',l:'想偷看未來',d:'Agent 時代的品牌與旅程',t:'未來特映之夜',sub:'當 AI 替消費者做選擇，品牌要站在哪裡？',ns:[2,13,18]},
 {k:'work',e:'🎭',l:'工作讓我懷疑人生',d:'組織、策略與創造力',t:'職場突圍之夜',sub:'轉型的阻力不在技術，而在人與組織。',ns:[16,5,20]},
 {k:'cut',e:'⏱',l:'只有 15 分鐘',d:'導演剪輯版：五場精華',t:'導演剪輯版',sub:'每場只看預告片＋影評，約 3 分鐘，五場串起全刊的主線：靠近人 → 守住真實 → 理解人 → 人做判斷 → 被記住。',ns:[2,3,12,14,19],cut:true}
];
let mood=null;
function renderMoods(){
  $('#moods').innerHTML=MOODS.map(m=>`<button class="mood ${m.cut?'cut':''}" data-k="${m.k}" aria-pressed="${mood===m.k}"><span class="e">${m.e}</span><b>${m.l}</b><span>${m.d}</span></button>`).join('');
  $$('.mood').forEach(b=>b.onclick=()=>{ mood=b.dataset.k; $('#lobbyQ').textContent='為你排好今晚的片單 ↓'; renderMoods(); renderLineup(); tick(); flick(); });
}
function renderLineup(){
  if(!mood){ $('#lineup').innerHTML=''; return; }
  const m=MOODS.find(x=>x.k===mood), list=m.ns.map(byN), mins=list.reduce((s,a)=>s+(m.cut?3:a.mins),0);
  $('#lineup').innerHTML=`<div class="lineup-head"><div><span class="mono dim">今晚的節目　${list.length} 場，約 ${mins} 分鐘</span><h3>${m.e} ${m.t}</h3></div><p>${esc(m.sub)}</p></div>
  <div class="picks ${m.cut?'five':''}">${list.map((a,i)=>`<button class="pick z-${a.zone}" data-n="${a.n}"><div class="pp">${poster(a,true)}</div><div class="pb">
   <span class="ord">第 ${i+1} 場　《${esc(a.film.zh)}》</span><h4>${esc(a.title)}</h4>
   <q>${esc(a.hook)}</q><span class="go">${m.cut?'看預告片＋影評':`進場，${a.mins} 分鐘`}</span></div></button>`).join('')}</div>`;
  $$('.pick').forEach(b=>b.onclick=()=>go(+b.dataset.n));
}

/* ---------- lobby film wall ---------- */
let lobHall='all';
function renderLobTabs(){
  const opts=[{z:'all',name:'全部 22 部'}].concat(HALLS);
  $('#lobTabs').innerHTML=opts.map(h=>{const t=h.z==='all'?DATA:DATA.filter(a=>a.zone===h.z);const s=t.filter(a=>seen.has(a.n)).length;
    return `<button role="tab" class="z-${h.z==='all'?'intro':h.z}" aria-selected="${lobHall===h.z}" data-z="${h.z}">${h.z==='all'?'':'<i></i>'}${h.name}<small>${s}/${t.length}</small></button>`}).join('');
  $$('#lobTabs button').forEach(b=>b.onclick=()=>{ lobHall=b.dataset.z; renderLobTabs(); renderReel(); flick(); tick(); });
}
function renderReel(){
  const list=lobHall==='all'?DATA:DATA.filter(a=>a.zone===lobHall);
  const r=$('#reel');
  r.innerHTML=list.map((a,i)=>{const h=hallOf(a.zone); const L=[...a.film.zh.replace(/\s/g,'')].length; const lc=L<=4?'l4':L<=5?'l5':L<=7?'l7':'l9'; return `<button class="fc z-${a.zone} ${seen.has(a.n)?'isseen':''} ${KV.has(a.n)?'haskv':''}" data-n="${a.n}" style="animation-delay:${Math.min(i,6)*60}ms" aria-label="《${esc(a.film.zh)}》${a.film.year}，第 ${a.n} 場">
    <div class="ftop"><b>第 ${a.n} 場</b><span>${h.name}</span></div>
    ${KV.has(a.n)?`<div class="art kvc kv-${pad(a.n)}"><img src="img/poster/${pad(a.n)}.webp" alt="" loading="lazy" draggable="false"><i class="kv-fx"></i><i class="kv-fx2"></i></div>`:`<div class="art">${window.SKETCH(a.n)}</div>`}
    <span class="yr">${a.film.year}—2026</span>
    <span class="zh ${lc}">${esc(a.film.zh)}</span>
    <span class="en">${esc(a.film.en)}</span>
    ${KV.has(a.n)?'':`<p class="lg">${esc(SCENES[a.n])}</p>`}
    <p class="fq">「${esc(HOOK[a.n])}」</p>
    <div class="cta"><span>2026 續集，${a.mins} 分鐘</span><span class="go">進場</span></div></button>`;}).join('');
  r.scrollLeft=0; watchKV(r);
  $$('.fc').forEach(c=>c.onclick=e=>{ if(r.dataset.moved==='1'){ e.preventDefault(); return; } go(+c.dataset.n); });
}
(function reelDrag(){
  const r=$('#reel'); let down=false,sx=0,sl=0, hold=0;
  const pauseAuto=()=>{ hold=performance.now()+4000; };
  ['pointerdown','wheel','touchstart','keydown'].forEach(ev=>r.addEventListener(ev,pauseAuto,{passive:true}));
  let acc=0;
  (function auto(){ const now=performance.now();
    if(now>hold && !down && $('#v-lobby').classList.contains('on') && !$('#reader').classList.contains('open') && !document.body.classList.contains('gated')){
      acc+=0.8; if(acc>=1){ const s=Math.floor(acc); acc-=s; r.scrollLeft+=s; }
      if(r.scrollLeft+r.clientWidth>=r.scrollWidth-2){ hold=now+2500; setTimeout(()=>r.scrollTo({left:0,behavior:'smooth'}),2000); }
    }
    requestAnimationFrame(auto); })();
  r.addEventListener('pointerdown',e=>{ if(e.pointerType!=='mouse') return; down=true; r.dataset.moved='0'; sx=e.clientX; sl=r.scrollLeft; });
  addEventListener('pointerup',()=>{ if(down){ down=false; r.classList.remove('drag'); setTimeout(()=>{ r.dataset.moved='0'; },30); } });
  r.addEventListener('pointermove',e=>{ if(!down) return; const dx=e.clientX-sx; if(Math.abs(dx)>6){ r.dataset.moved='1'; r.classList.add('drag'); r.scrollLeft=sl-dx; } });
  r.addEventListener('wheel',e=>{ if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){ r.scrollLeft+=e.deltaY; e.preventDefault(); } },{passive:false});
  r.addEventListener('keydown',e=>{ if(e.key==='ArrowRight') r.scrollBy({left:420,behavior:'smooth'}); if(e.key==='ArrowLeft') r.scrollBy({left:-420,behavior:'smooth'}); });
  $('#reelL').onclick=()=>{ r.scrollBy({left:-420,behavior:'smooth'}); tick(); };
  $('#reelR').onclick=()=>{ r.scrollBy({left:420,behavior:'smooth'}); tick(); };
  if($('#moodToggle')) $('#moodToggle').onclick=()=>{ const p=$('#moodPanel'), open=p.hidden; p.hidden=!open; $('#moodToggle').setAttribute('aria-expanded',open); if(open){ p.scrollIntoView({behavior:'smooth',block:'start'}); } tick(); };
})();

/* ---------- index ---------- */
function openIndex(){
  const d=$('#drawer'); d.innerHTML=`<button class="x" id="closeW" style="float:right">關閉</button><div class="idx"><h2>全部場次索引</h2>
  ${HALLS.map(h=>{const items=DATA.filter(a=>a.zone===h.z);return `<section class="z-${h.z}"><div class="hn"><span>${h.name}</span><span>${items.length} 場</span></div>
   ${items.map(a=>`<button class="row" data-n="${a.n}"><span class="rn ${seen.has(a.n)?'ok':''}">${seen.has(a.n)?'✓':pad(a.n)}</span><span class="rt">${esc(a.title)}<small>${esc(a.author)} ・《${esc(a.film.zh)}》${a.film.year}</small></span><span class="rm">${a.mins}′</span></button>`).join('')}</section>`;}).join('')}</div>`;
  $('#closeW').onclick=closeWallet; d.querySelectorAll('.row').forEach(b=>b.onclick=()=>{ closeWallet(); go(+b.dataset.n); });
  d.classList.add('open'); $('#scrim').classList.add('open'); d.scrollTop=0; tick();
}
$('#idxBtn').onclick=openIndex;

/* ---------- router ---------- */
function route(){
  const h=location.hash, m=h.match(/^#screen-(\d+)$/);
  if(m){ openReader(+m[1]); return; }
  if(h==='#finale'){ openFinale(); return; }
  closeReader();
  let v='lobby'; const hm=h.match(/^#hall-(intro|people|model|ai)$/);
  if(hm){ v='halls'; setHall(hm[1]); } else if(['#timeline','#halls','#about','#lobby'].includes(h)) v=h.slice(1);
  if(v==='halls'&&!hm) setHall(activeHall);
  lastView=h||'#lobby';
  $$('.view').forEach(s=>s.classList.toggle('on',s.dataset.view===v));
  $$('.dock a').forEach(a=>a.classList.toggle('on',a.dataset.v===v));
  if(v==='timeline') requestAnimationFrame(()=>tlPlace());
  window.scrollTo(0,0);
}
let lastView='#lobby';
addEventListener('hashchange',route);
document.addEventListener('keydown',e=>{ if(e.key!=='Escape') return; if($('#tStage').classList.contains('on')){ $('#tStage').className='ticket-stage'; $('#tStage').innerHTML=''; } else if($('#drawer').classList.contains('open')) closeWallet(); else if($('#reader').classList.contains('open')) location.hash=lastView; });


renderLobTabs(); renderReel(); buildTimeline(); renderFilters(); renderHalls(); renderTabs(); applyFilter();
if(!document.body.classList.contains('gated')) route();
/* 跳過片頭（重新整理或直接連到某部片）時，沿用上次選的「有聲」；瀏覽器要求先有一次點擊，所以第一次點螢幕就會出聲 */
(function(){ let w=false; try{ w=localStorage.getItem('dw-sound')==='1'; }catch(e){} if(w && !document.body.classList.contains('gated')) setSound(true); })();
})();
