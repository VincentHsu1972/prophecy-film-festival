"""輸出社群分享預覽圖 img/og/site.jpg 與 img/og/01..22.jpg（1200×630）。需先在 repo 根目錄開 http.server 8765。"""
# 需要 Noto Serif TC：cd /tmp/fnt && npm i @fontsource/noto-serif-tc && python3 -m http.server 8766
import asyncio
from playwright.async_api import async_playwright
from PIL import Image
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
    pg=await b.new_page(viewport={'width':1200,'height':630})
    for n in [0]+list(range(1,23)):
        await pg.goto(f'http://127.0.0.1:8765/_src/og/og.html?n={n}'); await pg.wait_for_timeout(1800)
        out='site' if n==0 else f'{n:02d}'; await pg.screenshot(path=f'/tmp/og_{out}.png')
        Image.open(f'/tmp/og_{out}.png').convert('RGB').save(f'img/og/{out}.jpg',quality=86,optimize=True)
    await b.close()
asyncio.run(m())
