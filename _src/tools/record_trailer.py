"""錄製影展預告片（概念版）：播放 _src/trailer/stage.html 的分鏡，配上網站即時合成的原創配樂。
先在 repo 根目錄開伺服器：python3 -m http.server 8765
再執行：python3 _src/tools/record_trailer.py  → media/trailer.mp4 與 media/trailer.jpg"""
import asyncio, base64, glob, os, shutil, subprocess, sys, time
# 用法：record_trailer.py [舞台頁路徑] [輸出檔]，預設為影展總預告
STAGE = sys.argv[1] if len(sys.argv) > 1 else '_src/trailer/stage.html'
DEST = sys.argv[2] if len(sys.argv) > 2 else 'media/trailer.mp4'
from playwright.async_api import async_playwright

U = 'http://127.0.0.1:8765/'
W, H = 1280, 720
OUT = 'media'
TMP = '/tmp/trailer_rec_' + str(os.getpid())

# 把頁面裡所有送到喇叭的聲音，同時錄一份下來
AUDIO_TAP = r"""
(()=>{ const orig=AudioNode.prototype.connect;
  AudioNode.prototype.connect=function(dest,...r){ const out=orig.call(this,dest,...r);
    try{ if(dest instanceof AudioDestinationNode){ const ctx=dest.context;
      if(!ctx.__tap){ ctx.__tap=ctx.createMediaStreamDestination(); window.__chunks=[];
        const mr=new MediaRecorder(ctx.__tap.stream,{mimeType:'audio/webm;codecs=opus',audioBitsPerSecond:192000});
        mr.ondataavailable=e=>{ if(e.data.size) window.__chunks.push(e.data); }; mr.start(1000);
        window.__mr=mr; window.__audioT0=performance.timeOrigin+performance.now(); }
      orig.call(this,ctx.__tap); } }catch(e){}
    return out; }; })();
"""

CARD_JS = r"""
([t,bg])=>{ let c=document.getElementById('__card');
  if(!c){ c=document.createElement('div'); c.id='__card';
    c.style.cssText='position:fixed;inset:0;z-index:2147483647;background:radial-gradient(ellipse at 50% 50%,#15181b,#07080a 75%);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .6s;pointer-events:none;overflow:hidden';
    c.innerHTML='<div id="__bg" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"></div><div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(7,8,10,.55),rgba(7,8,10,.15) 70%)"></div><p style="position:relative;margin:0;max-width:78%;text-align:center;color:#ece8df;font:700 40px/1.6 \'Noto Serif TC\',\'Songti TC\',serif;letter-spacing:.08em;text-shadow:0 2px 18px rgba(0,0,0,.9)"></p>';
    document.body.appendChild(c); }
  if(t===null){ c.style.opacity=0; return; }
  const box=c.querySelector('#__bg'); const sk=n=>window.SKETCH?window.SKETCH(n):'';
  let html='', op=.34;
  if(bg&&bg.n) html=`<div style="width:58%">${sk(bg.n)}</div>`;
  if(bg&&bg.many) html=`<div style="display:grid;grid-template-columns:repeat(${bg.cols},1fr);gap:${bg.gap||28}px;width:${bg.w||86}%">${bg.many.map(n=>`<div>${sk(n)}</div>`).join('')}</div>`, op=bg.op||.26;
  if(bg&&bg.posters) html=`<div style="display:grid;grid-template-columns:repeat(11,1fr);gap:6px;width:96%">${bg.posters.map(n=>`<img src="img/poster/${String(n).padStart(2,'0')}.webp" style="width:100%;aspect-ratio:2/3;object-fit:cover;display:block">`).join('')}</div>`, op=.42;
  if(bg&&bg.logo) html='<img src="img/logo/mark-dark.svg" alt="" style="width:62%">', op=.22;
  if(bg!==undefined){ box.innerHTML=html; box.style.opacity=op; box.style.transition='none'; box.style.transform='scale(1)';
    box.querySelectorAll('svg').forEach(s=>{ s.style.cssText='width:100%;height:auto;overflow:visible'; });
    const els=[...box.querySelectorAll('.pn')];
    els.forEach((el,i)=>{ let L=300; try{L=Math.ceil(el.getTotalLength())||300}catch(e){} el.style.stroke='#ece8df'; el.style.strokeWidth='1.4'; el.style.fill='none';
      el.style.strokeDasharray=L; el.style.strokeDashoffset=L; el.style.transition=`stroke-dashoffset 1.6s cubic-bezier(.5,.1,.3,1) ${Math.round(i/Math.max(1,els.length)*1400)}ms`; });
    requestAnimationFrame(()=>requestAnimationFrame(()=>{ els.forEach(el=>el.style.strokeDashoffset=0); box.style.transition='transform 6s linear'; box.style.transform='scale(1.07)'; })); }
  c.querySelector('p').innerHTML=t; c.style.opacity=1; }
"""

