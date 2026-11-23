"""重新截取簡報用的網站畫面（需要 playwright 與 Chrome）。
先在 repo 根目錄開伺服器：python3 -m http.server 8765
再執行：python3 _src/tools/capture_intro_shots.py  → 覆寫 intro/img/*.jpg"""
import asyncio
from playwright.async_api import async_playwright
from PIL import Image
U='http://127.0.0.1:8765/index.html'; T='/tmp/cap_'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':1440,'height':900})
        await pg.goto(U); await pg.wait_for_timeout(2000); await pg.screenshot(path=T+'gate.png')
        await pg.click('#enterMute'); await pg.wait_for_timeout(4800); await pg.screenshot(path=T+'lobby.png')
        await pg.evaluate("location.hash='screen-3'"); await pg.wait_for_timeout(3200); await pg.screenshot(path=T+'open.png')
        await pg.evaluate("document.querySelector('#reader').scrollTop=innerHeight-56"); await pg.wait_for_timeout(1200); await pg.screenshot(path=T+'vs.png')
        await pg.click('#modebar [data-m=\"orig\"]'); await pg.wait_for_timeout(500)
        await pg.evaluate("const r=document.querySelector('#reader');r.scrollTop=document.getElementById('sReview').offsetTop-70"); await pg.wait_for_timeout(1200); await pg.screenshot(path=T+'review.png')
        await pg.evaluate("const r=document.querySelector('#reader');r.scrollTop=document.querySelector('.related').offsetTop-80"); await pg.wait_for_timeout(800); await pg.screenshot(path=T+'related.png')
        await pg.click('#tearBtn'); await pg.wait_for_timeout(1300)
        t=pg.locator('#tkTear')
        if await t.count(): await t.click(); await pg.wait_for_timeout(1000)
        await pg.screenshot(path=T+'ticket.png')
        await pg.click('#tkClose'); await pg.evaluate("location.hash='timeline'"); await pg.wait_for_timeout(4200); await pg.screenshot(path=T+'timeline.png')
        await b.close()
    for n in ['gate','lobby','open','vs','review','related','ticket']:
        Image.open(T+n+'.png').convert('RGB').save(f'intro/img/{n}.jpg',quality=78)
    Image.open(T+'timeline.png').convert('RGB').crop((0,330,1440,850)).save('intro/img/timeline.jpg',quality=80)
    print('OK')
asyncio.run(main())
