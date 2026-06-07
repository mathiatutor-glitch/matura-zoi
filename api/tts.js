// api/tts.js — Vercel serverless: tekst -> govor preko Azure Speech-a
// Čuva TAJNI Azure ključ (env: AZURE_SPEECH_KEY) i region (env: AZURE_SPEECH_REGION, npr. "westeurope").
// POST { text, lang } -> MP3.  GET ?lang=sr -> probni MP3 (otvori u browseru da čuješ Azure direktno).
// Ako ključ/region nisu postavljeni ili Azure vrati grešku, widget se sam vraća na glas uređaja.

const VOICES = {
  sr: { locale: "sr-RS", voice: "sr-RS-SophieNeural" },
  en: { locale: "en-US", voice: "en-US-AriaNeural" },
  hu: { locale: "hu-HU", voice: "hu-HU-NoemiNeural" },
  hr: { locale: "hr-HR", voice: "hr-HR-GabrijelaNeural" },
  ro: { locale: "ro-RO", voice: "ro-RO-AlinaNeural" },
  sk: { locale: "sk-SK", voice: "sk-SK-ViktoriaNeural" },
  de: { locale: "de-DE", voice: "de-DE-KatjaNeural" },
  el: { locale: "el-GR", voice: "el-GR-AthinaNeural" },
  es: { locale: "es-ES", voice: "es-ES-ElviraNeural" },
  fr: { locale: "fr-FR", voice: "fr-FR-DeniseNeural" },
};

// probne rečenice za GET test
const SAMPLE = {
  sr: "Zdravo, ja sam Zoi. Ovo je probni glas na srpskom jeziku. Sinus od trideset stepeni je jedan kroz dva.",
  en: "Hello, I am Zoi. This is a voice test.",
  hu: "Szia, Zoi vagyok. Ez egy hangteszt.",
  hr: "Bok, ja sam Zoi. Ovo je probni glas.",
  ro: "Salut, eu sunt Zoi. Acesta este un test de voce.",
  sk: "Ahoj, som Zoi. Toto je test hlasu.",
  de: "Hallo, ich bin Zoi. Das ist ein Sprachtest.",
  el: "Γεια, είμαι η Zoi. Αυτό είναι ένα τεστ φωνής.",
  es: "Hola, soy Zoi. Esta es una prueba de voz.",
  fr: "Bonjour, je suis Zoi. Ceci est un test de voix.",
};

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

async function synth(text, lang, key, region) {
  const v = VOICES[lang] || VOICES.sr;
  const ssml =
    `<speak version='1.0' xml:lang='${v.locale}'>` +
    `<voice xml:lang='${v.locale}' name='${v.voice}'>` +
    `<prosody rate='-4%'>${xmlEscape(text)}</prosody>` +
    `</voice></speak>`;

  const r = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
      "User-Agent": "zoi-tts",
    },
    body: ssml,
  });
  if (!r.ok) {
    const msg = await r.text().catch(() => "");
    const e = new Error(msg.slice(0, 200) || ("status " + r.status));
    e.status = r.status;
    throw e;
  }
  return Buffer.from(await r.arrayBuffer());
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) {
    const m = "Azure nije podešen (AZURE_SPEECH_KEY / AZURE_SPEECH_REGION).";
    if (req.method === "GET") { res.statusCode = 500; return res.end(m); }
    return res.status(500).json({ error: m });
  }

  try {
    // --- GET: brzi test u browseru -> otvori /api/tts ili /api/tts?lang=en ---
    if (req.method === "GET") {
      const lang = (req.query && req.query.lang) || "sr";
      const buf = await synth(SAMPLE[lang] || SAMPLE.sr, lang, key, region);
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "no-store");
      res.statusCode = 200;
      return res.end(buf);  // res.end -> šalje čist binarni MP3 (bez kvarenja)
    }

    if (req.method !== "POST") return res.status(405).json({ error: "Koristi POST." });

    const { text = "", lang = "sr" } = req.body || {};
    const t = String(text).slice(0, 1500);
    if (!t.trim()) return res.status(400).json({ error: "Nema teksta." });

    const buf = await synth(t, lang, key, region);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.statusCode = 200;
    return res.end(buf);    // VAŽNO: res.end (ne res.send) — čist binarni MP3
  } catch (e) {
    const status = e.status || 500;
    const m = "Azure TTS greška: " + (e.message || e);
    if (req.method === "GET") { res.statusCode = status; return res.end(m); }
    return res.status(status).json({ error: m });
  }
}
