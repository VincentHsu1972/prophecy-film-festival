"""把 intro/ 打包成可離線播放的單一 HTML（CSS/JS/圖片全內嵌）。
在 repo 根目錄執行：python3 _src/tools/build_intro_single.py  → 產生 預言成真影展_三分鐘介紹.html"""
import re,base64,io
from PIL import Image
h=open('intro/index.html',encoding='utf-8').read()
css=open('intro/deck.css',encoding='utf-8').read();
css=re.sub(r'url\("\.\./fonts/([^"]+)"\)',lambda m:'url("data:font/woff2;base64,'+base64.b64encode(open('fonts/'+m.group(1),'rb').read()).decode()+'")',css)
js=open('intro/deck.js',encoding='utf-8').read()
h=re.sub(r'<meta http-equiv="Content-Security-Policy"[^>]*>\n','',h)
h=re.sub(r'<link rel="stylesheet" href="deck.css[^"]*">',lambda m:'<style>\n'+css+'\n</style>',h)
import os
def inl(m):
    p=os.path.normpath(os.path.join('intro',m.group(1).split('?')[0]))
    return '<script>\n'+open(p,encoding='utf-8').read().replace('</script','<\\/script')+'\n</script>'
h=re.sub(r'<script src="([^"]+)"></script>',inl,h)
def emb(m):
    im=Image.open('intro/'+m.group(1)).convert('RGB'); im.thumbnail((1440,1440)); b=io.BytesIO(); im.save(b,'JPEG',quality=72)
    return 'src="data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode()+'"'
h=re.sub(r'src="(img/[^"]+)"',emb,h)
h=re.sub(r'src="\.\./(img/[^"]+\.svg)"',lambda m:'src="data:image/svg+xml;base64,'+base64.b64encode(open(m.group(1),'rb').read()).decode()+'"',h)
h=re.sub(r'href="\.\./(img/[^"]+\.svg)"',lambda m:'href="data:image/svg+xml;base64,'+base64.b64encode(open(m.group(1),'rb').read()).decode()+'"',h)
h=h.replace('src="../media/trailer.mp4"','src="data:video/mp4;base64,'+base64.b64encode(open('media/trailer.mp4','rb').read()).decode()+'"')
h=h.replace('poster="../media/trailer.jpg"','poster="data:image/jpeg;base64,'+base64.b64encode(open('media/trailer.jpg','rb').read()).decode()+'"')
h=h.replace('<a class="btn" href="../">','<a class="btn" href="https://vincenthsu1972.github.io/prophecy-film-festival/">')
open('預言成真影展_三分鐘介紹.html','w',encoding='utf-8').write(h); print('OK',len(h)//1024,'KB')
