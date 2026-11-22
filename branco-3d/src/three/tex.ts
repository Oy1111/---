import * as THREE from "three";

/** Canvas-teksturer til skilte, skærme, sedler, polaroids osv. */
export const canvasTex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
};

export const phoneScreen = (kind: "lock" | "mom" | "gps" | "rent" | "chat") =>
  canvasTex(256, 512, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, kind === "mom" ? "#3a1a2a" : "#1a2a5a"); gr.addColorStop(1, "#120a1e");
    g.fillStyle = gr; g.fillRect(0, 0, 256, 512);
    g.fillStyle = "#fff"; g.textAlign = "center";
    if (kind === "lock") {
      g.font = "bold 72px Anton, sans-serif"; g.fillText("03:12", 128, 140);
      g.font = "18px sans-serif"; g.fillText("lørdag 22. november", 128, 172);
      ["BROR · hvor er du?", "MOR ♥ · ring til mig", "UKENDT · 3 opkald"].forEach((m, i) => {
        g.fillStyle = "rgba(255,255,255,0.16)"; g.beginPath(); g.roundRect(18, 220 + i * 76, 220, 60, 14); g.fill();
        g.fillStyle = "#fff"; g.font = "bold 17px sans-serif"; g.textAlign = "left"; g.fillText(m, 32, 256 + i * 76); g.textAlign = "center";
      });
    } else if (kind === "mom") {
      g.font = "20px sans-serif"; g.fillText("indgående opkald", 128, 90);
      g.fillStyle = "#c86a8a"; g.beginPath(); g.arc(128, 190, 60, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#fff"; g.font = "bold 60px Anton, sans-serif"; g.fillText("M", 128, 212);
      g.font = "bold 46px Anton, sans-serif"; g.fillText("MOR ♥", 128, 310);
      g.fillStyle = "#ff8a8a"; g.font = "18px sans-serif"; g.fillText("12 ubesvarede opkald", 128, 345);
      g.fillStyle = "#ff3b30"; g.beginPath(); g.arc(70, 440, 34, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#34c759"; g.beginPath(); g.arc(186, 440, 34, 0, Math.PI * 2); g.fill();
    } else if (kind === "gps") {
      g.fillStyle = "#0e1424"; g.fillRect(0, 0, 256, 512);
      g.strokeStyle = "#22304a"; g.lineWidth = 10; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(0, 60 + i * 60); g.lineTo(256, 30 + i * 64); g.stroke(); }
      g.strokeStyle = "#3de0ff"; g.setLineDash([12, 10]); g.lineWidth = 6; g.beginPath(); g.moveTo(40, 440); g.lineTo(110, 330); g.lineTo(160, 360); g.lineTo(200, 240); g.stroke(); g.setLineDash([]);
      g.fillStyle = "#fff"; g.font = "bold 34px Anton, sans-serif"; g.fillText("VEJEN HJEM", 128, 70);
      g.fillStyle = "#ff6a6a"; g.font = "bold 20px sans-serif"; g.fillText("rute ikke fundet", 128, 490);
    } else if (kind === "rent") {
      g.font = "bold 30px Anton, sans-serif"; g.fillText("MOBILEPAY", 128, 80);
      g.fillStyle = "#34c759"; g.beginPath(); g.arc(128, 200, 64, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#fff"; g.font = "bold 80px sans-serif"; g.fillText("✓", 128, 228);
      g.font = "bold 40px Anton, sans-serif"; g.fillText("HUSLEJE", 128, 320);
      g.font = "20px sans-serif"; g.fillText("til mama ♥", 128, 352);
      g.fillStyle = "#ffd27a"; g.font = "bold 32px Anton, sans-serif"; g.fillText("— 14 år —", 128, 420);
    }
  });

export const textTex = (txt: string, color: string, w = 512, h = 256, font = "bold 200px Anton, sans-serif", bg?: string) =>
  canvasTex(w, h, (g) => {
    if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
    g.fillStyle = color; g.font = font; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, w / 2, h / 2 + 8);
  });

export const billTex = () =>
  canvasTex(256, 128, (g) => {
    g.fillStyle = "#c8b8e8"; g.fillRect(0, 0, 256, 128);
    g.strokeStyle = "#6a5a9a"; g.lineWidth = 4; g.strokeRect(8, 8, 240, 112);
    g.fillStyle = "#6a5a9a"; g.font = "bold 54px Anton, sans-serif"; g.textAlign = "center"; g.fillText("1000", 150, 84);
    g.beginPath(); g.arc(60, 64, 30, 0, Math.PI * 2); g.fill();
  });

export const bubbleTex = (txt: string) =>
  canvasTex(512, 200, (g) => {
    g.fillStyle = "rgba(244,241,234,0.95)"; g.beginPath(); g.roundRect(10, 10, 492, 140, 70); g.fill();
    g.beginPath(); g.moveTo(230, 148); g.lineTo(270, 148); g.lineTo(220, 196); g.fill();
    g.fillStyle = "#1a1020"; g.font = "italic 64px Playfair, serif"; g.textAlign = "center"; g.fillText(txt, 256, 102);
  });

export const familyTex = () =>
  canvasTex(256, 320, (g) => {
    const gr = g.createRadialGradient(128, 140, 10, 128, 160, 220); gr.addColorStop(0, "#fff0c8"); gr.addColorStop(1, "#c8782a");
    g.fillStyle = gr; g.fillRect(0, 0, 256, 320);
    g.fillStyle = "#3a1a10";
    g.beginPath(); g.ellipse(80, 130, 24, 28, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.moveTo(30, 320); g.quadraticCurveTo(30, 170, 80, 165); g.quadraticCurveTo(130, 170, 130, 320); g.fill();
    g.beginPath(); g.ellipse(170, 200, 18, 20, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.moveTo(140, 320); g.quadraticCurveTo(140, 225, 170, 222); g.quadraticCurveTo(200, 225, 200, 320); g.fill();
    g.beginPath(); g.ellipse(222, 222, 14, 16, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.moveTo(200, 320); g.quadraticCurveTo(200, 242, 222, 240); g.quadraticCurveTo(244, 242, 244, 320); g.fill();
    g.fillStyle = "#1a0e08"; g.fillRect(124, 0, 8, 320); g.fillRect(0, 150, 256, 8);
  });

export const photoTex = (i: number) =>
  canvasTex(160, 190, (g) => {
    g.fillStyle = "#f4f1ea"; g.fillRect(0, 0, 160, 190);
    g.fillStyle = ["#c9a46a", "#8aa0b8", "#d8a080", "#a87ab8", "#7ab8a0", "#d8c070"][i % 6]; g.fillRect(10, 10, 140, 130);
    g.fillStyle = "#2a1a12"; g.beginPath(); g.ellipse(62, 70, 16, 18, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(100, 74, 14, 16, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.moveTo(36, 140); g.quadraticCurveTo(62, 86, 86, 140); g.fill(); g.beginPath(); g.moveTo(76, 140); g.quadraticCurveTo(100, 92, 126, 140); g.fill();
  });

export const glowTex = (color: string) =>
  canvasTex(128, 128, (g) => {
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.2, color); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  });
