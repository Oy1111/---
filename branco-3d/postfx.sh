#!/bin/bash
# Oldschool film-look: bloom + varm halation, let farveforskydning, grade, flimmer, filmkorn, blød vignet.
# brug: ./postfx.sh in.mp4 out.mp4
ffmpeg -y -loglevel error -i "$1" -filter_complex "
[0:v]format=gbrp,split=3[a][b][c];
[b]curves=all='0/0 0.42/0 1/1',gblur=sigma=14[bl1];
[c]curves=all='0/0 0.5/0 1/1',gblur=sigma=48,colorchannelmixer=rr=1.2:gg=0.75:bb=0.45[bl2];
[a][bl1]blend=all_mode=screen:all_opacity=0.75[m1];
[m1][bl2]blend=all_mode=screen:all_opacity=0.9,
rgbashift=rh=-2:bh=2:edge=smear,
eq=gamma=1.1:contrast=1.03:saturation=1.07:brightness='0.012*sin(n*1.9)+0.008*sin(n*0.37)':eval=frame,
colorbalance=rs=0.02:bs=0.05:rh=0.05:gh=0.01:bh=-0.04,
format=yuv420p,
noise=c0s=18:c0f=t+u:c1s=4:c1f=t:c2s=4:c2f=t,
vignette=angle=PI/6[v]" -map "[v]" -map 0:a? -c:v libx264 -crf 21 -maxrate 14M -bufsize 28M -preset veryfast -pix_fmt yuv420p -c:a copy "$2"
