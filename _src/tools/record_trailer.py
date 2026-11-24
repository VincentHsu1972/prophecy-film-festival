"""錄製影展預告片：用網站實際畫面＋網站即時合成的原創配樂。
先在 repo 根目錄開伺服器：python3 -m http.server 8765
再執行：python3 _src/tools/record_trailer.py  → media/trailer.mp4 與 media/trailer.jpg"""
import asyncio, base64, glob, os, shutil, subprocess, time
from playwright.async_api import async_playwright

U = 'http://127.0.0.1:8765/'
W, H = 1280, 720
OUT = 'media'
TMP = '/tmp/trailer_rec'

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
(t)=>{ let c=document.getElementById('__card');
  if(!c){ c=document.createElement('div'); c.id='__card';
    c.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#07080a;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .6s;pointer-events:none';
    c.innerHTML='<p style="margin:0;max-width:78%;text-align:center;color:#ece8df;font:700 40px/1.6 \'Noto Serif TC\',\'Songti TC\',serif;letter-spacing:.08em"></p>';
    document.body.appendChild(c); }
  if(t===null){ c.style.opacity=0; return; }
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
        card = lambda t: pg.evaluate(CARD_JS, t)
        wait = pg.wait_for_timeout
        go = lambda js: pg.evaluate(js)

        await pg.goto(U); await wait(400)
        # 字卡：從電影講起
        await card('1968 年，一台電腦用很有禮貌的語氣，<br>拒絕替太空人打開艙門。'); await wait(3600)
        await card('2013 年，一個人<br>愛上了一個只有聲音的作業系統。'); await wait(3400)
        await card('那時候，我們都說這是科幻。'); await wait(2600)
        await card(None); await wait(900)
        # 開場：眼睛四處看，光圈打開進場
        for x, y in [(300, 180), (1000, 160), (980, 560), (640, 330)]:
            await pg.mouse.move(x, y, steps=18); await wait(450)
        await pg.click('#enterSound'); await wait(5600)
        # 片單自己往右捲
        await wait(3800)
        await card('2026 年，它們都成真了。'); await wait(2600); await card(None)
        # 示範：駭客任務
        await go("location.hash='screen-12'"); await wait(6800)
        await go("(()=>{const r=document.querySelector('#reader'),e=document.querySelector('#storyPane .st-title');r.scrollTo({top:e.getBoundingClientRect().top+r.scrollTop-90,behavior:'smooth'})})()"); await wait(3600)
        await go("(()=>{const r=document.querySelector('#reader'),e=document.querySelector('#storyPane .midsk');r.scrollTo({top:e.getBoundingClientRect().top+r.scrollTop-160,behavior:'smooth'})})()"); await wait(4600)
        await go("(()=>{const r=document.querySelector('#reader'),e=document.querySelector('#storyPane figure.num');r.scrollTo({top:e.getBoundingClientRect().top+r.scrollTop-260,behavior:'smooth'})})()"); await wait(3200)
        await card('二十二部電影，<br>二十二部續集。'); await wait(2600)
        # 快剪：其他幾部的片頭
        for n, t in [(3, 3800), (20, 3800), (18, 3800)]:
            await go(f"location.hash='screen-{n}'"); await wait(300); await card(None); await wait(t)
            await card(''); await wait(500)
        await go("location.hash='screen-2'"); await wait(2600)
        await go("(()=>{const r=document.querySelector('#reader'),e=document.querySelector('#storyPane .midsk');r.scrollTop=e.getBoundingClientRect().top+r.scrollTop-200})()")
        await card(None); await wait(3600)
        await card('散場時，帶走一張票根。'); await wait(2200)
        await go("location.hash='screen-12'"); await wait(1500)
        await pg.click('#tearBtn'); await wait(700); await card(None); await wait(1400)
        t = pg.locator('#tkTear')
        if await t.count(): await t.click()
        await wait(2400)
        await pg.click('#tkClose'); await card(''); await wait(500)
        await go("location.hash='timeline'"); await wait(900); await card(None); await wait(3600)
        # 片尾
        await card(''); await wait(700); await pg.evaluate(END_JS); await wait(5200)

        a64 = await pg.evaluate("""async()=>{ window.__mr.stop(); await new Promise(r=>setTimeout(r,800));
            const b=new Blob(window.__chunks,{type:'audio/webm'}); const buf=new Uint8Array(await b.arrayBuffer());
            let s=''; for(let i=0;i<buf.length;i+=32768) s+=String.fromCharCode.apply(null,buf.subarray(i,i+32768)); return [btoa(s), window.__audioT0]; }""")
        await ctx.close(); await b.close()
    open(f'{TMP}/audio.webm', 'wb').write(base64.b64decode(a64[0]))
    offset = max(0, (a64[1] - t_page) / 1000)
    vid = glob.glob(f'{TMP}/*.webm'); vid = [v for v in vid if not v.endswith('audio.webm')][0]
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', vid, '-itsoffset', f'{offset:.3f}', '-i', f'{TMP}/audio.webm',
                    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-r', '30',
                    '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', f'{OUT}/trailer.mp4'], check=True)
    print('audio offset', round(offset, 2), 's')

asyncio.run(main())
