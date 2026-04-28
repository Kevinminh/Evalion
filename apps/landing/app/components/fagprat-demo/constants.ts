export type Steg = {
  num: number;
  navn: string;
  laptop: string;
  elev: string;
};

const DEMO_BASE = "/demo";

export const STEG: Steg[] = [
  {
    num: 0,
    navn: "Lobby",
    laptop: `${DEMO_BASE}/fagprat-steg0.html`,
    elev: `${DEMO_BASE}/Elevvisning/demo-steg0-elev.html`,
  },
  {
    num: 1,
    navn: "1. Første stemmerunde",
    laptop: `${DEMO_BASE}/fagprat-steg1.html`,
    elev: `${DEMO_BASE}/Elevvisning/demo-steg1-elev.html`,
  },
  {
    num: 2,
    navn: "2. Diskusjon",
    laptop: `${DEMO_BASE}/fagprat-steg2.html`,
    elev: `${DEMO_BASE}/Elevvisning/demo-steg2-elev.html`,
  },
  {
    num: 3,
    navn: "3. Andre stemmerunde",
    laptop: `${DEMO_BASE}/fagprat-steg3.html`,
    elev: `${DEMO_BASE}/Elevvisning/demo-steg3-elev.html`,
  },
  {
    num: 4,
    navn: "4. Vise fasit",
    laptop: `${DEMO_BASE}/fagprat-steg4.html`,
    elev: `${DEMO_BASE}/Elevvisning/demo-steg4-elev.html`,
  },
  {
    num: 5,
    navn: "5. Professorens forklaring",
    laptop: `${DEMO_BASE}/fagprat-steg5.html`,
    elev: `${DEMO_BASE}/Elevvisning/demo-steg5-elev.html`,
  },
  {
    num: 6,
    navn: "6. Egenvurdering",
    laptop: `${DEMO_BASE}/fagprat-steg6.html`,
    elev: `${DEMO_BASE}/Elevvisning/demo-steg6-elev.html`,
  },
];

export const NUM_PASTANDER = 4;

export const LOBBY_LAPTOP = `${DEMO_BASE}/fagprat-lobby.html`;
export const LOBBY_ELEV = `${DEMO_BASE}/Elevvisning/demo-lobby-elev.html`;
export const PHONE_SRC = `${DEMO_BASE}/Statistikk/statistikk.html#runde1`;
export const TV_FRAME_SRC = `${DEMO_BASE}/assets/TV-skjerm.png`;

export type PhoneTab = "runde1" | "runde2" | "resultat";

export function tabForSteg(num: number): PhoneTab {
  if (num <= 2) return "runde1";
  if (num >= 3 && num <= 5) return "runde2";
  return "resultat";
}

export function elevUrl(
  base: string,
  selectedStmt: { text: string; color: string } | null,
  fasit: string | null,
): string {
  if (!selectedStmt) return base;
  let url = `${base}?stmt=${encodeURIComponent(selectedStmt.text)}&color=${selectedStmt.color}`;
  if (fasit) url += `&fasit=${fasit}`;
  return url;
}

export function reddiKeyFor(
  inLobby: boolean,
  stegIdx: number,
  pastandIdx: number,
  actualLaptopIdx = 0,
): string {
  if (inLobby) return "lobby";
  const idx = Math.max(stegIdx, actualLaptopIdx);
  const num = STEG[idx]?.num ?? 0;
  if (num === 1) return `steg1-p${pastandIdx}`;
  return `steg${num}`;
}
