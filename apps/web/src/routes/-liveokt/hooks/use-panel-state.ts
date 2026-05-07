import { useEffect, useState } from "react";

export interface PanelState {
  panelOpen: boolean;
  setPanelOpen: (b: boolean) => void;
  panelTab: string;
  setPanelTab: (s: string) => void;
  begrunnelseIdx: number;
  setBegrunnelseIdx: (updater: (i: number) => number) => void;
}

export function usePanelState(step: number, selectedIdx: number): PanelState {
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelTab, setPanelTab] = useState("default");
  const [begrunnelseIdx, setBegrunnelseIdx] = useState<number>(0);

  useEffect(() => {
    setPanelTab("default");
    setBegrunnelseIdx(0);
  }, [step, selectedIdx]);

  return {
    panelOpen,
    setPanelOpen,
    panelTab,
    setPanelTab,
    begrunnelseIdx,
    setBegrunnelseIdx: (updater) => setBegrunnelseIdx((i) => updater(i)),
  };
}
