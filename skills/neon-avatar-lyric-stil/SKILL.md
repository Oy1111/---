---
name: neon-avatar-lyric-stil
description: Use with lyric-video-cinematic when the user wants the MusikFraFloor "neon avatar" style: the artist stands fixed in the centre of the frame (waist-up, facing camera) while a purple/pink/cyan neon city and one literal set piece per line change behind and around him.
---

# Neon-avatar style (MusikFraFloor reference, D1MA "Never Sober", tiktok @musikfrafloor/video/7707256930875788547)

Bruges sammen med `lyric-video-cinematic` (ord-sync, regler om våben/stoffer/brands, outro og film-look kommer derfra). Svar på dansk.

## Hvad referencen gør
- **Kunstneren står fast i midten** fra taljen og op, forfra, hele videoen (fylder nederste ~55 %: hoved ved y≈880, bund ved 1920). Han bevæger sig næsten ikke – kun let vugge/beat-puls.
- **Verden bag ham skifter** linje for linje: neon-gade i perspektiv (lilla/pink/cyan), laser-klub, pengesedler der regner, papirer der flyver, telefon med klokkeslæt (03:12), måne, kvinder der står ved siden af ham, paraply i regn. Alt bogstaveligt efter ordene.
- **Palet:** dyb lilla himmel, magenta #ff3dc8, cyan #3de0ff, varm orange; pink dis ved horisonten; lyskæder over gaden; lodrette neonskilte på facaderne; våd vej med brede, svage refleksioner.
- **Figuren har neon-lyskant i to farver** (magenta på den ene side, cyan på den anden).
- **Tekst:** øverst (y≈150–600). Små ord i Playfair italic (små bogstaver), andre i hvid Anton-versaler, nøgleord store i **pink neon** (gradient #fff0fb → #ff3dc8 → #b0108a + glow). Ord der ikke er sunget endnu står svagt.
- **Outro:** kunstnernavnet i pink neon (flimrer ind), undertitel i hvide spatierede versaler, derefter LIKE (pink hjerte) / FØLG / SKRIV + "og ønsk det næste nummer". Aldrig TikTok-watermark eller -logo.
- Referencen skjuler kunstnerens ansigt (maske/pixel-bjælke). Har brugeren sendt et foto, tegnes kunstneren i stedet ud fra fotoet (rembg birefnet-portrait → 2× opskalering → mean-shift + k-means 30 farver + let blur-blend → PNG), så han ligner 1:1.

## Opskrift (Remotion-projekt `branco-4x4`)
- `NeonStreet`: perspektiv-projektion P(x,y,z) = (540 + F·x/z, HZ + F·(y+CAMH)/z), F≈720, HZ≈960. Facadesegmenter som quads langs z på x = ±560, vinduer som quads i samme plan, lodrette neonskilte (DISKO, 24/7, KIOSK, GRILL, BAR …) tegnet skærmvendt og skaleret med F/z, lyskæder (kædelinje-punkter) med pærer, vejstriber, reflekser blurret. Kameraet "kører" frem: z −= t·speed, segmenter genbruges modulo.
- Én palet pr. sektion (hook 1 lilla, hook 2 rød/guld, vers kold cyan), skift med et kort hvidt neon-glimt. Et alternativt bagtæppe pr. sektion virker godt (fx byens tage som på kunstnerens foto: spir, tegltage, skorstene, kviste, rækværk med lyskæde).
- Sæt-stykker i skærm-rum bag figuren (oven over hovedet y≈600–880 og i siderne x<250 / x>830) og enkelte foran (blitz, sedler, splinter).
- Glitch på "finde mig selv": to kopier af figuren forskudt ±25 px med screen-blend og blur.
- Refleks i brillerne: beregn brille-koordinater i billedet og tegn små pink øjne der (bPt(ix,iy) → skærm).

## Ord → billede (fra "Branco – Ingen Introduktion – 4x4")
- "fire gang' fire'n" → boxy 4x4 forfra kører ind bag ham, dørene slår op; "fire brødre" → fire hættefigurer med neon-kant træder frem.
- "9'ere" → de fire vender ryggen til med **nr. 9 på trøjerne** + kæmpe neon-"9" (ALDRIG våben).
- "15 hurtig' skud" → **15 kamerablitz** med tæller 01/15–15/15 (dobbeltbetydning, aldrig skud/våben).
- "hvem der bli'r med dig" → publikum-silhuetter fader ud, kun de fire bliver.
- "spiller stille og roligt" → neon-skakkonge; "familien" → oplyst vindue med mor og børn; "glemmer" → polaroids der driver op (kort, max 1,4 s).
- "frygten i deres øjne" → mørket falder, mange par lysende øjne + øjnene spejlet i hans briller.
- "fuck hva' de si'r" → talebobler ("bla bla", "hva så?") der splintres på "fuck".
- "hjørnet" → grønt vejskilt + tom gynge; "mama … sin søn" → svævende telefon "MOR ♥ · 12 ubesvarede opkald"; "dag/nat" → sol op, så måne; "skejs" → sedler regner; "vejen derhjemme" → GPS-kort "rute ikke fundet"; "14 år … husleje" → neon-14 + konvolut "HUSLEJE til mama" der åbner med sedler; "hjerte" → stort neon-hjerte; "ikk' noget liv … kærlighed" → lysene dæmpes, højhusets vinduer slukker ét for ét, hjertet flimrer og knækker; "penge blevet værd" → sedler brænder til aske; "brødre blaffer hinanden" → to figurer med ryggen til hinanden.
- Ord-sync: hook 2 er samme optagelse som hook 1 → genbrug tiderne + forskydning (her +13,72 s). Ret derefter begge med verifikationen.

## VIGTIG RETTELSE fra brugeren (efter første Branco-version)
- **Kopiér ikke referencens farver/neon 1:1.** Brugeren ville have referencens *realistiske 3D-look* (blødt lys, materialer, dybde, en avatar-figur), ikke en neon-kopi.
- **Lav din HELT EGEN karakter**, ikke kunstnerens foto indsat. Kunstnerens foto må kun give små hints (fx rosa briller, guldkæde, dynevest).
- **Mere avanceret, flere detaljer, ikke kedeligt.** Bevis kvalitet: ægte 3D frem for flade lag.

## Ægte 3D i Remotion (projekt `branco-3d`)
- `npm i @remotion/three three @react-three/fiber@9 @react-three/drei@10`; `Config.setChromiumOpenGlRenderer("angle")` og `chromiumOptions: { gl: "angle" }` i renderStill/selectComposition; render med `--gl=angle`. ~2–5 s/frame.
- `@react-three/postprocessing` (EffectComposer: Bloom/DOF) giver hvide/sorte billeder i headless-render → lad være; brug ffmpeg-postfx til bloom/halation/korn og `fog` til dybde.
- Karakter af procedurale meshes: torso som `LatheGeometry` med en sinus-bump pr. dyne-kammer (+ tynde torus-syninger), ærmer som lathe-segmenter placeret med quaternion mellem skulder→albue→hånd, hætte = delvis kugle + torus-kant, balaclava = mørke kugler, briller = tynde cylindre (transparent pink MeshPhysical) + guld-torus, kæde = 48 små tori langs en CatmullRom-kurve (hver anden roteret 90°). Materialer: MeshPhysical med clearcoat/sheen til satin-nylon, metalness 1 / roughness .2 til guld.
- Kamera ~3,3 m foran, kig på y≈1,6, fov 40: i 9:16 er kun ca. ±1 m synligt i siderne ved z≈−2 → placér sæt-stykker indenfor (x ≤ ±0,95), ellers ryger de ud af billedet. Ting lige bag figuren skjules af ham – flyt dem ud til siden eller op over skuldrene.
- Lys: hemisphere + svag ambient, varm nøgle-spot foran-venstre, to farvede kant-spots bagfra, telefonens pointLight lyser ansigtet nedefra; få rigtige pointLights i gaden (resten emissive). Facader = CanvasTexture (map + emissiveMap for tændte vinduer), en materiale pr. bygning så vinduer kan slukke én for én.
- Hook 2 kan genbruge hook 1's koreografi (samme ordtider + offset) men med andet vejr (regn som InstancedMesh, rødt/blåt kantlys).
