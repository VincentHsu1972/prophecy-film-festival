/* 預言成真影展 · 22 段原創配樂（Web Audio 即時合成，無音檔）
   每段只取原片的「氛圍、樂器色彩、節奏感」，旋律與和弦進行皆為原創，不引用任何原曲。 */
window.SCORE=(function(){
'use strict';
let ac=null,master=null,bus=null,rev=null,drive=null,noiseBuf=null,timer=null,nextBar=0,barIdx=0,cfg=null,playingN=0;
const NOTE={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const m=s=>{const r=/^([A-G])([#b]?)(-?\d)$/.exec(s);let v=NOTE[r[1]]+(r[2]==='#'?1:r[2]==='b'?-1:0);return v+12*(+r[3]+1);};
const f=s=>440*Math.pow(2,((typeof s==='number'?s:m(s))-69)/12);
const ns=str=>str.split(' ').filter(Boolean);

function setup(ctx){
  if(ac===ctx&&master) return;
  ac=ctx;
  master=ac.createGain(); master.gain.value=0;
  const comp=ac.createDynamicsCompressor(); comp.threshold.value=-18; comp.ratio.value=3;
  master.connect(comp).connect(ac.destination);
  bus=ac.createGain(); bus.gain.value=1; bus.connect(master);
  // reverb
  const len=ac.sampleRate*2.8, ir=ac.createBuffer(2,len,ac.sampleRate);
  for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6);}
  rev=ac.createConvolver(); rev.buffer=ir; const rg=ac.createGain(); rg.gain.value=.9; rev.connect(rg).connect(master);
  // distortion
  drive=ac.createWaveShaper(); const k=40,n=1024,cv=new Float32Array(n);
  for(let i=0;i<n;i++){const x=i*2/n-1;cv[i]=(1+k)*x/(1+k*Math.abs(x));} drive.curve=cv; drive.connect(bus);
  // noise
  noiseBuf=ac.createBuffer(1,ac.sampleRate,ac.sampleRate); const nd=noiseBuf.getChannelData(0); for(let i=0;i<nd.length;i++) nd[i]=Math.random()*2-1;
}
function out(node,send=.25,dist=false){ node.connect(dist?drive:bus); if(send>0){const s=ac.createGain(); s.gain.value=send; node.connect(s).connect(rev);} }
function envGain(t,a,hold,r,peak){ const g=ac.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(peak,t+a); g.gain.setValueAtTime(peak,t+a+hold); g.gain.exponentialRampToValueAtTime(.0001,t+a+hold+r); return g; }

/* ---------- instruments ---------- */
function tone(note,t,dur,o={}){ const type=o.type||'sine',vol=o.vol??.1,a=o.a??.01,r=o.r??.3;
  const g=envGain(t,a,Math.max(0,dur-a),r,vol); let last=g;
  if(o.cut){const fl=ac.createBiquadFilter(); fl.type='lowpass'; fl.frequency.value=o.cut; fl.Q.value=o.q||.7; g.connect(fl); last=fl;}
  (o.det||[0]).forEach(dt=>{const os=ac.createOscillator(); os.type=type; os.frequency.value=f(note); os.detune.value=dt;
    if(o.vib){const l=ac.createOscillator(),lg=ac.createGain(); l.frequency.value=o.vib; lg.gain.value=o.vibd||6; l.connect(lg).connect(os.detune); l.start(t); l.stop(t+dur+r+.1);}
    if(o.glideFrom){os.frequency.setValueAtTime(f(o.glideFrom),t); os.frequency.exponentialRampToValueAtTime(f(note),t+(o.glide||.08));}
    os.connect(g); os.start(t); os.stop(t+dur+r+.1);});
  out(last,o.send??.25,o.dist); }
const pad=(notes,t,dur,o={})=>notes.forEach(n=>tone(n,t,dur,{type:'sawtooth',vol:.035,a:1.2,r:1.6,cut:900,det:[-9,9],send:.5,...o}));
const piano=(n,t,o={})=>{ tone(n,t,.05,{type:'triangle',vol:.11,a:.005,r:o.r??1.4,cut:2600,send:.3,...o}); tone(n,t,.05,{type:'sine',vol:.05,a:.005,r:(o.r??1.4)*.7,send:.2,...o}); };
const pluck=(n,t,o={})=>tone(n,t,.02,{type:'triangle',vol:.1,a:.003,r:o.r??.45,cut:o.cut??3200,send:.2,...o});
function bell(n,t,o={}){ const vol=o.vol??.06,r=o.r??2.2; const c=ac.createOscillator(),mo=ac.createOscillator(),mg=ac.createGain(),g=envGain(t,.002,0,r,vol);
  c.frequency.value=f(n); mo.frequency.value=f(n)*(o.ratio||3.5); mg.gain.setValueAtTime(f(n)*2,t); mg.gain.exponentialRampToValueAtTime(1,t+r);
  mo.connect(mg).connect(c.frequency); c.connect(g); out(g,o.send??.45); c.start(t); mo.start(t); c.stop(t+r+.1); mo.stop(t+r+.1); }
const bass=(n,t,dur,o={})=>tone(n,t,dur,{type:'sawtooth',vol:.1,a:.01,r:.12,cut:o.cut??420,q:4,send:.05,...o});
const brass=(notes,t,dur,o={})=>[].concat(notes).forEach(n=>tone(n,t,dur,{type:'sawtooth',vol:.05,a:.06,r:.35,cut:o.cut??1500,det:[-6,6],send:.35,vib:5,vibd:4,...o}));
function choir(notes,t,dur,o={}){ [].concat(notes).forEach(n=>[700,1150].forEach((fq,i)=>{ const g=envGain(t,o.a??1.5,Math.max(0,dur-(o.a??1.5)),o.r??2,(o.vol??.05)*(i?.6:1)); const bp=ac.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=o.vowel?o.vowel[i]:fq; bp.Q.value=6;
  [-7,7].forEach(dt=>{const os=ac.createOscillator(); os.type='sawtooth'; os.frequency.value=f(n); os.detune.value=dt; const l=ac.createOscillator(),lg=ac.createGain(); l.frequency.value=5.2; lg.gain.value=8; l.connect(lg).connect(os.detune); os.connect(bp); os.start(t); l.start(t); os.stop(t+dur+(o.r??2)+.1); l.stop(t+dur+(o.r??2)+.1);});
  bp.connect(g); out(g,o.send??.6); })); }
function noise(t,dur,o={}){ const s=ac.createBufferSource(); s.buffer=noiseBuf; const fl=ac.createBiquadFilter(); fl.type=o.ft||'highpass'; fl.frequency.value=o.fq||7000; fl.Q.value=o.q||.7; const g=envGain(t,o.a??.001,0,dur,o.vol??.05); s.connect(fl).connect(g); out(g,o.send??.1); s.start(t); s.stop(t+dur+.05); }
const hat=(t,v=.03,d=.05)=>noise(t,d,{vol:v,fq:8000});
const snare=(t,v=.08)=>{ noise(t,.18,{vol:v,ft:'bandpass',fq:1800,q:.8,send:.2}); tone('D3',t,.01,{vol:v*.6,r:.08,send:0}); };
function kick(t,v=.35,f0=120,f1=42,d=.35){ const o=ac.createOscillator(),g=envGain(t,.002,0,d,v); o.frequency.setValueAtTime(f0,t); o.frequency.exponentialRampToValueAtTime(f1,t+d*.6); o.connect(g); out(g,.05); o.start(t); o.stop(t+d+.1); }
const taiko=(t,v=.4)=>{ kick(t,v,95,48,.9); noise(t,.25,{vol:v*.25,ft:'lowpass',fq:600,send:.4}); };
const timp=(n,t,v=.22)=>{ tone(n,t,.02,{vol:v,r:1.2,cut:500,send:.4,glideFrom:m(n)+3,glide:.1}); noise(t,.15,{vol:v*.15,ft:'lowpass',fq:400}); };
const wood=(t,v=.08,fq=1700)=>tone(fq>0?69+12*Math.log2(fq/440):'A5',t,.005,{vol:v,r:.05,send:.1});
const guitar=(notes,t,dur,o={})=>[].concat(notes).forEach(n=>tone(n,t,dur,{type:'sawtooth',vol:.04,a:.005,r:.15,cut:2200,det:[-5,5],dist:true,send:.1,...o}));

/* ---------- 22 scores ---------- */
const S={
// 1 關鍵報告：冷調懸疑。低音弦樂的固定脈動、緊張的不協和長音、偶爾的玻璃鐘聲
1:{bpm:92,beats:4,bar(b,t,B){ for(let i=0;i<8;i++) tone(i%4===3?'F2':'D2',t+i*B/2,B*.4,{type:'sawtooth',vol:.07,cut:380,a:.01,r:.1,send:.15});
  if(b%2===0) pad(['D4','Eb4','A4'],t,B*8,{vol:.022,cut:1300,a:2});
  if(b%4===1) bell(['A5','F5','Bb5','E5'][(b>>2)%4],t+B*2.5,{vol:.045,r:3});
  hat(t+B*1.5,.015); hat(t+B*3.5,.015); }},
// 2 雲端情人：溫柔的鋼琴分解和弦與撥弦
2:{bpm:72,beats:4,bar(b,t,B){ const C=[['F3','A3','C4','E4'],['A2','E3','G3','C4'],['D3','F3','A3','C4'],['Bb2','D3','F3','A3']][b%4];
  [0,1,2,3,2,1].forEach((k,i)=>piano(C[k],t+i*B*2/3,{vol:.07,r:1.8}));
  pluck(C[3].replace(/\d/,d=>+d+1),t+B*3,{vol:.05,r:.9});
  pad(C,t,B*4,{type:'triangle',vol:.02,cut:1200}); }},
// 3 銀翼殺手：寬闊的類比合成器長音、慢速旋律、深殘響
3:{bpm:58,beats:4,bar(b,t,B){ const C=[['C3','G3','Eb4'],['Ab2','Eb3','C4','G4'],['Eb3','Bb3','G4'],['Bb2','F3','D4']][b%4];
  pad(C,t,B*4.2,{vol:.045,cut:1100,a:1.6,r:3,det:[-14,0,14],vib:.3,vibd:10});
  const L=[['G4',0,2],['Bb4',2,2]],L2=[['C5',0,3]],L3=[['Bb4',0,1.5],['G4',1.5,2.5]],L4=[['F4',0,4]];
  [L,L2,L3,L4][b%4].forEach(([n,s,d])=>tone(n,t+s*B,d*B,{type:'sawtooth',vol:.035,a:.4,r:1.5,cut:1800,vib:5,vibd:9,send:.7}));
  if(b%2) bell('G6',t+B*3,{vol:.02,r:4}); }},
// 4 鋼鐵人：搖滾。失真強力和弦、鼓組
4:{bpm:124,beats:4,bar(b,t,B){ const R=[['E3','B3'],['E3','B3'],['G3','D4'],['A3','E4']][b%4];
  [0,.5,1.5,2,2.5,3.5].forEach((s,i)=>guitar(i===3?['D3','A3']:R,t+s*B,B*.42));
  for(let i=0;i<8;i++) bass(i===3?'D2':R[0].replace('3','2'),t+i*B/2,B*.4,{vol:.09,cut:600});
  kick(t,.32); kick(t+B*1.5,.25); kick(t+B*2,.32); snare(t+B,.09); snare(t+B*3,.09); for(let i=0;i<8;i++) hat(t+i*B/2,.02); }},
// 5 全面啟動：低沉的銅管轟鳴、時鐘般的滴答、層層堆疊的弦樂
5:{bpm:60,beats:4,bar(b,t,B){ if(b%2===0) brass(['A1','E2','A2'],t,B*3.5,{vol:.07,cut:500,a:.4,r:1.8});
  const C=[['A3','C4','E4'],['F3','A3','C4'],['D3','F3','A3'],['E3','G#3','B3']][b%4]; pad(C,t,B*4,{vol:.03,cut:1000});
  for(let i=0;i<16;i++) wood(t+i*B/4,i%4?.018:.035,i%4?2400:1600); }},
// 6 攻殼機動隊：太鼓、吟唱般的人聲長音、冷冽鐘聲
6:{bpm:76,beats:4,bar(b,t,B){ [0,1.5,2,3].forEach((s,i)=>taiko(t+s*B,i===0?.45:.25)); if(b%2) taiko(t+B*3.5,.2);
  if(b%2===0) choir(['A3','D4','E4'],t,B*7.5,{vol:.045,vowel:[650,1080]});
  bell(['E5','A5','D5','B5'][b%4],t+B*2.5,{vol:.03,ratio:2.76,r:3}); }},
// 7 A.I. 人工智慧：童話般的鋼片琴琶音、柔和弦樂
7:{bpm:66,beats:4,bar(b,t,B){ const C=[['D4','F#4','A4','D5'],['B3','D4','F#4','B4'],['G3','B3','D4','G4'],['A3','C#4','E4','A4']][b%4];
  [0,1,2,3,2,1,2,3].forEach((k,i)=>bell(C[k].replace(/\d/,d=>+d+1),t+i*B/2,{vol:.03,ratio:4,r:1.8}));
  pad(C.slice(0,3),t,B*4,{type:'triangle',vol:.028,cut:900,a:1.5}); }},
// 8 一級玩家：80 年代合成器琶音、八度貝斯、閘門小鼓
8:{bpm:118,beats:4,bar(b,t,B){ const C=[['C4','E4','G4'],['A3','C4','E4'],['F3','A3','C4'],['G3','B3','D4']][b%4];
  for(let i=0;i<16;i++) tone(C[i%3].replace(/\d/,d=>+d+(i%6>2?1:0)),t+i*B/4,B*.2,{type:'square',vol:.03,cut:2800,r:.08,send:.2});
  for(let i=0;i<8;i++) bass(C[0].replace(/\d/,d=>+d-(i%2?1:2)),t+i*B/2,B*.4,{type:'square',vol:.07,cut:900});
  kick(t,.3); kick(t+B*2,.3); snare(t+B,.1); snare(t+B*3,.1); }},
// 9 社群網戰：低頻嗡鳴上，稀疏、略帶不安的高音鋼琴
9:{bpm:70,beats:4,bar(b,t,B){ if(b%2===0) tone('D2',t,B*8,{type:'sawtooth',vol:.04,a:2,r:2,cut:220,det:[-6,6],send:.3});
  const M=[['A5',0],['C6',1.5],['E5',2.5]],M2=[['A5',0],['G5',2]],M3=[['E6',.5],['C6',2],['B5',3]],M4=[['A5',1]];
  [M,M2,M3,M4][b%4].forEach(([n,s])=>piano(n,t+s*B,{vol:.06,r:2.4,cut:3000})); }},
// 10 回到未來：輕快冒險。快速弦樂琶音、銅管和弦、定音鼓
10:{bpm:134,beats:4,bar(b,t,B){ const C=[['C4','E4','G4'],['F4','A4','C5'],['D4','G4','B4'],['C4','E4','G4']][b%4];
  for(let i=0;i<16;i++) pluck(C[i%3].replace(/\d/,d=>+d+(i>7?1:0)),t+i*B/4,{type:'sawtooth',vol:.028,cut:2600,r:.12});
  brass(C,t,B*1.6,{vol:.04}); if(b%2) brass(C.map(n=>n.replace(/\d/,d=>+d+1)),t+B*2.5,B*1.2,{vol:.035});
  timp(b%4===2?'G2':'C3',t); timp('C3',t+B*2,.12); snare(t+B*3.5,.04); }},
// 11 王牌冤家：俏皮的撥弦吉他、鐘琴點綴
11:{bpm:94,beats:4,bar(b,t,B){ const C=[['G3','B3','D4'],['E3','G3','B3'],['C3','E3','G3'],['D3','F#3','A3']][b%4];
  [0,2,1,2,0,2,1,2].forEach((k,i)=>pluck(C[k],t+i*B/2,{vol:.08,r:.6,cut:2400}));
  bass(C[0].replace(/\d/,d=>+d-1),t,B*1.5,{type:'triangle',vol:.08,cut:600}); bass(C[2].replace(/\d/,d=>+d-1),t+B*2,B*1.5,{type:'triangle',vol:.06,cut:600});
  if(b%2===0) [['D6',.5],['B5',1],['G5',2.5]].forEach(([n,s])=>bell(n,t+s*B,{vol:.025,ratio:5,r:1.2})); }},
// 12 駭客任務：暗黑電子。四拍大鼓、失真十六分音符貝斯、金屬打擊
12:{bpm:128,beats:4,bar(b,t,B){ for(let i=0;i<4;i++) kick(t+i*B,.32); for(let i=0;i<4;i++) hat(t+i*B+B/2,.03);
  const R=['E2','E2','F2','E2','E2','G2','E2','F2'];
  for(let i=0;i<16;i++) tone(R[i%8],t+i*B/4,B*.2,{type:'sawtooth',vol:.05,cut:700,r:.05,dist:true,send:0});
  snare(t+B,.06); snare(t+B*3,.06); if(b%4===3) choir(['E4','F4','B4'],t+B*2,B*1.5,{vol:.03,a:.05,r:1}); }},
// 13 瓦力：溫暖的音樂盒、跳躍的撥奏貝斯
13:{bpm:100,beats:4,bar(b,t,B){ const C=[['C3','G3'],['A2','E3'],['F2','C3'],['G2','D3']][b%4];
  [[0,C[0]],[1,C[1]],[2,C[0]],[3,C[1]]].forEach(([s,n])=>pluck(n,t+s*B,{type:'sine',vol:.09,r:.3,cut:900}));
  const M=[['E6',0],['G6',.5],['C7',1],['G6',2],['A6',2.5]],M2=[['C7',0],['A6',1],['E6',2]],M3=[['F6',0],['A6',.5],['C7',1.5],['A6',2.5]],M4=[['G6',0],['D7',1],['B6',2],['G6',3]];
  [M,M2,M3,M4][b%4].forEach(([n,s])=>bell(n,t+s*B,{vol:.035,ratio:3,r:1})); }},
// 14 機械公敵：急促的弦樂頓音、軍鼓滾奏、銅管重擊
14:{bpm:112,beats:4,bar(b,t,B){ const R=[['C3','Eb3'],['C3','Eb3'],['Ab2','C3'],['G2','B2']][b%4];
  for(let i=0;i<16;i++) tone(R[i%2],t+i*B/4,B*.16,{type:'sawtooth',vol:.045,cut:1500,r:.05,det:[-5,5],send:.15});
  if(b%2===1) for(let i=0;i<8;i++) snare(t+B*2+i*B/8,.03+i*.006);
  if(b%4===0) brass(['C3','G3','C4'],t,B*.8,{vol:.06,a:.02}); kick(t,.3); kick(t+B*2,.25); }},
// 15 蝴蝶效應：憂傷的鋼琴琶音、大提琴般的低音長弦
15:{bpm:76,beats:4,bar(b,t,B){ const C=[['E3','B3','G4'],['C3','G3','E4'],['A2','E3','C4'],['B2','F#3','D#4']][b%4];
  [0,1,2,1,2,1,2,1].forEach((k,i)=>piano(C[k],t+i*B/2,{vol:.06,r:1.6}));
  tone(C[0].replace(/\d/,d=>+d-1),t,B*4,{type:'sawtooth',vol:.03,a:.8,r:1.2,cut:600,vib:4.5,vibd:8,send:.4}); }},
// 16 楚門的世界：極簡主義鋼琴，三對二的循環琶音，明亮而略帶不安
16:{bpm:84,beats:4,bar(b,t,B){ const C=[['A3','C4','E4'],['F3','A3','C4'],['C4','E4','G4'],['G3','B3','D4']][b%4];
  for(let i=0;i<12;i++) piano(C[i%3],t+i*B/3,{vol:.045,r:.7,cut:3200});
  for(let i=0;i<8;i++) piano(C[[0,2][i%2]].replace(/\d/,d=>+d+1),t+i*B/2,{vol:.03,r:.5});
  bass(C[0].replace(/\d/,d=>+d-1),t,B*4,{type:'sine',vol:.08,cut:400}); }},
// 17 明日邊界：軍鼓行進、低音合成器脈動、上揚的銅管
17:{bpm:100,beats:4,bar(b,t,B){ [0,.75,1,2,2.75,3].forEach(s=>snare(t+s*B,.05)); taiko(t,.3); taiko(t+B*2,.25);
  for(let i=0;i<8;i++) bass(['D2','D2','F2','C2'][b%4],t+i*B/2,B*.35,{vol:.08,cut:500});
  if(b%2===1) brass(['D3','A3','D4'],t+B,B*3,{vol:.045,a:.8}); }},
// 18 星際大戰：英雄式進行曲。銅管號角、軍鼓、定音鼓（原創旋律）
18:{bpm:104,beats:4,bar(b,t,B){ const H=[[['Bb3',0,1],['D4',1,.5],['F4',1.5,1.5],['D4',3,1]],[['Eb4',0,1.5],['G4',1.5,.5],['F4',2,2]],[['G4',0,1],['F4',1,.5],['Eb4',1.5,.5],['D4',2,1],['C4',3,1]],[['Bb3',0,1],['F4',1,1],['Bb4',2,2]]][b%4];
  H.forEach(([n,s,d])=>brass([n,n.replace(/\d/,x=>+x-1)],t+s*B,d*B*.92,{vol:.045,cut:2200}));
  const C=[['Bb2','F3'],['Eb3','Bb3'],['C3','G3'],['F2','C3']][b%4]; pad(C,t,B*4,{vol:.025,cut:1200,a:.3});
  [0,.5,.75,1,2,2.5,2.75,3].forEach(s=>snare(t+s*B,.035)); timp(C[0],t,.18); }},
// 19 記憶拼圖：倒放般漸強的長音（突然切斷）、稀疏鋼琴、低頻嗡鳴
19:{bpm:66,beats:4,bar(b,t,B){ const C=[['A3','E4'],['F3','C4'],['D3','A3'],['E3','B3']][b%4];
  C.forEach(n=>{ const g=ac.createGain(); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.05,t+B*3.6); g.gain.linearRampToValueAtTime(0,t+B*3.7);
    const o=ac.createOscillator(); o.type='triangle'; o.frequency.value=f(n); const fl=ac.createBiquadFilter(); fl.type='lowpass'; fl.frequency.value=1400; o.connect(fl).connect(g); out(g,.5); o.start(t); o.stop(t+B*3.8); });
  if(b%2) piano(['E5','C5','A5','B4'][b%4],t+B*.5,{vol:.05,r:3});
  tone('A1',t,B*4,{type:'sine',vol:.05,a:1,r:1,send:0}); }},
// 20 摩登時代：默片鋼琴。蹦蹦跳跳的拉格泰姆左手、俏皮旋律、略走音的酒館琴色
20:{bpm:132,beats:4,bar(b,t,B){ const C=[['C3','E3','G3'],['G2','D3','F3'],['F2','A2','C3'],['G2','B2','D3']][b%4];
  [0,1,2,3].forEach(s=>s%2? C.slice(1).forEach(n=>piano(n.replace(/\d/,d=>+d+1),t+s*B,{vol:.04,r:.25,det:[0,12]})) : piano(C[0],t+s*B,{vol:.07,r:.3}));
  const M=[['E5',0],['G5',.5],['C6',1],['B5',1.5],['A5',2],['G5',3]],M2=[['F5',0],['D5',.5],['B4',1],['D5',2],['F5',2.5],['G5',3.5]],M3=[['A5',0],['F5',1],['C5',1.5],['A4',2],['C5',3]],M4=[['B4',0],['D5',.5],['G5',1],['F5',2],['D5',2.5],['B4',3]];
  [M,M2,M3,M4][b%4].forEach(([n,s])=>piano(n,t+s*B,{vol:.06,r:.4,det:[0,14]})); }},
// 21 雨果的冒險：巴黎風情的手風琴圓舞曲（三拍）、時鐘滴答
21:{bpm:150,beats:3,bar(b,t,B){ const C=[['D3','F3','A3'],['A2','C#3','E3'],['G2','Bb2','D3'],['A2','C#3','G3']][b%4];
  piano(C[0],t,{vol:.07,r:.4}); [1,2].forEach(s=>C.slice(1).forEach(n=>piano(n,t+s*B,{vol:.035,r:.2})));
  const M=[['A4',0,1],['D5',1,1],['F5',2,1]],M2=[['E5',0,2],['C#5',2,1]],M3=[['D5',0,1],['Bb4',1,1],['G4',2,1]],M4=[['A4',0,3]];
  [M,M2,M3,M4][b%4].forEach(([n,s,d])=>tone(n,t+s*B,d*B*.9,{type:'square',vol:.03,a:.03,r:.15,cut:2000,det:[-12,12],vib:6,vibd:12,send:.3}));
  [0,1,2].forEach(s=>wood(t+s*B,.025,s?2600:1800)); }},
// 22 2001 太空漫遊：深沉的持續低音、緩慢膨脹的人聲音簇、遙遠的定音鼓
22:{bpm:48,beats:4,bar(b,t,B){ if(b%2===0){ tone('C1',t,B*8,{type:'sawtooth',vol:.05,a:3,r:3,cut:160,det:[-4,4],send:.4}); tone('C2',t,B*8,{type:'sine',vol:.06,a:3,r:3,send:.4}); }
  const cl=[['B3','C4','D4'],['C4','Db4','Eb4','E4'],['F#3','G3','Ab3'],['A3','Bb3','B3','C4']][b%4];
  choir(cl,t+B*.5,B*3.4,{vol:.025,a:B*2.6,r:2.5,vowel:[520,900]});
  if(b%4===3) timp('C2',t+B*3,.15); }}
};

function sched(){ if(!cfg) return; const B=60/cfg.bpm, len=B*cfg.beats;
  while(nextBar<ac.currentTime+1.2){ try{ cfg.bar(barIdx,nextBar,B); }catch(e){} nextBar+=len; barIdx++; } }

function play(n,ctx){
  if(!ctx||!S[n]) return; if(playingN===n&&cfg) return; stop(true);
  setup(ctx); cfg=S[n]; playingN=n; barIdx=0; nextBar=ac.currentTime+.15;
  master.gain.cancelScheduledValues(ac.currentTime); master.gain.setValueAtTime(master.gain.value,ac.currentTime); master.gain.linearRampToValueAtTime(.55,ac.currentTime+2.5);
  sched(); timer=setInterval(sched,250);
}
function stop(quick){
  clearInterval(timer); timer=null; cfg=null; playingN=0;
  if(!ac||!master) return;
  const now=ac.currentTime; master.gain.cancelScheduledValues(now); master.gain.setValueAtTime(master.gain.value,now); master.gain.linearRampToValueAtTime(0,now+(quick?.25:1.2));
  // 讓尚未播放的音符在淡出後自然結束；重新建立匯流排，避免殘音疊到下一部片
  const old=master; master=null; setTimeout(()=>{ try{old.disconnect();}catch(e){} },quick?400:1500);
}
return {play,stop,get playing(){return playingN;}};
})();
