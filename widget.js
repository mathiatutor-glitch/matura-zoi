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

  // ——— prevodi UI-ja (AI ionako odgovara na izabranom jeziku) ———
  var T = {
    sr: { sub: "profesorica · mala matura", hi: "Ćao! 😊 Ja sam Zoi, tvoja profesorica za malu maturu iz matematike. Napiši zadatak ili pošalji 📷 sliku — idemo korak po korak, polako i lepo.", ph: "Napiši zadatak ili pitanje…", send: "Pošalji", chips: ["Napiši zadatak", "Pošalji sliku 📷", "Objasni mi pojam"], voice: "Glas", thinking: "Zoi razmišlja…" },
    en: { sub: "teacher · final exam (grade 8)", hi: "Hi! 😊 I'm Zoi, your math teacher for the grade-8 final exam. Type a problem or send a 📷 photo — we'll go step by step.", ph: "Type a problem or question…", send: "Send", chips: ["Type a problem", "Send a photo 📷", "Explain a concept"], voice: "Voice", thinking: "Zoi is thinking…" },
    hu: { sub: "tanárnő · kisérettségi", hi: "Szia! 😊 Zoi vagyok, a matek tanárnőd a kisérettségire. Írj be egy feladatot vagy küldj 📷 képet — lépésről lépésre haladunk.", ph: "Írd be a feladatot vagy kérdést…", send: "Küldés", chips: ["Feladat beírása", "Kép küldése 📷", "Fogalom magyarázat"], voice: "Hang", thinking: "Zoi gondolkodik…" },
    bs: { sub: "profesorica · mala matura", hi: "Ćao! 😊 Ja sam Zoi, tvoja profesorica iz matematike za malu maturu. Napiši zadatak ili pošalji 📷 sliku — idemo korak po korak.", ph: "Napiši zadatak ili pitanje…", send: "Pošalji", chips: ["Napiši zadatak", "Pošalji sliku 📷", "Objasni pojam"], voice: "Glas", thinking: "Zoi razmišlja…" },
    sq: { sub: "mësuese · matura e vogël", hi: "Përshëndetje! 😊 Jam Zoi, mësuesja jote e matematikës. Shkruaj një ushtrim ose dërgo një 📷 foto — shkojmë hap pas hapi.", ph: "Shkruaj ushtrimin ose pyetjen…", send: "Dërgo", chips: ["Shkruaj ushtrim", "Dërgo foto 📷", "Shpjego një koncept"], voice: "Zëri", thinking: "Zoi po mendon…" },
    hr: { sub: "profesorica · mala matura", hi: "Bok! 😊 Ja sam Zoi, tvoja profesorica matematike za malu maturu. Napiši zadatak ili pošalji 📷 sliku — idemo korak po korak.", ph: "Napiši zadatak ili pitanje…", send: "Pošalji", chips: ["Napiši zadatak", "Pošalji sliku 📷", "Objasni pojam"], voice: "Glas", thinking: "Zoi razmišlja…" },
    ro: { sub: "profesoară · examen final", hi: "Bună! 😊 Sunt Zoi, profesoara ta de matematică. Scrie un exercițiu sau trimite o 📷 poză — mergem pas cu pas.", ph: "Scrie exercițiul sau întrebarea…", send: "Trimite", chips: ["Scrie un exercițiu", "Trimite o poză 📷", "Explică un concept"], voice: "Voce", thinking: "Zoi se gândește…" },
    sk: { sub: "učiteľka · malá matura", hi: "Ahoj! 😊 Som Zoi, tvoja učiteľka matematiky. Napíš úlohu alebo pošli 📷 fotku — pôjdeme krok za krokom.", ph: "Napíš úlohu alebo otázku…", send: "Poslať", chips: ["Napíš úlohu", "Pošli fotku 📷", "Vysvetli pojem"], voice: "Hlas", thinking: "Zoi premýšľa…" },
  };
  var SPEAK = { sr: "sr-RS", en: "en-US", hu: "hu-HU", bs: "bs-BA", sq: "sq-AL", hr: "hr-HR", ro: "ro-RO", sk: "sk-SK" };
  var ORDER = ["sr", "en", "hu", "bs", "sq", "hr", "ro", "sk"];
  function t() { return T[LANG] || T.sr; }

  // dopune: 4. čip (zadatak za vežbu), prefiks za „objasni pojam", poruka za vežbu — po jeziku
  var EXTRA = {
    sr: { c: "Zadatak za vežbu 🎯", cp: "Objasni mi pojam: ", pr: "Daj mi jedan zadatak za vežbu po nivou male mature." },
    en: { c: "Practice problem 🎯", cp: "Explain a concept: ", pr: "Give me one practice problem at grade-8 final-exam level." },
    hu: { c: "Gyakorló feladat 🎯", cp: "Magyarázz el egy fogalmat: ", pr: "Adj egy gyakorló feladatot a kisérettségi szintjén." },
    bs: { c: "Zadatak za vježbu 🎯", cp: "Objasni mi pojam: ", pr: "Daj mi jedan zadatak za vježbu na nivou male mature." },
    sq: { c: "Ushtrim praktik 🎯", cp: "Më shpjego një koncept: ", pr: "Më jep një ushtrim praktike në nivelin e maturës së vogël." },
    hr: { c: "Zadatak za vježbu 🎯", cp: "Objasni mi pojam: ", pr: "Daj mi jedan zadatak za vježbu na razini male mature." },
    ro: { c: "Exercițiu de practică 🎯", cp: "Explică-mi un concept: ", pr: "Dă-mi un exercițiu de practică la nivelul examenului final." },
    sk: { c: "Cvičná úloha 🎯", cp: "Vysvetli mi pojem: ", pr: "Daj mi jednu cvičnú úlohu na úrovni malej matury." },
  };
  Object.keys(EXTRA).forEach(function (k) {
    if (T[k]) { T[k].chips = T[k].chips.concat([EXTRA[k].c]); T[k].cp = EXTRA[k].cp; T[k].pr = EXTRA[k].pr; }
  });

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
    ".zoi-typing{font-size:13px;color:#6b7873;font-style:italic;padding:2px 4px}";

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ——— DOM ———
  var btn = document.createElement("div");
  btn.id = "zoi-btn";
  btn.style.backgroundImage = "url('" + AVATAR + "')";
  btn.setAttribute("title", "Zoi");

  var langOpts = ORDER.map(function (l) {
    return '<option value="' + l + '"' + (l === LANG ? " selected" : "") + ">" + l.toUpperCase() + "</option>";
  }).join("");

  var panel = document.createElement("div");
  panel.id = "zoi-panel";
  panel.innerHTML =
    '<div id="zoi-head">' +
      '<img src="' + AVATAR + '" alt="Zoi"/>' +
      '<div><div class="zoi-name">Zoi</div><div class="zoi-sub" id="zoi-sub"></div></div>' +
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

  var history = [];       // {role, content} za API
  var attachment = null;  // {media_type, data, url}
  var voiceOn = false;

  // ——— jezik / tekstovi ———
  function applyLang() {
    var x = t();
    subEl.textContent = x.sub;
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
    addBub("zoi", t().hi);
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
    if (text) bub.appendChild(document.createTextNode(text));
    if (imgUrl) { var im = document.createElement("img"); im.src = imgUrl; bub.appendChild(im); }
    msgsEl.appendChild(row);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return bub;
  }

  function typing(on) {
    var ex = msgsEl.querySelector(".zoi-typing");
    if (on && !ex) {
      var d = document.createElement("div");
      d.className = "zoi-typing"; d.textContent = t().thinking;
      msgsEl.appendChild(d); msgsEl.scrollTop = msgsEl.scrollHeight;
    } else if (!on && ex) { ex.remove(); }
  }

  function speak(text) {
    if (!voiceOn || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = SPEAK[LANG] || "sr-RS";
      u.rate = 0.98;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

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
      body: JSON.stringify({ lang: LANG, messages: history }),
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
  $("#zoi-x").onclick = function () { panel.classList.remove("zoi-open"); };
  goEl.onclick = send;
  taEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  });
  taEl.addEventListener("input", function () {
    taEl.style.height = "auto"; taEl.style.height = Math.min(taEl.scrollHeight, 96) + "px";
  });
  langEl.onchange = function () { LANG = langEl.value; applyLang(); greet(); history = []; };
  voiceBtn.onclick = function () {
    voiceOn = !voiceOn;
    voiceBtn.style.background = voiceOn ? "rgba(255,255,255,.45)" : "rgba(255,255,255,.18)";
    if (!voiceOn && window.speechSynthesis) window.speechSynthesis.cancel();
  };

  // ——— start ———
  applyLang();
  greet();
})();
