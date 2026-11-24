/* 簡報的現場動畫與襯底配樂：直接沿用網站的 sketch.js／scene.js／score.js */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 描線 ---------- */
function draw(box,total){ if(!box) return; total=reduce?0:(total||1900);
  const els=[...box.querySelectorAll('.pn')];
  els.forEach((el,i)=>{ let L=300; try{ L=Math.ceil(el.getTotalLength())||300; }catch(e){}
    el.style.transition='none'; el.style.strokeDasharray=L; el.style.strokeDashoffset=reduce?0:L;
    if(!reduce){ const d=Math.round(i/Math.max(1,els.length)*total*.7); el.style.transition=`stroke-dashoffset ${Math.max(500,total*.55)}ms cubic-bezier(.5,.1,.3,1) ${200+d}ms`; } });
  box.classList.remove('lv');
  requestAnimationFrame(()=>requestAnimationFrame(()=>els.forEach(el=>el.style.strokeDashoffset=0)));
  setTimeout(()=>{ els.forEach(el=>{ el.style.strokeDasharray=''; el.style.strokeDashoffset=''; el.style.transition=''; }); box.classList.add('lv'); }, reduce?0:total+400);
}

/* ---------- 配樂 ---------- */
let ac=null, on=false, cur=-1;
function ensure(){ try{ if(navigator.audioSession) navigator.audioSession.type='playback'; }catch(e){}
  if(!ac){ try{ ac=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return false; } }
  if(ac.state!=='running') ac.resume().catch(()=>{}); return true; }
function music(n,vol){ if(!on||!window.SCORE||!ensure()) return; window.SCORE.play(n,ac,vol); }
const THEME=7, END=21;
function setSnd(v){ on=v; const b=$('snd'); b.setAttribute('aria-pressed',v); b.textContent=v?'♪ 配樂 開':'♪ 配樂 關'; b.setAttribute('aria-label',v?'關閉配樂':'開啟配樂');
  if(cur===1&&tv) tv.muted=!v;
  if(v&&cur===1){ ensure(); return; }
  if(v){ ensure(); if(cur===9) music(+document.querySelectorAll('#scenes .tile[data-n]')[ti].dataset.n,.4); else score(Math.max(cur,0)); } else if(window.SCORE) window.SCORE.stop(); }
$('go').addEventListener('click',()=>setSnd(true));
$('snd').addEventListener('click',()=>setSnd(!on));

/* ---------- DEMO 1：駭客任務片頭 ---------- */
const FILM={n:12,zh:'駭客任務',en:'The Matrix',t:'第二顆紅色膠囊',fx:'rain',c:'#3dff7a'};
let ft=0, yt=0;
function opening(){ const f=FILM, box=$('liveOpen'); if(!box||!window.SKETCH) return;
  box.className='shot live-open lo2 fx-'+f.fx; box.style.setProperty('--fc',f.c); cancelAnimationFrame(yt);
  $('loSk').innerHTML=window.SKETCH(f.n); draw($('loSk'),1600);
  $('loK').textContent=`Model 廳　第 12 場　《${f.zh}》${f.en}`;
  $('loM').textContent='改編自〈People Model 讓消費者研究變成一場對話〉';
  $('loT').innerHTML=''; const y=$('loY'); y.textContent='1999';
  const done=()=>{ y.textContent='2026'; box.classList.add('titled');
    $('loT').innerHTML=[...f.t].map((c,i)=>`<span class="ch" style="--i:${i}">${c}</span>`).join(''); };
  if(reduce){ done(); return; }
  const t0=performance.now()+500, dur=1500;
  (function step(now){ const p=Math.min(1,Math.max(0,(now-t0)/dur)), e=1-Math.pow(1-p,3); y.textContent=Math.round(1999+27*e); if(p<1) yt=requestAnimationFrame(step); else done(); })(performance.now());
}

/* ---------- 22 部各不相同：插圖輪流亮起，配樂跟著換 ---------- */
let ti=0, tt=0;
function tiles(){ const T=[...document.querySelectorAll('#scenes .tile[data-n]')];
  T.forEach((t,i)=>{ const a=t.querySelector('.art'); a.innerHTML=window.SCENE?window.SCENE(+t.dataset.n):''; setTimeout(()=>draw(a,2000),i*400); });
  const hot=k=>{ ti=k; T.forEach((t,i)=>t.classList.toggle('hot',i===k)); music(+T[k].dataset.n,.4); };
  clearInterval(tt); hot(0); tt=setInterval(()=>hot((ti+1)%T.length),4400); }
function demoScene(){ const t=$('demoScene'); if(!t) return; const a=t.querySelector('.art'); a.innerHTML=window.SCENE?window.SCENE(12):''; setTimeout(()=>draw(a,2000),600); }

/* 配樂：DEMO 四頁都是駭客任務；結語（第 11 頁）換成雨果的圓舞曲；其餘是影展主題 */
function score(i){ if(i===1||i===9) return; if(i>=5&&i<=8) music(12,.4); else music(i===11?END:THEME,.32); }
/* 預告片：進到這頁就從頭播放（有開配樂就帶聲音），離開就暫停 */
const tv=$('tv');
function trailer(onSlide){ if(!tv) return; if(onSlide){ if(window.SCORE) window.SCORE.stop(true); tv.currentTime=0; tv.muted=!on; const p=tv.play(); if(p) p.catch(()=>{ tv.muted=true; tv.play().catch(()=>{}); }); } else tv.pause(); }
$('play').addEventListener('click',()=>{ if(cur===1&&tv){ if(tv.paused) tv.play().catch(()=>{}); else tv.pause(); } });

document.addEventListener('slide',e=>{ const i=e.detail; cur=i;
  clearInterval(ft); if(i!==9){ clearInterval(tt); }
  trailer(i===1);
  if(i===5){ opening(); ft=setInterval(opening,10000); }
  if(i===6) demoScene();
  if(i===9) tiles();
  score(i); });
})();
