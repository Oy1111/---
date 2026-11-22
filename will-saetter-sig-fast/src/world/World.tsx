import React from "react";
import { Walls, Window, Entry, Sideboard, Wall2, Stove, RoomDefs } from "./Room";
import { Her, Him, TABLE } from "./Characters";
import { Table } from "./Table";
import { Phone, Candle, Mug, Turntable, FogWrite } from "./Props";
import { wordTimes } from "../data/timing";
import { clamp, easeOut, smooth } from "../lib";

const w0 = (line: number, w: string, i = 0) => wordTimes(line, w)[i];
const ap = (t: number, a: number | undefined, d = 0.3) => (a === undefined ? 0 : easeOut((t - a) / d));
const win = (t: number, a: number, b: number, fi = 0.3, fo = 0.4) => clamp((t - a) / fi) * (1 - clamp((t - b) / fo));

export const World: React.FC<{ t: number }> = ({ t }) => {
  // nøgletider (videotid)
  const himmel = w0(0, "himmelvendte") ?? 3.3;
  const hojt = w0(1, "højt") ?? 8.35;
  const fol = w0(2, "følelser") ?? 11;
  const naa = w0(3, "nå") ?? 14.8;
  const viser = w0(3, "viser") ?? 15.5;
  const sig = w0(4, "sig") ?? 17.75;
  const ligeud = w0(4, "ligeud") ?? 21.3;
  const sige = w0(5, "sige") ?? 25.45;
  const maade = w0(5, "måde") ?? 26.5;
  const ud = w0(6, "ud") ?? 29.85;
  const er = w0(7, "er") ?? 30.7;
  const samme = w0(7, "samme") ?? 32.4;
  const sporg = w0(7, "spørgsmål") ?? 32.7;
  const saetter = w0(8, "sætter") ?? 33.45;
  const bar = w0(9, "bar") ?? 36.7;
  const aendre = w0(9, "ændre") ?? 37.6;
  const svar = w0(9, "svarene") ?? 38.3;
  const skille = w0(10, "skille") ?? 41.3;
  const ad = w0(10, "ad") ?? 42.2;
  const starte = w0(11, "starte") ?? 46.4;
  const forfra = w0(11, "forfra") ?? 47.4;
  const huden = w0(12, "huden") ?? 51.7;

  const reset = smooth((t - starte) / 0.6); // alt spoler tilbage
  const eyeUp = win(t, himmel - 0.1, 5.2, 0.35, 0.5);
  const blinkPh = (t % 3.7) / 3.7;
  const blink = blinkPh > 0.96 ? Math.sin(((blinkPh - 0.96) / 0.04) * Math.PI) : 0;
  const herReach = clamp((t - (naa - 0.35)) / 0.45) * (1 - clamp((t - viser) / 0.5)) * 0.95;
  const himReach = clamp((t - (naa - 0.4)) / 0.5) * (1 - clamp((t - 17.2) / 0.8));
  const talk = win(t, 5.7, 8.5, 0.1, 0.1) * 0.8;
  const lamp = 1 - (t > hojt && t < hojt + 0.5 ? Math.abs(Math.sin((t - hojt) * 40)) * 0.6 : 0);
  const heart = win(t, fol - 0.1, 12.8, 0.3, 0.6);
  const stuck = t > saetter && t < 35.3 ? 1 : 0;
  const apart = clamp((t - skille) / (ad + 0.3 - skille)) * (1 - reset);
  const burn = clamp(t / ud) * (1 - reset);
  const out = t > ud ? 1 : 0;
  const relight = clamp((t - forfra) / 0.3);
  const fog = (0.3 + clamp((t - 20) / 20) * 0.4) * (1 - reset * 0.6);
  const hood = ap(t, huden - 0.6, 0.7);
  return (
    <g>
      <RoomDefs />
      <Walls t={t} lamp={lamp} />
      <Window t={t} fog={fog}>
        <FogWrite
          t={t}
          items={[
            { txt: "?", x: 1700, y: 700, t0: er, t1: starte, size: 220 },
            { txt: "?", x: 2020, y: 640, t0: samme, t1: starte, size: 180 },
            { txt: "?", x: 1880, y: 1080, t0: sporg, t1: starte, size: 260 },
            { txt: "nej", x: 1700, y: 960, t0: bar, t1: starte, size: 170, strike: aendre },
            { txt: "ja", x: 2040, y: 1000, t0: svar, t1: starte, size: 190 },
          ]}
        />
      </Window>
      <Entry t={t} heart={heart} />
      <Wall2 t={t} />
      <Sideboard />
      <Turntable t={t} stuck={stuck} apart={apart} />
      <Stove t={t} fire={0.55} />
      <Table />
      <Mug x={TABLE.x0 + 120} y={TABLE.y - 34} c="#2a3a5a" />
      <Mug x={TABLE.x1 - 160} y={TABLE.y - 30} />
      <Phone t={t} sent={sig} typing={[[sig + 0.6, sig + 1.8], [sig + 2.4, ligeud]]} reply="i lige måde" replyT={[sige - 0.4, maade + 0.1]} lit={1 - clamp((t - 27.5) / 0.6) * (1 - reset)} />
      <Candle t={t} out={out * (1 - relight)} relight={relight} burn={burn} />
      <Him t={t} reach={himReach} talk={talk} lean={himReach * 0.6} />
      <Her t={t} eyeUp={eyeUp} blink={blink} reach={herReach} lookAt={win(t, naa - 0.3, viser, 0.3, 0.3)} sad={0.6} hood={hood} headTilt={hood * 0.5} />
    </g>
  );
};
