"use node";

import Anthropic from "@anthropic-ai/sdk";
import { v } from "convex/values";
import OpenAI from "openai";

import { internal } from "./_generated/api";
import { action } from "./_generated/server";
import { requireAdmin } from "./helpers";

interface GeneratedStatement {
  text: string;
  fasit: "sant" | "usant" | "delvis";
  explanation: string;
}

interface RawItem {
  claim?: unknown;
  text?: unknown;
  answer?: unknown;
  fasit?: unknown;
  explanation?: unknown;
  forklaring?: unknown;
}

const FASIT_VALUES = ["sant", "usant", "delvis"] as const;
type Fasit = (typeof FASIT_VALUES)[number];

function findItemsArray(raw: unknown, reqId: string): RawItem[] | null {
  if (Array.isArray(raw)) {
    console.log(`[REDDI ${reqId}] findItemsArray: top-level array`, {
      length: raw.length,
    });
    return raw as RawItem[];
  }
  if (!raw || typeof raw !== "object") {
    console.warn(`[REDDI ${reqId}] findItemsArray: raw is not an object`, {
      type: typeof raw,
      value: raw,
    });
    return null;
  }

  const obj = raw as Record<string, unknown>;
  const topKeys = Object.keys(obj);
  for (const key of ["statements", "påstander", "pastander", "data", "items", "result"]) {
    const v = obj[key];
    if (Array.isArray(v)) {
      console.log(`[REDDI ${reqId}] findItemsArray: matched key`, {
        key,
        length: v.length,
      });
      return v as RawItem[];
    }
  }

  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v) && v.length > 0 && v[0] && typeof v[0] === "object") {
      console.log(`[REDDI ${reqId}] findItemsArray: heuristic value-scan match`, {
        key: k,
        length: v.length,
      });
      return v as RawItem[];
    }
  }

  const looksLikeSingleStatement =
    (typeof obj.claim === "string" || typeof obj.text === "string") &&
    (typeof obj.answer === "string" || typeof obj.fasit === "string");
  if (looksLikeSingleStatement) {
    console.log(`[REDDI ${reqId}] findItemsArray: single-statement object`, {
      keys: topKeys,
    });
    return [obj as RawItem];
  }

  if (
    Array.isArray(obj.sant) ||
    Array.isArray(obj.usant) ||
    Array.isArray(obj.delvis)
  ) {
    const merged: RawItem[] = [];
    for (const fasit of FASIT_VALUES) {
      const arr = obj[fasit];
      if (!Array.isArray(arr)) continue;
      for (const entry of arr) {
        if (typeof entry === "string") {
          merged.push({ claim: entry, answer: fasit });
        } else if (entry && typeof entry === "object") {
          merged.push({ ...(entry as RawItem), answer: fasit });
        }
      }
    }
    if (merged.length > 0) {
      console.log(`[REDDI ${reqId}] findItemsArray: grouped-by-fasit match`, {
        length: merged.length,
      });
      return merged;
    }
  }

  console.warn(`[REDDI ${reqId}] findItemsArray: no recognized shape`, {
    topKeys,
  });
  return null;
}

function flatten(raw: unknown, reqId: string): GeneratedStatement[] {
  const list = findItemsArray(raw, reqId);
  if (!list) {
    console.error(`[REDDI ${reqId}] flatten: unexpected AI response shape`, {
      raw: JSON.stringify(raw),
    });
    throw new Error("Uventet respons fra AI. Prøv igjen.");
  }

  const out: GeneratedStatement[] = [];
  const skipped: { noClaim: number; invalidFasit: number } = {
    noClaim: 0,
    invalidFasit: 0,
  };
  const skippedSamples: Array<{ reason: string; item: unknown }> = [];
  for (const item of list) {
    const claimRaw = typeof item?.claim === "string" ? item.claim : item?.text;
    const claim = typeof claimRaw === "string" ? claimRaw.trim() : "";
    const answerRaw = typeof item?.answer === "string" ? item.answer : item?.fasit;
    const answer =
      typeof answerRaw === "string" ? answerRaw.trim().toLowerCase() : "";
    const explanationRaw =
      typeof item?.explanation === "string" ? item.explanation : item?.forklaring;
    const explanation =
      typeof explanationRaw === "string" ? explanationRaw.trim() : "";
    if (!claim) {
      skipped.noClaim += 1;
      if (skippedSamples.length < 3) {
        skippedSamples.push({ reason: "noClaim", item });
      }
      continue;
    }
    if (!FASIT_VALUES.includes(answer as Fasit)) {
      skipped.invalidFasit += 1;
      if (skippedSamples.length < 3) {
        skippedSamples.push({
          reason: `invalidFasit(${JSON.stringify(answerRaw)})`,
          item,
        });
      }
      continue;
    }
    out.push({ text: claim, fasit: answer as Fasit, explanation });
  }

  console.log(`[REDDI ${reqId}] flatten: validation`, {
    rawCount: list.length,
    kept: out.length,
    skipped,
  });

  if (out.length === 0) {
    console.error(`[REDDI ${reqId}] flatten: zero valid statements`, {
      rawCount: list.length,
      skipped,
      skippedSamples,
      raw: JSON.stringify(raw),
    });
    throw new Error("Uventet respons fra AI. Prøv igjen.");
  }
  return out;
}

