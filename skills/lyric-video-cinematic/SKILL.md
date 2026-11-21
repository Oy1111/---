---
name: "lyric-video-cinematic"
description: "Lyric-video v2 (TikTok 9:16) i semi-realistisk 2,5D-stil: lys, dis, skygger, dybdeskarphed, ord-for-ord-tekst og et bogstaveligt billede pr. frase, der fortæller sangens historie."
---

# Lyric-video v2 — cinematisk 2,5D

Korte lyric-videoer til danske rappere i stil med MusikFraFloor-videoerne. Stadig 2D bygget i kode (HTML canvas → MP4), men det skal ligne et maleri/film: lys, atmosfære, dybde og tekstur — ikke flade vektorfigurer. Svar på dansk. Brug v1-skillen `lyric-video` til den flade, legende stil.

## Input
Lydklip (15–60 s), kunstnernavn, sangtekst (linje for linje). Mangler teksten, laves et udkast med v1-skillens Whisper-pipeline (vokal-separation + whisper-medium) — kun til brugerens/kundens egne sange; skriv ikke tekst ud til udgivne numre af andre. Standard-outro: titel + kunstner + en filmisk afslutning (ingen "ude snart" medmindre brugeren beder om det).

## 1. Lyd → tidslinje (ord-niveau)
1. Vokal-separation (spleeter 2-stems via sherpa-onnx, se v1-skillen) → `vocals.wav`.
2. Ordtider: fraser fra vokal-energi + stavelsesvægtet fordeling, snappet til vokal-onsets (±0,3 s præcision; ret de vigtige ord i hånden):
```python
import sys, re, json, numpy as np, librosa
y, sr = librosa.load('vocals.wav', sr=22050); hop = 441; dt = hop / sr
e = librosa.feature.rms(y=y, frame_length=1024, hop_length=hop)[0]; on = e > max(np.percentile(e, 30) * 2, e.max() * .05)
ph = []; st = None; g = 0
for i, f in enumerate(on):
    if f: st = i if st is None else st; g = 0
    elif st is not None:
        g += 1
        if g * dt >= .18: ph.append([st * dt, (i - g + 1) * dt]); st = None; g = 0
if st is not None: ph.append([st * dt, len(on) * dt])
ph = [p for p in ph if p[1] - p[0] > .2]
ons = librosa.onset.onset_detect(y=y, sr=sr, hop_length=256, backtrack=True, units='time')
words = [w for line in open('tekst.txt', encoding='utf8') for w in line.split()]
syl = lambda w: max(1, len(re.findall(r'[aeiouyæøå]+', w.lower())))
S = np.array([syl(w) for w in words], float); tot = sum(b - a for a, b in ph)
cum = np.concatenate([[0], np.cumsum(S)])[:-1] / S.sum() * tot
def at(x):
    for a, b in ph:
        if x <= b - a: return a + x
        x -= b - a
    return ph[-1][1]
out = []
for w, c in zip(words, cum):
    t = at(c); k = ons[np.argmin(abs(ons - t))]; out.append([w, round(float(k if abs(k - t) < .25 else t), 2)])
print(json.dumps(out, ensure_ascii=False))
```
Forbedring: hvis antallet af frase-grupper (pauser > 0,35 s) = antal tekstlinjer, så lås hver linjes første ord til frasens start.
3. Beat og energi: `librosa.beat.beat_track` (tempo + beats) og RMS pr. sektion på hele mixet → verse = rolig kamera, hook = flere hits/skift, drop/stort ord = wow.

## 2. Storytelling (det vigtigste)
- Læs teksten som et manuskript. Find **én hovedperson** (kunstneren som silhuet/figur set bagfra, over skulderen eller i profil) og **én rød tråd** (fx en nat i byen, en flugt, et minde), som alle scener hænger på.
- **Én scene pr. frase (2–3 s), skift på downbeat.** Hver scene viser det mest konkrete ord i frasen bogstaveligt: steder ("Paris" → Eiffeltårn ved nat), tal ("9" → 9 personer/9 vinduer), handlinger ("synker" → under vandet med lysstråler), ting (piller/slik, kop, cigaret, dør, telefon). Ved abstrakte linjer: brug et symbol (skygge på væg, tom stol, ur).
- Lav en **shotliste** før storyboardet: frase → nøgleord → billede → kameravinkel → lys → overgang. Vis sammenhængen i én sætning: "Historien: …".
- Variation i billedudsnit: total (by/rum) → halvnær (person) → detalje (objekt) → total igen. Aldrig to ens udsnit i træk.
- Ét wow-øjeblik på sangens stærkeste ord (lys-eksplosion, kamera-punch, alt skifter farve).

