import json,sys
sys.argv=['x','a16.wav'];exec(open('tb.py').read().split("if __name__")[0])
L=[(0.3,"Du går med tunge følelser"),(3.4,"Alle omkring dig er bare spøgelser"),(7.0,"Kan du ik sig mig hvad du føler"),(11.3,"Du så svær at gennemskue"),
(16.0,"Uh for hun ville græde en sø for mig"),(19.35,"Jeg tror hun ku dø for mig"),(21.3,"Jeg står inde på Sø og søger bitches der ikk hører mig"),
(26.7,"Ja hvad er det jeg løber fra"),(30.5,"For baby nu det sent igen vi sent op laver scener"),(33.7,"Påvirket af følelser siger for mange ting vi ikk mener"),
(38.45,"Ved ik hvad vi ligner ved ik hvorfor vi spilder de her timer"),(45.1,"For jeg var derude imens du lå i din seng"),(47.0,"Jeg søgte noget falsk imens vi havde noget ægte"),
(49.8,"Ringer til dig når klokken er 6 du siger jeg klam og kun tænker på sex"),(55.3,"Hun siger det fucked op den måde som jeg bær mig"),(57.3,"Fucked op jeg skrider hver gang jeg burde være der"),(60.3,"END")]
out=[]
for i in range(len(L)-1):
    s0=L[i][0]-0.12;e=L[i+1][0]+0.35;rows=[];x=s0+0.35
    while x<=e: rows.append([round(x,3),run(s0,x)]);x+=0.12
    out.append({'line':L[i][1],'s0':s0,'rows':rows});print(i,L[i][1],len(rows),flush=True)
    json.dump(out,open('prefix.json','w'),ensure_ascii=False)
