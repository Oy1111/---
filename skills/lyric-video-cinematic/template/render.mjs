import {createRequire} from 'module';const require=createRequire(import.meta.url);const {chromium}=require('playwright');import fs from 'fs';import {spawn} from 'child_process';import path from 'path';
const [mode,page_,out,...rest]=process.argv.slice(2);
const opt=k=>{const i=rest.indexOf(k);return i>=0?rest[i+1]:null};
const url='file://'+path.resolve(page_)+'?scale='+(opt('--scale')||1);
const b=await chromium.launch({args:['--disable-web-security','--allow-file-access-from-files']});
async function mkPage(){const p=await b.newPage({viewport:{width:540,height:960}});p.on('pageerror',e=>console.error('ERR',e.message));await p.goto(url);await p.waitForFunction(()=>window.ready===true,null,{timeout:30000});return p}
const grab=async(p,t,q)=>{const d=await p.evaluate(([t,q])=>{renderAt(t);return document.getElementById('c').toDataURL('image/jpeg',q)},[t,q]);return Buffer.from(d.split(',')[1],'base64')};
if(mode==='stills'){fs.mkdirSync(out,{recursive:true});const p=await mkPage();const ts=rest.filter(x=>!x.startsWith('--')&&!isNaN(+x));for(const t of ts){fs.writeFileSync(`${out}/s_${(+t).toFixed(2).padStart(6,'0')}.jpg`,await grab(p,+t,.85))}}
else{const fps=+(opt('--fps')||30),TOTAL=await (await mkPage()).evaluate(()=>TOTAL),N=Math.round(TOTAL*fps),dir=out+'_frames';fs.mkdirSync(dir,{recursive:true});
 const nw=+(opt('--workers')||3);let next=0,done=0;const t0=Date.now();
 await Promise.all([...Array(nw)].map(async()=>{const p=await mkPage();while(true){const i=next++;if(i>=N)break;const f=`${dir}/f${String(i).padStart(5,'0')}.jpg`;if(!fs.existsSync(f))fs.writeFileSync(f,await grab(p,i/fps,.92));if(++done%60==0)console.log(done,'/',N,((Date.now()-t0)/1000).toFixed(0)+'s')}}));
 const audio=opt('--audio');const args=['-y','-v','error','-framerate',String(fps),'-i',dir+'/f%05d.jpg'];if(audio)args.push('-i',audio);args.push('-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-preset','medium','-movflags','+faststart');if(audio)args.push('-c:a','aac','-b:a','192k','-shortest');args.push(out);
 await new Promise(r=>spawn('ffmpeg',args,{stdio:'inherit'}).on('close',r));console.log('done',out)}
await b.close();
