import json,sys
sys.argv=['x','a16.wav'];exec(open('tb.py').read().split("if __name__")[0])
S=[(14.9,24.6),(24.3,34.6),(34.2,43.6),(43.3,52.4),(51.9,58.8)]
out=[]
for s0,e in S:
    rows=[];x=s0+0.3
    while x<=e: rows.append([round(x,3),run(s0,x)]);x+=0.1
    out.append({'s0':s0,'rows':rows});print(s0,flush=True)
    json.dump(out,open('sect.json','w'),ensure_ascii=False)