### Gør det kreativt (ikke bare illustreret)
- **Et koncept over hele sangen**, ikke kun et sted: fx "rutinen er et loop" (et flip-ur går 21:00 → 22:00 og springer tilbage til 21:00 i outroen, så videoen starter forfra), "kroppen er byen" (blodårer = motorveje med baglygter). Konceptet skal kunne siges i én sætning og vende tilbage i slutningen.
- **Billedet skifter på ordene, ikke kun på linjerne.** I shotlisten får hver scene en linje "ORD → hvad der sker" (TO → to baglygter tænder som øjne · TÆNDT → lighterens flamme springer op · SMIL → læberne smiler og glimter · POPPER → én pille popper ud af blisterkortet pr. beat · IKKE FÅ NOK → hånden fyldes og løber over · SAMME → billedet ekko-dubleres 3×).
- **Dobbeltbetydninger og ordspil** er guld: "tændt" = lighter/tænding, "samme" = ekko af samme billede, "rundt" = lys der kører rundt i årerne.
- **Genbrug motiver** (samme ur, samme lygtepæl, samme bil) som rød tråd, og lad overgange være match-cuts mellem former (koppens rand → urskive, pille → lys).
- **Detaljer der lever:** hår der blæser, regn på ruder, støv i lyskegler, gnister, dråber i slowmo, ringe og øreringe der glimter, røg der krøller. Mindst én sekundær bevægelse pr. scene.
- Hellere 14–16 korte scener med tydelige ord-triggers end 8 lange.

## 3. Visuel stil (2,5D "ægte-agtig")
Vælg ÉN palette pr. sang og hold den: navy-monokrom (blæk-illustration), sepia/noir, varm nat (orange vinduer mod blå himmel), kold vinter, rød neon. Opskriften, lag for lag:
1. **Baggrund** i skærm-rum med gradient + støv/papir-tekstur (forberegnet canvas, overlay ~.08).
2. **Dybdeplaner** (3–5): fjern baggrund (sløret via `soft(c, 6–10, …)`), mellemgrund (skarp), forgrund (stor, mørk, sløret). Kameraet flytter planerne med forskellig hastighed (parallakse 0.2 / 0.6 / 1.0 / 1.4).
3. **Volumen på former**: ingen flade fills — hver flade får en lineær/radial gradient fra lyskilden; kugler/glas/metal får specular highlight (lille hvid ellipse) + rim light i kanten; ansigter/figurer ofte som silhuet med rim light.
4. **Lys**: én tydelig lyskilde pr. scene. Lyskegler = trapez med gradient i `lighter`-blend og lav alpha; varme vinduer med glow; lygtepæle/måne med stor blød glow; lysstråler under vand (skrå striber der langsomt bevæger sig).
5. **Skygger**: kastede skygger på væg/gulv (figurens silhuet, skaleret + skråt, sort alpha .5, tegnet via `soft()` for blød kant). Ambient occlusion: mørk blød ellipse under ting.
6. **Atmosfære**: dis-lag (store bløde radial-gradienter der driver), partikler (støv i lyset, sne, bobler, gnister), let blomstring (glow over de lyseste områder).
7. **Linjetegning (valgfrit)**: tynde lyse konturer på kanterne (blæk-stil) for navy/monokrom-looket.
8. **Post**: vignette, filmkorn, let kromatisk aberration på hits, sort fade/lysglimt mellem enkelte scener.
Egne 3D-objekter (fx én roterende genstand) kan laves med three.js (saas-animation-skillens `template-3d.html`, render med `--gpu`), men standard er 2,5D canvas — hurtigst og mest stabilt.