const DEFAULT_MODEL = "gpt-4o" as const;

const modelValidator = v.union(
  v.literal("gpt-4o"),
  v.literal("gpt-4o-mini"),
  v.literal("claude-opus-4-7"),
  v.literal("claude-sonnet-4-6"),
  v.literal("claude-haiku-4-5"),
);

type Model =
  | typeof DEFAULT_MODEL
  | "gpt-4o-mini"
  | "claude-opus-4-7"
  | "claude-sonnet-4-6"
  | "claude-haiku-4-5";

const SYSTEM_PROMPT = `Du er en erfaren faglærer som lager diskusjonsutløsende påstander til bruk i FagPrat.

Målet er å fremme refleksjon og faglig resonnering, ikke definisjoner eller pugging.

Du mottar:

Tema for FagPraten
Fag
Trinn
Elevenes forkunnskaper

=== KRITISK: JSON-RESPONSE ===

DU MÅ ALLTID RETURNERE AKKURAT DENNE JSON-STRUKTUREN OG INGENTING ANNET:

{
  "statements": [
    {
      "claim": "Generert påstand",
      "answer": "sant" | "usant" | "delvis",
      "explanation": "Generert forklaring"
    }
  ]
}

"answer" må være nøyaktig én av disse tre verdiene: "sant", "usant", "delvis".

Returner BARE JSON-objektet – ingenting annet.

=== KRAV ===

Lag nøyaktig 15 påstander:

5 faglig korrekte
5 faglig feil
5 faglig delvis korrekte

Alle påstander skal være én kort setning.

=== GENERELLE REGLER ===

Påstandene skal:

Bruk et tilgjengelig språk, unngå unødvendig kompleksitet og lange setninger.
Tilpass begrepsbruk og abstraksjonsnivå til fag + trinn + forkunnskaper.
Velg den enkleste formuleringen som bevarer faglig mening.
Påstanden skal være umiddelbart forståelig for eleven og invitere til refleksjon eller diskusjon
Maks én setning per påstand.
Unngå unødvendige leddsetninger, omstendelige formuleringer og oppramsinger.
Unngå metaforer og billedspråk som kan skape uklarhet.
Unngå rene definisjoner og trivielle fakta.
Ordvalg skal ikke gjøre fasit forutsigbar.

=== NATURLIG SPRÅK OG TROVERDIGHET ===

Unngå språklig avslørende formuleringer.
Ikke bruk absolutte ord (f.eks. «alltid», «aldri», «alle», «bare») som hovedmekanisme for å gjøre påstander usanne eller delvis sanne.
Feil og nyanser skal oppstå fra faglig innhold.
Variér formuleringer naturlig.

=== VARIASJON I PÅSTANDSTYPER ===

Bruk en naturlig blanding av:

hverdagslige situasjoner
intuitive elevforestillinger
faglige sammenhenger eller regler

Flere påstander skal være forankret i situasjoner elever kan kjenne igjen.

=== DELVIS SANT ===

Delvis sanne påstander skal være plausible og faglig relevante.
De skal fremstå som rimelige ved første lesning, men kreve nyansering eller presisering.
En faglig sterk elev skal kunne argumentere for at påstanden virker riktig ved første vurdering.
Delvis sant skal skyldes faglig innhold, ikke formuleringsteknikk.
Eksempel på ønsket kvalitet (ikke kopier formulering):
En påstand mange elever intuitivt vil være enige i, men som faglig sett krever nyansering.

=== TILPASNING ===

Tilpass språk og nivå til trinn og forkunnskaper.

Prioriter klarhet fremfor kompleksitet.

=== VERIFIKASJON ===

Påstander under "sant" må være faglig korrekte.
Påstander under "usant" må være faglig feil.
Påstander under "delvis" må være faglig delvis korrekte.


=== REGLER FOR FORKLARING ===

Maks to setninger per forklaring.
Forklaringen skal være klar, direkte og tilpasset trinnet og faget.
Unngå faste forklaringsmønstre.
Unngå metaforer og akademisk stil.
Forklaringen må være logisk konsistent med påstanden og fasiten.

For «Delvis sant»: forklar hva som stemmer og hva som ikke stemmer.
For «Sant»: bekreft kort hva som er korrekt.
For «Usant»: forklar hva som faktisk er riktig.
`;

