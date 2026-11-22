import json,sys
sys.argv=['x','a16.wav'];exec(open('tb.py').read().split("if __name__")[0])
S=[(4.5,14.5),(13.5,25.0),(24.4,33.5),(32.8,42.5),(41.8,51.5),(50.8,60.5)]
out=[]
for s0,e in S:
    rows=[];x=s0+0.3
    while x<=e: rows.append([round(x,3),run(s0,x)]);x+=0.1
    out.append({'s0':s0,'rows':rows});print(s0,flush=True)
    json.dump(out,open('sect.json','w'),ensure_ascii=False)
