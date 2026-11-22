#!/bin/bash
# Render 3D-videoen i bidder (frisk browser pr. bid), skaler op til 1080x1920, saml + lyd + film-look.
set -e
mkdir -p out/chunks
N=1650; STEP=275; SCALE=${SCALE:-0.75}
: > out/list.tmp
i=0
for ((s=0; s<N; s+=STEP)); do
  e=$((s+STEP-1)); [ $e -ge $N ] && e=$((N-1))
  f=$(printf "out/chunks/c%02d.mp4" $i); u=$(printf "out/chunks/u%02d.mp4" $i)
  if [ ! -s "$f" ]; then
    for try in 1 2 3; do
      npx remotion render Branco "$f" --frames=$s-$e --concurrency=4 --gl=angle --muted --scale=$SCALE && break
    done
  fi
  ffmpeg -y -loglevel error -i "$f" -vf "scale=1080:1920:flags=lanczos,setsar=1" -r 30 -c:v libx264 -crf 15 -preset veryfast "$u"
  echo "file 'chunks/$(basename $u)'" >> out/list.tmp
  i=$((i+1))
done
mv out/list.tmp out/list.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i out/list.txt -i public/branco.mp3 -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out/raw.mp4
./postfx.sh out/raw.mp4 "out/Branco - Ingen Introduktion - 4x4 (3D).mp4"
echo DONE
