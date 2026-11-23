"""印出某篇原文全文：python3 _src/tools/read_article.py 13"""
import json,sys
src=open('data.js',encoding='utf-8').read(); d=json.loads(src[src.index('['):src.rindex(']')+1])
a=next(x for x in d if x['n']==int(sys.argv[1]))
print(a['n'],a['title'],'|',a['author'],'| p.',a['p'],'| 電影：',a['film']['zh'],a['film']['year'])
for i,p in enumerate(a['paras']): print(f'[{i}] {p}')
