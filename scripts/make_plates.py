import cv2, numpy as np
from PIL import Image, ImageFilter
A='/workspace/beyond-assets/'; O='/workspace/beyondwatches/public/plates/'; P='/workspace/plates-preview/'
import os, glob
for f in glob.glob(O+'*'): os.remove(f)
K=1.25
def R(*a): return tuple(int(v*K) for v in a)
def inpaint(img, rects, r=9):
    m=np.zeros(img.shape[:2],np.uint8)
    for x0,y0,x1,y1 in rects: m[y0:y1,x0:x1]=255
    return cv2.inpaint(img,m,r,cv2.INPAINT_TELEA)
def grade(img, mode):
    f=img.astype(np.float32)/255.0
    lum=(0.114*f[...,0]+0.587*f[...,1]+0.299*f[...,2])[...,None]
    h=f.shape[0]
    if mode=='night_h':
        out=(lum*0.62)*np.array([1.2,1.0,0.86]); out=out**1.05
    elif mode=='night':
        out=(lum*0.40)*np.array([1.18,0.98,0.85]); out=out**1.12
    elif mode=='twilight':
        out=(lum*0.85)*np.array([0.55,0.82,1.15])*0.82+f*0.18*np.array([0.5,0.7,1.0]); out=out**1.1
    elif mode=='day':
        out=(lum*1.12+0.04)*np.array([1.20,1.03,0.88])*0.85+f*0.15
    else: out=f
    return (np.clip(out,0,1)*255).astype(np.uint8)
def save(img,name,alpha=None):
    rgb=cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
    im=Image.fromarray(rgb)
    if alpha is not None: im.putalpha(Image.fromarray(alpha))
    for w,q in [(1600,74),(900,70)]:
        r=im.resize((w,int(im.height*w/im.width)),Image.LANCZOS).filter(ImageFilter.UnsharpMask(2,35,2))
        r.save(O+f'{name}-{w}.webp','WEBP',quality=q,method=6)
    prev=Image.new('RGB',im.size,(255,0,255)); prev.paste(im,(0,0),im if alpha is not None else None); prev.save(P+name+'.jpg',quality=80)

# Landing with transparent sky (sky is drawn live in CSS)
d=cv2.imread(A+'scene_day.jpg')
x0,y0,x1,y1=R(440,495,585,568)
src=d[y0:y1,x0-int(150*K):x1-int(150*K)].copy()
m=np.zeros((y1-y0,x1-x0),np.float32); m[8:-8,8:-8]=1; m=cv2.GaussianBlur(m,(31,31),0)[...,None]
d[y0:y1,x0:x1]=(d[y0:y1,x0:x1]*(1-m)+src*m).astype(np.uint8)
land=d[int(132*K):,:].copy()
H,W=land.shape[:2]
b,g,r=[land[...,i].astype(int) for i in range(3)]
lum=(0.11*b+0.59*g+0.3*r)
sky=((b-r)>2)&(lum>88)
yy=np.arange(H)[:,None]*np.ones((1,W))
horizon=int((398*K)-132*K)   # sea/horizon line row
sky=sky&(yy<horizon)
sky[:int(0.35*H),:]=True
sky[:int(0.572*H),:int(0.226*W)]=True
x0,x1=int(0.2*W),int(0.31*W); y1=int(0.565*H)
sub=(lum[:y1,x0:x1]>60)&((b-r)[:y1,x0:x1]>-6)
sky[:y1,x0:x1]|=sub
sky[int(0.572*H):,:]=False
m=(sky*255).astype(np.uint8)
m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
alpha=255-cv2.GaussianBlur(m,(5,5),0)
# luminance key for the treeline: bright sky fringes become transparent, dark palms stay
key=np.clip((138-lum)/30.0,0,1)
sx0,sy0,sx1,sy1=R(585,372,720,412); key[sy0-int(132*K):sy1-int(132*K),sx0:sx1]=1
key[:, :int(0.2*W)]=np.where(yy[:, :int(0.2*W)]<horizon,0,1)
zone=(yy<horizon)&(yy>int(0.30*H))
alpha=np.where(zone,np.minimum(alpha,(key*255)).astype(np.uint8),alpha).astype(np.uint8)
# soften alpha: haze band at horizon
for t in ['day','twilight','night']:
    save(grade(land,t if t!='day' else 'none'),f'landing_{t}',alpha)
# Hangar + Puss Moth
s=cv2.imread(A+'scene_sunset.jpg')
air=s[int(120*K):int(572*K),int(418*K):int(1021*K)]
for t in ['day','twilight','night']:
    save(grade(air,{'twilight':'none','night':'night_h'}.get(t,t)),f'hangar_{t}')
# Watch reveal
for t,n in [('day','reveal_day.jpg'),('twilight','reveal_sunset.jpg'),('night','reveal_night.jpg')]:
    rr=cv2.imread(A+n); rr=inpaint(rr,[R(0,508,640,576)],9)
    save(rr[int(62*K):int(540*K),:],'watch_'+t)
print('ok')
