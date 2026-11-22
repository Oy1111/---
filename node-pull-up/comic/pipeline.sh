#!/bin/bash
# Render ren video -> tegneserie-filter på hvert billede -> encode med lyd
set -e
cd "$(dirname "$0")/.."
npx remotion render PullUp out/clean.mp4 --concurrency=4 --crf=14 --log=error
rm -rf /tmp/cframes && mkdir -p /tmp/cframes/in /tmp/cframes/out
ffmpeg -v error -y -i out/clean.mp4 /tmp/cframes/in/f%05d.png
python3 comic/batch.py /tmp/cframes/in /tmp/cframes/out 4
ffmpeg -v error -y -framerate 30 -i /tmp/cframes/out/f%05d.png -i public/pullup.mp3 -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium -c:a aac -b:a 256k -shortest -movflags +faststart "out/Node - Pull Up.mp4"
echo DONE
