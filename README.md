# MathIA — Zoi · Mila · Iskra (AI profesorice)

Komplet fajlova spreman za GitHub + Vercel + tvoj domen.
Sve tri profesorice koriste isti Anthropic ključ; za govor: ElevenLabs (srpski) i Azure (ostali jezici).

---

## 1. Šta je u paketu
```
widget.js              # GLAVNI ugradni čet-widget (Zoi/Mila) — koristi /api/tts (klon glas, tempo)
widget-bilingual.js    # stariji SR/EN widget (glas uređaja u pregledaču); sad i on čita matematiku
api/chat.js            # GLAVNI "mozak" za Zoi (site + FTN prijemni, dvojezično SR/EN)
api/chat-matura.js     # alternativni "mozak" (mala matura + FTN) — koristi ako ti je sajt na njemu
api/mila.js            # "mozak" + govor za Mila (prijemni/matura/Analiza 1), vraća tekst i audio
api/iskra.js           # "mozak" za Iskra (Električna merenja)
api/tts.js             # govor (text -> MP3): srpski -> ElevenLabs (klon), ostalo -> Azure
README.md
```
> Koje da koristiš: za sve nove stranice koristi **widget.js + api/chat.js** (imaju klon glas,
> tempo i najbolje čitanje matematike). `widget-bilingual.js` i `api/chat-matura.js` su ovde
> radi kompletnosti (starije/alternativne verzije) — u njih su prenete iste popravke gradiva i
> čitanja, ali `widget-bilingual.js` koristi glas pregledača (ne klon).
>
> HTML stranice sajta (`prijemni-ftn.html`, `mala-matura.html`, `mila.html`, …) i
> `package.json`/`vercel.json` nisu u paketu — dodaj svoje postojeće. Primer
> `package.json` je u odeljku 7 (samo ako ga nemaš).

---

## 2. Šta je NOVO u ovoj verziji
- **Isti glas za Zoi i Milu (potvrđeno):** u `api/tts.js` je podrazumevani srpski glas
  sada tvoj klon `sK1CZxinAv6CB3NL3fNq` (isti koji Mila koristi u `api/mila.js`).
  Tako obe zvuče identično čak i ako stranica ne navede `data-voice`.
- **Sporiji tempo (Zoi i Mila):** `api/tts.js` čita podrazumevano brzinom 0.9.
  Po stranici menjaš sa `data-rate` (Mila npr. 0.85).