## 3b. Placering og anatomi (det brugeren opdager først)
Tjek dette på beskårne nærbilleder (ikke kun i kontaktarket), før der renderes:
- **Kvinder skal ligne kvinder**, også i silhuet: langt hår med volumen (evt. knold/hestehale), creoler, vipper, glossy læber, smalle skuldre/top. Silhuetter med kort hoved ligner mænd.
- **Ansigtsdele inden for ansigtet.** Glans, glimt og "bling" placeres ud fra de faktiske kurver: en quadraticCurve fra (−w,y0) til (w,y0) med kontrolpunkt yc når kun ned til (y0+yc)/2 på midten. Sæt aldrig et højlys på kontrolpunktets y; det havner under læben og ligner en hvid streg på hagen. Gnister omkring munden kun over/ved siden af, aldrig under hagen.
- **Smil = mundvigene op + tænder synlige + kinder der løftes**, ikke et glimt et andet sted. Bling på tænderne er godt.
- **Hænder skal gribe om ting:** armen kommer fra personens krop (beregn retningen fra greb til skulder), næven sidder på selve rattet/glasset/lighteren, og en del af objektet tegnes foran fingrene. Hånden må aldrig dække ansigtet; flyt grebet ned/til siden.
- **Væske og røg kommer fra kilden:** beregn flaskehalsens position efter rotation (x' = x·cos − y·sin, y' = x·sin + y·cos) og start strålen der; strålen ender inde i koppen (bag koppens forside).
- **Røntgen/abstrakte kroppe ser mærkelige ud.** Brug en rigtig figur (kasket, hætte, kæde) med glød igennem tøjet i stedet for pindefigurer.
- **Spejlinger i vådt vejlag:** brede, svage striber (alpha ≤ 0,4). Smalle, kraftige striber under bilen ligner ben/stylter.
- Hold motiver ude af tekstzonen (y≈230–600), og hold scenens fokus i midten/nederst.

## 4. Typografi (ord for ord)
- Fonte via npm (HuggingFace/Google Fonts er blokeret): `npm pack @fontsource/anton @fontsource/playfair-display` → brug `files/anton-latin-400-normal.woff2` og `files/playfair-display-latin-400-italic.woff2` (latin dækker æøå) via `@font-face`.
- Hvert ord dukker op på sin ordtid; vis 1–4 ord ad gangen (fyld én linje, ryd på frase-skift). VERSALER i Anton 140–200 px, hvid med blød skygge, øverst (y≈260–520). Ét ord pr. frase må være Playfair italic (små bogstaver, accentfarve) — typisk det lille fyldord eller det følelsesladede ord.
- Ord-animation: kort skala-pop 1.15→1.0 + fade over 0,12 s; aktive ord 100 %, tidligere ord i linjen 85 %. Let grunge: tegn teksten, og skær støj ud med `destination-out` ved alpha .15.
- Store tal/ord kan selv være billedet ("9" fylder skærmen).

## 4b. Effekt-værktøjskasse (afprøvet, hurtig)
- **RGB-split:** kopiér canvas to gange, gang den ene med #ff0000 og den anden med #00ffff (`multiply`), tegn cyan forskudt den ene vej og rød med `lighter` den anden vej. Kun på hits (henfald 0,3–0,5 s).
- **Bølge/smelt ("slop", rus):** tegn rammen i 48 vandrette strimler med sin-forskydning.
- **Flash-tabel** `[t, farve, styrke, henfald]` med `lighter`, **sort dip** omkring scenegrænser, **PUNCH** (zoom) og **SHAKE** som tabeller øverst, så timing rettes ét sted.
- **Zoom-puls på alle beats**, kraftigere i hook/wow-sektioner.
- **Flip-ur** (top/bund-halvdele med scaleY), **bokeh** (radial-cirkler med lys kant, `lighter`), **anamorfisk flare** (glow skaleret fladt), **stjerne-glimt** (8-takket stjerne + glow) til smykker, tænder og ringe.
- **Lys-sweep** hen over lak/glas på et ord, **gudestråler** (roterende trekanter med gradient) til rus/eufori, **warp-fartstriber** til fart.
- Genbrugsfigurer: bil bagfra, profil (kasket, kæde, rim light), forfra-figur, kvindeansigt, næve, pille, flaske, lighter-flamme. Byg dem som funktioner med options (tilt, rim-farve, øjne åbne/lukkede, smil 0–1).

## 5. Kamera og musik-sync
- Kamera bevæger sig altid lidt: langsomt push-in (1.0→1.08 pr. scene), drift sidelæns, handheld-vugge i rolige scener.
- Sceneskift på downbeats tættest på frasestart. Zoom-pulse (+1–2 %) på kick-trommer i hook; større punch + rystelse på wow-ordet.
- Overgange: match-cut på form (måne → pille, vindue → telefon), kamera kører ind i en lyskilde → hvidt → ny scene, kort sort dip på tunge ord. Undgå crossfades.

