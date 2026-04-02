# FagPrat - Utvikleroppgaver

Dette dokumentet beskriver hva som skal bygges for hver del av FagPrat-applikasjonen. Bruk HTML-prototypene i `forslag-12/` som visuell referanse for utseende, layout og interaksjon. Designtokens (farger, spacing, fonter osv.) ligger i `tokens.css`.

> **Visuell referanse:** Åpne hver HTML-fil i nettleseren for å se nøyaktig hvordan siden skal se ut. Start en lokal server med `npx serve .` og naviger til filene.

---

## Utforsk (`utforsk.html`)

Utforsk-siden er der lærere kan bla gjennom og finne FagPrats laget av andre lærere.

### Layout

- Venstre sidebar (fast 220px, alltid utvidet) med logo, navigasjon og brukerprofil
- Hovedinnhold med overskrift, søk/filter-linje og kortrutenett

### Sidebar (felles for alle sider med sidebar)

Sidebaren er identisk på `utforsk.html`, `min-samling.html`, `preview-fagprat.html`, `lag-pastand.html`, `velg-pastander.html`, `lagre-fagprat.html` og `fagprat-edit.html`.

| Element                | Plassering                             | Utseende                                               | Hva skjer ved klikk                               |
| ---------------------- | -------------------------------------- | ------------------------------------------------------ | ------------------------------------------------- |
| **Evalion-logo**       | Øverst i sidebar                       | Evalion-logoen                                         | Navigerer til `utforsk.html`                      |
| **"+ Lag en FagPrat"** | Under logoen, lilla knapp med `+`-ikon | Bred lilla knapp med hvit tekst og rosa-lilla gradient | Navigerer til `lag-pastand.html`                  |
| **"Utforsk"**          | Navigasjonslenke med kompass-ikon      | Aktiv: lys bakgrunn, lilla tekst. Inaktiv: grå tekst   | Navigerer til `utforsk.html`                      |
| **"Min samling"**      | Navigasjonslenke med mappe-ikon        | Samme styling som over                                 | Navigerer til `min-samling.html`                  |
| **"Historikk"**        | Navigasjonslenke med klokke-ikon       | Samme styling som over                                 | Navigerer til `historikk.html` (skal bygges)      |
| **Brukerprofil**       | Nederst i sidebar                      | Sirkulær avatar med initialer + navn + e-post          | Ikke klikkbar i prototypen. Skal åpne profilmeny. |

### Søk og filtrering

| Element         | Plassering                        | Utseende                                                              | Hva skjer ved klikk                                       |
| --------------- | --------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------- |
| **Søkefelt**    | Topp av hovedinnhold, full bredde | Tekstfelt med lupe-ikon, placeholder: "Søk etter fag, tema, trinn..." | Fritekst-søk. Søker i tittel, fag, tema og nøkkelord      |
| **Filterknapp** | Høyre side av søkefeltet          | Sirkulær knapp med tre horisontale linjer (filter-ikon)               | Åpner/lukker et filterpanel som dropdown under søkelinjen |

**Filterpanelet** (vises som dropdown under filterknappen):

| Element                             | Utseende                                                   | Hva skjer ved klikk                                                                        |
| ----------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **"Mest relevant" / "Nyeste"**      | To radioknapper under "SORTERING"-overskrift               | Bytter sorteringsrekkefølge. Kun én kan være valgt                                         |
| **"Introduksjon" / "Oppsummering"** | To avkryssingsbokser under "FORKUNNSKAPER" med farget ikon | Filtrerer på forkunnskapstype. Begge kan velges samtidig                                   |
| **Fag-dropdown**                    | Dropdown under "FAG"-overskrift, viser f.eks. "Naturfag"   | Åpner en nedtrekksliste med fag: Naturfag, Matematikk, Samfunnsfag, Fysikk, Norsk, Engelsk |
| **Trinn-dropdown**                  | Dropdown under "TRINN"-overskrift, viser f.eks. "9. trinn" | Åpner en nedtrekksliste med trinn: 8. trinn, 9. trinn, 10. trinn, VG1, VG2, VG3            |

Filterpanelet lukkes automatisk ved klikk utenfor panelet.

### FagPrat-kort (rutenett)

Kortene vises i et 3-kolonners rutenett (responsivt). Hvert kort inneholder:

- **Fag-tagg** (f.eks. "Naturfag") + **Trinn-tagg** (f.eks. "10. trinn") + **Forkunnskap-ikon** (grønn sirkel med bok-ikon for introduksjon, oransje for oppsummering)
- **Tittel** i fet skrift (f.eks. "Klimaendringer og bærekraft")
- **Antall påstander** (f.eks. "5 påstander")
- **Antall ganger brukt** med ikon (f.eks. "Brukt 31 ganger")
- **Forfatter** med sirkulær avatar + navn (f.eks. "Kristine Hansen")

| Handling          | Hva skjer                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| **Hover på kort** | Kortet løftes litt opp og får større skygge                                                     |
| **Klikk på kort** | Lagrer FagPrat-ID i localStorage (`fagprat-current-id`) og navigerer til `preview-fagprat.html` |

---

## Min samling (`min-samling.html`)

Min samling viser lærerens egne lagrede FagPrats.

### Layout

- Samme sidebar som Utforsk (med "Min samling" markert som aktiv)
- Overskrift "Min samling", søkefelt, sorteringsdropdown, kortrutenett

### Søk og sortering

| Element                | Plassering                        | Utseende                                                   | Hva skjer ved klikk                                                                                            |
| ---------------------- | --------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Søkefelt**           | Øverst til venstre i hovedinnhold | Tekstfelt med lupe-ikon, placeholder: "Søk i samlingen..." | Filtrerer egne FagPrats med fritekst                                                                           |
| **Sorteringsdropdown** | Øverst til høyre                  | Dropdown som viser "Sist endret" med pil-ned               | Velg mellom "Sist endret" (flat liste etter dato) og "Fag" (grupperer kort etter fagkategori med overskrifter) |

### FagPrat-kort

Kortene har samme design som i Utforsk (fag-tagg, trinn-tagg, forkunnskap-ikon, tittel, antall påstander), men har i tillegg en rad med handlingsknapper i bunnen av kortet:

