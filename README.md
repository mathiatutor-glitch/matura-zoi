# MathIA — sajt (mathia-sajt)

Tople, pametne **mentorke** i raskošni materijali za fakultet, srednju školu, prijemni i malu maturu.
Brend: *slatko + skupo* (krem/zlatna, Playfair Display + Plus Jakarta Sans).

> **Napomena:** MathIA je nezavisna obrazovna platforma opšteg karaktera. Sadržaj je informativan i nije
> povezan ni sa jednom konkretnom obrazovnom ustanovom, niti je predstavlja.

---

## ✅ Čisti set naziva (dogovoreno)

Prelazimo na kratke, jasne nazive. Stari `mathia_*` i duple strane spajamo u ove (čišćenje radimo **na kraju**, kad sve bude gore — da se sajt ne lomi usput).

### Root strane
| Nova (čista) | Zamenjuje / spaja | Status |
|---|---|---|
| `index.html` | `mathia_naslovna.html`, stari `index.html` | ✅ Batch 1 |
| `kviz.html` | `mathia_kviz_fakultet.html`, `mathia_kviz_srednja.html`, `test-sklonosti.html`, stari `kviz.html` | ✅ Batch 1 (fakultet + srednja, 1 + 4) |
| `predmet-analiza1.html` | primer/šablon strane predmeta | ✅ Batch 1 |
| `predmet-*.html` (fakultetski) | `fakultet.html`, `mathia_fakultet.html`, `vodic-fakultet*.html` | ⏳ Batch 2 |
| `srednja-matematika-1..4.html`, `srednja-fizika-1..4.html` | iste | ⏳ Batch 2 |
| `prijemni.html` | `prijemni-ftn.html`, `tutor-ftn*.html` | ⏳ Batch 2 |
| `mala-matura.html` | ista | ⏳ Batch 2 |
| `mathia_ponuda.html` | ista (dve ponude: klon / klon + materijali) | ⏳ Batch 2 |

### Folderi
| Folder | Sadržaj | Status |
|---|---|---|
| `api/` | `chat.js`, `widget.js`, `api_chat_KLONOVI.js`, persona po klonu (`iskra.js`, `mila.js`…), `tts.js` (isključen) | ⏳ Batch 3 |
| `sr/`, `en/` | baze znanja `.md` + `MathIA_klonovi_SVI_promptovi.md` | ⏳ Batch 3 |
| (root) PDF | `Oblast_*`, `MathIA_E-skripta_*`, `MathIA_Formule_*`, `MathIA_Izdanje_*`, `MathIA_Mala_matura_*`, `MathIA_Prijemni_*` | ⏳ Batch 4 |

### Jezici (10, bez bugarskog)
Srpski, engleski, nemački, grčki, mađarski, španski, ruski, italijanski, slovenački, francuski.
Mehanizam: **jedan set fajlova** + prevod preko `?lang=` (JS rečnik, padajući meni menja jezik) — ⏳ Batch 5.
Ne pravimo 10× kopija stranica.

---

## Klonovi (mentorke)
- **Bez glasa** — samo **pišu i crtaju** (canvas), korak po korak, tačno.
- MathIA (naslovna) = vodič/concierge; predmetne mentorke (Nina, Iskra, Lana, Vera, Lara, Iva, Zoi, Mila) = predaju.
- Tačni odgovori + crtanje dolaze od živog modela preko **tvog Anthropic ključa** u widget aplikaciji; ovde su
  front-end klona + **persona + sistem-promptovi + baze znanja** (Batch 3) koji ih čine tačnim i u stilu.

## Pristup / ponude
- Samo **dve ponude** (po predmetu): **klon** ili **klon + e-knjige/skripte/formule**.
- Test izbora fakulteta/srednje = **besplatan**; **prvo pitanje klonu besplatno**, dalje uz pretplatu.

## Batch plan
1. **Jezgro** — `index.html`, `kviz.html`, `predmet-analiza1.html`, `README.md`, `UPUTSTVO.md` ✅
2. **Predmeti** — svi fakultetski + srednja (mat 1–4, fiz 1–4), prijemni, mala matura, `mathia_ponuda.html`
3. **Klonovi** — `api/`, `chat.js`, `widget.js`, persona, baze znanja (`sr/`, `en/`)
4. **E-knjige / PDF** — sve oblasti, skripte, formule, izdanja
5. **Jezici** — i18n mehanizam + prevodi (10 jezika)
