# Zoi · mala matura — kompletno uputstvo (korak po korak)

Samostalni AI tutor za pripremu **male mature iz matematike**. Ubacuje se na bilo koju
stranu **jednom linijom**. Radi zadatak iz teksta ili sa **slike**, korak po korak,
na **8 jezika**, sa **glasom**, **prepoznavanjem nivoa** i **zadatkom za vežbu**.

## Šta je uključeno
- 5 zvaničnih oblasti završnog ispita (Brojevi i operacije, Algebra i funkcije, Geometrija, Merenje, Obrada podataka).
- 3 nivoa težine — Zoi prepozna i kaže je li zadatak **osnovni / srednji / napredni**.
- Tvoj **metod i glas** (prepiši uredno, skraćuj, „kao slikovnicu", smiruj tremu, ne juriti grešku).
- Na kraju **uvek** daje **nov zadatak za vežbu** istog nivoa.
- Jezici: **SR, EN, HU, BS, SQ, HR, RO, SK** (prekidač u prozoru).
- Slika zadatka 📷 + glas 🔊.

## Fajlovi u paketu
- `widget.js` — sam tutor (ide na sajt).
- `index.html` — gotova demo strana sa već ubačenom Zoi.
- `api/chat.js` — backend koji čuva tajni ključ i Zoin „mozak" (radi na Vercel-u).
- `package.json`, `.gitignore` — prateći fajlovi.

> ⚠️ Tajni ključ NIKAD ne ide u `widget.js` ni na GitHub — samo kao Vercel env varijabla (vidi KORAK 3).

---

# UPUTSTVO ZA UPLOAD

## KORAK 1 — Napravi repo na GitHub-u
1. Uđi na **github.com** → New repository → ime npr. `matura-zoi` → Create.
2. Otvori repo → **Add file → Upload files**.
3. Prevuci **sve fajlove iz paketa** (i folder `api`) → **Commit changes**.

## KORAK 2 — Poveži sa Vercel-om
1. Uđi na **vercel.com** → prijavi se GitHub nalogom.
2. **Add New… → Project** → izaberi repo `matura-zoi` → **Import** → **Deploy**.
3. Sačekaj da piše **Ready**. (Vercel sam prepozna `api/chat.js`.)

## KORAK 3 — Dodaj tajni API ključ
1. Na **console.anthropic.com** → Settings → **API Keys** → napravi ključ (kopiraj ga).
2. Tu na **Billing** dodaj malo sredstava (AI se plaća po upotrebi).
3. Nazad na Vercel: **Project → Settings → Environment Variables** dodaj:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** tvoj ključ → **Save**.
4. **Deployments → (tri tačkice na poslednjem) → Redeploy.**
   (Bez ovog koraka ključ se ne primeni!)

## KORAK 4 — Testiraj
1. Klikni **Visit** (ili otvori svoj `…vercel.app` link).
2. Klikni Zoi dugme **dole desno** → napiši **„Zdravo"** → pošalji.
3. Ako odgovori — uspelo je! 🎉
   Ako zucne grešku, oblačić tačno kaže šta fali (najčešće: ključ nije dodat ili
   nema sredstava → dodaj pa ponovo **Redeploy**). Posle promena uvek **Cmd/Ctrl+Shift+R**.

## KORAK 5 — Stavi Zoi na svoju stranu
Na svaku `.html` stranu, **iznad `</body>`**, nalepi ovu liniju:

```html
<script src="widget.js"
        data-api="/api/chat"
        data-avatar="URL_DO_ZOI_SLIKE"
        data-lang="sr"></script>
```

- Ako je backend na drugom domenu, stavi pun link:
  `data-api="https://matura-zoi.vercel.app/api/chat"`.
- `data-lang` = početni jezik (`sr`, `en`, `hu`, `bs`, `sq`, `hr`, `ro`, `sk`) — korisnik ga menja u prozoru.

---

## Šta lako menjaš
- **Slika (avatar):** `data-avatar` u liniji za ubacivanje.
- **Početni jezik:** `data-lang`.
- **Zoin „mozak" / metod / gradivo:** `api/chat.js` → `MATURA_SYSTEM`.
- **Model / cena:** `api/chat.js`, polje `model`:
  - `claude-sonnet-4-6` — **kvalitetnije (podrazumevano)**,
  - `claude-haiku-4-5-20251001` — jeftinije i brže.
  Posle svake izmene fajlova → **Redeploy** na Vercel-u.

## Napomene
- Postavi **limit potrošnje** na Anthropic nalogu dok testiraš.
- Glas/mikrofon zavise od uređaja i jezika (najbolje Chrome); za vrhunski glas kasnije premium TTS (ElevenLabs).
- Zvanična zbirka je korišćena kao orijentir za oblasti, nivoe i tipove — bez prepisivanja zadataka od reči do reči.
- Sledeće (po želji): praćenje napretka učenika, više jezika, zasebna baza zadataka kad naraste.
