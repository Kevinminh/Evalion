/**
 * FagPrat Data – shared across all pages
 * Each FagPrat contains 1-5 statements with fasit, explanation and highlighted begrunnelse.
 */
var FAGPRAT_DATA = {

  "klimaendringer": {
    id: "klimaendringer",
    title: "Klimaendringer og b\u00e6rekraft",
    subject: "Naturfag",
    level: "10. trinn",
    type: "intro",
    concepts: ["Drivhuseffekt", "CO\u2082", "Fossil energi", "Fornybar energi", "Karbonavtrykk"],
    statements: [
      {
        text: "Drivhuseffekten er utelukkende skadelig for livet p\u00e5 jorda.",
        fasit: "usant",
        color: "yellow",
        explanation: "Drivhuseffekten er en naturlig prosess som holder jorda varm nok til at liv kan eksistere. Uten den ville gjennomsnittstemperaturen v\u00e6rt rundt -18\u00b0C. Problemet oppst\u00e5r n\u00e5r menneskelig aktivitet <span class=\"explanation-highlight\">forsterker</span> drivhuseffekten ved \u00e5 slippe ut ekstra klimagasser.",
        begrunnelse: "\u00abDrivhuseffekten er naturlig og n\u00f8dvendig, men vi forsterker den med utslipp fra industri og transport\u00bb"
      },
      {
        text: "Fossile br\u00e5nsler som olje og gass er dannet av plante- og dyrerester over millioner av \u00e5r.",
        fasit: "sant",
        color: "blue",
        explanation: "Fossile br\u00e5nsler er dannet av organisk materiale som har v\u00e6rt utsatt for h\u00f8yt trykk og temperatur over <span class=\"explanation-highlight\">millioner av \u00e5r</span>. Olje og gass kommer hovedsakelig fra marine organismer, mens kull stammer fra landplanter.",
        begrunnelse: "\u00abPlanter og dyr som d\u00f8de for lenge siden ble presset sammen under jorda og ble til olje og kull\u00bb"
      },
      {
        text: "Hvis alle land g\u00e5r over til fornybar energi, vil klimaendringene stoppe umiddelbart.",
        fasit: "usant",
        color: "orange",
        explanation: "Selv om vi sluttet med alle utslipp i dag, ville temperaturen fortsette \u00e5 stige i flere ti\u00e5r p\u00e5 grunn av <span class=\"explanation-highlight\">tregheten</span> i klimasystemet. CO\u2082 blir v\u00e6rende i atmosf\u00e6ren i hundrevis av \u00e5r. Men overgang til fornybar energi er likevel avgj\u00f8rende for \u00e5 begrense oppvarmingen.",
        begrunnelse: "\u00abCO\u2082 forsvinner ikke med en gang, s\u00e5 selv om vi slutter \u00e5 forurense n\u00e5, tar det lang tid f\u00f8r det hjelper\u00bb"
      },
      {
        text: "B\u00e6rekraftig utvikling handler om \u00e5 dekke dagens behov uten \u00e5 \u00f8delegge for fremtidige generasjoner.",
        fasit: "sant",
        color: "purple",
        explanation: "Dette er kjernen i Brundtland-kommisjonens definisjon fra 1987. B\u00e6rekraftig utvikling balanserer tre dimensjoner: <span class=\"explanation-highlight\">\u00f8konomisk vekst</span>, <span class=\"explanation-highlight\">sosial rettferdighet</span> og <span class=\"explanation-highlight\">milj\u00f8vern</span>.",
        begrunnelse: "\u00abVi m\u00e5 ta vare p\u00e5 naturen s\u00e5nn at barna v\u00e5re ogs\u00e5 kan leve godt\u00bb"
      },
      {
        text: "Norges oljeproduksjon p\u00e5virker ikke det globale klimaet fordi Norge er et lite land.",
        fasit: "usant",
        color: "red",
        explanation: "Norge er en av verdens st\u00f8rste <span class=\"explanation-highlight\">oljeeksport\u00f8rer</span>. N\u00e5r oljen brennes i andre land, bidrar det til globale utslipp. Klimagasser kjenner ingen landegrenser \u2013 utslippene blander seg i atmosf\u00e6ren uansett hvor de slippes ut.",
        begrunnelse: "\u00abSelv om Norge er lite, selger vi olje til hele verden og det gir store utslipp totalt\u00bb"
      }
    ]
  },

  "brok-prosent": {
    id: "brok-prosent",
    title: "Br\u00f8k, prosent og desimaltall",
    subject: "Matematikk",
    level: "10. trinn",
    type: "oppsummering",
    concepts: ["Br\u00f8k", "Prosent", "Desimaltall", "Omregning"],
    statements: [
      {
        text: "50 % er alltid det samme som halvparten.",
        fasit: "sant",
        color: "blue",
        explanation: "50 % betyr bokstavelig talt <span class=\"explanation-highlight\">50 per hundre</span>, som er det samme som 50/100 = 1/2. Uansett hva vi regner prosent av, vil 50 % alltid v\u00e6re halvparten av det totale.",
        begrunnelse: "\u00ab50 prosent betyr 50 av 100, og det er alltid en halv uansett hva det er\u00bb"
      },
      {
        text: "0,5 er st\u00f8rre enn 0,45 fordi 5 er st\u00f8rre enn 45.",
        fasit: "usant",
        color: "orange",
        explanation: "0,5 er st\u00f8rre enn 0,45, men <span class=\"explanation-highlight\">ikke fordi 5 er st\u00f8rre enn 45</span>. Vi m\u00e5 sammenligne siffer for siffer: 0,5 = 0,50. Tiendedelen (5) er st\u00f8rre enn tiendedelen (4), s\u00e5 0,50 > 0,45. Begrunnelsen i p\u00e5standen er alts\u00e5 feil selv om svaret tilfeldigvis stemmer.",
        begrunnelse: "\u00abP\u00e5standen er sant at 0,5 er st\u00f8rst, men begrunnelsen er helt feil \u2013 du m\u00e5 sammenligne desimal for desimal\u00bb"
      },
      {
        text: "1/3 kan skrives n\u00f8yaktig som et desimaltall.",
        fasit: "usant",
        color: "purple",
        explanation: "1/3 = 0,333... med uendelig mange desimaler. Det er en <span class=\"explanation-highlight\">periodisk desimal</span> som aldri stopper. Vi kan avrunde til 0,33 eller 0,333, men det blir aldri helt n\u00f8yaktig.",
        begrunnelse: "\u00abN\u00e5r du deler 1 p\u00e5 3 f\u00e5r du 0,3333 som bare fortsetter, s\u00e5 det blir aldri helt riktig\u00bb"
      },
      {
        text: "Hvis en vare koster 200 kr og f\u00e5r 25 % rabatt, sparer du 50 kr.",
        fasit: "sant",
        color: "yellow",
        explanation: "25 % av 200 kr = 0,25 \u00d7 200 = <span class=\"explanation-highlight\">50 kr</span>. For \u00e5 regne prosent av et tall, gj\u00f8r du prosenten om til desimaltall og ganger. 25 % = 25/100 = 0,25.",
        begrunnelse: "\u00ab25 prosent av 200 er 50, for du tar en fjerdedel av prisen\u00bb"
      }
    ]
  },

  "cellebiologi": {
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
        color: "blue",
        explanation: "Celleteorien sier at alle levende ting best\u00e5r av \u00e9n eller flere <span class=\"explanation-highlight\">celler</span>. Bakterier har \u00e9n celle, mens mennesker har rundt 37 billioner celler som samarbeider.",
        begrunnelse: "\u00abAlt som lever har celler \u2013 b\u00e5de sm\u00e5 bakterier og store dyr\u00bb"
      },
      {
        text: "DNA finnes bare i cellekjernen.",
        fasit: "usant",
        color: "orange",
        explanation: "Det meste av DNA-et finnes i <span class=\"explanation-highlight\">cellekjernen</span>, men mitokondrier har ogs\u00e5 sitt eget DNA. Mitokondrie-DNA arves kun fra mor og er viktig for cellens energiproduksjon.",
        begrunnelse: "\u00abMitokondrier, som lager energi i cellen, har ogs\u00e5 sitt eget DNA som vi arver fra mamma\u00bb"
      },
      {
        text: "Gener bestemmer alene hvordan vi ser ut og hvem vi er.",
        fasit: "usant",
        color: "purple",
        explanation: "Genene gir en <span class=\"explanation-highlight\">oppskrift</span>, men milj\u00f8et p\u00e5virker ogs\u00e5 hvordan genene uttrykkes. For eksempel: gener bestemmer potensialet for h\u00f8yde, men ern\u00e6ring avgj\u00f8r hvor h\u00f8y du faktisk blir. Dette kalles <span class=\"explanation-highlight\">samspill mellom arv og milj\u00f8</span>.",
        begrunnelse: "\u00abGenene gir muligheter, men milj\u00f8et rundt oss bestemmer ogs\u00e5 mye \u2013 som hva vi spiser og hvordan vi lever\u00bb"
      },
      {
        text: "Ved celledeling f\u00e5r de nye cellene n\u00f8yaktig samme DNA som den opprinnelige cellen.",
        fasit: "sant",
        color: "yellow",
        explanation: "I <span class=\"explanation-highlight\">mitose</span> (vanlig celledeling) kopieres DNA-et f\u00f8r cellen deler seg, slik at begge dattercellene f\u00e5r identiske kopier. Sm\u00e5 kopieringsfeil kan oppst\u00e5, men normalt repareres disse av cellens egne kontrollsystemer.",
        begrunnelse: "\u00abCellen kopierer alt DNA-et f\u00f8rst, og s\u00e5 deler den seg slik at begge nye celler har det samme\u00bb"
      },
      {
        text: "Mennesker har 46 kromosomer, og vi arver 23 fra hver forelder.",
        fasit: "sant",
        color: "red",
        explanation: "Menneskeceller har <span class=\"explanation-highlight\">23 kromosompar</span> \u2013 totalt 46. Vi f\u00e5r ett sett med 23 fra mor (via egget) og ett sett med 23 fra far (via s\u00e6dcellen). Det er dette som gj\u00f8r at vi ligner p\u00e5 begge foreldrene.",
        begrunnelse: "\u00abVi f\u00e5r halvparten av kromosomene fra mamma og halvparten fra pappa, s\u00e5 vi ligner p\u00e5 begge\u00bb"
      }
    ]
  },

  "geometri": {
    id: "geometri",
    title: "Geometri og areal",
    subject: "Matematikk",
    level: "9. trinn",
    type: "intro",
    concepts: ["Areal", "Omkrets", "Trekant", "Sirkel", "Pytagoras"],
    statements: [
      {
        text: "Arealet av en trekant er alltid halvparten av arealet til et rektangel med samme grunnlinje og h\u00f8yde.",
        fasit: "sant",
        color: "blue",
        explanation: "Formelen for trekantens areal er A = \u00bd \u00d7 g \u00d7 h. Et rektangel med samme grunnlinje og h\u00f8yde har areal A = g \u00d7 h. Trekanten er alltid <span class=\"explanation-highlight\">halvparten</span>, uansett form p\u00e5 trekanten.",
        begrunnelse: "\u00abHvis du tegner et rektangel rundt en trekant, fyller trekanten alltid n\u00f8yaktig halve rektangelet\u00bb"
      },
      {
        text: "En sirkel med radius 5 cm har omkrets p\u00e5 nesten 31,4 cm.",
        fasit: "sant",
        color: "orange",
        explanation: "Omkretsen av en sirkel er O = 2\u03c0r. Med r = 5 cm: O = 2 \u00d7 3,14 \u00d7 5 = <span class=\"explanation-highlight\">31,4 cm</span>. Pi (\u03c0) er forholdet mellom omkrets og diameter, og er omtrent 3,14.",
        begrunnelse: "\u00abDu ganger diameteren med pi, og 10 ganger 3,14 blir 31,4\u00bb"
      },
      {
        text: "To trekanter med samme areal har alltid samme form.",
        fasit: "usant",
        color: "purple",
        explanation: "Ulike trekanter kan ha <span class=\"explanation-highlight\">samme areal men helt forskjellig form</span>. For eksempel: en trekant med grunnlinje 10 og h\u00f8yde 4 har samme areal som en med grunnlinje 8 og h\u00f8yde 5 (begge = 20). Likt areal betyr ikke lik form.",
        begrunnelse: "\u00abDu kan tegne mange forskjellige trekanter som alle har likt areal, s\u00e5 de trenger ikke se like ut\u00bb"
      },
      {
        text: "Pytagoras\u2019 setning fungerer for alle typer trekanter.",
        fasit: "usant",
        color: "yellow",
        explanation: "Pytagoras\u2019 setning (a\u00b2 + b\u00b2 = c\u00b2) gjelder <span class=\"explanation-highlight\">bare for rettvinklede trekanter</span>, der c er hypotenusen (den lengste siden, mot den rette vinkelen). For andre trekanter m\u00e5 man bruke cosinussetningen.",
        begrunnelse: "\u00abPytagoras gjelder bare n\u00e5r trekanten har en vinkel p\u00e5 90 grader\u00bb"
      },
      {
        text: "Hvis du dobler alle sidene i en figur, dobles ogs\u00e5 arealet.",
        fasit: "usant",
        color: "red",
        explanation: "N\u00e5r alle sidene dobles, \u00f8ker arealet med <span class=\"explanation-highlight\">faktoren 4</span> (2\u00b2), ikke 2. Areal m\u00e5les i kvadratenheter, s\u00e5 skaleringseffekten er kvadratisk. Et rektangel 2\u00d73 har areal 6, men 4\u00d76 har areal 24 (4 ganger s\u00e5 stort).",
        begrunnelse: "\u00abN\u00e5r du ganger b\u00e5de bredde og h\u00f8yde med 2, blir arealet 4 ganger s\u00e5 stort, ikke 2\u00bb"
      }
    ]
  },

  "demokrati": {
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
        color: "orange",
        explanation: "Demokrati handler om mer enn bare flertallsstyre. <span class=\"explanation-highlight\">Rettsstaten</span> og <span class=\"explanation-highlight\">menneskerettighetene</span> beskytter minoriteter mot flertallets makt. Grunnloven setter grenser for hva et flertall kan vedta.",
        begrunnelse: "\u00abFlertallet kan ikke ta fra folk grunnleggende rettigheter, selv om de er mange nok til \u00e5 stemme det igjennom\u00bb"
      },
      {
        text: "Ytringsfrihet betyr at du kan si hva du vil uten noen begrensninger.",
        fasit: "usant",
        color: "purple",
        explanation: "Ytringsfrihet er en grunnleggende rett, men den har <span class=\"explanation-highlight\">begrensninger</span>. Hatefulle ytringer, trusler og \u00e6rekrenkelser er ikke beskyttet. Norges lover balanserer ytringsfrihet mot andre rettigheter som personvern og vern mot diskriminering.",
        begrunnelse: "\u00abDu har lov til \u00e5 mene mye, men du kan ikke true noen eller spre hat \u2013 det er fortsatt ulovlig\u00bb"
      },
      {
        text: "Stortinget vedtar lovene i Norge, og regjeringen gjennomf\u00f8rer dem.",
        fasit: "sant",
        color: "blue",
        explanation: "Dette er et eksempel p\u00e5 <span class=\"explanation-highlight\">maktfordeling</span>. Stortinget (lovgivende makt) vedtar lover, regjeringen (utf\u00f8rende makt) setter dem ut i livet, og domstolene (d\u00f8mmende makt) avgj\u00f8r tvister. Denne tredelingen forhindrer maktmisbruk.",
        begrunnelse: "\u00abStortinget lager reglene, regjeringen sier til folk at de m\u00e5 f\u00f8lge dem, og domstolene d\u00f8mmer hvis noen bryter dem\u00bb"
      },
      {
        text: "Alle som bor i Norge har stemmerett ved stortingsvalg.",
        fasit: "usant",
        color: "yellow",
        explanation: "For \u00e5 stemme ved stortingsvalg m\u00e5 du v\u00e6re <span class=\"explanation-highlight\">norsk statsborger</span> og fylle 18 \u00e5r i valg\u00e5ret. Utenlandske statsborgere kan stemme ved kommunevalg etter 3 \u00e5rs botid, men ikke ved stortingsvalg.",
        begrunnelse: "\u00abBare de som er norske statsborgere og er gamle nok f\u00e5r stemme p\u00e5 Stortinget\u00bb"
      },
      {
        text: "Pressefrihet er viktig for demokratiet fordi mediene fungerer som en vaktbikkje.",
        fasit: "sant",
        color: "red",
        explanation: "Frie medier kalles ofte \u00abden fjerde statsmakt\u00bb fordi de <span class=\"explanation-highlight\">gransker</span> og <span class=\"explanation-highlight\">avdekker</span> maktmisbruk. Uten pressefrihet kan politikere og myndigheter handle uten innsyn, noe som undergraver demokratisk kontroll.",
        begrunnelse: "\u00abHvis ingen f\u00e5r skrive om hva politikerne gj\u00f8r, kan de gj\u00f8re hva de vil uten at folk f\u00e5r vite det\u00bb"
      }
    ]
  },

  "retorikk": {
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
        color: "blue",
        explanation: "Etos er det retoriske virkemiddelet som bygger p\u00e5 <span class=\"explanation-highlight\">avsenderens troverdighet</span>. En lege som snakker om helse har h\u00f8y etos. Vi overbevises lettere av noen vi stoler p\u00e5 og oppfatter som kompetente.",
        begrunnelse: "\u00abHvis du stoler p\u00e5 den som snakker, er det lettere \u00e5 tro p\u00e5 det de sier\u00bb"
      },
      {
        text: "Patos er det sterkeste argumentet fordi f\u00f8lelser alltid trumfer logikk.",
        fasit: "usant",
        color: "orange",
        explanation: "Patos (appell til f\u00f8lelser) er kraftfullt, men <span class=\"explanation-highlight\">ikke alltid sterkest</span>. God argumentasjon bruker en blanding av etos, patos og logos. Ren patos uten logos kan oppfattes som manipulerende.",
        begrunnelse: "\u00abF\u00f8lelser er viktige, men du trenger ogs\u00e5 fakta og logikk for at argumentet skal v\u00e6re godt\u00bb"
      },
      {
        text: "Et argument best\u00e5r av en p\u00e5stand og en begrunnelse.",
        fasit: "sant",
        color: "purple",
        explanation: "Et argument har minst to deler: <span class=\"explanation-highlight\">p\u00e5standen</span> (det du mener) og <span class=\"explanation-highlight\">begrunnelsen</span> (hvorfor du mener det). Uten begrunnelse er det bare en p\u00e5stand, ikke et argument. Gode argumenter har ogs\u00e5 st\u00f8ttebevis.",
        begrunnelse: "\u00abDu m\u00e5 si b\u00e5de hva du mener og hvorfor, ellers er det ikke et skikkelig argument\u00bb"
      },
      {
        text: "I en debatt er det viktigst \u00e5 snakke h\u00f8yest og lengst for \u00e5 vinne.",
        fasit: "usant",
        color: "yellow",
        explanation: "\u00c5 snakke h\u00f8yest er et eksempel p\u00e5 <span class=\"explanation-highlight\">usaklig argumentasjon</span>. I god debatt handler det om \u00e5 lytte, m\u00f8te motargumenter og bygge logiske resonnement. Overtalelse gjennom volum er ikke argumentasjon \u2013 det er press.",
        begrunnelse: "\u00abDet hjelper ikke \u00e5 rope hvis du ikke har gode argumenter \u2013 da virker du bare usaklig\u00bb"
      }
    ]
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
        text: "British English uses \u2018colour\u2019 while American English uses \u2018color\u2019.",
        fasit: "sant",
        color: "blue",
        explanation: "This is one of the most common spelling differences. British English keeps the French-influenced <span class=\"explanation-highlight\">-our</span> ending (colour, honour, favour), while American English simplified it to <span class=\"explanation-highlight\">-or</span> after Noah Webster\u2019s spelling reforms in the 1800s.",
        begrunnelse: "\u00abWebster \u00f8nsket \u00e5 forenkle stavem\u00e5ten i Amerika, s\u00e5 han fjernet u-en fra mange ord\u00bb"
      },
      {
        text: "Americans say \u2018lorry\u2019 and British say \u2018truck\u2019.",
        fasit: "usant",
        color: "orange",
        explanation: "Det er <span class=\"explanation-highlight\">omvendt</span>: britene sier \u2018lorry\u2019 og amerikanerne sier \u2018truck\u2019. Andre eksempler: lift/elevator, boot/trunk, flat/apartment, biscuit/cookie.",
        begrunnelse: "\u00abDet er britene som sier lorry og amerikanerne som sier truck \u2013 p\u00e5standen har byttet om\u00bb"
      },
      {
        text: "In British English, the past tense of \u2018learn\u2019 can be either \u2018learned\u2019 or \u2018learnt\u2019.",
        fasit: "sant",
        color: "purple",
        explanation: "British English godtar begge formene: <span class=\"explanation-highlight\">learned</span> og <span class=\"explanation-highlight\">learnt</span>. Det samme gjelder dreamed/dreamt, burned/burnt og spelled/spelt. Amerikansk engelsk bruker nesten utelukkende -ed-formen.",
        begrunnelse: "\u00abI britisk engelsk kan du velge mellom begge formene, men amerikanere bruker nesten alltid -ed\u00bb"
      },
      {
        text: "American English and British English have completely different grammar systems.",
        fasit: "usant",
        color: "yellow",
        explanation: "Grammatikksystemene er i hovedsak <span class=\"explanation-highlight\">like</span>. Forskjellene er sm\u00e5: amerikanere sier \u2018I just ate\u2019 der briter foretrekker \u2018I\u2019ve just eaten\u2019. Collective nouns er entall i AE (\u2018the team is\u2019) men kan v\u00e6re flertall i BE (\u2018the team are\u2019).",
        begrunnelse: "\u00abSpesielle sm\u00e5 forskjeller fins, men det meste av grammatikken er lik\u00bb"
      },
      {
        text: "The word \u2018football\u2019 refers to the same sport in both British and American English.",
        fasit: "usant",
        color: "red",
        explanation: "I British English betyr \u2018football\u2019 det vi p\u00e5 norsk kaller <span class=\"explanation-highlight\">fotball</span> (soccer). I American English betyr \u2018football\u2019 <span class=\"explanation-highlight\">amerikansk fotball</span>, og det vi kaller fotball heter \u2018soccer\u2019.",
        begrunnelse: "\u00abBriter mener vanlig fotball n\u00e5r de sier football, men amerikanere mener den sporten med hjelm og tackles\u00bb"
      }
    ]
  }

};

// ── Helper: get FagPrat by ID ──
function getFagPrat(id) {
  return FAGPRAT_DATA[id] || null;
}

// ── Helper: get current FagPrat from localStorage ──
function getCurrentFagPrat() {
  var id = localStorage.getItem('fagprat-current-id');
  return id ? getFagPrat(id) : null;
}

// ── Helper: get current statement from localStorage ──
function getCurrentStatement() {
  var fp = getCurrentFagPrat();
  var idx = parseInt(localStorage.getItem('fagprat-current-statement') || '0');
  return fp && fp.statements[idx] ? fp.statements[idx] : null;
}

// ── Helper: get current statement index ──
function getCurrentStatementIndex() {
  return parseInt(localStorage.getItem('fagprat-current-statement') || '0');
}