| Element                                      | Utseende                                                                     | Hva skjer ved klikk                                                                       |
| -------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **"Start liveøkt"**                          | Grønn knapp med rutenett-ikon og hvit tekst. Tar ca. halve bredden av kortet | Lagrer FagPrat-ID i localStorage og navigerer til `start-liveokt.html`                    |
| **Endre-knapp**                              | Sirkulær turkis knapp med blyant-ikon                                        | Lagrer FagPrat-ID i localStorage og navigerer til `fagprat-edit.html`                     |
| **Mer-knapp**                                | Sirkulær knapp med tre vertikale prikker                                     | Skal åpne en meny med flere valg: duplikere, slette, osv. (ikke implementert i prototype) |
| **Klikk på selve kortet** (utenfor knappene) | Hele kortet er klikkbart med hover-effekt                                    | Lagrer FagPrat-ID i localStorage og navigerer til `preview-fagprat.html`                  |

**Viktig:** Knappeklikk (Start liveøkt, Endre, Mer) må bruke `event.stopPropagation()` for å hindre at kortklikket også trigges.

---

## Forhåndsvisning av FagPrat (`preview-fagprat.html`)

Viser en fullstendig oversikt over en FagPrat med alle påstander, fasit og forklaringer.

### Layout

- Sidebar + hovedinnhold
- Tilbake-lenke øverst
- Toppseksjon med tittel og handlingsknapper
- Metadata-tagger + viktige begreper
- Påstandstabell

### Interaktive elementer

| Element             | Plassering                                      | Utseende                                                | Hva skjer ved klikk                                     |
| ------------------- | ----------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| **"Tilbake"**       | Øverst til venstre i hovedinnhold               | Lenke med venstrepil + "Tilbake" i grå tekst            | Navigerer til forrige side (min-samling eller utforsk)  |
| **"Start liveøkt"** | Øverst til høyre, grønn knapp med rutenett-ikon | Bred grønn pill-formet knapp med hvit tekst             | Navigerer til `start-liveokt.html`                      |
| **"Endre"**         | Til høyre for Start liveøkt                     | Hvit pill-formet knapp med blyant-ikon og "Endre" tekst | Navigerer til `fagprat-edit.html`                       |
| **"Mer"**           | Helt til høyre                                  | Hvit pill-formet knapp med tre prikker og "Mer" tekst   | Skal åpne meny med flere valg (duplikere, slette, osv.) |

### Innhold (dynamisk, hentet fra backend)

**Metadata-rad:**

- Fag-tagg (f.eks. "Naturfag"), trinn-tagg (f.eks. "10. trinn"), forkunnskap-ikon

**Viktige begreper:**

- Rad med pill-formede tagger i lilla (f.eks. "Drivhuseffekt", "CO2", "Fossil energi"). Begrepene hentes fra FagPrat-dataen.

**Påstandstabell:**

- Tre kolonner med grid-ratio `2fr 100px 3fr`: Påstand | Fasit | Forklaring
- Kolonneoverskrifter: "PÅSTAND", "FASIT", "FORKLARING" i grå, liten tekst
- For hver påstand vises:
  - Påstandsteksten (venstrejustert)
  - Fasit-badge: "SANT" (grønn pill), "USANT" (rød pill) eller "DELVIS SANT" (oransje pill)
  - Forklaringsteksten (ren tekst, uten formatering)
- Radene er adskilt med tynne linjer
- Antall rader er dynamisk (1-5 påstander)

---

## Opprett FagPrat (`lag-pastand.html`)

Siden der læreren oppretter en ny FagPrat fra bunnen av.

### Layout

- Sidebar + hovedinnhold
- Sticky topplinje med overskrift og handlingsknapper
- Metadata-kort (fag, trinn, forkunnskap)
- Påstandsseksjon med manuelt opprettede påstander

### Topplinje

| Element      | Plassering                  | Utseende                             | Hva skjer ved klikk                      |
| ------------ | --------------------------- | ------------------------------------ | ---------------------------------------- |
| **"Avbryt"** | Øverst til høyre            | Hvit pill-knapp med ramme, grå tekst | Navigerer tilbake til `min-samling.html` |
| **"Neste"**  | Helt til høyre i topplinjen | Lilla pill-knapp med hvit tekst      | Navigerer til `lagre-fagprat.html`       |

### Metadata-kort

| Element                 | Plassering                                      | Utseende                                                                                             | Hva skjer ved klikk                                                                                      |
| ----------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Fag-dropdown**        | Venstre halvdel av metadata-kortet, under "FAG" | Dropdown med placeholder "Velg fag" og pil-ned ikon                                                  | Åpner nedtrekksliste: Naturfag, Matematikk, Samfunnsfag, Fysikk, Norsk, Engelsk                          |
| **Trinn-dropdown**      | Høyre halvdel, under "TRINN"                    | Dropdown med placeholder "Velg trinn" og pil-ned ikon                                                | Åpner nedtrekksliste: 8. trinn - VG3                                                                     |
| **"Introduksjon"-kort** | Venstre under "FORKUNNSKAPER"                   | Klikkbart kort med bok-ikon, tittel "Introduksjon" og beskrivelse "Lite eller ingen forkunnskaper"   | Velges som forkunnskapstype. Får lilla ramme og bakgrunn. Bare ett valg om gangen (radioknapp-oppførsel) |
| **"Oppsummering"-kort** | Høyre under "FORKUNNSKAPER"                     | Klikkbart kort med hjerne-ikon, tittel "Oppsummering" og beskrivelse "Noen eller gode forkunnskaper" | Velges som forkunnskapstype. Samme radioknapp-oppførsel som over                                         |

### Påstandsseksjon

| Element                       | Plassering                                  | Utseende                                      | Hva skjer ved klikk                                                                               |
| ----------------------------- | ------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **"Lag påstander med REDDI"** | Høyre side av "Mine påstander"-overskriften | Hvit pill-knapp med robot-ikon og lilla tekst | Deaktivert (grået ut) til fag, trinn og forkunnskaper er valgt. Når aktivert: åpner REDDI-modalen |
| **"+ Legg til påstand"**      | Til høyre for REDDI-knappen                 | Hvit pill-knapp med + ikon                    | Legger til et nytt tomt påstandskort nederst                                                      |

**REDDI-modal** (popup som dekker skjermen med halvgjennomsiktig bakgrunn):

- REDDI-avatar (robot-ikon) og tittel "Lag påstander med REDDI"
- 3-trinns prosessindikator (1. Beskriv tema, 2. Velg påstander, 3. Fullfør)
- Tekstfelt: "Hva skal påstandene handle om?" med placeholder
- **"Avbryt"**-knapp (lukker modalen)
- **"Generer påstander"**-knapp (lilla, navigerer til `velg-pastander.html`)