END_JS = r"""
()=>{ const c=document.getElementById('__card'); const logo=document.querySelector('#gateLogo');
  c.querySelector('p').innerHTML='<img src="img/logo/mark-dark.svg" alt="" style="display:block;width:340px;margin:0 auto 22px">'
   +'<span style="display:block;font-size:54px;letter-spacing:.24em">預言成真影展</span>'
   +'<span style="display:block;font-size:26px;font-weight:500;margin-top:14px;color:#cfc9bd">十年前的「未來」，已經成了今天的日常。</span>'
   +'<span style="display:block;font:15px ui-monospace,Menlo,monospace;letter-spacing:.18em;margin-top:30px;color:#9b9890">vincenthsu1972.github.io/prophecy-film-festival</span>';
  c.style.opacity=1; }
"""

async def main():
    shutil.rmtree(TMP, ignore_errors=True); os.makedirs(TMP); os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--autoplay-policy=no-user-gesture-required'])
        ctx = await b.new_context(viewport={'width': W, 'height': H}, record_video_dir=TMP, record_video_size={'width': W, 'height': H}, device_scale_factor=1)
        await ctx.add_init_script(AUDIO_TAP)
        await ctx.add_init_script("try{localStorage.removeItem('dw-stubs');localStorage.removeItem('dw-sound')}catch(e){}")
        pg = await ctx.new_page(); t_page = time.time() * 1000
        await pg.goto(U + STAGE); await pg.wait_for_timeout(1500)
        await pg.evaluate('window.__start()')
        await pg.wait_for_function('window.__done===true', timeout=120000, polling=500)
        a64 = await pg.evaluate("""async()=>{ window.__mr.stop(); await new Promise(r=>setTimeout(r,800));
            const b=new Blob(window.__chunks,{type:'audio/webm'}); const buf=new Uint8Array(await b.arrayBuffer());
            let s=''; for(let i=0;i<buf.length;i+=32768) s+=String.fromCharCode.apply(null,buf.subarray(i,i+32768)); return [btoa(s), window.__audioT0]; }""")
        await ctx.close(); await b.close()
    open(f'{TMP}/audio.webm', 'wb').write(base64.b64decode(a64[0]))
    offset = max(0, (a64[1] - t_page) / 1000)
    vid = glob.glob(f'{TMP}/*.webm'); vid = [v for v in vid if not v.endswith('audio.webm')][0]
    trim = max(0, offset - 0.25) if 'sequel' in STAGE else 0   # 續集預告：剪掉載入素材的前置黑畫面，從配樂前 0.25 秒開始
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', f'{trim:.3f}', '-i', vid, '-itsoffset', f'{offset-trim:.3f}', '-i', f'{TMP}/audio.webm',
                    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-r', '30',
                    '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', DEST], check=True)
    print('audio offset', round(offset, 2), 's')

asyncio.run(main())