## 6. Arbejdsgang
1. Tidslinje (ord + beats). Verificér usikre steder med whisper-small på korte vinduer (1–1,5 s) af den udskilte vokal, og match fonetisk ("romper en opvå" = "brormand … booz op"). → 2. shotliste + "Historien: …" + koncept i én sætning → 3. storyboard: 12–16 lodrette rammer i ét billede (detaljerede SVG-skitser med lys, palette og figurer, der ligner det de skal være), og pr. ramme: tid, tekst, beskrivelse, blå linje "ORD → hvad der sker", gul kamera-linje og grøn overgang. Vent på "kør". Små noter ("det ligner mænd", "de sidste scener er mærkelige") → ret kun de scener og vis igen. → 4. byg én HTML-side (kontrakt: canvas `#c`, `renderAt(t)`, `TOTAL`, `ready`, `?t=`, `?scale=`; 1080×1920). Øverst: `WORDS = [[ord, tid], …]`, `SCENES = [[start, navn], …]`, `HIT`. → 5. stills (2 pr. scene) i et 9:16-ark og tjek: tekst læselig over billedet, lys/palette konsistent, scenen matcher ordet. Beskær derefter nærbilleder af ansigter, hænder og objekt-interaktioner (greb, skænkning, smil) og gennemgå tjeklisten i 3b. Gem en backup af siden før hver rettelsesrunde, og render rettelser som v2, v3 … → 6. render: `node render.mjs video side.html "Kunstner - Titel.mp4" --fps 30 --scale 1 --audio klip.wav` (render.mjs fra saas-animation-skillen).