### Påstandskort (gjentas for hver påstand)

Hvert påstandskort har et nummerert sirkelikon (1, 2, 3...) øverst til venstre.

| Element                          | Plassering                                    | Utseende                                       | Hva skjer ved klikk                                              |
| -------------------------------- | --------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| **Drag-håndtak**                 | Øverst til høyre, ikon 1 av 4                 | Tre horisontale streker                        | Dra for å endre rekkefølge på påstandene (drag-and-drop)         |
| **KI-forslag-knapp**             | Øverst til høyre, ikon 2 av 4                 | Firkant med gnist-ikon                         | Ber REDDI om å forbedre påstanden (KI-basert)                    |
| **Slett-knapp**                  | Øverst til høyre, ikon 4 av 4                 | Søppelbøtte-ikon                               | Sletter hele påstandskortet                                      |
| **Påstand-tekstfelt**            | Under "PÅSTAND"-label                         | Stort tekstfelt med placeholder                | Fritekst-input for påstandsteksten                               |
| **Bildeopplasting (påstand)**    | Til høyre for påstand-tekstfeltet             | Lite bilde-ikon                                | Åpner filopplasting for å legge til illustrasjon                 |
| **Fasit-dropdown**               | Under "FASIT"-label                           | Fargekodet pill-dropdown som viser valgt fasit | Tre valg: "SANT" (grønn), "DELVIS SANT" (oransje), "USANT" (rød) |
| **Forklaring-tekstfelt**         | Under "FORKLARING"-label, til høyre for fasit | Stort tekstfelt                                | Fritekst-input for professorens forklaring                       |
| **Bildeopplasting (forklaring)** | Til høyre for forklaring-tekstfeltet          | Lite bilde-ikon                                | Åpner filopplasting for illustrasjon til forklaringen            |

**"Neste"-knapp** (nederst, sentrert): Lilla knapp som navigerer til `lagre-fagprat.html`.

---

## Velg påstander fra REDDI (`velg-pastander.html`)

Etter at REDDI har generert påstander, velger læreren hvilke som skal inkluderes.

### Layout

- Sidebar + hovedinnhold
- Tilbake-lenke øverst
- 3-kolonners rutenett: Sant, Usant, Delvis sant
- Fast bunnlinje med teller og knapp

### Interaktive elementer

| Element       | Plassering         | Utseende                 | Hva skjer ved klikk                      |
| ------------- | ------------------ | ------------------------ | ---------------------------------------- |
| **"Tilbake"** | Øverst til venstre | Grå lenke med venstrepil | Navigerer tilbake til `lag-pastand.html` |

### Tre kolonner med genererte påstander

Hver kolonne har en farget overskrift:

- **"Sant"** (grønn topplinje): 5 påstandskort
- **"Usant"** (rød topplinje): 5 påstandskort
- **"Delvis sant"** (oransje topplinje): 5 påstandskort

| Element                   | Utseende                                                   | Hva skjer ved klikk                                                                                                   |
| ------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Påstandskort** (15 stk) | Hvite kort med lys bakgrunn og tekst. Avrundet med padding | Klikk velger/avvelger kortet. Valgt kort: farget venstre-kant, mørkere ramme og skygge. Avvalgt: hvitt uten markering |

### Bunnlinje (fast, følger skjermkanten)

| Element                    | Plassering                 | Utseende                                                              | Hva skjer ved klikk                                                                                                                         |
| -------------------------- | -------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **REDDI-attribusjon**      | Venstre side av bunnlinjen | Robot-ikon + "Foreslått av REDDI" i grå tekst                         | Ikke klikkbar                                                                                                                               |
| **"Legg til X påstander"** | Høyre side av bunnlinjen   | Lilla pill-knapp. Viser antall valgte (f.eks. "Legg til 3 påstander") | Deaktivert (grå, cursor: not-allowed) til minst en er valgt. Klikk: legger til valgte påstander og navigerer tilbake til `lag-pastand.html` |

Telleteksten i knappen oppdateres dynamisk: "Legg til 1 påstand", "Legg til 2 påstander" osv.

---

## Fullfør FagPrat (`lagre-fagprat.html`)

Siste steg for å lagre en ny FagPrat.

### Layout

- Sidebar + hovedinnhold
- Sticky topplinje med overskrift og knapper
- Tre seksjoner: Tittel, Viktige begreper, Synlighet

### Topplinje

| Element       | Plassering                                   | Utseende                        | Hva skjer ved klikk                                                |
| ------------- | -------------------------------------------- | ------------------------------- | ------------------------------------------------------------------ |
| **"Tilbake"** | Øverst til høyre (venstre av de to knappene) | Hvit pill-knapp med ramme       | Navigerer tilbake til `lag-pastand.html`                           |
| **"Lagre"**   | Helt til høyre                               | Lilla pill-knapp med hvit tekst | Lagrer FagPraten til databasen og navigerer til `min-samling.html` |

### Innhold

| Element                         | Plassering                                  | Utseende                                                                              | Hva skjer ved klikk                                                                               |
| ------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Tittel-tekstfelt**            | Under "TITTEL PÅ DIN FAGPRAT"               | Stort tekstfelt, placeholder: "F.eks. Newtons lover, Fotosyntesen..."                 | Fritekst-input                                                                                    |
| **KI-forslag-knapp (begreper)** | Til høyre for "VIKTIGE BEGREPER"-overskrift | Lite sirkulært ikon med KI-gnist                                                      | Ber KI om å foreslå relevante begreper basert på påstandene                                       |
| **Begrep-tagger**               | Under begreper-overskriften                 | Lilla pill-tagger med tekst + X-knapp (f.eks. "Kraft x", "Masse x", "Akselerasjon x") | X-knappen fjerner begrepet                                                                        |
| **"+ Legg til begrep"**         | Etter siste begrep-tagg                     | Grå pill med + ikon og tekst                                                          | Legger til et nytt begrep (åpner tekstfelt)                                                       |
| **"Offentlig"-knapp**           | Under "SYNLIGHET"                           | Pill-knapp med globus-ikon. Når aktiv: lilla bakgrunn. Når inaktiv: hvit              | Setter synlighet til offentlig. Beskrivelse endres til: "Alle kan finne og bruke denne FagPraten" |
| **"Privat"-knapp**              | Til høyre for Offentlig                     | Pill-knapp med lås-ikon. Samme aktiv/inaktiv-styling                                  | Setter synlighet til privat. Beskrivelse endres til: "Bare du kan se og bruke denne FagPraten"    |