const STRUCTURAL_REQUIREMENTS = `=== KRITISK: RESPONSFORMAT (OVERSTYRER ALT ANNET) ===

Du MÅ returnere ÉT enkelt JSON-objekt med EXAKT denne strukturen og ingenting annet (ingen markdown, ingen kodeblokker, ingen prosa, ingen forklarende tekst):

{
  "statements": [
    {
      "claim": "Generert påstand",
      "answer": "sant",
      "explanation": "Generert forklaring"
    }
  ]
}

KRAV:
- Roten skal være et objekt med nøkkelen "statements" som inneholder en JSON-array.
- Arrayet skal inneholde nøyaktig 15 elementer: 5 sanne, 5 usanne, og 5 delvis sanne.
- Hvert element skal ha feltene "claim" (string), "answer" (string), og "explanation" (string).
- "answer" må være nøyaktig én av de små bokstavene: "sant", "usant", eller "delvis". Ikke skriv det med stor forbokstav, ikke oversett til engelsk.
- Returner BARE JSON-objektet — ingenting før eller etter.`;

function buildUserPrompt(args: {
  topic: string;
  subject: string;
  level: string;
  type: "intro" | "oppsummering";
}): string {
  const typeDescription =
    args.type === "intro"
      ? "Introduksjon — elevene har lite forkunnskap om temaet"
      : "Oppsummering — elevene har grunnleggende kunnskap om temaet";

  return `Generer 15 påstander om: ${args.topic}

Fag: ${args.subject}
Trinn: ${args.level}
Type: ${typeDescription}`;
}

async function generateWithOpenAI(
  model: Model,
  systemPrompt: string,
  userPrompt: string,
  reqId: string,
): Promise<GeneratedStatement[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  console.log(`[REDDI ${reqId}] openai: prepare`, {
    model,
    hasApiKey: !!apiKey,
    apiKeyPrefix: apiKey?.slice(0, 7),
    systemPromptChars: systemPrompt.length,
    userPromptChars: userPrompt.length,
  });
  if (!apiKey) {
    throw new Error("OpenAI API-nøkkel er ikke konfigurert.");
  }

  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model,
    response_format: { type: "json_object" },
    temperature: 0.8,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const choice = response.choices[0];
  const content = choice?.message?.content;
  console.log(`[REDDI ${reqId}] openai: response`, {
    finishReason: choice?.finish_reason,
    usage: response.usage,
    contentChars: content?.length ?? 0,
  });
  if (!content) {
    console.error(`[REDDI ${reqId}] openai: empty content`, {
      response: JSON.stringify(response),
    });
    throw new Error("Fikk ingen respons fra AI. Prøv igjen.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    console.error(`[REDDI ${reqId}] openai: JSON.parse failed`, {
      message: err instanceof Error ? err.message : String(err),
      content,
    });
    throw new Error("AI returnerte ugyldig JSON. Prøv igjen.");
  }
  console.log(`[REDDI ${reqId}] openai: parsed keys`, {
    keys:
      parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? Object.keys(parsed as Record<string, unknown>)
        : Array.isArray(parsed)
          ? `array(${(parsed as unknown[]).length})`
          : typeof parsed,
  });

  return flatten(parsed, reqId);
}