- **Izvodi / limesi / integrali** ugrađeni kao metode (tablica izvoda, pravila, lančano,
  neodređeni oblici, L'Hopital, ispitivanje funkcije) u `api/chat.js` (FTN, SR+EN) i `api/mila.js`.
- **Proporcije i procenti** obogaćeni (direktna/obrnuta, razmera 1:200, uzastopni procenti,
  koncentracija/smeša, sušenje).
- **Bolje čitanje matematike (oba):** razlomci („tri četvrtine"), `Q` -> „ku",
  `f(x)`/`f'(x)`/`f''(x)`, `|x|`, `n!`, `integral`, `Σ` -> „suma", `∂` -> „parcijalno",
  `x->0` -> „iks teži ka nuli", `=>` -> „sledi", skupovi `∈ ∪ ∩` i `ℕ ℤ ℚ ℝ ℂ`, `lim`, `arcsin/arctg`.

---

## 3. Priprema ključeva (pre deploya)
- Anthropic (obavezno): API ključ na console.anthropic.com.
- ElevenLabs (srpski glas): API ključ; tvoj klon glasa je već u kodu.
- Azure Speech (opciono, za ostale jezike): ključ + region (npr. westeurope).

---

## 4. Postavljanje na GitHub
```bash
cd matura-zoi
git init
git add .
git commit -m "Zoi/Mila: izvodi/limesi/proporcije + bolje citanje + isti glas + sporije"
git branch -M main
git remote add origin https://github.com/KORISNIK/REPO.git
git push -u origin main
```
Ako repo već postoji: samo zameni ovih 5 fajlova, pa `git add . && git commit -m "update" && git push`.

---

## 5. Deploy na Vercel + domen
1. vercel.com -> Add New -> Project -> izaberi GitHub repo -> Import.
2. Settings -> Environment Variables (za Production, Preview i Development):
   - `ANTHROPIC_API_KEY`  — obavezno
   - `ELEVENLABS_API_KEY` — za srpski glas
   - `AZURE_SPEECH_KEY` i `AZURE_SPEECH_REGION` — opciono (ostali jezici)
3. Deploy. Posle SVAKE izmene env varijabli -> Redeploy.
4. Domen: Vercel -> projekat -> Settings -> Domains -> dodaj `mathia.rs` (i `www.mathia.rs`),
   pa kod registrara podesi DNS kako Vercel kaže (A zapis na 76.76.21.21 ili CNAME na cname.vercel-dns.com).
   Sačekaj da se aktivira HTTPS.

Endpoints: `/api/chat` (Zoi), `/api/mila` (Mila), `/api/iskra` (Iskra), `/api/tts` (glas).

---

## 6. Ubacivanje widgeta na stranice
Na svaku stranicu, pred `</body>`, stavi JEDNU liniju. Posle svake izmene `widget.js`
povećaj broj u `?v=` da pregledači povuku novo (sad je v=16).

Zoi — prijemni FTN:
```html
<script src="https://mathia.rs/widget.js?v=16"
        data-api="https://mathia.rs/api/chat"
        data-mode="ftn" data-lang="sr"></script>
```
Zoi — mala matura: isto, samo `data-mode="matura"`.

Mila (isti widget, ime + isti glas + sporije):
```html
<script src="https://mathia.rs/widget.js?v=16"
        data-api="https://mathia.rs/api/chat"
        data-mode="ftn" data-name="Mila"
        data-voice="sK1CZxinAv6CB3NL3fNq"
        data-rate="0.85" data-lang="sr"></script>
```
`data-voice` = ElevenLabs Voice ID (nije obavezno jer je klon već podrazumevan, ali ga ostavi radi jasnoće).
`data-rate` = brzina (0.7 sporije … 1.2 brže).

---

## 7. Provera posle deploya
- Glas i tempo: otvori `https://mathia.rs/api/tts?lang=sr&speed=0.9` (treba tvoj klon, mirnim tempom). Probaj i `?speed=0.85`.
- Isti glas Zoi/Mila: klikni 🔊 na obe stranice — treba da zvuče identično.
- Čitanje matematike: u čavtu otkucaj i poslušaj:
  `3/4 • 5/6` -> „tri četvrtine puta pet šestina";
  `f'(x)` -> „ef prim od iks"; `x ∈ ℝ` -> „iks pripada skup realnih brojeva";
  `lim x->0` -> „limes iks teži ka nuli"; `∫ x^2 dx` -> „integral iks na kvadrat de iks".

Primer `package.json` (samo ako ga nemaš):
```json
{ "name": "mathia", "version": "1.0.0", "private": true, "type": "module" }
```
`"type": "module"` je bitno jer `api/*.js` koriste `export default`.

---

## 8. Napomene
- Autorska prava: kombinatorika/proporcije/izvodi su ugrađeni kao TIPOVI zadataka i METODE
  (ne prepisani iz zbirke od reči do reči).
- Izvodi/limesi transkript: tvoj snimak za izvode/limese nije stigao (otpremio se isti
  fajl o proporcijama). Za sada su ugrađene standardne metode; pošalji pravi snimak (kao `.txt`)
  pa ću dodati tvoj konkretan pristup i trikove.
- Model u `api/mila.js`: `claude-opus-4-5-20251001` — ako Mila vrati grešku, prvo proveri
  da je taj naziv važeći na nalogu (ostali fajlovi koriste `claude-sonnet-4-6`).
- Uključene su i starije/alternativne verzije (`widget-bilingual.js`, `api/chat-matura.js`) radi
  kompletnosti; za nove stranice preporučujem `widget.js` + `api/chat.js`.
