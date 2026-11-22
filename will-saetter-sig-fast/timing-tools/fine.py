import sys,json;sys.argv=['x','a16.wav'];exec(open('tb.py').read().split("if __name__")[0])
import numpy as np
out=[]
for x in np.arange(14.5,78.0,0.1):
    out.append([round(float(x),2),run(x,x+0.8)])
    if len(out)%20==0: json.dump(out,open('fine.json','w'),ensure_ascii=False);print(x,flush=True)
json.dump(out,open('fine.json','w'),ensure_ascii=False)
