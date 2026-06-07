// api/tts.js — Vercel serverless: pretvara tekst u govor preko Azure Speech-a
// Čuva TAJNI Azure ključ (env: AZURE_SPEECH_KEY) i region (env: AZURE_SPEECH_REGION, npr. "westeurope").
// Klijent (widget.js) šalje { text, lang } i dobija MP3 zvuk.
// Ako ključ/region nisu postavljeni ili Azure vrati grešku, widget se sam vraća na glas uređaja.

// Ženski neuronski glas po jeziku (Azure)
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

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Koristi POST." });

  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) {
    // nije podešeno -> neka se widget vrati na glas uređaja
    return res.status(500).json({ error: "Azure nije podešen (AZURE_SPEECH_KEY / AZURE_SPEECH_REGION)." });
  }

  try {
    const { text = "", lang = "sr" } = req.body || {};
    const t = String(text).slice(0, 1500); // ograniči dužinu (kontrola troška)
    if (!t.trim()) return res.status(400).json({ error: "Nema teksta." });

    const v = VOICES[lang] || VOICES.sr;
    const ssml =
      `<speak version='1.0' xml:lang='${v.locale}'>` +
      `<voice xml:lang='${v.locale}' name='${v.voice}'>` +
      `<prosody rate='-4%'>${xmlEscape(t)}</prosody>` +
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
      return res.status(r.status).json({ error: "Azure TTS greška: " + msg.slice(0, 200) });
    }

    const ab = await r.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(Buffer.from(ab));
  } catch (e) {
    return res.status(500).json({ error: "Veza je zapela: " + (e.message || e) });
  }
}
