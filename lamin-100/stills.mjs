// Render flere stillbilleder: node stills.mjs outdir t1 t2 ... (sekunder)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
const [out, ...ts] = process.argv.slice(2);
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Lamin", browserExecutable });
for (const t of ts) {
  await renderStill({ composition, serveUrl, browserExecutable, frame: Math.round(+t * 30), output: `${out}/s_${(+t).toFixed(2).padStart(6, "0")}.png`, scale: 0.5 });
}
console.log("ok", ts.length);
