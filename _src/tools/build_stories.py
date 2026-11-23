"""把 _src/stories/NN.md 編譯成網站用的 stories.js。在 repo 根目錄執行：python3 _src/tools/build_stories.py"""
import json,glob,re,os
S={}
for f in sorted(glob.glob('_src/stories/*.md')):
    n=int(os.path.basename(f)[:2]); raw=open(f,encoding='utf-8').read()
    meta={}; body=[]
    for line in raw.split('\n'):
        m=re.match(r'^(TITLE|STYLE|NOTE):\s*(.*)$',line)
        if m and not body: meta[m.group(1).lower()]=m.group(2)
        else: body.append(line)
    S[n]=dict(title=meta.get('title',''),style=meta.get('style',''),text='\n'.join(body).strip())
    if meta.get('note'): S[n]['note']=meta['note']
open('stories.js','w',encoding='utf-8').write('window.STORIES='+json.dumps(S,ensure_ascii=False).replace('</','<\\/')+';')
src=open('data.js',encoding='utf-8').read(); d=json.loads(src[src.index('['):src.rindex(']')+1])
for n,s in S.items():
    a=next(x for x in d if x['n']==n)
    orig=sum(len(p) for p in a['paras'] if not re.match(r'^(註解|圖 ?\d|資料來源)',p) and '｜' not in p)
    st=len(re.sub(r'\s','',re.sub(r'(?m)^NUM:.*$','',s['text'])))
    print(f"{n:02d} 原文 {orig} 字｜劇情 {st} 字｜{st/orig:.0%}")
