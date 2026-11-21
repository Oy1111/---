import sys,glob
from PIL import Image,ImageDraw
fs=sorted(glob.glob(sys.argv[1]+'/*.jpg'));cols=int(sys.argv[3]) if len(sys.argv)>3 else 7;tw,th=216,384
rows=(len(fs)+cols-1)//cols;S=Image.new('RGB',(cols*tw,rows*(th+22)),'#222');d=ImageDraw.Draw(S)
for i,f in enumerate(fs):
    im=Image.open(f).resize((tw,th));x,y=(i%cols)*tw,(i//cols)*(th+22);S.paste(im,(x,y));d.text((x+4,y+th+4),f.split('_')[-1][:-4],fill='white')
S.save(sys.argv[2],quality=88)
