export interface FagPratStatement {
  text: string;
  fasit: "sant" | "usant" | "delvis";
  explanation: string;
}

export interface FagPrat {
  id: string;
  title: string;
  subject: string;
  level: string;
  type: "intro" | "oppsummering";
  concepts: string[];
  statements: FagPratStatement[];
  usageCount: number;
  author: string;
}

export const FAGPRAT_DATA: Record<string, FagPrat> = {
  klimaendringer: {
    id: "klimaendringer",
    title: "Klimaendringer og bærekraft",
    subject: "Naturfag",
    level: "10. trinn",
    type: "intro",
    concepts: ["Drivhuseffekt", "CO₂", "Fossil energi", "Fornybar energi", "Karbonavtrykk"],
    statements: [
      {
        text: "Drivhuseffekten er utelukkende skadelig for livet på jorda.",
        fasit: "usant",
        explanation:
          "Drivhuseffekten er en naturlig prosess som holder jorda varm nok til at liv kan eksistere. Uten den ville gjennomsnittstemperaturen vært rundt -18°C. Problemet oppstår når menneskelig aktivitet forsterker drivhuseffekten ved å slippe ut ekstra klimagasser.",
      },
      {
        text: "Fossile brånsler som olje og gass er dannet av plante- og dyrerester over millioner av år.",
        fasit: "sant",
        explanation:
          "Fossile brånsler er dannet av organisk materiale som har vært utsatt for høyt trykk og temperatur over millioner av år. Olje og gass kommer hovedsakelig fra marine organismer, mens kull stammer fra landplanter.",
      },
      {
        text: "Hvis alle land går over til fornybar energi, vil klimaendringene stoppe umiddelbart.",
        fasit: "usant",
        explanation:
          "Selv om vi sluttet med alle utslipp i dag, ville temperaturen fortsette å stige i flere tiår på grunn av tregheten i klimasystemet. CO₂ blir værende i atmosfæren i hundrevis av år. Men overgang til fornybar energi er likevel avgjørende for å begrense oppvarmingen.",
      },
      {
        text: "Bærekraftig utvikling handler om å dekke dagens behov uten å ødelegge for fremtidige generasjoner.",
        fasit: "sant",
        explanation:
          "Dette er kjernen i Brundtland-kommisjonens definisjon fra 1987. Bærekraftig utvikling balanserer tre dimensjoner: økonomisk vekst, sosial rettferdighet og miljøvern.",
      },
      {
        text: "Norges oljeproduksjon påvirker ikke det globale klimaet fordi Norge er et lite land.",
        fasit: "usant",
        explanation:
          "Norge er en av verdens største oljeeksportører. Når oljen brennes i andre land, bidrar det til globale utslipp. Klimagasser kjenner ingen landegrenser – utslippene blander seg i atmosfæren uansett hvor de slippes ut.",
      },
    ],
    usageCount: 31,
    author: "Kristine Hansen",
  },
  "brok-prosent": {
    id: "brok-prosent",
    title: "Brøk, prosent og desimaltall",
    subject: "Matematikk",
    level: "10. trinn",
    type: "oppsummering",
    concepts: ["Brøk", "Prosent", "Desimaltall", "Omregning"],
    statements: [
      {
        text: "50 % er alltid det samme som halvparten.",
        fasit: "sant",
        explanation:
          "50 % betyr bokstavelig talt 50 per hundre, som er det samme som 50/100 = 1/2. Uansett hva vi regner prosent av, vil 50 % alltid være halvparten av det totale.",
      },
      {
        text: "0,5 er større enn 0,45 fordi 5 er større enn 45.",
        fasit: "usant",
        explanation:
          "0,5 er større enn 0,45, men ikke fordi 5 er større enn 45. Vi må sammenligne siffer for siffer: 0,5 = 0,50. Tiendedelen (5) er større enn tiendedelen (4), så 0,50 > 0,45.",
      },
      {
        text: "1/3 kan skrives nøyaktig som et desimaltall.",
        fasit: "usant",
        explanation:
          "1/3 = 0,333... med uendelig mange desimaler. Det er en periodisk desimal som aldri stopper. Vi kan avrunde til 0,33 eller 0,333, men det blir aldri helt nøyaktig.",
      },
      {
        text: "Hvis en vare koster 200 kr og får 25 % rabatt, sparer du 50 kr.",
        fasit: "sant",
        explanation:
          "25 % av 200 kr = 0,25 × 200 = 50 kr. For å regne prosent av et tall, gjør du prosenten om til desimaltall og ganger. 25 % = 25/100 = 0,25.",
      },
    ],
    usageCount: 24,
    author: "Lars Johansen",
  },
  cellebiologi: {
    id: "cellebiologi",
    title: "Cellebiologi og arv",
    subject: "Naturfag",
    level: "10. trinn",
    type: "oppsummering",
    concepts: ["Cellen", "DNA", "Gener", "Celledeling", "Arv"],
    statements: [
      {
        text: "Alle levende organismer er bygget opp av celler.",
        fasit: "sant",
        explanation:
          "Celleteorien sier at alle levende ting består av én eller flere celler. Bakterier har én celle, mens mennesker har rundt 37 billioner celler som samarbeider.",
      },
      {
        text: "DNA finnes bare i cellekjernen.",
        fasit: "usant",
        explanation:
          "Det meste av DNA-et finnes i cellekjernen, men mitokondrier har også sitt eget DNA. Mitokondrie-DNA arves kun fra mor og er viktig for cellens energiproduksjon.",
      },
      {
        text: "Gener bestemmer alene hvordan vi ser ut og hvem vi er.",
        fasit: "usant",
        explanation:
          "Genene gir en oppskrift, men miljøet påvirker også hvordan genene uttrykkes. For eksempel: gener bestemmer potensialet for høyde, men ernæring avgjør hvor høy du faktisk blir. Dette kalles samspill mellom arv og miljø.",
      },
      {
        text: "Ved celledeling får de nye cellene nøyaktig samme DNA som den opprinnelige cellen.",
        fasit: "sant",
        explanation:
          "I mitose (vanlig celledeling) kopieres DNA-et før cellen deler seg, slik at begge dattercellene får identiske kopier.",
      },
      {
        text: "Mennesker har 46 kromosomer, og vi arver 23 fra hver forelder.",
        fasit: "sant",
        explanation:
          "Menneskeceller har 23 kromosompar – totalt 46. Vi får ett sett med 23 fra mor (via egget) og ett sett med 23 fra far (via sædcellen).",
      },
    ],
    usageCount: 42,
    author: "Erik Pedersen",
  },
  geometri: {
    id: "geometri",
    title: "Geometri og areal",
    subject: "Matematikk",
    level: "9. trinn",
    type: "intro",
    concepts: ["Areal", "Omkrets", "Trekant", "Sirkel", "Pytagoras"],
    statements: [
      {
        text: "Arealet av en trekant er alltid halvparten av arealet til et rektangel med samme grunnlinje og høyde.",
        fasit: "sant",
        explanation:
          "Formelen for trekantens areal er A = 1/2 x g x h. Et rektangel med samme grunnlinje og høyde har areal A = g x h. Trekanten er alltid halvparten, uansett form på trekanten.",
      },
      {
        text: "En sirkel med radius 5 cm har omkrets på nesten 31,4 cm.",
        fasit: "sant",
        explanation:
          "Omkretsen av en sirkel er O = 2 x pi x r. Med r = 5 cm: O = 2 x 3,14 x 5 = 31,4 cm.",
      },
      {
        text: "To trekanter med samme areal har alltid samme form.",
        fasit: "usant",
        explanation:
          "Ulike trekanter kan ha samme areal men helt forskjellig form. For eksempel: en trekant med grunnlinje 10 og høyde 4 har samme areal som en med grunnlinje 8 og høyde 5 (begge = 20).",
      },
      {
        text: "Pytagoras' setning fungerer for alle typer trekanter.",
        fasit: "usant",
        explanation:
          "Pytagoras' setning (a² + b² = c²) gjelder bare for rettvinklede trekanter, der c er hypotenusen.",
      },
      {
        text: "Hvis du dobler alle sidene i en figur, dobles også arealet.",
        fasit: "usant",
        explanation:
          "Når alle sidene dobles, øker arealet med faktoren 4 (2²), ikke 2. Areal måles i kvadratenheter, så skaleringseffekten er kvadratisk.",
      },
    ],
    usageCount: 19,
    author: "Lars Johansen",
  },
  demokrati: {
    id: "demokrati",
    title: "Demokrati og medborgerskap",
    subject: "Samfunnsfag",
    level: "VG1",
    type: "intro",
    concepts: ["Demokrati", "Ytringsfrihet", "Valg", "Maktfordeling", "Rettigheter"],
    statements: [
      {
        text: "I et demokrati bestemmer flertallet alltid, uten unntak.",
        fasit: "usant",
        explanation:
          "Demokrati handler om mer enn bare flertallsstyre. Rettsstaten og menneskerettighetene beskytter minoriteter mot flertallets makt.",
      },
      {
        text: "Ytringsfrihet betyr at du kan si hva du vil uten noen begrensninger.",
        fasit: "usant",
        explanation:
          "Ytringsfrihet er en grunnleggende rett, men den har begrensninger. Hatefulle ytringer, trusler og ærekrenkelser er ikke beskyttet.",
      },
      {
        text: "Stortinget vedtar lovene i Norge, og regjeringen gjennomfører dem.",
        fasit: "sant",
        explanation:
          "Dette er et eksempel på maktfordeling. Stortinget (lovgivende makt) vedtar lover, regjeringen (utførende makt) setter dem ut i livet.",
      },
      {
        text: "Alle som bor i Norge har stemmerett ved stortingsvalg.",
        fasit: "usant",
        explanation:
          "For å stemme ved stortingsvalg må du være norsk statsborger og fylle 18 år i valgåret.",
      },
      {
        text: "Pressefrihet er viktig for demokratiet fordi mediene fungerer som en vaktbikkje.",
        fasit: "sant",
        explanation:
          "Frie medier kalles ofte «den fjerde statsmakt» fordi de gransker og avdekker maktmisbruk.",
      },
    ],
    usageCount: 18,
    author: "Maria Olsen",
  },
  retorikk: {
    id: "retorikk",
    title: "Retorikk og argumentasjon",
    subject: "Norsk",
    level: "10. trinn",
    type: "intro",
    concepts: ["Etos", "Patos", "Logos", "Argumentasjon"],
    statements: [
      {
        text: "Etos handler om talerens troverdighet og karakter.",
        fasit: "sant",
        explanation:
          "Etos er det retoriske virkemiddelet som bygger på avsenderens troverdighet. En lege som snakker om helse har høy etos.",
      },
      {
        text: "Patos er det sterkeste argumentet fordi følelser alltid trumfer logikk.",
        fasit: "usant",
        explanation:
          "Patos (appell til følelser) er kraftfullt, men ikke alltid sterkest. God argumentasjon bruker en blanding av etos, patos og logos.",
      },
      {
        text: "Et argument består av en påstand og en begrunnelse.",
        fasit: "sant",
        explanation:
          "Et argument har minst to deler: påstanden (det du mener) og begrunnelsen (hvorfor du mener det).",
      },
      {
        text: "I en debatt er det viktigst å snakke høyest og lengst for å vinne.",
        fasit: "usant",
        explanation:
          "Å snakke høyest er et eksempel på usaklig argumentasjon. I god debatt handler det om å lytte, møte motargumenter og bygge logiske resonnement.",
      },
    ],
    usageCount: 15,
    author: "Ingrid Bakken",
  },
  "british-american": {
    id: "british-american",
    title: "British vs. American English",
    subject: "Engelsk",
    level: "VG2",
    type: "oppsummering",
    concepts: ["Spelling", "Vocabulary", "Pronunciation", "Grammar", "Culture"],
    statements: [
      {
        text: "British English uses 'colour' while American English uses 'color'.",
        fasit: "sant",
        explanation:
          "This is one of the most common spelling differences. British English keeps the French-influenced -our ending, while American English simplified it to -or.",
      },
      {
        text: "Americans say 'lorry' and British say 'truck'.",
        fasit: "usant",
        explanation:
          "Det er omvendt: britene sier 'lorry' og amerikanerne sier 'truck'.",
      },
      {
        text: "In British English, the past tense of 'learn' can be either 'learned' or 'learnt'.",
        fasit: "sant",
        explanation:
          "British English godtar begge formene: learned og learnt. Amerikansk engelsk bruker nesten utelukkende -ed-formen.",
      },
      {
        text: "American English and British English have completely different grammar systems.",
        fasit: "usant",
        explanation:
          "Grammatikksystemene er i hovedsak like. Forskjellene er små.",
      },
      {
        text: "The word 'football' refers to the same sport in both British and American English.",
        fasit: "usant",
        explanation:
          "I British English betyr 'football' det vi på norsk kaller fotball (soccer). I American English betyr 'football' amerikansk fotball.",
      },
    ],
    usageCount: 9,
    author: "Thomas Berg",
  },
};

export const FAGPRAT_LIST: FagPrat[] = Object.values(FAGPRAT_DATA);

export function getFagPrat(id: string): FagPrat | undefined {
  return FAGPRAT_DATA[id];
}

export function getAllFagPrats(): FagPrat[] {
  return FAGPRAT_LIST;
}
