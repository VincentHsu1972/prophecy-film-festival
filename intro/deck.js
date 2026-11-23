(function(){
const S=[...document.querySelectorAll('.s')], T=S.map(s=>+s.dataset.t*1000), TOTAL=T.reduce((a,b)=>a+b,0);
let i=0, t0=0, el=0, playing=false, raf=0;
const $=id=>document.getElementById(id);
const fmt=ms=>{const s=Math.round(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
function show(n){ i=Math.max(0,Math.min(S.length-1,n)); S.forEach((s,k)=>{ s.classList.remove('on'); void s.offsetWidth; if(k===i) s.classList.add('on'); }); el=0; t0=performance.now(); $('cnt').textContent=String(i+1).padStart(2,'0')+' / '+S.length; }
function loop(now){ if(playing){ el=now-t0; if(el>=T[i]){ if(i<S.length-1){ show(i+1); } else { playing=false; $('play').textContent='▶'; } } }
  const before=T.slice(0,i).reduce((a,b)=>a+b,0), cur=before+Math.min(el,T[i]);
  $('bar').style.width=(cur/TOTAL*100)+'%'; $('clock').textContent=fmt(cur)+' / '+fmt(TOTAL); raf=requestAnimationFrame(loop); }
function play(){ playing=true; t0=performance.now()-el; $('play').textContent='❚❚'; $('play').setAttribute('aria-label','暫停'); }
function pause(){ playing=false; $('play').textContent='▶'; $('play').setAttribute('aria-label','播放'); }
function begin(){ if(begun) return; begun=true; clearInterval(cd); $('start').classList.add('gone'); show(0); play(); }
let begun=false, left=3;
const cd=setInterval(()=>{ left--; $('auto').textContent=left>0?`${left} 秒後自動開始`:'開始播放'; if(left<=0) begin(); },1000);
$('go').onclick=begin;
$('play').onclick=()=>{ if(!begun) return begin(); if(playing) pause(); else { if(i===S.length-1&&el>=T[i]) show(0); play(); } };
$('next').onclick=()=>{ begin(); show(i+1); };
$('prev').onclick=()=>{ begin(); show(i-1); };
document.addEventListener('keydown',e=>{ if(e.key==='ArrowRight'||e.key==='PageDown') $('next').onclick(); else if(e.key==='ArrowLeft'||e.key==='PageUp') $('prev').onclick(); else if(e.key===' '){ e.preventDefault(); $('play').onclick(); } });
S[0].classList.add('on'); requestAnimationFrame(loop);
})();
