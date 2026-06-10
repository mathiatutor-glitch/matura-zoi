/* ============================================================
   Zoi · mala matura — samostalni widget (ubacuje se JEDNOM linijom)
   Primer:
     <script src="widget.js"
             data-api="/api/chat"
             data-avatar="https://.../zoi.png"
             data-lang="sr"></script>
   ============================================================ */
(function () {
  "use strict";

  var script = document.currentScript;
  var API = (script && script.getAttribute("data-api")) || "/api/chat";
  var AVATAR =
    (script && script.getAttribute("data-avatar")) ||
    "https://i.postimg.cc/qBXWmBQf/Chat-GPT-Image-6-jun-2026-11-58-24.png";
  var LANG = (script && script.getAttribute("data-lang")) || "sr";
  var MODE = (script && script.getAttribute("data-mode")) || "matura"; // "matura" | "ftn"
  var NAME = (script && script.getAttribute("data-name")) || "Zoi"; // ime asistenta (npr. "Mila")
  var VOICE = (script && script.getAttribute("data-voice")) || ""; // ElevenLabs Voice ID za srpski (prazno = podrazumevano)
  var AVATAR_OK = true;
  var TTS = (script && script.getAttribute("data-tts")) || API.replace(/\/api\/[a-z-]+\/?$/, "/api/tts");
  var RATE = (script && script.getAttribute("data-rate")) || ""; // brzina govora (npr. "0.85" za sporije); prazno = normalno

  // ——— prevodi UI-ja (AI ionako odgovara na izabranom jeziku) ———
  var T = {
    sr: { sub: "profesorica · mala matura", hi: "Ćao! 😊 Ja sam Zoi, tvoja profesorica za malu maturu iz matematike. Napiši zadatak ili pošalji 📷 sliku — idemo korak po korak, polako i lepo.", ph: "Napiši zadatak ili pitanje…", send: "Pošalji", chips: ["Napiši zadatak", "Pošalji sliku 📷", "Objasni mi pojam"], voice: "Glas", thinking: "Zoi razmišlja…" },
    en: { sub: "teacher · final exam (grade 8)", hi: "Hi! 😊 I'm Zoi, your math teacher for the grade-8 final exam. Type a problem or send a 📷 photo — we'll go step by step.", ph: "Type a problem or question…", send: "Send", chips: ["Type a problem", "Send a photo 📷", "Explain a concept"], voice: "Voice", thinking: "Zoi is thinking…" },
    hu: { sub: "tanárnő · kisérettségi", hi: "Szia! 😊 Zoi vagyok, a matek tanárnőd a kisérettségire. Írj be egy feladatot vagy küldj 📷 képet — lépésről lépésre haladunk.", ph: "Írd be a feladatot vagy kérdést…", send: "Küldés", chips: ["Feladat beírása", "Kép küldése 📷", "Fogalom magyarázat"], voice: "Hang", thinking: "Zoi gondolkodik…" },
    hr: { sub: "profesorica · mala matura", hi: "Bok! 😊 Ja sam Zoi, tvoja profesorica matematike za malu maturu. Napiši zadatak ili pošalji 📷 sliku — idemo korak po korak.", ph: "Napiši zadatak ili pitanje…", send: "Pošalji", chips: ["Napiši zadatak", "Pošalji sliku 📷", "Objasni pojam"], voice: "Glas", thinking: "Zoi razmišlja…" },
    ro: { sub: "profesoară · examen final", hi: "Bună! 😊 Sunt Zoi, profesoara ta de matematică. Scrie un exercițiu sau trimite o 📷 poză — mergem pas cu pas.", ph: "Scrie exercițiul sau întrebarea…", send: "Trimite", chips: ["Scrie un exercițiu", "Trimite o poză 📷", "Explică un concept"], voice: "Voce", thinking: "Zoi se gândește…" },
    sk: { sub: "učiteľka · malá matura", hi: "Ahoj! 😊 Som Zoi, tvoja učiteľka matematiky. Napíš úlohu alebo pošli 📷 fotku — pôjdeme krok za krokom.", ph: "Napíš úlohu alebo otázku…", send: "Poslať", chips: ["Napíš úlohu", "Pošli fotku 📷", "Vysvetli pojem"], voice: "Hlas", thinking: "Zoi premýšľa…" },
    de: { sub: "Lehrerin · Abschlussprüfung (Kl. 8)", hi: "Hallo! 😊 Ich bin Zoi, deine Mathelehrerin für die Abschlussprüfung der 8. Klasse. Schreib eine Aufgabe oder schick ein 📷 Foto — wir gehen Schritt für Schritt vor.", ph: "Schreib eine Aufgabe oder Frage…", send: "Senden", chips: ["Aufgabe schreiben", "Foto senden 📷", "Begriff erklären"], voice: "Stimme", thinking: "Zoi denkt nach…" },
    el: { sub: "καθηγήτρια · τελικές εξετάσεις", hi: "Γεια! 😊 Είμαι η Zoi, η καθηγήτριά σου στα μαθηματικά για τις τελικές εξετάσεις. Γράψε μια άσκηση ή στείλε μια 📷 φωτογραφία — θα πάμε βήμα βήμα.", ph: "Γράψε την άσκηση ή την ερώτηση…", send: "Αποστολή", chips: ["Γράψε άσκηση", "Στείλε φωτογραφία 📷", "Εξήγησε μια έννοια"], voice: "Φωνή", thinking: "Η Zoi σκέφτεται…" },
    es: { sub: "profesora · examen final (8.º)", hi: "¡Hola! 😊 Soy Zoi, tu profesora de matemáticas. Escribe un ejercicio o envía una 📷 foto — vamos paso a paso.", ph: "Escribe el ejercicio o la pregunta…", send: "Enviar", chips: ["Escribe un ejercicio", "Enviar foto 📷", "Explica un concepto"], voice: "Voz", thinking: "Zoi está pensando…" },
    fr: { sub: "professeure · examen final", hi: "Salut ! 😊 Je suis Zoi, ta prof de maths. Écris un exercice ou envoie une 📷 photo — on avance étape par étape.", ph: "Écris l’exercice ou la question…", send: "Envoyer", chips: ["Écris un exercice", "Envoyer une photo 📷", "Explique une notion"], voice: "Voix", thinking: "Zoi réfléchit…" },
  };
  var SPEAK = { sr: "sr-RS", en: "en-US", hu: "hu-HU", hr: "hr-HR", ro: "ro-RO", sk: "sk-SK", de: "de-DE", el: "el-GR", es: "es-ES", fr: "fr-FR" };
  var ORDER = ["sr", "en", "hu", "hr", "ro", "sk", "de", "el", "es", "fr"];
  function t() { return T[LANG] || T.sr; }

  // dopune: 4. čip (zadatak za vežbu), prefiks za „objasni pojam", poruka za vežbu — po jeziku
  var EXTRA = {
    sr: { c: "Zadatak za vežbu 🎯", cp: "Objasni mi pojam: ", pr: "Daj mi jedan zadatak za vežbu po nivou male mature." },
    en: { c: "Practice problem 🎯", cp: "Explain a concept: ", pr: "Give me one practice problem at grade-8 final-exam level." },
    hu: { c: "Gyakorló feladat 🎯", cp: "Magyarázz el egy fogalmat: ", pr: "Adj egy gyakorló feladatot a kisérettségi szintjén." },
    hr: { c: "Zadatak za vježbu 🎯", cp: "Objasni mi pojam: ", pr: "Daj mi jedan zadatak za vježbu na razini male mature." },
    ro: { c: "Exercițiu de practică 🎯", cp: "Explică-mi un concept: ", pr: "Dă-mi un exercițiu de practică la nivelul examenului final." },
    sk: { c: "Cvičná úloha 🎯", cp: "Vysvetli mi pojem: ", pr: "Daj mi jednu cvičnú úlohu na úrovni malej matury." },
    de: { c: "Übungsaufgabe 🎯", cp: "Erkläre mir einen Begriff: ", pr: "Gib mir eine Übungsaufgabe auf dem Niveau der Abschlussprüfung der 8. Klasse." },
    el: { c: "Άσκηση εξάσκησης 🎯", cp: "Εξήγησέ μου μια έννοια: ", pr: "Δώσε μου μια άσκηση εξάσκησης στο επίπεδο των τελικών εξετάσεων." },
    es: { c: "Ejercicio de práctica 🎯", cp: "Explícame un concepto: ", pr: "Dame un ejercicio de práctica del nivel del examen final." },
    fr: { c: "Exercice d’entraînement 🎯", cp: "Explique-moi une notion : ", pr: "Donne-moi un exercice d’entraînement au niveau de l’examen final." },
  };
  Object.keys(EXTRA).forEach(function (k) {
    if (T[k]) { T[k].chips = T[k].chips.concat([EXTRA[k].c]); T[k].cp = EXTRA[k].cp; T[k].pr = EXTRA[k].pr; }
  });

  // ——— FTN mod: drugačiji pozdrav/podnaslov (UI ostaje isti, „mozak" bira server) ———
  var FTN = {
    sr: { sub: "profesorica · prijemni FTN", hi: "Ćao! 😊 Ja sam Zoi, tvoja profesorica za prijemni iz matematike (FTN). Napiši zadatak ili pošalji 📷 sliku — idemo korak po korak." },
    en: { sub: "teacher · FTN entrance exam", hi: "Hi! 😊 I'm Zoi, your math teacher for the FTN entrance exam. Type a problem or send a 📷 photo — we'll go step by step." },
    hu: { sub: "tanárnő · FTN felvételi", hi: "Szia! 😊 Zoi vagyok, a matek tanárnőd az FTN felvételire. Írj egy feladatot vagy küldj 📷 képet — lépésről lépésre haladunk." },
    hr: { sub: "profesorica · prijemni FTN", hi: "Bok! 😊 Ja sam Zoi, tvoja profesorica za prijemni iz matematike (FTN). Napiši zadatak ili pošalji 📷 sliku — idemo korak po korak." },
    ro: { sub: "profesoară · admitere FTN", hi: "Bună! 😊 Sunt Zoi, profesoara ta de matematică pentru admiterea la FTN. Scrie un exercițiu sau trimite o 📷 poză — mergem pas cu pas." },
    sk: { sub: "učiteľka · prijímačky FTN", hi: "Ahoj! 😊 Som Zoi, tvoja učiteľka matematiky na prijímačky na FTN. Napíš úlohu alebo pošli 📷 fotku — pôjdeme krok za krokom." },
    de: { sub: "Lehrerin · FTN-Aufnahmeprüfung", hi: "Hallo! 😊 Ich bin Zoi, deine Mathelehrerin für die FTN-Aufnahmeprüfung. Schreib eine Aufgabe oder schick ein 📷 Foto — wir gehen Schritt für Schritt vor." },
    el: { sub: "καθηγήτρια · εισαγωγικές FTN", hi: "Γεια! 😊 Είμαι η Zoi, η καθηγήτριά σου στα μαθηματικά για τις εισαγωγικές εξετάσεις του FTN. Γράψε μια άσκηση ή στείλε μια 📷 φωτογραφία — θα πάμε βήμα βήμα." },
    es: { sub: "profesora · acceso FTN", hi: "¡Hola! 😊 Soy Zoi, tu profesora de matemáticas para el examen de acceso a la FTN. Escribe un ejercicio o envía una 📷 foto — vamos paso a paso." },
    fr: { sub: "professeure · concours FTN", hi: "Salut ! 😊 Je suis Zoi, ta prof de maths pour le concours d’entrée à la FTN. Écris un exercice ou envoie une 📷 photo — on avance étape par étape." },
  };
  function modeSub(x) { return (MODE === "ftn" && FTN[LANG]) ? FTN[LANG].sub : x.sub; }
  function modeHi(x) { var s = (MODE === "ftn" && FTN[LANG]) ? FTN[LANG].hi : x.hi; return String(s).replace(/Zoi/g, NAME); }

  // ——— stilovi (sve scope-ovano sa zoi- prefiksom) ———
  var css =
    '@import url("https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&family=Nunito:wght@400;600;700&display=swap");' +
    "#zoi-btn{position:fixed;right:20px;bottom:20px;width:62px;height:62px;border-radius:50%;border:3px solid #fff;cursor:pointer;z-index:2147483000;box-shadow:0 10px 30px rgba(20,80,70,.35);background-position:center;background-size:cover;transition:transform .15s ease}" +
    "#zoi-btn:hover{transform:scale(1.06)}" +
    "#zoi-panel{position:fixed;right:20px;bottom:94px;width:370px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 130px);background:#FBF5EA;border-radius:22px;overflow:hidden;display:none;flex-direction:column;z-index:2147483000;box-shadow:0 24px 60px rgba(20,60,55,.30);font-family:'Nunito',system-ui,sans-serif;border:1px solid #ECE0CC}" +
    "#zoi-panel.zoi-open{display:flex}" +
    "#zoi-head{display:flex;align-items:center;gap:10px;padding:12px 14px;background:linear-gradient(135deg,#1F8A78,#2FB7A0);color:#fff}" +
    "#zoi-head img{width:40px;height:40px;border-radius:50%;border:2px solid rgba(255,255,255,.7);object-fit:cover}" +
    "#zoi-head .zoi-name{font-family:'Baloo 2',cursive;font-weight:700;font-size:18px;line-height:1}" +
    "#zoi-head .zoi-sub{font-size:11.5px;opacity:.92;margin-top:2px}" +
    "#zoi-head .zoi-sp{flex:1}" +
    "#zoi-lang{background:rgba(255,255,255,.18);color:#fff;border:1px solid rgba(255,255,255,.4);border-radius:9px;font-family:inherit;font-size:12px;padding:4px 6px;cursor:pointer}" +
    "#zoi-lang option{color:#16302b}" +
    ".zoi-ico{background:rgba(255,255,255,.18);border:none;color:#fff;width:30px;height:30px;border-radius:9px;cursor:pointer;font-size:15px;line-height:1}" +
    "#zoi-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}" +
    ".zoi-row{display:flex;gap:8px;align-items:flex-end}" +
    ".zoi-row.zoi-me{flex-direction:row-reverse}" +
    ".zoi-av{width:26px;height:26px;border-radius:50%;object-fit:cover;flex:none}" +
    ".zoi-bub{max-width:78%;padding:9px 12px;border-radius:15px;font-size:14.5px;line-height:1.5;white-space:pre-wrap;word-wrap:break-word}" +
    ".zoi-zoi .zoi-bub{background:#fff;color:#27302d;border-bottom-left-radius:5px;box-shadow:0 2px 6px rgba(0,0,0,.05)}" +
    ".zoi-me .zoi-bub{background:#1F8A78;color:#fff;border-bottom-right-radius:5px}" +
    ".zoi-bub img{max-width:100%;border-radius:10px;margin-top:4px}" +
    "#zoi-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 6px}" +
    ".zoi-chip{background:#FFF;border:1px solid #E2D6BF;color:#3a4a45;border-radius:999px;padding:6px 11px;font-size:12.5px;font-family:inherit;cursor:pointer}" +
    ".zoi-chip:hover{background:#F0FAF7;border-color:#2FB7A0}" +
    "#zoi-foot{padding:10px;border-top:1px solid #ECE0CC;background:#FFFDF8}" +
    "#zoi-prev{display:none;align-items:center;gap:8px;margin-bottom:8px;font-size:12px;color:#5b6863}" +
    "#zoi-prev img{width:38px;height:38px;border-radius:8px;object-fit:cover}" +
    "#zoi-prev button{margin-left:auto;border:none;background:#eee;border-radius:8px;cursor:pointer;padding:3px 8px}" +
    "#zoi-inrow{display:flex;gap:7px;align-items:flex-end}" +
    "#zoi-ta{flex:1;resize:none;border:1px solid #E2D6BF;border-radius:13px;padding:9px 11px;font-family:inherit;font-size:14px;max-height:96px;outline:none}" +
    "#zoi-ta:focus{border-color:#2FB7A0}" +
    ".zoi-send{background:#1F8A78;color:#fff;border:none;border-radius:13px;padding:0 14px;height:40px;font-family:inherit;font-weight:700;font-size:14px;cursor:pointer}" +
    ".zoi-tool{background:#F0FAF7;border:1px solid #CFE9E2;border-radius:13px;width:40px;height:40px;cursor:pointer;font-size:17px}" +
    ".zoi-typing{font-size:13px;color:#6b7873;font-style:italic;padding:2px 4px}" +
    ".zoi-say{align-self:flex-end;flex:none;background:#F0FAF7;border:1px solid #CFE9E2;border-radius:8px;cursor:pointer;font-size:13px;line-height:1;padding:4px 7px;color:#1F8A78}" +
    ".zoi-say:hover{background:#E2F4EF;border-color:#2FB7A0}" +
    ".zoi-avfb{display:grid;place-items:center;background:linear-gradient(135deg,#1F8A78,#2FB7A0);color:#fff}" +
    "#zoi-btn.zoi-avfb{font-size:30px}" +
    "#zoi-head .zoi-headfb{width:40px;height:40px;border-radius:50%;border:2px solid rgba(255,255,255,.7);font-size:20px}";

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ——— DOM ———
  var btn = document.createElement("div");
  btn.id = "zoi-btn";
  btn.style.backgroundImage = "url('" + AVATAR + "')";
  btn.setAttribute("title", NAME);
  (function () {
    var probe = new Image();
    probe.onerror = function () {
      AVATAR_OK = false;
      btn.style.backgroundImage = "none";
      btn.classList.add("zoi-avfb");
      btn.textContent = "👩‍🏫";
    };
    probe.src = AVATAR;
  })();

  var langOpts = ORDER.map(function (l) {
    return '<option value="' + l + '"' + (l === LANG ? " selected" : "") + ">" + l.toUpperCase() + "</option>";
  }).join("");

  var panel = document.createElement("div");
  panel.id = "zoi-panel";
  panel.innerHTML =
    '<div id="zoi-head">' +
      '<img src="' + AVATAR + '" alt="' + NAME + '"/>' +
      '<div><div class="zoi-name">' + NAME + '</div><div class="zoi-sub" id="zoi-sub"></div></div>' +
      '<div class="zoi-sp"></div>' +
      '<select id="zoi-lang" title="Jezik">' + langOpts + "</select>" +
      '<button class="zoi-ico" id="zoi-voice" title="Glas">🔊</button>' +
      '<button class="zoi-ico" id="zoi-x" title="Zatvori">✕</button>' +
    "</div>" +
    '<div id="zoi-msgs"></div>' +
    '<div id="zoi-chips"></div>' +
    '<div id="zoi-foot">' +
      '<div id="zoi-prev"><img id="zoi-prev-img"/><span id="zoi-prev-name"></span><button id="zoi-prev-x">ukloni</button></div>' +
      '<div id="zoi-inrow">' +
        '<button class="zoi-tool" id="zoi-photo" title="Slika zadatka">📷</button>' +
        '<input type="file" id="zoi-file" accept="image/*" style="display:none"/>' +
        '<textarea id="zoi-ta" rows="1"></textarea>' +
        '<button class="zoi-send" id="zoi-go"></button>' +
      "</div>" +
    "</div>";

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  // ——— reference ———
  var $ = function (id) { return panel.querySelector(id); };
  var msgsEl = $("#zoi-msgs"), taEl = $("#zoi-ta"), goEl = $("#zoi-go");
  var chipsEl = $("#zoi-chips"), subEl = $("#zoi-sub"), langEl = $("#zoi-lang");
  var fileEl = $("#zoi-file"), prevEl = $("#zoi-prev"), prevImg = $("#zoi-prev-img"), prevName = $("#zoi-prev-name");
  var voiceBtn = $("#zoi-voice");

  // rezerva za sliku u zaglavlju ako se ne učita
  (function () {
    var headAv = panel.querySelector("#zoi-head img");
    if (headAv) headAv.onerror = function () {
      AVATAR_OK = false;
      var s = document.createElement("span");
      s.className = "zoi-avfb zoi-headfb";
      s.textContent = "👩‍🏫";
      headAv.replaceWith(s);
    };
  })();

  var history = [];       // {role, content} za API
  var attachment = null;  // {media_type, data, url}
  var voiceOn = false;
  var lastZoiText = "";

  // ——— jezik / tekstovi ———
  function applyLang() {
    var x = t();
    subEl.textContent = modeSub(x);
    taEl.placeholder = x.ph;
    goEl.textContent = x.send;
    chipsEl.innerHTML = "";
    x.chips.forEach(function (c, i) {
      var b = document.createElement("button");
      b.className = "zoi-chip";
      b.textContent = c;
      b.onclick = function () {
        if (i === 1) { fileEl.click(); }
        else if (i === 2) { taEl.value = x.cp || (c + ": "); taEl.focus(); }
        else if (i === 3) { taEl.value = x.pr || ""; send(); }
        else { taEl.value = ""; taEl.focus(); }
      };
      chipsEl.appendChild(b);
    });
  }

  function greet() {
    msgsEl.innerHTML = "";
    addBub("zoi", modeHi(t()));
  }

  // ——— čišćenje Markdown-a (da se ne vide gole zvezdice/taraba) ———
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function fmt(s) {
    s = esc(s);
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>"); // **podebljano**
    s = s.replace(/__([^_]+)__/g, "<strong>$1</strong>");     // __podebljano__
    s = s.replace(/^[ \t]*#{1,6}\s*/gm, "");                  // ### naslovi -> bez taraba
    s = s.replace(/^[ \t]*[\*\-\+]\s+/gm, "• ");              // „* "/„- " na početku reda -> tačkica
    s = s.replace(/\*([^*\n]+)\*/g, "$1");                    // *kurziv* -> tekst
    s = s.replace(/\*/g, "");                                  // sve preostale zvezdice
    return s;
  }

  // ——— mehurići ———
  function addBub(who, text, imgUrl) {
    var row = document.createElement("div");
    row.className = "zoi-row " + (who === "me" ? "zoi-me" : "zoi-zoi");
    var html = "";
    if (who === "zoi") html += '<img class="zoi-av" src="' + AVATAR + '"/>';
    html += '<div class="zoi-bub"></div>';
    row.innerHTML = html;
    var bub = row.querySelector(".zoi-bub");
    if (who === "zoi") {
      var av = row.querySelector(".zoi-av");
      if (av) av.onerror = function () {
        var s = document.createElement("span");
        s.className = "zoi-av zoi-avfb";
        s.textContent = "👩‍🏫";
        av.replaceWith(s);
      };
    }
    if (text) {
      if (who === "zoi") { bub.innerHTML = fmt(text); }
      else { bub.appendChild(document.createTextNode(text)); }
    }
    if (imgUrl) { var im = document.createElement("img"); im.src = imgUrl; bub.appendChild(im); }
    if (who === "zoi" && text) {
      lastZoiText = text;
      var say = document.createElement("button");
      say.className = "zoi-say"; say.type = "button"; say.textContent = "🔊";
      say.title = "Pročitaj naglas / zaustavi";
      say.onclick = function () {
        if (curBtn === say) { stopSpeak(); }
        else { primeAudio(); speakNow(text, say); }
      };
      row.appendChild(say);
    }
    msgsEl.appendChild(row);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return bub;
  }

  function typing(on) {
    var ex = msgsEl.querySelector(".zoi-typing");
    if (on && !ex) {
      var d = document.createElement("div");
      d.className = "zoi-typing"; d.textContent = String(t().thinking).replace(/Zoi/g, NAME);
      msgsEl.appendChild(d); msgsEl.scrollTop = msgsEl.scrollHeight;
    } else if (!on && ex) { ex.remove(); }
  }

  // ——— čišćenje teksta za izgovor ———
  function stripMd(s) {
    return String(s).replace(/\*\*|__|[#`]/g, " ").replace(/[*_]/g, " ");
  }
  // izbaci emojije i sličice iz IZGOVORA (na ekranu ostaju) — da glas ne čita „nasmešeno lice"
  function stripEmoji(s) {
    s = String(s);
    try { s = s.replace(/[\u{1F000}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}]/gu, " "); } catch (e) {}
    s = s.replace(/[\u2190-\u21FF\u2300-\u27BF\u2600-\u26FF\u2B00-\u2BFF\uFE0F\u200D\u20E3]/g, " ");
    return s.replace(/\s{2,}/g, " ");
  }
  // imenovani razlomci: 3/4 -> "3 četvrtine" (TTS pročita "tri četvrtine"), 1/2 -> "jedna polovina"
  function razlomakReci(num, den) {
    var N = { 2: "polovina", 3: "trećina", 4: "četvrtina", 5: "petina", 6: "šestina",
      7: "sedmina", 8: "osmina", 9: "devetina", 10: "desetina", 11: "jedanaestina",
      12: "dvanaestina", 15: "petnaestina", 16: "šesnaestina", 20: "dvadesetina", 100: "stotina" };
    var n = parseInt(num, 10), d = parseInt(den, 10), b = N[d];
    if (!b) return num + " kroz " + den;          // npr. 3/27 -> "tri kroz dvadeset sedam"
    var pl = b.slice(0, -1) + "e";                  // paukal: -a -> -e
    var d2 = n % 100, d1 = n % 10;
    if (n === 1) return "jedna " + b;               // 1/2 -> "jedna polovina"
    if (n === 2) return "dve " + pl;                // 2/3 -> "dve trećine"
    if (d1 >= 2 && d1 <= 4 && !(d2 >= 12 && d2 <= 14)) return num + " " + pl; // 3,4 -> paukal
    return num + " " + b;                            // 5+, 11..14 -> jedninski/gen.mn. oblik
  }
  // izgovor matematike na srpskom (i bs/hr) — simboli -> reči
  // Vraćanje srpskih kvačica za najčešće reči (kad se kuca bez č/ć/š/ž/đ).
  // Potpuno automatsko vraćanje nije moguće (npr. "kuca" = "kuća" ili "kuca"); ovo je rečnik
  // čestih, nedvosmislenih reči — glavni oslonac je da Zoi piše sa kvačicama.
  var KVACICE = {
    "cao":"ćao","sta":"šta","nesto":"nešto","nista":"ništa","jos":"još","vec":"već","zasto":"zašto",
    "ucenik":"učenik","ucenica":"učenica","ucenici":"učenici","uci":"uči","ucis":"učiš","ucimo":"učimo",
    "nauci":"nauči","naucis":"naučiš","naucimo":"naučimo",
    "resenje":"rešenje","resenja":"rešenja","resi":"reši","resis":"rešiš","resavamo":"rešavamo","resavanje":"rešavanje","resavaj":"rešavaj",
    "tacno":"tačno","tacan":"tačan","tacna":"tačna","tacne":"tačne","netacno":"netačno",
    "greska":"greška","greske":"greške","gresku":"grešku","pogresno":"pogrešno","pogresan":"pogrešan",
    "racun":"račun","racunamo":"računamo","racunas":"računaš","racunanje":"računanje","izracunaj":"izračunaj","izracunas":"izračunaš","izracunamo":"izračunamo",
    "kolicnik":"količnik","razlicit":"različit","razliciti":"različiti","razlicite":"različite",
    "cetiri":"četiri","cetvrti":"četvrti","cetvrta":"četvrta","cetvrtina":"četvrtina","cetvrtine":"četvrtine",
    "sest":"šest","sesti":"šesti","sestina":"šestina","sestine":"šestine",
    "treci":"treći","treca":"treća","trece":"treće","trecina":"trećina","trecine":"trećine",
    "jednacina":"jednačina","jednacine":"jednačine","jednacinu":"jednačinu","nejednacina":"nejednačina",
    "mnozenje":"množenje","mnozi":"množi","pomnozi":"pomnoži",
    "povrsina":"površina","povrsine":"površine","povrsinu":"površinu",
    "duzina":"dužina","duzine":"dužine","duzi":"duži","sirina":"širina","siri":"širi",
    "pocetak":"početak","pocni":"počni","pocinje":"počinje",
    "zavrsi":"završi","zavrsni":"završni","zavrsava":"završava",
    "vezba":"vežba","vezbaj":"vežbaj","vezbamo":"vežbamo",
    "domaci":"domaći","sledeci":"sledeći","sledeca":"sledeća","sledece":"sledeće",
    "dosao":"došao","dosla":"došla","cesto":"često","obicno":"obično","obican":"običan","znacenje":"značenje",
    "moze":"može","mozes":"možeš","mozemo":"možemo","mozete":"možete",
    "zelim":"želim","zelis":"želiš","zeli":"želi","veci":"veći","veca":"veća"
  };
  function vratiKvacice(s) {
    return String(s).replace(/[A-Za-z]+/g, function (w) {
      var r = KVACICE[w.toLowerCase()];
      if (!r) return w;
      return (w[0] >= "A" && w[0] <= "Z") ? r.charAt(0).toUpperCase() + r.slice(1) : r;
    });
  }
  function mathSr(s) {
    s = vratiKvacice(s);
    s = " " + s + " ";
    // grčka slova -> srpski izgovor (npr. „sin α" -> „sinus alfa"); π se rešava niže kao „pi"
    s = s.replace(/[αΑ]/g, " alfa ").replace(/[βΒ]/g, " beta ").replace(/[γΓ]/g, " gama ")
         .replace(/[δΔ]/g, " delta ").replace(/[εΕ]/g, " epsilon ").replace(/[θΘϑ]/g, " teta ")
         .replace(/[λΛ]/g, " lambda ").replace(/[μµ]/g, " mi ").replace(/[ρ]/g, " ro ")
         .replace(/Σ/g, " suma ").replace(/[σς]/g, " sigma ").replace(/[τ]/g, " tau ").replace(/[φΦϕ]/g, " fi ")
         .replace(/[ψΨ]/g, " psi ").replace(/[ωΩ]/g, " omega ");
    // brojevni skupovi (unicode) i logika skupova (oblast „skupovi" na FTN-u)
    s = s.replace(/ℕ/g, " skup prirodnih brojeva ").replace(/ℤ/g, " skup celih brojeva ")
         .replace(/ℚ/g, " skup racionalnih brojeva ").replace(/ℝ/g, " skup realnih brojeva ")
         .replace(/ℂ/g, " skup kompleksnih brojeva ");
    s = s.replace(/∈/g, " pripada ").replace(/∉/g, " ne pripada ")
         .replace(/[⊆⊂]/g, " podskup od ").replace(/[⊇⊃]/g, " nadskup od ")
         .replace(/∪/g, " unija ").replace(/∩/g, " presek ").replace(/∅/g, " prazan skup ")
         .replace(/∀/g, " za svako ").replace(/∃/g, " postoji ");
    // apsolutna vrednost |x| -> „apsolutna vrednost iks"
    s = s.replace(/\|\s*([^|]{1,40}?)\s*\|/g, " apsolutna vrednost $1 ");
    // analiza: integral, suma/proizvod, parcijalni izvod
    s = s.replace(/[∫∮]/g, " integral ").replace(/∏/g, " proizvod ").replace(/∂/g, " parcijalno ");
    // funkcije f(x), f''(x), f'(x) -> „ef od iks", „ef drugi izvod od iks", „ef prim od iks" (i g, h)
    s = s.replace(/\bf\s*(?:['′]{2}|[″‴])\s*\(/g, " ef drugi izvod od ").replace(/\bf\s*['′]\s*\(/g, " ef prim od ").replace(/\bf\s*\(/g, " ef od ");
    s = s.replace(/\bg\s*['′]\s*\(/g, " ge prim od ").replace(/\bg\s*\(/g, " ge od ");
    s = s.replace(/\bh\s*\(/g, " ha od ");
    // funkcije -> reči (sin samo kad ima argument, da ne pokvari reč „sin")
    s = s.replace(/\bcos\b/g, " kosinus ");
    s = s.replace(/\bsin(?=\s*[(²³^]|\s+[A-Za-z0-9])/g, " sinus ");
    s = s.replace(/\btg\b/g, " tangens ");
    s = s.replace(/\b(?:ctg|cot)\b/g, " kotangens ");
    s = s.replace(/\bln\b/g, " prirodni logaritam ");
    s = s.replace(/\blog\b/g, " logaritam ");
    // arkus-funkcije, limes, faktorijel
    s = s.replace(/\barcsin\b/g, " arkus sinus ").replace(/\barccos\b/g, " arkus kosinus ")
         .replace(/\barctg\b/g, " arkus tangens ").replace(/\barctan\b/g, " arkus tangens ");
    s = s.replace(/\blim\b/g, " limes ");
    // koreni
    s = s.replace(/∛\s*/g, " treći koren iz ");
    s = s.replace(/√\s*/g, " koren iz ");
    // stepeni
    s = s.replace(/\^\s*2\b/g, " na kvadrat ");
    s = s.replace(/\^\s*3\b/g, " na treći stepen ");
    s = s.replace(/\^\s*4\b/g, " na četvrti stepen ");
    s = s.replace(/\^\s*\(([^)]*)\)/g, " na stepen $1 ");
    s = s.replace(/\^\s*([0-9]+)/g, " na $1. stepen ");
    s = s.replace(/\^\s*([A-Za-z]+)/g, " na $1 ");
    s = s.replace(/²/g, " na kvadrat ");
    s = s.replace(/³/g, " na treći stepen ");
    // indeks: x_1 -> iks indeks 1
    s = s.replace(/_\s*\{?([0-9A-Za-z]+)\}?/g, " $1 ");
    // poređenja i operacije
    // implikacije (ASCII) pre znakova <,>,=
    s = s.replace(/<=>/g, " ako i samo ako ").replace(/=>/g, " sledi ");
    s = s.replace(/<=/g, " manje ili jednako ");
    s = s.replace(/>=/g, " veće ili jednako ");
    s = s.replace(/!=/g, " nije jednako ");
    s = s.replace(/≈/g, " približno jednako ");
    s = s.replace(/≠/g, " nije jednako ");
    s = s.replace(/≤/g, " manje ili jednako ");
    s = s.replace(/≥/g, " veće ili jednako ");
    s = s.replace(/=/g, " jednako ");
    s = s.replace(/</g, " manje od ");
    s = s.replace(/>/g, " veće od ");
    s = s.replace(/±/g, " plus minus ");
    s = s.replace(/[·×∙•*]/g, " puta ");
    s = s.replace(/÷/g, " podeljeno sa ");
    s = s.replace(/%/g, " posto ");
    s = s.replace(/π/g, " pi ");
    s = s.replace(/∞/g, " beskonačno ");
    s = s.replace(/°/g, " stepeni ");
    s = s.replace(/[()\[\]{}]/g, " ");
    // faktorijel: 5! -> „5 faktorijel", n! -> „en faktorijel" (pre razlomka, da „!" ne smeta kosoj crti)
    s = s.replace(/(\d)\s*!/g, "$1 faktorijel ");
    s = s.replace(/\b([nmk])\s*!/g, "$1 faktorijel ");
    // razlomak: brojni a/b -> imenovan ("3/4" -> "3 četvrtine")
    s = s.replace(/(\d+)\s*\/\s*(\d+)/g, function (_, a, b) { return " " + razlomakReci(a, b) + " "; });
    // ostala kosa crta: razlomak/deljenje -> "kroz" (ima cifru ili je promenljiva); samo reč/reč -> "ili" (npr. „došao/la")
    s = s.replace(/([0-9A-Za-zčćžšđČĆŽŠĐ]+)\s*\/\s*([0-9A-Za-zčćžšđČĆŽŠĐ]+)/g, function (_, a, b) {
      var mat = /\d/.test(a) || /\d/.test(b) || a.length <= 1 || b.length <= 1;
      return mat ? (a + " kroz " + b) : (a + " ili " + b);
    });
    // plus / minus
    s = s.replace(/\+/g, " plus ");
    s = s.replace(/−/g, " minus ");
    s = s.replace(/(\d|\s)\s*-\s*(\d|[A-Za-z])/g, "$1 minus $2");
    // implicitno množenje: 2x -> 2 iks, 4ac -> 4 ac
    s = s.replace(/(\d)(?=[A-Za-zπ])/g, "$1 ");
    // slovo Q -> "ku" (da ne čita "kju"); ako Q kod tebe znači skup racionalnih, vidi napomenu
    s = s.replace(/\bQ\b/g, " ku ");
    // usamljeno slovo „v" (opcija a/b/v/g, ili promenljiva) -> „ve" (da ne čita „volt")
    s = s.replace(/\bv\b/g, " ve ");
    // promenljive bez srpskog ekvivalenta -> uvek matematika
    s = s.replace(/[xX]/g, " iks ");
    s = s.replace(/[yY]/g, " ipsilon ");
    return s.replace(/\s{2,}/g, " ").trim();
  }
  function clean(text) {
    text = String(text == null ? "" : text).normalize("NFC"); // spoji rastavljene kvačice (Ć, Č, Š…)
    if (LANG === "sr" || LANG === "bs" || LANG === "hr") {
      // strelice nose značenje (limesi/implikacije) — obradi ih PRE stripEmoji koji bi ih obrisao
      var s = stripMd(text)
        .replace(/([A-Za-z0-9)\]∞])\s*[→⟶]\s*/g, "$1 teži ka ") // x→0, n→∞
        .replace(/[⇒⟹]/g, " sledi ").replace(/⇔/g, " ako i samo ako ");
      s = stripEmoji(s);
      s = s.replace(/\bFTN\b/g, "Fakultet tehničkih nauka"); // da ne čita „ef-ti-en"
      return mathSr(s);
    }
    var e = stripEmoji(stripMd(text));
    return e.replace(/\^2(?![0-9])/g, "²").replace(/\^3(?![0-9])/g, "³")
            .replace(/\^/g, " ").replace(/\s{2,}/g, " ").trim();
  }

  // ——— glas (TTS) ———
  var synth = window.speechSynthesis || null;
  var voices = [];
  var curBtn = null;
  var curAudio = null;          // trenutni izvor zvuka
  // Web Audio — najpouzdaniji način da Safari pusti preuzeti (Azure) zvuk
  var AC = window.AudioContext || window.webkitAudioContext || null;
  var actx = null, curSrc = null;
  function ensureCtx() {
    if (!AC) return null;
    if (!actx) { try { actx = new AC(); } catch (e) { actx = null; } }
    return actx;
  }
  function primeAudio() {        // MORA unutar klika (sinhrono) — otključava zvuk u Safariju
    var c = ensureCtx(); if (!c) return;
    try { if (c.state === "suspended") c.resume(); } catch (e) {}
    try { var bb = c.createBuffer(1, 1, 22050); var ss = c.createBufferSource(); ss.buffer = bb; ss.connect(c.destination); ss.start(0); } catch (e) {}
  }
  function loadVoices() { try { voices = (synth && synth.getVoices()) || []; } catch (e) {} }
  loadVoices();
  if (synth && typeof synth.onvoiceschanged !== "undefined") synth.onvoiceschanged = loadVoices;

  // za srpski/bosanski/hrvatski koristi srodan glas ako tačnog nema
  var VFALL = { sr: ["sr","hr"], hr: ["hr","sr"], sk: ["sk","cs"], de: ["de"], el: ["el"], en: ["en"], hu: ["hu"], ro: ["ro"], es: ["es"], fr: ["fr"] };
  function pickVoice(code) {
    if (!voices.length) loadVoices();
    var chain = VFALL[code] || [code];
    for (var i = 0; i < chain.length; i++) {
      var pre = chain[i];
      for (var j = 0; j < voices.length; j++) {
        var L = (voices[j].lang || "").toLowerCase().replace("_", "-");
        if (L.indexOf(pre) === 0) return voices[j];
      }
    }
    return null;
  }
  function stopSpeak() {
    try { if (synth) synth.cancel(); } catch (e) {}
    if (curSrc) { try { curSrc.onended = null; curSrc.stop(0); } catch (e) {} curSrc = null; }
    curAudio = null;
    if (curBtn) { curBtn.textContent = "🔊"; curBtn = null; }
  }
  function deviceSpeak(text, btn) {            // rezerva: glas uređaja
    if (!synth) { if (btn) btn.textContent = "🔊"; return; }
    loadVoices();
    var u = new SpeechSynthesisUtterance(clean(text));
    var v = pickVoice(LANG);
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = SPEAK[LANG] || "sr-RS"; }
    u.rate = 0.98;
    if (btn) {
      curBtn = btn; btn.textContent = "⏹";
      u.onend = function () { if (curBtn === btn) curBtn = null; if (btn) btn.textContent = "🔊"; };
      u.onerror = function () { if (curBtn === btn) curBtn = null; if (btn) btn.textContent = "🔊"; };
    }
    try { synth.speak(u); } catch (e) {}
  }
  function speakNow(text, btn) {
    stopSpeak();
    primeAudio();                       // otključaj zvuk JOŠ unutar klika (Safari)
    if (btn) { curBtn = btn; btn.textContent = "⏹"; }
    var spoken = clean(text);
    var c = ensureCtx();
    if (!c) { deviceSpeak(text, btn); return; }
    // 1) Azure glas (isti za sve uređaje); 2) ako zakaže -> glas uređaja
    var ttsBody = { text: spoken, lang: LANG, voice: VOICE };
    if (RATE) ttsBody.speed = RATE;
    fetch(TTS, { method: "POST", headers: { "Content-Type": "application/json" },
                 body: JSON.stringify(ttsBody) })
      .then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); })
      .then(function (buf) {
        if (!buf || buf.byteLength < 256) throw 0;
        if (curBtn !== btn) throw "stop";
        return new Promise(function (resolve, reject) {
          try { c.decodeAudioData(buf, resolve, function () { reject(0); }); } catch (e) { reject(0); }
        });
      })
      .then(function (audioBuf) {
        if (curBtn !== btn) return;
        try { if (c.state === "suspended") c.resume(); } catch (e) {}
        var src = c.createBufferSource();
        src.buffer = audioBuf; src.connect(c.destination);
        src.onended = function () { if (curSrc === src) curSrc = null; if (curBtn === btn) curBtn = null; if (btn) btn.textContent = "🔊"; };
        curSrc = src; curAudio = src;
        try { src.start(0); } catch (e) { deviceSpeak(text, btn); }
      })
      .catch(function (e) { if (e === "stop") return; deviceSpeak(text, btn); });
  }
  function speak(text) { if (voiceOn) speakNow(text); } // auto-čitanje kad je 🔊 (gore) uključen

  // ——— slanje ———
  function send() {
    var txt = (taEl.value || "").trim();
    if (!txt && !attachment) return;

    addBub("me", txt, attachment ? attachment.url : null);

    var content;
    if (attachment) {
      content = [];
      if (txt) content.push({ type: "text", text: txt });
      content.push({ type: "image", source: { type: "base64", media_type: attachment.media_type, data: attachment.data } });
    } else {
      content = txt;
    }
    history.push({ role: "user", content: content });

    taEl.value = ""; clearAttach();
    typing(true); goEl.disabled = true;

    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: MODE, lang: LANG, messages: history }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        typing(false); goEl.disabled = false;
        if (data.error) { addBub("zoi", "⚠️ " + data.error); return; }
        var reply = data.text || "…";
        history.push({ role: "assistant", content: reply });
        addBub("zoi", reply);
        speak(reply);
      })
      .catch(function () {
        typing(false); goEl.disabled = false;
        addBub("zoi", "⚠️ Veza je zapela. Pokušaj ponovo.");
      });
  }

  // ——— slika ———
  function clearAttach() { attachment = null; prevEl.style.display = "none"; fileEl.value = ""; }
  fileEl.addEventListener("change", function () {
    var f = fileEl.files && fileEl.files[0];
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      var url = rd.result;
      attachment = { media_type: f.type || "image/jpeg", data: String(url).split(",")[1], url: url };
      prevImg.src = url; prevName.textContent = f.name || "slika"; prevEl.style.display = "flex";
    };
    rd.readAsDataURL(f);
  });
  $("#zoi-prev-x").onclick = clearAttach;
  $("#zoi-photo").onclick = function () { fileEl.click(); };

  // ——— događaji ———
  btn.onclick = function () { panel.classList.toggle("zoi-open"); taEl.focus(); };
  $("#zoi-x").onclick = function () { panel.classList.remove("zoi-open"); stopSpeak(); };
  goEl.onclick = send;
  taEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  });
  taEl.addEventListener("input", function () {
    taEl.style.height = "auto"; taEl.style.height = Math.min(taEl.scrollHeight, 96) + "px";
  });
  langEl.onchange = function () { stopSpeak(); LANG = langEl.value; applyLang(); greet(); history = []; };
  voiceBtn.onclick = function () {
    voiceOn = !voiceOn;
    voiceBtn.style.background = voiceOn ? "rgba(255,255,255,.45)" : "rgba(255,255,255,.18)";
    if (voiceOn) { if (lastZoiText) speakNow(lastZoiText); }
    else { stopSpeak(); }
  };

  // ——— start ———
  applyLang();
  greet();
})();