Bare en synlighetsknapp kan være aktiv om gangen (radioknapp-oppførsel).

---

## Rediger FagPrat (`fagprat-edit.html`)

Redigeringssiden for en eksisterende FagPrat.

### Layout

- Sidebar + hovedinnhold
- Sticky topplinje med "Rediger FagPrat", Avbryt-knapp og "Lagre endringer"-knapp
- Metadata-kort med to moduser (lese og redigere)
- Påstandsseksjon med eksisterende påstander

### Topplinje

| Element               | Plassering       | Utseende                        | Hva skjer ved klikk                                  |
| --------------------- | ---------------- | ------------------------------- | ---------------------------------------------------- |
| **"Avbryt"**          | Øverst til høyre | Hvit pill-knapp med ramme       | Navigerer tilbake (forkaster endringer)              |
| **"Lagre endringer"** | Helt til høyre   | Lilla pill-knapp med hvit tekst | Lagrer endringer og navigerer til `min-samling.html` |

### Metadata-kort

Metadata-kortet har to moduser:

**Lesemodus** (standard):
Viser fag-tagg, trinn-tagg, forkunnskap-ikon, tittel, synlighet-ikon og begreper som lilla pill-tagger.

| Element                             | Utseende                                                                            | Hva skjer ved klikk                         |
| ----------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------- |
| **Blyant-knapp (rediger metadata)** | Oransje sirkulær knapp med blyant-ikon, plassert øverst til høyre i metadata-kortet | Bytter metadata-kortet til redigeringsmodus |

**Redigeringsmodus** (etter klikk på blyant):
Alle felter er redigerbare, identisk med feltene i `lag-pastand.html` + `lagre-fagprat.html`:

- Tittel-tekstfelt
- Synlighets-toggle (Offentlig/Privat)
- Fag-dropdown
- Trinn-dropdown
- Forkunnskap-valgknapper (Introduksjon/Oppsummering)
- Begreper med X-knapp for fjerning, + Legg til, KI-forslag

| Element                          | Utseende    | Hva skjer ved klikk                                        |
| -------------------------------- | ----------- | ---------------------------------------------------------- |
| **"Avbryt"** (i metadata-kortet) | Hvit knapp  | Forkaster metadata-endringer, bytter tilbake til lesemodus |
| **"Lagre"** (i metadata-kortet)  | Lilla knapp | Lagrer metadata-endringer, bytter tilbake til lesemodus    |

### Påstandskort

Identisk struktur som i `lag-pastand.html`:

- Nummerert sirkel, drag-håndtak, KI-forslag, slett-knapp
- Påstand-tekstfelt med bildeopplasting
- Fasit-dropdown (Sant/Delvis sant/Usant)
- Forklaring-tekstfelt med bildeopplasting
- Alle felter er ferdig utfylt med eksisterende data fra backend

| Element                       | Plassering                  | Utseende                       | Hva skjer ved klikk                         |
| ----------------------------- | --------------------------- | ------------------------------ | ------------------------------------------- |
| **"Lag påstander med REDDI"** | Over påstandskortene        | Hvit pill-knapp med robot-ikon | Åpner REDDI-modal (samme som i lag-pastand) |
| **"+ Legg til påstand"**      | Til høyre for REDDI-knappen | Hvit pill-knapp med + ikon     | Legger til nytt tomt påstandskort           |

---

## Start liveøkt (`start-liveokt.html`)

Oppsettside der læreren konfigurerer innstillinger før liveøkten starter. Denne siden har **ikke** sidebar, den bruker fullskjerm-layout.

### Layout

- Fast topplinje med FagPrat-logo, dynamisk tittel og Avbryt-knapp
- To-kolonners innhold: venstre med tre valgkort, høyre med QR og neste-knapp

### Topplinje

| Element            | Plassering               | Utseende                                             | Hva skjer ved klikk     |
| ------------------ | ------------------------ | ---------------------------------------------------- | ----------------------- |
| **FagPrat-logo**   | Venstre i topplinjen     | FagPrat-logoen                                       | Ingen handling          |
| **FagPrat-tittel** | Til høyre for logo       | Dynamisk tekst, f.eks. "Klimaendringer og bærekraft" | Ingen handling          |
| **"Avbryt"**       | Høyre side av topplinjen | Hvit pill-knapp med ramme                            | Åpner bekreftelsesmodal |

### Bekreftelsesmodal (ved Avbryt)

| Element                                  | Utseende                                 | Hva skjer ved klikk                          |
| ---------------------------------------- | ---------------------------------------- | -------------------------------------------- |
| **Halvgjennomsiktig overlay**            | Mørk bakgrunn over hele skjermen         | Klikk på overlay lukker modalen              |
| **"Er du sikker på at du vil avbryte?"** | Hvit boks sentrert på skjermen med tekst | —                                            |
| **"Ja, avbryt"**                         | Rød/mørk knapp                           | Navigerer tilbake til `preview-fagprat.html` |
| **"Nei, fortsett oppsettet"**            | Hvit knapp med ramme                     | Lukker modalen, forblir på siden             |

### Tre valgkort (venstre kolonne)

Hvert kort har et ikon til venstre, tittel + beskrivelse i midten, og en toggle-bryter til høyre.

**Kort 1: Grupper**

| Element            | Utseende                                                  | Hva skjer ved klikk                                                                                     |
| ------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Toggle-bryter**  | Avrundet bryter, grå = av, blå/lilla = på                 | Slår grupper av/på. Når PÅ: viser stepper for antall grupper under beskrivelsen. Kortet får lilla ramme |
| **Minus-knapp**    | Sirkulær knapp med minus-tegn, vises kun når toggle er PÅ | Reduserer antall grupper (minimum 2)                                                                    |
| **Antall-visning** | Tall mellom minus og pluss (f.eks. "4")                   | Kun visning                                                                                             |
| **Pluss-knapp**    | Sirkulær knapp med pluss-tegn, vises kun når toggle er PÅ | Øker antall grupper (maksimum 8)                                                                        |

**Kort 2: Transkribering**

| Element           | Utseende       | Hva skjer ved klikk                                                                     |
| ----------------- | -------------- | --------------------------------------------------------------------------------------- |
| **Toggle-bryter** | Samme som over | Slår transkribering av/på. Når PÅ: viser advarsel om mikrofontilgang under beskrivelsen |

