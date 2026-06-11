// api/tts.js — Vercel serverless: tekst -> govor.
// HIBRID: srpski (sr) -> ElevenLabs (glas "Ida", prirodan srpski); ostali jezici -> Azure.
// Tajni ključevi iz env: ELEVENLABS_API_KEY, AZURE_SPEECH_KEY, AZURE_SPEECH_REGION.
// POST { text, lang } -> MP3.  GET ?lang=sr -> probni MP3 (otvori u browseru da čuješ).
// Ako neki provajder zakaže, widget se sam vraća na glas uređaja.

// ——— ElevenLabs (samo srpski) ———
const EL_VOICE_SR = "sK1CZxinAv6CB3NL3fNq"; // tvoj klon — isti glas za Zoi i Milu (raniji "Ida": d3l4f3HgkE3P6Fo91lYA)
const EL_MODEL = "eleven_multilingual_v2";

// ——— Azure (ostali jezici) ———
const VOICES = {
  sr: { locale: "sr-Latn-RS", voice: "sr-Latn-RS-SophieNeural" }, // rezerva ako ElevenLabs nije podešen
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

// ElevenLabs -> MP3 buffer
async function synthEleven(text, voiceId, key, speed) {
  const vs = { stability: 0.50, similarity_boost: 0.85, style: 0.0, use_speaker_boost: true };
  const sp = Number(speed);
  vs.speed = (sp >= 0.7 && sp <= 1.2) ? sp : 0.95; // podrazumevano 0.95 (normalno, ne brzo); data-rate/?speed= menja
  const r = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text: text,
        model_id: EL_MODEL,
        voice_settings: vs,
      }),
    }
  );
  if (!r.ok) {
    const msg = await r.text().catch(() => "");
    const e = new Error("ElevenLabs: " + msg.slice(0, 200));
    e.status = r.status;
    throw e;
  }
  return Buffer.from(await r.arrayBuffer());
}

// Azure -> MP3 buffer
async function synthAzure(text, lang, key, region, override) {
  const v = (override && override.voice) ? override : (VOICES[lang] || VOICES.sr);
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
    const e = new Error("Azure: " + (msg.slice(0, 200) || ("status " + r.status)));
    e.status = r.status;
    throw e;
  }
  return Buffer.from(await r.arrayBuffer());
}

// izaberi provajdera po jeziku
async function speak(text, lang, voice, speed) {
  const elKey = process.env.ELEVENLABS_API_KEY;
  const azKey = process.env.AZURE_SPEECH_KEY;
  const azRegion = process.env.AZURE_SPEECH_REGION;

  if (lang === "sr" && elKey) {
    return await synthEleven(text, voice || EL_VOICE_SR, elKey, speed);   // srpski -> tvoj klon (sK1CZ…)
  }
  if (azKey && azRegion) {
    return await synthAzure(text, lang, azKey, azRegion); // ostalo -> Azure
  }
  // ako baš ništa nije podešeno
  if (lang === "sr") throw new Error("Nije podešen ELEVENLABS_API_KEY ni Azure.");
  throw new Error("Azure nije podešen (AZURE_SPEECH_KEY / AZURE_SPEECH_REGION).");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // --- GET: brzi test u browseru -> /api/tts ili /api/tts?lang=en ---
    if (req.method === "GET") {
      const lang = (req.query && req.query.lang) || "sr";
      const voice = (req.query && req.query.voice) || "";
      const speed = (req.query && req.query.speed) || "";
      const buf = await speak(SAMPLE[lang] || SAMPLE.sr, lang, voice, speed);
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "no-store");
      res.statusCode = 200;
      return res.end(buf);
    }

    if (req.method !== "POST") return res.status(405).json({ error: "Koristi POST." });

    const { text = "", lang = "sr", voice = "", speed = "" } = req.body || {};
    const t = String(text).slice(0, 1500);
    if (!t.trim()) return res.status(400).json({ error: "Nema teksta." });

    const buf = await speak(t, lang, voice, speed);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.statusCode = 200;
    return res.end(buf);
  } catch (e) {
    const status = e.status || 500;
    const m = "TTS greška: " + (e.message || e);
    if (req.method === "GET") { res.statusCode = status; return res.end(m); }
    return res.status(status).json({ error: m });
  }
}
