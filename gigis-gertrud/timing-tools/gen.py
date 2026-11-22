# Bygger src/data/timing.ts ud fra words_gt.txt (lydtid) + chunk-markup
import json, re, numpy as np, librosa
OFF=6.0
y,sr=librosa.load('vocals.wav',sr=22050,duration=62)
ons=librosa.onset.onset_detect(y=y,sr=sr,hop_length=128,backtrack=True,units='time',delta=.04)
lines=[];chunks=[]
for raw in open('words_gt.txt',encoding='utf8'):
    raw=raw.rstrip('\n')
    if not raw.strip() or raw.startswith('#'): continue
    style='normal'
    m=re.match(r'^\{(\w+)\}',raw)
    if m: style=m.group(1);raw=raw[m.end():]
    li=[];cur=[]
    for part in raw.split('|'):
        part=part.strip()
        if part=='/':
            chunks.append({'li':len(lines),'style':style,'words':cur});cur=[];continue
        w,t=part.rsplit(' ',1);t=float(t);key=w.startswith('*');w=w.lstrip('*')
        k=ons[np.argmin(abs(ons-t))]
        if abs(k-t)<=.06: t=float(k)
        wd={'w':w,'t':round(t-OFF-0.03,3),'key':key};li.append(wd);cur.append(wd)
    if cur: chunks.append({'li':len(lines),'style':style,'words':cur})
    lines.append(li)
sc=json.load(open('scenes.json'))
OUTRO=sc[-1][0]
for c in chunks: c['t0']=c['words'][0]['t']
for i,c in enumerate(chunks):
    nx=chunks[i+1] if i+1<len(chunks) else None
    last=c['words'][-1]['t']
    c['t1']=round(min(nx['t0']-0.02,last+1.4) if nx else last+1.2,3)
    c['t1']=min(c['t1'],OUTRO-0.05)
    if c['style']=='stack':
        rows=[];r=[]
        for w in c['words']:
            r.append(w)
            if w['w'].lower().startswith('op'): rows.append(r);r=[]
        if r: rows.append(r)
        c['rows']=rows
B=[round(b-OFF,3) for b in json.load(open('beats.json')) if b>=OFF]

hits=json.load(open('hits.json'))
def wt(li,word):
    return [w['t'] for w in lines[li] if re.sub(r"[^a-zæøå0-9-]",'',w['w'].lower())==word][0]
def wts(li,word): return [w['t'] for w in lines[li] if re.sub(r"[^a-zæøå0-9-]",'',w['w'].lower())==word]
H=[]
for h in hits:
    li,w,s=h[0],h[1],h[2];ts_=wts(li,w)
    if not ts_: print('MANGLER',h);continue
    if len(h)>3 and h[3]=='all': H+= [[x,s] for x in ts_]
    else: H.append([ts_[h[3] if len(h)>3 else 0],s])
F=[[wt(li,w),s,d] for li,w,s,d in json.load(open('flashes.json'))]
D=[[s[0],0.1] for s in sc[1:]]
ts=f'''// AUTO-GENERERET af gen.py – ordtider i videotid (sek). Lyd-offset {OFF}s.
export type Word = {{ w: string; t: number; key: boolean }};
export type Chunk = {{ li: number; style: string; words: Word[]; t0: number; t1: number; rows?: Word[][] }};
export const LINES: Word[][] = {json.dumps(lines,ensure_ascii=False)};
export const CHUNKS: Chunk[] = {json.dumps(chunks,ensure_ascii=False)};
export const BEATS: number[] = {json.dumps(B)};
export const HITS: [number, number][] = {json.dumps(H)};
export const FLASHES: [number, number, number][] = {json.dumps(F)};
export const DIPS: [number, number][] = {json.dumps(D)};
export const SCENES: [number, string, number][] = {json.dumps(sc,ensure_ascii=False)};
const norm = (s: string) => s.toLowerCase().replace(/[^a-zæøå0-9-]/g, "");
export const wordTimes = (line: number, word: string) => (line >= 0 ? LINES[line].filter((w) => norm(w.w) === word).map((w) => w.t) : []);
export const lineOf = (line: number) => (line >= 0 ? LINES[line] : []);
'''
open('/home/user/---/gigis-gertrud/src/data/timing.ts','w').write(ts)
print('lines',len(lines),'chunks',len(chunks))