**Kort 3: Egenvurdering og refleksjon**

| Element           | Utseende       | Hva skjer ved klikk                                  |
| ----------------- | -------------- | ---------------------------------------------------- |
| **Toggle-bryter** | Samme som over | Slår egenvurdering av/på. Ingen ekstra innhold vises |

### Høyre kolonne

| Element                     | Plassering             | Utseende                                                   | Hva skjer ved klikk                                                                                            |
| --------------------------- | ---------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **QR-kode**                 | Øverst i høyre kolonne | Lilla QR-kode placeholder med "LÆRER-ANALYTICS" overskrift | Ikke klikkbar. Beskrivelse under: "Skann for sanntidsinnsikt i gruppeaktivitet og elevsvar underveis i økten." |
| **"Neste - opprett lobby"** | Under QR-koden         | Bred grønn pill-knapp med hvit tekst og pil                | Lagrer gruppeinnstillinger (av/på + antall) i localStorage og navigerer til `fagprat-lobby.html`               |

---

## Lobby (`fagprat-lobby.html`)

Venteromsiden der elevene kobler til og læreren ser hvem som er med. **Ingen sidebar** — fullskjerm-layout.

### Layout

- Fast topplinje med logo, tittel og handlingsknapper
- To-panel: venstre med kobleinformasjon, høyre med elevliste

### Topplinje

| Element                 | Plassering                                                                            | Utseende                                     | Hva skjer ved klikk                                                                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FagPrat-logo**        | Venstre                                                                               | FagPrat-logoen                               | Ingen handling                                                                                                                                                                          |
| **FagPrat-tittel**      | Til høyre for logo                                                                    | Dynamisk tekst                               | Ingen handling                                                                                                                                                                          |
| **"Opprett grupper"**   | Høyre side (kun synlig hvis grupper er aktivert i forrige steg)                       | Blå pill-knapp med gruppe-ikon og hvit tekst | Fordeler alle tilkoblede elever tilfeldig i grupper (antall bestemt i forrige steg). Etter klikk: visningen endres til gruppekolonner og denne knappen erstattes av "Start aktiviteten" |
| **"Start aktiviteten"** | Høyre side (synlig når grupper IKKE er aktivert, ELLER etter at grupper er opprettet) | Grønn pill-knapp med hvit tekst              | Navigerer til `fagprat-steg0.html`                                                                                                                                                      |

### Venstre panel: Kobleinformasjon

Kun visning, ikke klikkbart:

- Evalion-logo
- URL: "www.evalion.no/delta"
- Tekst: "Skriv inn koden for å bli med:"
- **Spillkode** i stor monospace-skrift (6 tegn, f.eks. "UBD2TS") med lilla ramme
- "Eller skann" + QR-kode placeholder

### Høyre panel: Elevliste

**Før gruppering:**

Elevene vises som fargede pill-kort i en flytende rad (flex-wrap).

| Element                   | Utseende                                                                                        | Hva skjer ved klikk                         |
| ------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------- |
| **Elevkort**              | Farget sirkel med initial + navn + X-knapp. Fargene varierer (grønn, oransje, rosa, blå, lilla) | Ingen handling på selve kortet              |
| **X-knapp** (på elevkort) | Lite kryss-ikon til høyre for navnet                                                            | Fjerner eleven fra lobbyen (sparker eleven) |

Bunnlinje: "Venter på at elever kobler til..." med pulserende animerte prikker + elevteller (f.eks. "5" med person-ikon)

**Etter gruppering** (klikk på "Opprett grupper"):

Visningen endres helt — elevene organiseres i kolonner:

- Hver kolonne har overskrift "Gruppe 1", "Gruppe 2" osv.
- Elevkortene vises som kompakte kort (180px brede) inni gruppekolonnene
- Elevkort i grupper har IKKE X-knapp (kan ikke sparkes etter gruppering)
- Animasjon: gruppene fader inn med forsinkelse (staggered, 0.08s mellom hver)

---

## Velg påstand - Steg 0 (`fagprat-steg0.html`)

Læreren velger hvilken påstand klassen skal jobbe med. **Ingen sidebar** — fullskjerm FagPrat-layout.

### Layout

- Topplinje med FagPrat-logo, dynamisk tittel og "Avslutt"-knapp
- Hovedinnhold: professor til venstre, påstandskort-rutenett til høyre
- Bunnnavigasjon med 6 steg (alle inaktive)

### Topplinje (felles for alle steg 0-6)

| Element                   | Plassering                | Utseende                                                          | Hva skjer ved klikk                                         |
| ------------------------- | ------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------- |
| **FagPrat-logo**          | Venstre                   | FagPrat-logoen                                                    | Ingen handling                                              |
| **Vertikal skillelinje**  | Mellom logo og tittel     | Tynn grå vertikal strek (1.5px, 32px høy)                         | —                                                           |
| **FagPrat-tittel**        | Til høyre for skillelinje | Dynamisk tekst i fet skrift, f.eks. "Klimaendringer og bærekraft" | Ingen handling                                              |
| **"Avslutt aktiviteten"** | Høyre side                | Rød pill-knapp med kryss-ikon og hvit tekst                       | Navigerer til `min-samling.html` (avslutter hele liveøkten) |

### Hovedinnhold

**Professorfigur (venstre side):**

- Stort sirkulært bilde (220px) med lilla kant
- Tekst under: "Velg en påstand"

**Påstandskort (høyre side, 2-kolonners grid):**

| Element                    | Utseende                                                                                                                      | Hva skjer ved klikk                                                                                                                                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Påstandskort** (1-5 stk) | Fargede kort med tekst. Fargene roterer: gul, blå, oransje, lilla, rød. Hvert kort har 2px farget ramme og matchende bakgrunn | Hover: kort forstørres litt (scale 1.03) med skygge. Klikk: valgt kort utheves (scale 1.05, stor skygge), alle andre dimmes (opacity 0.4, scale 0.97). Etter 600ms: navigerer til `fagprat-steg1.html` |

**Dynamisk tilpasning basert på antall kort:**

- **5 kort:** 2+2+1 layout, siste kort sentrert. Normal størrelse (min-height 110px, text-sm)
- **4 kort:** 2+2 layout. Litt større kort (min-height 130px, text-base, mer padding)
- **3 kort:** 2+1 layout, siste sentrert. Litt større kort
- **2 kort:** 2 kort side om side. Litt større kort
- **1 kort:** Sentrert alene. Litt større kort

