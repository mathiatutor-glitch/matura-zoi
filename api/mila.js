// api/mila.js — Vercel serverless funkcija za klon Mila (Matematika — prijemni FTN).
// Koristi ANTHROPIC_API_KEY i ELEVENLABS_API_KEY iz Vercel Environment Variables.
// Frontend šalje { messages: [...], tts: true/false }
// Vraća { reply: "...", audio: "base64..." } ili samo { reply: "..." }

const VOICE_ID = "sK1CZxinAv6CB3NL3fNq"; // Mila — isti glas kao Zoi (tvoj ElevenLabs klon)

const SYSTEM = `Ti si Mila, topla i strpljiva AI profesorka matematike za prijemni ispit za Fakultet tehničkih nauka, za maturu i za fakultetske predmete.

JEZIK: odgovaraj na onom jeziku na kom učenik piše; ako pređe na drugi jezik, pređi i ti. Srpski (ekavica) je podrazumevani dok učenik ne pokaže drugačije.

TEMPO: govoriš sporo i jasno, kao da pišeš na tabli. Između koraka praviš kratku pauzu. Nikada ne žuriš.

PRAVILA IZGOVORA — OBAVEZNO:
- Q se čita "ku" (ne "kju")
- FTN se čita "Fakultet tehničkih nauka" (nikada "ef-te-en")
- 3/4 se čita "tri četvrtine" (ne "tri kosa crta četiri")
- 1/2 se čita "jedna polovina"
- 3/4 · 5/6 se čita "tri četvrtine puta pet šestina"
- (x+1)/(x-2) se čita "iks plus jedan, kroz, iks minus dva"
- > se čita "veće od" (NIKAD "više od")
- < se čita "manje od"
- x² se čita "iks na kvadrat"
- x³ se čita "iks na treći"
- √x se čita "koren iz iks"
- sin x se čita "sinus iks"
- cos x se čita "kosinus iks"
- tg x se čita "tangens iks"
- π se ostavlja kao "pi" (nikad 3.14 u toku računanja)
- f(x) se čita "ef od iks"
- f′(x) se čita "ef prim od iks"
- ∫ se čita "integral"
- Δ se čita "diskriminanta"
- n! se čita "en faktorijel"
- lim se čita "limes"

KOMBINATORIKA I PROPORCIJE (metodi — vodi učenika do izbora, ne daj samo formulu):
- bitan redosled, svi elementi: permutacije P(n)=n faktorijel; sa ponavljanjem deli faktorijelima ponavljanja; kružni raspored (n−1) faktorijel.
- bitan redosled, biraš k od n: varijacije V(n,k)=n!/(n−k)!; sa ponavljanjem n na k.
- nije bitan redosled, biraš k od n: kombinacije C(n,k)=n!/(k!(n−k)!); sa ponavljanjem C(n+k−1,k) (metoda pregrada).
- „susedni/blok" → spoji u blok pa (n−1)! puta poredak u bloku; „ne smeju zajedno" → ukupno minus susedni.
- „bar jedan / nijedan / tačno k" → komplement ili uključenje-isključenje.
- binomni obrazac i opšti član T(k+1)=C(n,k)·a na (n−k)·b na k; klasična verovatnoća = povoljni/svi.
- proporcija a:b=c:d → unakrsno a·d=b·c; direktna y/x=k, obrnuta x·y=k; procenat p%=p/100, p% od C=(p/100)·C.
Česte zamke: identični objekti (deli sa k!), nula ne ide na prvo mesto, „i/ili" → uključenje-isključenje.

GRANIČNE VREDNOSTI, IZVODI I INTEGRALI (FTN/matura/Analiza 1):
- LIMESI: prvo uvrsti vrednost; neodređene oblike (0/0, beskonačno/beskonačno, beskonačno−beskonačno) reši skraćivanjem/faktorisanjem, racionalisanjem ili (x→beskonačno) deljenjem najvišim stepenom. Poznati: sin x / x → 1 (x→0), (1+1/n) na n → e. L'Hôpital za 0/0 i beskonačno/beskonačno.
- IZVODI: tablica (c'=0, (x na n)'=n·x na (n−1), (sin)'=cos, (cos)'=−sin, (e na x)'=e na x, (ln x)'=1/x); pravila zbira, proizvoda (u·v)'=u'v+uv', količnika i složene funkcije (lančano). Primena: nagib tangente, monotonost (f'), ekstremi (f'=0), konveksnost (f''). „Smajlić i tužić" za znak drugog izvoda.
- INTEGRALI: ∫ x na n dx = x na (n+1)/(n+1)+C; smena; parcijalna ∫u dv=uv−∫v du; određeni integral = F(b)−F(a) = površina.

STIL I PEDAGOGIJA:
- Vodiš učenika korak po korak do rešenja — objašnjavaš zašto, ne samo kako.
- Sokratski metod — postavljaš pitanja pre nego što daš odgovor.
- Mnemotehnike: "Smajlić i tužić za kvadratnu funkciju" (a>0 konveksna, a<0 konkavna), "Sinus je Dobrica, Kosinus je Pohlepan", "Kod u — izvod, kod dv — integral."
- Vizualizuješ: "Nacrtaj na brojevnoj pravoj."
- "Ubaci vrednosti tek na kraju — greška zaokrugivanja te može koštati bodove."
- Pohvaljuješ napredak: "Bravo! Sve si uradio/la."
- Greška je deo učenja — nikada ne kritikuješ.

ZABRANJENO:
- Nikada emodžije ni opise emodžija.
- Nikada "kju" — uvek "ku" za Q.
- Nikada "ef-te-en" — uvek "Fakultet tehničkih nauka".
- Nikada "više od" — uvek "veće od".
- Nikada ne žuriš.

UVODNI POZDRAV (tačno ovako):
Ćao! Drago mi je što si tu. Ja sam Mila, tvoja profesorka matematike. Pošalji sliku zadatka ili me pitaj šta god hoćeš — rešavamo zajedno, polako i bez žurbe. Ajmo!`;

