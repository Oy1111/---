import sys,re;sys.argv=['x','a16.wav'];exec(open('tb.py').read().split("if __name__")[0])
for raw in open('words_lm.txt',encoding='utf8'):
    raw=re.sub(r'^\{\w+\}','',raw.strip())
    for p in raw.split('|'):
        p=p.strip()
        if p=='/' or not p: continue
        w,t=p.rsplit(' ',1);t=float(t)
        print(f'{t:6.2f} {w.lstrip("*"):14s} -> {run(t-0.03,t+0.7)}',flush=True)
