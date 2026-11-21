import re, json, numpy as np, librosa
L=[(0.35,2.9,"Du går med tunge følelser"),(3.5,6.4,"Alle omkring dig er bare spøgelser"),(7.1,9.85,"Kan du ik' sig mig hvad du føler?"),(11.5,14.6,"Du så svær at gennemskue"),
(16.1,19.18,"Uh, for hun ville græde en sø for mig"),(19.44,21.1,"Jeg tror hun ku' dø for mig"),(21.38,25.96,"Jeg står inde på Sø og søger bitches, der ikk' hører mig"),
(26.78,29.7,"Ja, hvad er det jeg løber fra?"),(30.6,33.6,"For baby nu det sent igen, vi sent op laver scener"),(33.78,38.14,"Påvirket af følelser, siger for mange ting vi ikk' mener"),
(38.54,44.94,"Ved ik' hvad vi ligner, ved ik' hvorfor vi spilder de her timer"),(45.22,47.1,"For jeg var derude imens du lå i din seng"),(47.1,49.64,"Jeg søgte noget falsk imens vi havde noget ægte"),
(49.9,55.44,"Ringer til dig når klokken er 6, du siger jeg klam og kun tænker på sex"),(55.5,57.4,"Hun siger det fucked op den måde som jeg bær mig"),(57.44,60.0,"Fucked op jeg skrider hver gang jeg burde være der")]
y,sr=librosa.load('vocals.wav',sr=22050,duration=61); hop=220; dt=hop/sr
e=librosa.feature.rms(y=y,frame_length=1024,hop_length=hop)[0]
ons=librosa.onset.onset_detect(y=y,sr=sr,hop_length=256,backtrack=True,units='time')
syl=lambda w:max(1,len(re.findall(r'[aeiouyæøå]+',w.lower())))
out=[]
for a,b,txt in L:
    ws=txt.split(); i0,i1=int(a/dt),int(b/dt); seg=e[i0:i1]
    act=seg>max(np.percentile(seg,25),seg.max()*.12)
    t_act=np.array([a+k*dt for k in range(len(seg)) if act[k]])
    S=np.array([syl(w) for w in ws],float); cum=np.concatenate([[0],np.cumsum(S)])[:-1]/S.sum()
    line=[]
    for w,c in zip(ws,cum):
        t=t_act[min(int(c*len(t_act)),len(t_act)-1)] if len(t_act) else a+c*(b-a)
        near=ons[(ons>a-.05)&(ons<b)]
        if len(near):
            k=near[np.argmin(abs(near-t))]
            if abs(k-t)<.2: t=k
        line.append([w,round(float(t),2)])
    line[0][1]=round(min(line[0][1],a+.05),2)
    for j in range(1,len(line)): line[j][1]=max(line[j][1],line[j-1][1]+.08)
    out.append(line)
json.dump(out,open('words.json','w'),ensure_ascii=False)
for l in out: print(' '.join(f'{w}@{t}' for w,t in l))