## Ydelse (samme fælder som v1)
- Baggrunde i skærm-rum, aldrig kæmpe `fillRect` i kamera-rum.
- Ingen `ctx.filter = blur()` på store lag; brug `soft(c, div, draw)` (tegn i lav opløsning med samme transform, skaler op) til dybdeskarphed og bløde skygger. Funktionen står i v1-skillen.
- Ingen sub-frame motion blur. Forbered teksturer/støj én gang ved load. Mål ~1 s/frame; render i baggrunden og poll.
- Reference: 23 s / 16 scener / 696 frames renderes på ca. 2 min med denne opskrift (by-silhuet forudtegnet i et offscreen-canvas, korn i 4 forberegnede lag, tekst på et separat lag med grunge via `destination-out`).
## 7. Lærdomme fra referencer (opdateres hver gang)
**Reference 1: MusikFraFloor-stil (Paris/Smarties) – brugt til "Zira – Jovina"**
- Tekst: lille Anton-linje (≈90 px, hvid) øverst + nøgleordet i stor Anton (≈200 px) med varm guld-gradient (#fff3d6 → #ffd28a → #e59a43) lige under. De ord, der ikke er sunget endnu, står allerede svagt (≈20 % alpha) og "tændes" på ordtiden. Markér tekst i én streng pr. linje: `|` = ny bid, `*` = nøgleord, `~` = kursiv accent (Playfair, orange #ffbf73).
- Ét gennemgående motiv, der ændrer form hen over videoen (i referencen bliver smarties til et kranie). Find sangens eget motiv, fx et ur der går mod 06:00 og "spøgelser" (gennemsigtige silhuetter) omkring hovedpersonen.
- Varm nat-palet: navy himmel, ravgule vinduer og lygter, våd vej med brede, svage spejlinger.
- Outro: kunstnernavn med spatierede versaler, en kort orange streg, titlen i Playfair kursiv og derefter LIKE / FØLG / SKRIV (ikon i orange, Anton-ord og en lille kursiv undertekst). Ingen TikTok-logo/watermark.
- Kopiér aldrig referencens motiver (Balmain, Eiffeltårn, smarties). Brug kun dens grammatik: tekst-layout, palet, ord→objekt og outro.

**Tekniske fælder fundet**
- Beregn alle chunk-starttider (`t0`), FØR sluttider (`t1 = næste.t0`) beregnes. Ellers bliver t1 NaN, og teksten forsvinder.
- Perspektiv-gader: tegn hver facade som ÉT plan med punkter `P(side, dybde, højde)` (s = 1/(1+d)) og vinduer som quads i samme plan. Separate trapez-segmenter giver savtakker.
- Spøgelser: tegn rigtige silhuetter opakt i et `soft()`-lag og sæt alpha på HELE laget (`softA`). Alpha pr. figur giver klodsede, overlappende rektangler.
- Løbende figur: armene hænger NED og svinger (vinkel ±sw fra lodret), og knæet bøjer bagud. Tegn lygten FØR figuren.
- render.mjs fandtes ikke i miljøet. Selvskrevet Playwright-render (4 workers, `toDataURL('image/jpeg',.92)` → ffmpeg) klarer 63 s / 1890 frames på ca. 1,5 min. Spleeter 2-stems via sherpa-onnx: `sherpa-onnx-spleeter-2stems-fp16` fra GitHub-releases (source-separation-models).

**Reference 2+3: Ziras egne videoer (404musikdk) – brugt til "Zira – Tunge følelser" (v2)**
- Det er kunstnerens etablerede stil: DUOTONE (én farvetone pr. sektion: violet nat, bordeaux, daggry), styret af en tone-rampe `T(v)` (0 = sort … 1 = hvid i paletten), og ALT tegnes med den. Paletten skifter blødt mellem sektioner.
- Fast figur: Zira med hætte, strikket maske med øjenspalte og vatteret jakke (forfra og profil) + en kvindesilhuet med langt hår. Spøgelser = de samme silhuetter tegnet opakt i et eget lag og lagt på med lav alpha + lyskant.
- Teksten er en del af scenen, ikke kun en undertekst. Variér stil pr. bid via `{stil}` i markup: drop (tungt ord falder og bumper), circle (tekst rundt om figuren), scatter (bogstaver opløses som spøgelser), frost (sløret bag dug, skarp hvor hånden tørrer), inphone/bubble (skrivemaskine i telefon/chat, bogstav for bogstav synkront med ordtiden), deltype (skrives og slettes igen), ecg, wave (rus), overflow (ordene vælter ud), strike (overstregning), digits (tæller), shatter, glint, big6 (tal fylder skærmen), slide (bogstaver glider ud), sign (lyskilt med pærer).
- Grafiske motiver der virker: låseskærm med klokkeslæt + notifikationer, skrive-prikker, EKG der flader ud, frostramme (genereret iskrystal-tekstur), lyskegler, diskokugle, perspektivgitter, split-screen med to paletter.

## 8. Præcis ord-sync (vigtigst – brugeren tjekker det)
Energi-fordeling alene giver fejl på 0,5–1,9 s. Brug i stedet denne kæde:
1. Whisper large-v3-turbo som ONNX fra sherpa-onnx GitHub-releases (`sherpa-onnx-whisper-turbo.tar.bz2`). Sæt `stream.set_option("max_tokens_per_second","25")`, ellers bliver korte klip afskåret. Kør på HELE mixet (bedre end den udskilte vokal).
2. Prefix-dekodning pr. linje: afkod [linjestart, x] for x i trin på 0,12 s. Hvornår et ord dukker op = ordets slutning (+0,1–0,2 s forsinkelse). Læs tabellerne manuelt og match fonetisk.
3. Sungne omkvæd: brug `librosa.pyin` (toner + stemt/ustemt). Ustemte huller = t/f/s/k → præcise stavelsesgrænser.
4. Rap-vers: stemte segmenter (pyin voiced_flag) + vokalkerner (båndpas-energi-toppe) som støtte.
5. Snap til nærmeste vokal-onset inden for ±0,07 s.
6. VERIFICÉR: afkod [ordtid−0,03, ordtid+0,7] for hvert nøgleord. Ordet skal høres først i klippet. Hører modellen det foregående ord, er tiden for tidlig; hører den det næste, er den for sen. Scan usikre steder i trin på 0,1 s, og ret.
- Tekst vises 0,04 s før ordet (LEAD), og bogstav-for-bogstav-stile fordeler bogstaverne over ordets varighed.
- Sceneskift placeres lige før første ord i linjen (og på et beat, når det er muligt).
- **Gentagne omkvæd (Remotion-projekt "Node – Pull Up"):** Find forskydningen mellem omkvæd ved at krydskorrelere vokal-RMS (hop 5 ms) for et præcist sat omkvæd mod resten af sangen. Korrelation > 0,8 betyder samme optagelse: genbrug ordtiderne + forskydning (her +9,60 s og +38,40 s). Det er præcist og sparer mange dekodninger.
- **Prefix pr. SEKTION** (8–10 s fra et fast start) giver Whisper kontekst og er langt mere robust end prefix pr. linje, som kræver, at linjestarterne allerede er rigtige.
- Remotion-variant: React/SVG-scener, data i `src/data/timing.ts` genereret af `gen.py` (ordtider snappet til onsets, chunks, beats, hits, scener). Chromium fra `/opt/pw-browsers/chromium_headless_shell-*/…/chrome-headless-shell` via `Config.setBrowserExecutable`. Render 50 s / 1500 frames ≈ 5,5 min med concurrency 4.