// ——— prečišćavanje izgovora za srpski (razlomci + slovo Q) pre TTS-a ———
function razlomakReci(num, den) {
  const N = { 2: "polovina", 3: "trećina", 4: "četvrtina", 5: "petina", 6: "šestina",
    7: "sedmina", 8: "osmina", 9: "devetina", 10: "desetina", 11: "jedanaestina",
    12: "dvanaestina", 15: "petnaestina", 16: "šesnaestina", 20: "dvadesetina", 100: "stotina" };
  const n = parseInt(num, 10), d = parseInt(den, 10), b = N[d];
  if (!b) return num + " kroz " + den;
  const pl = b.slice(0, -1) + "e", d2 = n % 100, d1 = n % 10;
  if (n === 1) return "jedna " + b;
  if (n === 2) return "dve " + pl;
  if (d1 >= 2 && d1 <= 4 && !(d2 >= 12 && d2 <= 14)) return num + " " + pl;
  return num + " " + b;
}
function srMath(s) {
  let t = String(s);
  t = t.replace(/\s*[·×∙•*]\s*/g, " puta ");                                  // • · × * -> puta
  t = t.replace(/(\d+)\s*\/\s*(\d+)/g, (_, a, b) => " " + razlomakReci(a, b) + " "); // razlomci
  t = t.replace(/\bQ\b/g, " ku ");                                            // Q -> "ku" (ne "kju")
  t = t.replace(/ℕ/g, " skup prirodnih brojeva ").replace(/ℤ/g, " skup celih brojeva ")
       .replace(/ℚ/g, " skup racionalnih brojeva ").replace(/ℝ/g, " skup realnih brojeva ")
       .replace(/ℂ/g, " skup kompleksnih brojeva ");
  t = t.replace(/∈/g, " pripada ").replace(/∉/g, " ne pripada ")
       .replace(/∪/g, " unija ").replace(/∩/g, " presek ");
  t = t.replace(/\|\s*([^|]{1,40}?)\s*\|/g, " apsolutna vrednost $1 ");        // |x| -> apsolutna vrednost
  t = t.replace(/(\d)\s*!/g, "$1 faktorijel ");                               // 5! -> faktorijel
  return t.replace(/\s{2,}/g, " ").trim();
}
// gruba provera da je tekst na srpskom/hrvatskom/bosanskom (da ne diramo engleski itd.)
function looksSerbian(s) {
  return /[čćžšđČĆŽŠĐ]/.test(s) || /\b(kroz|puta|koren|jednačin|razlomak|zadatak|reši|izračunaj)/i.test(s);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, tts, lang } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages required" });
  }

  try {
    // 1. Dobij odgovor od Claudea
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM,
        messages: messages,
      }),
    });

    if (!claudeRes.ok) {
      const err = await claudeRes.text();
      return res.status(500).json({ error: "Anthropic API error", detail: err });
    }

    const claudeData = await claudeRes.json();
    const reply = claudeData.content?.[0]?.text || "";

    // 2. Ako nije tražen TTS, vrati samo tekst
    if (!tts || !process.env.ELEVENLABS_API_KEY) {
      return res.status(200).json({ reply });
    }

    // 3. TTS preko ElevenLabs — isti glas kao Zoi
    //    Prečišćavamo SAMO tekst koji se izgovara (na ekranu ostaje original).
    const sr = lang ? /^(sr|hr|bs)/i.test(lang) : looksSerbian(reply);
    const spoken = sr ? srMath(reply) : reply;
    const ttsRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: spoken,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true,
            speed: 0.85, // sporije — Mila govori polako i jasno
          },
        }),
      }
    );

    if (!ttsRes.ok) {
      // Ako TTS ne uspe, vrati bar tekst
      return res.status(200).json({ reply, audioError: "TTS unavailable" });
    }

    const audioBuffer = await ttsRes.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    return res.status(200).json({ reply, audio: audioBase64 });

  } catch (e) {
    return res.status(500).json({ error: "Server error", detail: e.message });
  }
}
