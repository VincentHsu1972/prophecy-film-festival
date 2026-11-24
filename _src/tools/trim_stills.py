"""把原文插圖從雜誌頁面裁出來：去掉大片留白與淡化的頁面文字，只留照片／圖表本體。
多張分散的照片會並排重組。用法：python3 _src/tools/trim_stills.py 來源資料夾 → 覆寫 img/still/ 並印出新尺寸"""
import sys, numpy as np
from PIL import Image
from scipy import ndimage as nd
SRC=sys.argv[1] if len(sys.argv)>1 else 'img/still'
def boxes(im):
    a=np.asarray(im).astype(int); h,w,_=a.shape
    border=np.concatenate([a[0],a[-1],a[:,0],a[:,-1]]); paper=np.median(border,0)
    diff=np.abs(a-paper).max(2); m=diff>60
    m=nd.binary_closing(m,np.ones((9,9)),iterations=2); m=nd.binary_opening(m,np.ones((3,3)))
    lab,n=nd.label(nd.binary_dilation(m,np.ones((25,25))))
    out=[]
    for sl in nd.find_objects(lab):
        y0,y1,x0,x1=sl[0].start,sl[0].stop,sl[1].start,sl[1].stop
        sub=m[y0:y1,x0:x1]; ys,xs=np.where(sub)
        if len(ys)==0: continue
        y0,y1,x0,x1=y0+ys.min(),y0+ys.max()+1,x0+xs.min(),x0+xs.max()+1
        if (y1-y0)*(x1-x0)>0.012*h*w: out.append([x0,y0,x1,y1])
    return out,paper,(w,h)
res={}
for i in range(1,23):
    p=f'{SRC}/{i:02d}.webp'; im=Image.open(p).convert('RGB'); bs,paper,(w,h)=boxes(im)
    if not bs: res[i]=(w,h,'keep'); im.save(f'img/still/{i:02d}.webp',quality=88); continue
    U=[min(b[0] for b in bs),min(b[1] for b in bs),max(b[2] for b in bs),max(b[3] for b in bs)]
    ua=(U[2]-U[0])*(U[3]-U[1]); sa=sum((b[2]-b[0])*(b[3]-b[1]) for b in bs)
    pad=14
    if i in {2,16}:  # 這兩張本來就是滿版圖表，維持原圖
        im.save(f"img/still/{i:02d}.webp",quality=88); res[i]=(w,h,"keep"); continue
    NOCOMP=set()
    if len(bs)>=2 and ua>1.7*sa and i not in NOCOMP:
        bs.sort(key=lambda b:b[0]); H=max(b[3]-b[1] for b in bs)
        crops=[im.crop(tuple(b)) for b in bs]; crops=[c.resize((round(c.width*H/c.height),H),Image.LANCZOS) for c in crops]
        W=sum(c.width for c in crops)+pad*(len(crops)+1); out=Image.new('RGB',(W,H+2*pad),tuple(int(v) for v in paper))
        x=pad
        for c in crops: out.paste(c,(x,pad)); x+=c.width+pad
        tag=f'compose{len(bs)}'
    elif ua<0.8*w*h:
        out=im.crop((max(0,U[0]-pad),max(0,U[1]-pad),min(w,U[2]+pad),min(h,U[3]+pad))); tag='crop'
    else: out=im; tag='keep'
    out.save(f'img/still/{i:02d}.webp',quality=88); res[i]=(out.width,out.height,tag)
for k,v in res.items(): print(k,v)
