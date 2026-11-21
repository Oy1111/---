import json, numpy as np, librosa
y,sr=librosa.load('vocals.wav',sr=22050,duration=62)
ons=librosa.onset.onset_detect(y=y,sr=sr,hop_length=128,backtrack=True,units='time',delta=.04)
lines=[]
for ln in open('manual.txt',encoding='utf8'):
    ln=ln.strip()
    if not ln: continue
    ws=[]
    for p in ln.split('|'):
        w,t=p.rsplit(' ',1);t=float(t)
        k=ons[np.argmin(abs(ons-t))]
        if abs(k-t)<=.07: t=float(k)
        ws.append([w,round(t,3)])
    lines.append(ws)
B=json.load(open('beats.json'))
open('../site/tdata.js','w').write('const LINES='+json.dumps(lines,ensure_ascii=False)+';\nconst BEATS='+json.dumps(B)+';\n')
for l in lines: print(' '.join(f'{w}@{t:.2f}' for w,t in l))
