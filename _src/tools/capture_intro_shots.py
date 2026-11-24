"""重新截取簡報用的網站畫面（需要 playwright 與 Chrome）。
先在 repo 根目錄開伺服器：python3 -m http.server 8765
再執行：python3 _src/tools/capture_intro_shots.py  → 覆寫 intro/img/*.jpg"""
import asyncio,os,shutil
from playwright.async_api import async_playwright
from PIL import Image
U='http://127.0.0.1:8765/index.html'; T='/tmp/cap_'
CHROME=next((p for p in ['/usr/bin/google-chrome',shutil.which('google-chrome') or '',shutil.which('chromium') or ''] if p and os.path.exists(p)),None)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(**({'executable_path':CHROME} if CHROME else {}))
        pg=await b.new_page(viewport={'width':1440,'height':900})
        go=lambda js:pg.evaluate(js)
        await pg.goto(U); await pg.wait_for_timeout(2000); await pg.screenshot(path=T+'gate.png')
        await pg.click('#enterMute'); await pg.wait_for_timeout(6500); await pg.screenshot(path=T+'lobby.png')
        # 片頭：素描描線＋片名出場（銀翼殺手）
        await go("location.hash='screen-3'"); await pg.wait_for_timeout(5600); await pg.screenshot(path=T+'open.png')
        # 劇情版：雲端情人（暖色調＋中場插圖）、駭客任務（綠色調＋數據大字卡）
        await go("location.hash='screen-12'"); await pg.wait_for_timeout(3000)
        await go("const r=document.querySelector('#reader'),e=document.querySelector('#storyPane .st-title');r.scrollTop=e.getBoundingClientRect().top+r.scrollTop-120"); await pg.wait_for_timeout(1500); await pg.screenshot(path=T+'story0.png')
        await go("location.hash='screen-2'"); await pg.wait_for_timeout(3000)
        await pg.locator('#storyPane .midsk').scroll_into_view_if_needed(); await go("document.querySelector('#reader').scrollBy(0,-240)"); await pg.wait_for_timeout(4500); await pg.screenshot(path=T+'story.png')
        await go("location.hash='screen-12'"); await pg.wait_for_timeout(3000)
        await pg.locator('#storyPane figure.num').first.scroll_into_view_if_needed(); await go("document.querySelector('#reader').scrollBy(0,-300)"); await pg.wait_for_timeout(2500); await pg.screenshot(path=T+'story2.png')
        # 原文版：電影場景 vs 2026、影評、片尾推薦
        await go("location.hash='screen-12'"); await pg.wait_for_timeout(3000)
        await go("const r=document.querySelector('#reader');r.scrollTop=document.getElementById('modebar').offsetTop-60"); await pg.wait_for_timeout(900); await pg.screenshot(path=T+'mode.png')
        await pg.click('#modebar [data-m="orig"]'); await pg.wait_for_timeout(900)
        await go("document.querySelector('#reader').scrollTop=innerHeight-56"); await pg.wait_for_timeout(1200); await pg.screenshot(path=T+'vs.png')
        await go("const r=document.querySelector('#reader');r.scrollTop=document.getElementById('sReview').offsetTop-70"); await pg.wait_for_timeout(1200); await pg.screenshot(path=T+'review.png')
        await go("const r=document.querySelector('#reader');r.scrollTop=document.querySelector('.related').offsetTop-80"); await pg.wait_for_timeout(800); await pg.screenshot(path=T+'related.png')
        await pg.evaluate("document.getElementById('tearBtn').click()"); await pg.wait_for_timeout(1300)
        t=pg.locator('#tkTear')
        if await t.count(): await pg.evaluate("document.getElementById('tkTear').click()"); await pg.wait_for_timeout(1000)
        await pg.screenshot(path=T+'ticket.png')
        await pg.evaluate("document.getElementById('tkClose').click()"); await go("location.hash='timeline'"); await pg.wait_for_timeout(4200); await pg.screenshot(path=T+'timeline.png')
        await b.close()
    for n in ['gate','lobby','open','vs','review','related','ticket','story0','story','story2','mode']:
        Image.open(T+n+'.png').convert('RGB').save(f'intro/img/{n}.jpg',quality=78)
    Image.open(T+'timeline.png').convert('RGB').crop((0,330,1440,850)).save('intro/img/timeline.jpg',quality=80)
    print('OK')
asyncio.run(main())
