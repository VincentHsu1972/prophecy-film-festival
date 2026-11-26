"""產生 s/NN.html：每部片的分享落地頁（帶社群預覽 og 標籤，打開後立刻轉到該片）。"""
import json,re,html
BASE='https://vincenthsu1972.github.io/prophecy-film-festival/'
src=open('data.js',encoding='utf-8').read(); D=json.loads(src[src.index('['):src.rindex(']')+1])
st=open('stories.js',encoding='utf-8').read(); S=json.loads(st[st.index('{'):st.rindex('}')+1])
app=open('app.js',encoding='utf-8').read(); hk=re.search(r'const HOOK=(\{.*?\});',app,re.S).group(1)
H={int(k):v for k,v in json.loads(hk).items()}
for a in D:
    n=a['n']; t=S[str(n)]['title']; seq=t[t.index('：')+1:] if '：' in t else t
    title=f"《{a['film']['zh']}》續集：{seq}｜預言成真影展"; desc=H.get(n,'')
    e=html.escape; url=f'{BASE}s/{n:02d}.html'; img=f'{BASE}img/og/{n:02d}.jpg'
    open(f's/{n:02d}.html','w',encoding='utf-8').write(f'''<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8">
<title>{e(title)}</title><meta name="description" content="{e(desc)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="預言成真影展"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:url" content="{url}"><meta property="og:image" content="{img}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{e(title)}"><meta name="twitter:description" content="{e(desc)}"><meta name="twitter:image" content="{img}">
<meta http-equiv="refresh" content="0;url=../#screen-{n}"><link rel="canonical" href="{url}">
</head><body style="background:#07080a;color:#ece8df;font-family:sans-serif"><script>location.replace('../#screen-{n}')</script><p><a href="../#screen-{n}" style="color:#ece8df">進場觀看 {e(title)}</a></p></body></html>''')
print('ok',len(D),list(H.items())[:1])