async function generateWithAnthropic(
  model: Model,
  systemPrompt: string,
  userPrompt: string,
  reqId: string,
): Promise<GeneratedStatement[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log(`[REDDI ${reqId}] anthropic: prepare`, {
    model,
    hasApiKey: !!apiKey,
    apiKeyPrefix: apiKey?.slice(0, 7),
    systemPromptChars: systemPrompt.length,
    userPromptChars: userPrompt.length,
  });
  if (!apiKey) {
    throw new Error("Anthropic API-nøkkel er ikke konfigurert.");
  }

  const anthropic = new Anthropic({ apiKey });
  const response = await anthropic.messages.create({
    model,
    max_tokens: 4096,
    temperature: 0.8,
    system: `${systemPrompt}\n\nVIKTIG: Svar KUN med rå JSON, ingen prosa, ingen markdown, ingen kodeblokker.`,
    messages: [{ role: "user", content: userPrompt }],
  });

  const block = response.content.find((b) => b.type === "text");
  const text = block && block.type === "text" ? block.text : "";
  console.log(`[REDDI ${reqId}] anthropic: response`, {
    stopReason: response.stop_reason,
    usage: response.usage,
    blockCount: response.content.length,
    blockTypes: response.content.map((b) => b.type),
    textChars: text.length,
  });
  if (!text) {
    console.error(`[REDDI ${reqId}] anthropic: empty text block`, {
      content: JSON.stringify(response.content),
    });
    throw new Error("Fikk ingen respons fra AI. Prøv igjen.");
  }

  console.log(`[REDDI ${reqId}] anthropic: raw text`, { text });

  const objStart = text.indexOf("{");
  const objEnd = text.lastIndexOf("}");
  const arrStart = text.indexOf("[");
  const arrEnd = text.lastIndexOf("]");

  let slice: string | null = null;
  if (objStart !== -1 && objEnd !== -1 && (arrStart === -1 || objStart < arrStart)) {
    slice = text.slice(objStart, objEnd + 1);
  } else if (arrStart !== -1 && arrEnd !== -1) {
    slice = text.slice(arrStart, arrEnd + 1);
  }
  if (!slice) {
    console.error(`[REDDI ${reqId}] anthropic: no JSON brackets found`, { text });
    throw new Error("Uventet respons fra AI. Prøv igjen.");
  }
  console.log(`[REDDI ${reqId}] anthropic: extracted slice`, {
    sliceChars: slice.length,
    head: slice.slice(0, 100),
    tail: slice.slice(-100),
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(slice);
  } catch (err) {
    console.error(`[REDDI ${reqId}] anthropic: JSON.parse failed`, {
      message: err instanceof Error ? err.message : String(err),
      slice,
    });
    throw new Error("AI returnerte ugyldig JSON. Prøv igjen.");
  }
  return flatten(parsed, reqId);
}

export const generateStatements = action({
  args: {
    topic: v.string(),
    subject: v.string(),
    level: v.string(),
    type: v.union(v.literal("intro"), v.literal("oppsummering")),
    model: v.optional(modelValidator),
  },
  handler: async (
    ctx,
    args,
  ): Promise<
    Array<{
      id: string;
      text: string;
      fasit: "sant" | "usant" | "delvis";
      explanation: string;
    }>
  > => {
    const reqId = Math.random().toString(36).slice(2, 8);
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Du må være logget inn for å bruke REDDI.");
    }

    if (args.model && args.model !== DEFAULT_MODEL) {
      await requireAdmin(ctx);
    }

    const model: Model = args.model ?? DEFAULT_MODEL;
    const userPrompt = buildUserPrompt(args);

    const storedPrompt: string | null = await ctx.runQuery(
      internal.aiPrompts.getReddiSystemPromptInternal,
    );
    const basePrompt = storedPrompt ?? SYSTEM_PROMPT;
    const systemPrompt = `${basePrompt}\n\n${STRUCTURAL_REQUIREMENTS}`;

    console.log(`[REDDI ${reqId}] start`, {
      model,
      type: args.type,
      subject: args.subject,
      level: args.level,
      topic: args.topic.slice(0, 80),
      hasStoredPrompt: !!storedPrompt,
      basePromptChars: basePrompt.length,
      systemPromptChars: systemPrompt.length,
    });

    let statements: GeneratedStatement[];
    try {
      statements = model.startsWith("gpt-")
        ? await generateWithOpenAI(model, systemPrompt, userPrompt, reqId)
        : await generateWithAnthropic(model, systemPrompt, userPrompt, reqId);
    } catch (err) {
      console.error(`[REDDI ${reqId}] generation failed`, {
        model,
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
      throw err;
    }

    const prefixes: Record<string, string> = { sant: "s", usant: "u", delvis: "d" };
    const counters: Record<string, number> = { sant: 0, usant: 0, delvis: 0 };

    const result = statements.map((s) => {
      const fasit = s.fasit as "sant" | "usant" | "delvis";
      counters[fasit] = (counters[fasit] ?? 0) + 1;
      return {
        id: `${prefixes[fasit]}${counters[fasit]}`,
        text: s.text,
        fasit,
        explanation: s.explanation,
      };
    });

    console.log(`[REDDI ${reqId}] success`, {
      count: result.length,
      sant: counters.sant,
      usant: counters.usant,
      delvis: counters.delvis,
    });

    return result;
  },
});