### Bunnnavigasjon (felles for alle steg 0-6)

6 steg-indikatorer i en horisontal rad. Hvert steg har et nummerert sirkelikon og en kort label.

| Steg | Label                   | Navigerer til        |
| ---- | ----------------------- | -------------------- |
| 1    | Første stemmerunde      | `fagprat-steg1.html` |
| 2    | Diskusjon               | `fagprat-steg2.html` |
| 3    | Andre stemmerunde       | `fagprat-steg3.html` |
| 4    | Vise fasit              | `fagprat-steg4.html` |
| 5    | Professorens forklaring | `fagprat-steg5.html` |
| 6    | Egenvurdering           | `fagprat-steg6.html` |

**Tre tilstander for hvert steg:**

- **Inaktiv:** Grå sirkel, grå tekst, halvgjennomsiktig (opacity 0.45). Ikke klikkbar
- **Aktiv:** Lilla/blå bakgrunn, hvit tall i sirkel, lilla tekst. Klikkbar
- **Fullført:** Grønn sirkel med sjekkmerke. Klikkbar

I steg 0 er alle 6 inaktive.

---

## Steg 1: Første stemmerunde (`fagprat-steg1.html`)

Elevene stemmer individuelt på om påstanden er sant, delvis sant eller usant.

### Layout

- Topplinje (felles, se steg 0) + ekstra knapper
- Elevområde (venstre/sentrum): påstandskort + professor
- Lærerpanel (høyre, sammenleggbart)
- Bunnnavigasjon med steg 1 aktiv

### Topplinje (ekstra elementer utover felles)

| Element                   | Plassering                                                   | Utseende                                                                                     | Hva skjer ved klikk                                          |
| ------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **"Alle påstander"**      | Venstre, under topplinjen                                    | Hvit pill-knapp med venstrepil                                                               | Navigerer tilbake til `fagprat-steg0.html` (velg ny påstand) |
| **Timer** (i topplinjen)  | Sentrum av topplinjen. Skjult til læreren starter nedtelling | Hvit boks med svart monospace-tekst, f.eks. "00:24". Rød pulserende prikk vises under opptak | Kun visning. Kontrolleres fra lærerpanelet                   |
| **"Opptak"**              | Høyre, før "Avslutt"-knappen                                 | Grå pill-knapp med mikrofon-ikon. I steg 1: deaktivert (grået ut, cursor: not-allowed)       | Deaktivert i dette steget                                    |
| **"Avslutt aktiviteten"** | Helt til høyre                                               | Rød knapp (samme som steg 0)                                                                 | Navigerer til `min-samling.html`                             |

### Elevområde

| Element                      | Utseende                                                                                                                                           | Beskrivelse                                    |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **Påstandskort**             | Stort blått kort med hvit tekst, sentrert. Avrundede hjørner                                                                                       | Viser den valgte påstandens tekst. Kun visning |
| **Professorfigur**           | Sirkulært bilde (80px) til venstre for snakkeboblen                                                                                                | Kun visning                                    |
| **Professorens snakkeboble** | Hvit boble med liten trekant-peker mot professor. Tekst: "Stem uten å avsløre for de andre, og skriv gjerne ned hva du tenker. Hvor sikker er du?" | Kun visning                                    |

### Lærerpanel (høyre side, sammenleggbart, 340px bredt)

| Element          | Plassering              | Utseende                                                                                   | Hva skjer ved klikk                                                                                         |
| ---------------- | ----------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Panel-toggle** | Venstre kant av panelet | Smal strek med pilikon. Pilen peker til høyre når panelet er åpent, til venstre når lukket | Åpner/lukker lærerpanelet. Tilstand lagres i localStorage (`fagprat-panel-collapsed`) og huskes mellom steg |

**Panelinnhold (steg 1):**

_Nedtelling-seksjon:_

| Element                    | Utseende                                     | Hva skjer ved klikk                                                                       |
| -------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Timer-visning**          | Stor monospace-tekst, f.eks. "01:00"         | Kun visning                                                                               |
| **"Start"**                | Bred grønn knapp med play-ikon under timeren | Starter nedtelling. Knappen endres til pause/stopp-knapper. Timer vises også i topplinjen |
| **Tidsjustering (slider)** | Horisontal slider under start-knappen        | Dra for å justere nedtellingstid                                                          |
| **"30s" / "1m" / "2m"**    | Tre pill-knapper under slideren              | Hurtigvalg for nedtellingstid. Valgt knapp har lilla bakgrunn                             |

_Etter start:_

| Element         | Utseende                   | Hva skjer ved klikk  |
| --------------- | -------------------------- | -------------------- |
| **Pause-knapp** | Grønn knapp med pause-ikon | Pauser nedtellingen  |
| **Stopp-knapp** | Rød knapp med stopp-ikon   | Stopper nedtellingen |

_Stemmeresultat (vises etter at elever har stemt):_

- Vertikalt søylediagram med tre søyler: Sant (grønn), Delvis sant (oransje), Usant (rød)
- Hver søyle viser antall stemmer + prosent
- Under: gjennomsnittlig sikkerhet (1-5 skala) med utvidbar fordeling

_Neste-steg:_

| Element          | Utseende                      | Hva skjer ved klikk                |
| ---------------- | ----------------------------- | ---------------------------------- |
| **"Neste steg"** | Lilla knapp nederst i panelet | Navigerer til `fagprat-steg2.html` |

---

## Steg 2: Diskusjon (`fagprat-steg2.html`)

Elevene diskuterer påstanden i grupper eller læringspar.

### Layout

- Identisk overordnet layout som steg 1
- Opptaksknappen er NÅ AKTIV (ikke grået ut)
- Bunnnavigasjon: steg 1 fullført (grønn), steg 2 aktiv

### Forskjeller fra steg 1

| Element                      | Endring fra steg 1                                                                                    |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| **"Opptak"-knapp**           | Nå aktiv (lilla pill-knapp med mikrofon-ikon). Klikk starter opptak                                   |
| **Professorens snakkeboble** | Ny tekst: "Diskuter med læringspartneren din. Forklar hva du tenker og lytt til hva den andre mener." |

**Opptak-knapp (tre tilstander):**

