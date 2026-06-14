/* ============================================================
   MathIA — zastita.js  (vodeni žig + deterrent + ©)
   Ubaci JEDNOM linijom pred </body> u e-knjige i priručnike:
     <script src="/zastita.js"></script>

   ISKRENO: ovo je sloj ODVRAĆANJA, ne neprobojna brava.
   - Vodeni žig sa brojem korisnika čini deljenje SLEDLJIVIM (najjače na webu).
   - Blokada kopiranja/desnog klika otežava, ali se može zaobići.
   - Screenshot se na webu NE može sprečiti.
   Prava zaštita = posluživanje iza prijave (server proverava nalog) + ovaj žig.

   Identitet (broj telefona) postavi sajt/backend posle prijave, npr:
     <script>window.MATHIA_USER = "+38160••••123";</script>   (pre ovog skripta)
   Ako ga nema, žig pokazuje "mathia.rs" + datum.
   ============================================================ */
(function () {
  "use strict";

  // --- identitet korisnika (backend ga ubaci posle prijave) ---
  function userTag() {
    var u = window.MATHIA_USER || "";
    if (!u) {
      try { var m = document.cookie.match(/(?:^|;\s*)mphone=([^;]+)/); if (m) u = decodeURIComponent(m[1]); } catch (e) {}
    }
    var d = new Date();
    var dt = ("0"+d.getDate()).slice(-2)+"."+("0"+(d.getMonth()+1)).slice(-2)+"."+d.getFullYear()+".";
    return (u ? u : "mathia.rs") + "  ·  " + dt;
  }

  // --- vodeni žig (tiled, preko cele strane, ne smeta čitanju, ne hvata klik) ---
  function buildWatermark() {
    var txt = "MathIA · " + userTag();
    var svg =
      "<svg xmlns='http://www.w3.org/2000/svg' width='340' height='200'>" +
      "<text x='0' y='100' transform='rotate(-24 170 100)' " +
      "font-family='Arial, sans-serif' font-size='15' fill='rgba(31,51,87,0.10)' " +
      "font-weight='700'>" + txt.replace(/&/g,"&amp;").replace(/</g,"&lt;") + "</text></svg>";
    var url = "data:image/svg+xml;utf8," + encodeURIComponent(svg);

    var wm = document.getElementById("mathia-wm");
    if (!wm) { wm = document.createElement("div"); wm.id = "mathia-wm"; document.body.appendChild(wm); }
    wm.setAttribute("aria-hidden", "true");
    wm.style.cssText =
      "position:fixed;inset:0;z-index:2147482000;pointer-events:none;" +
      "background-image:url(\"" + url + "\");background-repeat:repeat;opacity:1;" +
      "mix-blend-mode:multiply;user-select:none;-webkit-user-select:none;";
    return wm;
  }

  // --- ponovo nacrtaj žig ako ga neko ukloni (lagana otpornost) ---
  function guardWatermark() {
    buildWatermark();
    try {
      var mo = new MutationObserver(function () {
        if (!document.getElementById("mathia-wm")) buildWatermark();
      });
      mo.observe(document.body, { childList: true });
    } catch (e) {}
    // periodična provera (ako neko ukloni preko konzole)
    setInterval(function () { var w = document.getElementById("mathia-wm"); if (!w || w.style.display === "none" || w.style.opacity === "0") buildWatermark(); }, 1500);
  }

  // --- deterrent: blokada selekcije / kopiranja / desnog klika / čuvanja / alatki ---
  function deterrents() {
    var st = document.createElement("style");
    st.textContent =
      "html,body{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-touch-callout:none}" +
      "input,textarea{user-select:text!important}" +
      "@media print{html{display:none!important}}";   // sprečava print/„Save as PDF" preko štampe
    document.head.appendChild(st);

    var stop = function (e) { e.preventDefault(); e.stopPropagation(); return false; };
    ["contextmenu", "copy", "cut", "dragstart", "selectstart"].forEach(function (ev) {
      document.addEventListener(ev, stop, { capture: true });
    });

    document.addEventListener("keydown", function (e) {
      var k = (e.key || "").toLowerCase();
      var mod = e.ctrlKey || e.metaKey;
      // Ctrl/Cmd + S/P/U/C/X/A  i  F12, DevTools kombinacije
      if (mod && ["s", "p", "u", "c", "x", "a"].indexOf(k) !== -1) return stop(e);
      if (k === "f12") return stop(e);
      if (mod && e.shiftKey && ["i", "j", "c"].indexOf(k) !== -1) return stop(e); // DevTools
    }, { capture: true });
  }

  // --- © napomena (diskretno, pri dnu) ---
  function copyrightNote() {
    if (document.getElementById("mathia-cc")) return;
    var c = document.createElement("div");
    c.id = "mathia-cc";
    var yr = new Date().getFullYear();
    c.textContent = "© " + yr + " MathIA · mathia.rs — Sav sadržaj je zaštićen. Umnožavanje i deljenje nisu dozvoljeni.";
    c.style.cssText =
      "position:relative;z-index:2147482001;text-align:center;font:600 12px/1.5 'Plus Jakarta Sans',Arial,sans-serif;" +
      "color:#9b7420;background:#fff8ef;border-top:1px solid #eadfca;padding:14px 16px;margin-top:30px";
    document.body.appendChild(c);
  }

  function init() { deterrents(); guardWatermark(); copyrightNote(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
