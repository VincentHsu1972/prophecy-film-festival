"""輸出 IG 限時動態圖 img/story/site.jpg 與 01..22.jpg（1080×1920）。
需在 repo 根目錄開 http.server 8765，並在 /tmp/fnt（npm i @fontsource/noto-serif-tc）開 http.server 8766。"""
import asyncio
from playwright.async_api import async_playwright
from PIL import Image
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
    pg=await b.new_page(viewport={'width':1080,'height':1920})
    for n in [0]+list(range(1,23)):
        await pg.goto(f'http://127.0.0.1:8765/_src/og/story.html?n={n}'); await pg.wait_for_timeout(2200)
        out='site' if n==0 else f'{n:02d}'; await pg.screenshot(path=f'/tmp/st_{out}.png')
        Image.open(f'/tmp/st_{out}.png').convert('RGB').save(f'img/story/{out}.jpg',quality=84,optimize=True)
    await b.close()
asyncio.run(m())