| Tilstand                      | Utseende                                                                   | Hva skjer ved klikk |
| ----------------------------- | -------------------------------------------------------------------------- | ------------------- |
| **Klar**                      | Lilla pill med mikrofon-ikon + "Opptak" tekst                              | Starter opptak      |
| **Under opptak**              | Rød pill med rød pulserende prikk + tidtaker (f.eks. "00:24") + stopp-ikon | Stopper opptak      |
| **Deaktivert** (steg 1, 5, 6) | Grå pill, cursor: not-allowed                                              | Ingen handling      |

### Lærerpanel (steg 2)

Panelet har to faner øverst:

| Element                    | Utseende                          | Hva skjer ved klikk                                       |
| -------------------------- | --------------------------------- | --------------------------------------------------------- |
| **"Begrunnelser"-fane**    | Pill-knapp, aktiv: lilla bakgrunn | Viser elevenes begrunnelser                               |
| **"Stemmefordeling"-fane** | Pill-knapp, inaktiv: hvit         | Viser søylediagram fra steg 1 + gjennomsnittlig sikkerhet |

_Begrunnelser-fane (standard):_

| Element              | Utseende                                                                                             | Hva skjer ved klikk          |
| -------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------- |
| **Begrunnelse-kort** | Hvitt kort med elevens skrevne begrunnelse. Blå venstrekant og kursiv tekst på fremhevet begrunnelse | Kun visning                  |
| **Forrige-pil**      | Pilknapp til venstre                                                                                 | Blar til forrige begrunnelse |
| **Neste-pil**        | Pilknapp til høyre                                                                                   | Blar til neste begrunnelse   |
| **Teller**           | "1 av 3" mellom pilknappene                                                                          | Kun visning                  |

_Stemmefordeling-fane:_
Identisk med steg 1: søylediagram + gjennomsnittlig sikkerhet

_Neste-steg:_

| Element          | Utseende    | Hva skjer ved klikk                |
| ---------------- | ----------- | ---------------------------------- |
| **"Neste steg"** | Lilla knapp | Navigerer til `fagprat-steg3.html` |

---

## Steg 3: Andre stemmerunde (`fagprat-steg3.html`)

Elevene stemmer på nytt etter diskusjonen. Tilnærmet identisk med steg 1.

### Forskjeller fra steg 1

| Element                      | Endring                                                           |
| ---------------------------- | ----------------------------------------------------------------- |
| **Professorens snakkeboble** | Ny tekst: "Har du endret mening etter diskusjonen? Stem på nytt!" |
| **Opptak-knapp**             | Aktiv (som i steg 2)                                              |
| **Bunnnavigasjon**           | Steg 1-2 fullført (grønne), steg 3 aktiv                          |

Lærerpanelet har samme nedtelling/timer + stemmeresultat som steg 1, men viser nye stemmedata.

**"Neste steg"-knapp** i panelet navigerer til `fagprat-steg4.html`.

---

## Steg 4: Vise fasit (`fagprat-steg4.html`)

Fasiten avsløres med en dramatisk nedtellingsanimasjon.

### Nedtellingsoverlay (vises automatisk ved sideinnlasting)

| Element              | Utseende                                                              | Beskrivelse                                                                                                                          |
| -------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Overlay**          | Halvgjennomsiktig mørk bakgrunn (rgba 0,0,0, 0.75) over HELE skjermen | Dekker alt innhold                                                                                                                   |
| **Nedtellingstall**  | Hvite tall i 160px skriftstørrelse, sentrert                          | Viser 3, deretter 2, deretter 1. Hvert tall animeres: popper inn (scale 0.5 til 1, opacity 0 til 1), holder, fader ut. 0.8s per tall |
| **Etter nedtelling** | Overlayet fader ut (0.5s)                                             | Avslører innholdet under                                                                                                             |

### Etter nedtelling

| Element                      | Utseende                                                         | Beskrivelse                                                                                                                                                    |
| ---------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fasit-badge**              | Pill-formet badge over påstandskortet. Bouncer inn med animasjon | Dynamisk: "SANT" (grønn), "USANT" (rød) eller "DELVIS SANT" (oransje). Avhenger av påstandens fasit-verdi                                                      |
| **Påstandskort**             | Blått kort under badgen                                          | Viser påstandsteksten                                                                                                                                          |
| **Professorens snakkeboble** | Teksten byttes med fade-animasjon (fade ut, ny tekst, fade inn)  | Dynamisk tekst basert på fasit: "Hvorfor er denne påstanden **sant**?" / "...usant?" / "...delvis sant?" + "Prøv å forklare hvorfor til læringspartneren din." |

### Topplinje (ekstra)

| Element          | Endring fra steg 1-3 |
| ---------------- | -------------------- |
| **Opptak-knapp** | Aktiv (som steg 2-3) |

### Lærerpanel (steg 4)

Panelet har to faner: "Endringer" (standard) og "Stemmefordeling".

_Endringer-fane:_

| Element                                   | Utseende                                                                            | Beskrivelse                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------- |
| **"Svarte riktig"-boks**                  | Grønn boks med tall + prosent, f.eks. "13/24 svarte riktig (54 %)"                  | Antall som stemte riktig fasit            |
| **"Endret fra feil til riktig"-boks**     | Grønn boks med tall + prosent, f.eks. "5/14 endret fra feil til riktig svar (36 %)" | Antall som endret mening i riktig retning |
| **"Endret fra riktig til feil"-advarsel** | Rød/oransje boks med advarsel-ikon, f.eks. "1 elev endret fra riktig til feil svar" | Vises kun hvis noen endret feil vei       |
| **Gjennomsnittlig sikkerhet**             | Viser endring: gammel til ny verdi + delta, f.eks. "2.8 -> 3.2 +0.4"                | Pil mellom verdiene, grønn delta-badge    |

---

## Steg 5: Professorens forklaring (`fagprat-steg5.html`)

Professoren forklarer svaret med en detaljert faglig begrunnelse.

### Layout

- Topplinje (felles) + "Alle påstander"-knapp
- Sentrert kombinert kort (påstand + forklaring)
- Fasit-badge over kortet
- Lærerpanel med to bokser

### Hovedinnhold

| Element                     | Utseende                                                                       | Beskrivelse                                                                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fasit-badge**             | Samme som steg 4 (SANT/USANT/DELVIS SANT), statisk (ikke animert)              | Plassert over det kombinerte kortet                                                                                                                                 |
| **Kombinert kort - toppen** | Blått felt med hvit påstandstekst                                              | Identisk med påstandskortet i andre steg                                                                                                                            |
| **Kombinert kort - bunnen** | Hvitt felt med professorbilde (96px, sirkulaer) til venstre + forklaringstekst | Forklaringen har uthevede nøkkelord i **fet skrift** (f.eks. "**millioner av år**"). Tekststørrelsen skaleres ned automatisk hvis kortet blir for høyt (maks 392px) |

