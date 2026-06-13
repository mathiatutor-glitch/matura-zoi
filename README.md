# MathIA — sajt (mathia-sajt)

Tople, pametne **mentorke** i raskošni materijali za fakultet, srednju, prijemni i malu maturu.
Brend: *slatko + skupo* (krem/zlatna, Playfair Display + Plus Jakarta Sans).

> **Napomena:** MathIA je nezavisna obrazovna platforma opšteg karaktera. Sadržaj je informativan i nije
> povezan ni sa jednom konkretnom obrazovnom ustanovom, niti je predstavlja.

## ✅ Čisti set naziva (dogovoreno)

### Root strane
| Nova (čista) | Zamenjuje / spaja | Status |
|---|---|---|
| `index.html` | `mathia_naslovna.html`, stari `index.html` | ✅ |
| `kviz.html` | `mathia_kviz_fakultet.html`, `mathia_kviz_srednja.html`, `test-sklonosti.html` | ✅ |
| `prijava.html` | nova — prijava telefonom + 1 dan besplatno | ✅ |
| `predmet-analiza1.html` | primer/šablon strane predmeta | ✅ |
| `predmet-*.html` (fakultetski) | `fakultet.html`, `mathia_fakultet.html`, `vodic-fakultet*.html` | ⏳ Batch 2 |
| `srednja-matematika-1..4.html`, `srednja-fizika-1..4.html` | iste | ⏳ Batch 2 |
| `prijemni.html` | `prijemni-ftn.html`, `tutor-ftn*.html` | ⏳ Batch 2 |
| `mala-matura.html` | ista | ⏳ Batch 2 |
| `mathia_ponuda.html` | ista | ⏳ Batch 2 |

### Folderi / ostalo
| | Sadržaj | Status |
|---|---|---|
| `api/` | `chat.js`, `widget.js`, `api_chat_KLONOVI.js`, persona, `tts.js` (off) | ⏳ Batch 3 |
| `sr/`, `en/` | baze znanja `.md` + promptovi | ⏳ Batch 3 |
| PDF (root) | `Oblast_*`, `MathIA_E-skripta_*`, `MathIA_Formule_*`, `MathIA_Izdanje_*`, `MathIA_Mala_matura_*`, `MathIA_Prijemni_*` | ⏳ Batch 4 |

## Cene — TRI paketa (po predmetu; Diamond = sve uključeno)
- **Basic 5.990 RSD/mes** — mentorka za 1 predmet.
- **Gold 6.990 RSD/mes** (najpopularnije) — mentorka + e-knjiga + priručnik sa formulama.
- **Diamond 9.990 RSD/mes** — sve mentorke, svi predmeti, svi materijali + probni testovi.

## Pristup
- **Prijava brojem telefona (SMS kod).**
- **1 dan besplatno za ceo sajt** (bez kartice), pa pretplata.
- Zaštita (backend): **jedan broj = jedan trial** (trajni hash broja), **blok VOIP/virtuelnih brojeva**, **otisak uređaja + IP rate-limit**.
- Test izbora fakulteta/srednje je i dalje besplatan (lead magnet).

## Klonovi (mentorke)
- **Bez glasa** — samo pišu i crtaju (canvas), korak po korak, tačno.
- Tačni odgovori dolaze od živog modela preko **tvog Anthropic ključa** (widget app); ovde su front-end + persona + baze znanja (Batch 3).

## Jezici
10 jezika (bez bugarskog): SR, EN, DE, EL, HU, ES, RU, IT, SL, FR. Mehanizam: jedan set fajlova + `?lang=`/JS rečnik. SR+EN gotovi; ostalih 8 padaju na EN dok se ne popune.

## Batch plan
1. **Jezgro** — `index.html`, `kviz.html`, `prijava.html`, `predmet-analiza1.html`, `README.md`, `UPUTSTVO.md` ✅
2. **Predmeti** — fakultetski + srednja (mat 1–4, fiz 1–4), prijemni, mala matura, `mathia_ponuda.html`
3. **Klonovi** — `api/`, `chat.js`, `widget.js`, persona, baze znanja
4. **PDF** — sve oblasti, skripte, formule, izdanja
5. **Jezici** — preostalih 8
