#!/bin/bash
# Render 3D-videoen i bidder (frisk browser pr. bid, så WebGL-hukommelsen ikke løber fuld), saml + lyd + film-look.
set -e
mkdir -p out/chunks
N=1650; STEP=275
i=0
for ((s=0; s<N; s+=STEP)); do
  e=$((s+STEP-1)); [ $e -ge $N ] && e=$((N-1))
  f=$(printf "out/chunks/c%02d.mp4" $i)
  if [ ! -s "$f" ]; then
    for try in 1 2 3; do
      npx remotion render Branco "$f" --frames=$s-$e --concurrency=4 --gl=angle --muted && break
    done
  fi
  echo "file 'chunks/$(basename $f)'" >> out/list.tmp
  i=$((i+1))
done
mv out/list.tmp out/list.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i out/list.txt -i public/branco.mp3 -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out/raw.mp4
./postfx.sh out/raw.mp4 "out/Branco - Ingen Introduktion - 4x4 (3D).mp4"
echo DONE