Inngangsanimasjon: kortet glir opp (fadeInUp, 0.5s med 0.2s forsinkelse).

### Topplinje (ekstra)

| Element          | Endring fra steg 4    |
| ---------------- | --------------------- |
| **Opptak-knapp** | Deaktivert (grået ut) |

### Lærerpanel (steg 5)

| Element                   | Utseende                                                  | Beskrivelse                                                                  |
| ------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **"Svarte riktig"-boks**  | Grønn boks, f.eks. "13/24 svarte riktig (54 %)"           | Kun visning                                                                  |
| **Fremhevet begrunnelse** | Hvit boks med blå venstrekant, kursiv tekst, lys bakgrunn | Viser en utvalgt elevbegrunnelse som passer godt med professorens forklaring |

---

## Steg 6: Egenvurdering (`fagprat-steg6.html`)

Elevene vurderer sin egen forståelse av påstanden.

### Layout

- Topplinje (felles) + "Alle påstander"-knapp
- Fasit-badge over påstandskort
- Professor med snakkeboble
- Lærerpanel med forståelsesstatistikk

### Hovedinnhold

| Element                      | Utseende                                                | Beskrivelse                                   |
| ---------------------------- | ------------------------------------------------------- | --------------------------------------------- |
| **Fasit-badge**              | Statisk (SANT/USANT/DELVIS SANT)                        | Over påstandskortet                           |
| **Påstandskort**             | Blått kort med påstandstekst                            | Kun visning                                   |
| **Professorfigur**           | Sirkulært bilde (80px)                                  | Kun visning                                   |
| **Professorens snakkeboble** | "Vurder fra 1 til 5 hvor godt du forstår påstanden nå." | Kun visning — eleven svarer på sin egen enhet |

### Lærerpanel (steg 6)

| Element                        | Utseende                                                                             | Hva skjer ved klikk                                                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Gjennomsnittlig forståelse** | Stort tall (f.eks. "2.8") med label                                                  | Kun visning                                                                                                                            |
| **Utvid-knapp**                | Lite diagram-ikon til høyre for gjennomsnittet                                       | Viser/skjuler fordeling per svarkategori: "Riktig svar" (snitt for de som stemte riktig) og "Feil svar" (snitt for de som stemte feil) |
| **Søylediagram (1-5)**         | 5 vertikale søyler med graderte farger: 1=rød, 2=oransje, 3=gul, 4=lysgrønn, 5=grønn | Kun visning. Viser fordelingen av elevsvar                                                                                             |

Hver søyle viser:

- Antall (f.eks. "3 stk") over søylen
- Prosentandel (inne i søylen hvis over 85%, ellers over)
- Score-tall (1-5) under søylen

---

## Felles funksjonalitet

### Lærerpanel (steg 1-6)

| Egenskap         | Beskrivelse                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| **Bredde**       | 340px når åpent                                                                                    |
| **Toggle-knapp** | Smal stripe på venstre kant av panelet med pil-ikon. Klikk: åpner/lukker panelet                   |
| **Persistens**   | Panelstatus (åpent/lukket) lagres i localStorage (`fagprat-panel-collapsed`) og huskes mellom steg |
| **Standard**     | Panelet starter lukket                                                                             |

### Navigasjonsflyt mellom steg

```
Steg 0 -> Steg 1 -> Steg 2 -> Steg 3 -> Steg 4 -> Steg 5 -> Steg 6
(velg)   (stem)   (disk.)  (stem)   (fasit)  (forkl.)  (vurder)
                                                           |
                                               Tilbake til Steg 0
                                            (velg ny påstand) eller
                                            Avslutt -> Min samling
```

### Dynamisk data

- Alle steg henter FagPrat-navn og påstandsdata fra backend (ikke hardkodet)
- Fasit-badgen (sant/usant/delvis sant) bestemmes av den valgte påstandens data
- Professorens forklaring hentes fra den valgte påstandens data
- Lærerpaneldata (stemmeresultater, endringer, forståelsesscore) kommer fra sanntidsdata fra elevene

---

## Generelle navigasjonsflyter

### Oppdagelse og administrasjon

```
Utforsk -> forhåndsvisning -> start liveokt
Min samling -> forhåndsvisning -> start liveokt
Min samling -> redigering
Min samling -> start liveokt (direkte via grønn knapp på kortet)
```

### Opprettelse

```
"Lag en FagPrat" (sidebar) -> lag-pastand -> (valgfritt: REDDI -> velg-pastander -> lag-pastand) -> lagre-fagprat -> min-samling
```

### Liveokt

```
Start liveokt (oppsett) -> lobby (venting/grupper) -> steg 0-6 (aktivitet) -> min-samling (avslutning)
```

---

## Datamodell (FagPrat)

En FagPrat består av:

| Felt          | Type      | Beskrivelse                                               |
| ------------- | --------- | --------------------------------------------------------- |
| tittel        | tekst     | Navnet på FagPraten, f.eks. "Newtons lover"               |
| fag           | valg      | Naturfag, Matematikk, Samfunnsfag, Fysikk, Norsk, Engelsk |
| trinn         | valg      | 8. trinn, 9. trinn, 10. trinn, VG1, VG2, VG3              |
| forkunnskaper | valg      | Introduksjon eller Oppsummering                           |
| synlighet     | valg      | Offentlig eller Privat                                    |
| begreper      | liste     | Viktige fagbegreper som tagger                            |
| forfatter     | referanse | Brukeren som opprettet FagPraten                          |
| opprettet     | dato      | Når den ble laget                                         |
| sist_endret   | dato      | Sist endret                                               |
| antall_brukt  | tall      | Antall ganger brukt i liveokt                             |
| paastander    | liste     | 1-5 påstander (se under)                                  |

Hver påstand består av:

| Felt             | Type            | Beskrivelse                                                |
| ---------------- | --------------- | ---------------------------------------------------------- |
| tekst            | tekst           | Selve påstanden                                            |
| fasit            | valg            | Sant, Usant eller Delvis sant                              |
| forklaring       | tekst           | Professorens faglige forklaring (kan inneholde uthevinger) |
| bilde            | fil (valgfritt) | Illustrasjon til påstanden                                 |
| forklaring_bilde | fil (valgfritt) | Illustrasjon til forklaringen                              |
