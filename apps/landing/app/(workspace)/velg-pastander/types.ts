export type Fasit = "sant" | "usant" | "delvis";

export type GeneratedStatement = {
  id: string;
  text: string;
  fasit: Fasit;
  explanation: string;
};
