import cv2, numpy as np, sys
H,W=1920,1080
rng=np.random.default_rng(3)
# forberegnet: rasterprik-mønster (45° gitter) og papirtekstur
yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
u=(xx+yy)/np.sqrt(2);v=(xx-yy)/np.sqrt(2);P=7.0
dotd=np.sqrt(((u%P)-P/2)**2+((v%P)-P/2)**2)/(P/2)  # 0 i midten af prik .. ~1.4
paper=cv2.GaussianBlur(rng.normal(0,1,(H//4,W//4)).astype(np.float32),(0,0),1.2)
paper=cv2.resize(paper,(W,H));paper=(paper-paper.min())/(np.ptp(paper)+1e-6)
def comic(img):
    small=cv2.resize(img,(W//2,H//2),interpolation=cv2.INTER_AREA)
    sm=small
    for _ in range(2): sm=cv2.bilateralFilter(sm,7,40,5)
    # posterisering i LAB (lysstyrke i trin, farve bevaret)
    lab=cv2.cvtColor(sm,cv2.COLOR_BGR2LAB).astype(np.float32)
    L=lab[...,0]/255.0
    steps=7
    Lq=np.floor(L*steps+0.5)/steps
    lab[...,0]=np.clip((0.55*Lq+0.45*L)*255,0,255)
    lab[...,1:]=128+(lab[...,1:]-128)*1.18
    col=cv2.cvtColor(np.clip(lab,0,255).astype(np.uint8),cv2.COLOR_LAB2BGR)
    col=cv2.resize(col,(W,H),interpolation=cv2.INTER_CUBIC)
    # blæk-konturer: kombination af Canny og mørke adaptive kanter
    g=cv2.cvtColor(sm,cv2.COLOR_BGR2GRAY)
    e1=cv2.Canny(cv2.GaussianBlur(g,(3,3),0),45,120)
    e2=255-cv2.adaptiveThreshold(cv2.medianBlur(g,5),255,cv2.ADAPTIVE_THRESH_MEAN_C,cv2.THRESH_BINARY,11,6)
    e=cv2.bitwise_or(e1,cv2.bitwise_and(e2,cv2.dilate(e1,np.ones((5,5)))))
    e=cv2.resize(e,(W,H),interpolation=cv2.INTER_LINEAR).astype(np.float32)/255.0
    e=cv2.GaussianBlur(e,(3,3),0)
    # rasterprikker i mellem-skyggerne
    lum=cv2.cvtColor(col,cv2.COLOR_BGR2GRAY).astype(np.float32)/255.0
    shade=np.clip((0.5-lum)/0.4,0,1)*np.clip(lum/0.08,0,1)  # kun mellemskygger
    dots=(dotd< (0.25+0.75*shade)).astype(np.float32)*shade
    out=col.astype(np.float32)
    out*= (1-0.35*dots)[...,None]
    out*= (1-0.85*np.clip(e,0,1))[...,None]
    # papir + varm tone
    out*= (0.94+0.06*paper)[...,None]
    out=np.clip(out,0,255).astype(np.uint8)
    return out
if __name__=='__main__':
    for f in sys.argv[1:]:
        im=cv2.imread(f);o=comic(im);cv2.imwrite(f.replace('in/','out_'),o)
