import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export interface PanelState {
  panelOpen: boolean;
  setPanelOpen: (b: boolean) => void;
  panelTab: string;
  setPanelTab: (tab: string) => void;
  begrunnelseIdx: number;
  setBegrunnelseIdx: Dispatch<SetStateAction<number>>;
}

export function usePanelState(step: number, selectedIdx: number): PanelState {
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelTab, setPanelTab] = useState("default");
  const [begrunnelseIdx, setBegrunnelseIdx] = useState(0);

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
    setBegrunnelseIdx,
  };
}
