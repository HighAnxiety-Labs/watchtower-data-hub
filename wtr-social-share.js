/* ============================================================================
   [-WTR-] WATCHTOWER MULTI-PLATFORM SHARE ENGINE (DISCORD • FACEBOOK • STEAM)
   Renders WTR Logo scaled to exact 3 line heights (4.05em) + 1-Click Copy Text,
   Copy Share Card PNG, and Copy 3-Line-Height Logo PNG
   ============================================================================ */
(function initWtrSocialShare() {
  const WTR_LOGO_REMOTE = "https://highanxiety-labs.github.io/watchtower-data-hub/assets/images/wtr-logo.png";
  const WTR_BADGE_REMOTE = "https://highanxiety-labs.github.io/watchtower-data-hub/assets/images/wtr-logo-badge.png";
  const WTR_BADGE_LOCAL = "./assets/images/wtr-logo-badge.png";

  function injectStyles() {
    if (document.getElementById("wtrSocialShareStyles")) return;
    const st = document.createElement("style");
    st.id = "wtrSocialShareStyles";
    st.textContent = `
      .wtr-share-btn-group {
        display: inline-flex; align-items: center; gap: 5px; flex-wrap: wrap;
      }
      .wtr-sbtn {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 5px 10px; border-radius: 4px; cursor: pointer;
        font-family: monospace; font-size: 11px; font-weight: 900;
        letter-spacing: 0.4px; text-transform: uppercase; text-decoration: none;
        transition: all 0.14s ease; white-space: nowrap;
      }
      .wtr-sbtn-discord {
        background: rgba(88, 101, 242, 0.22); border: 1px solid rgba(129, 140, 248, 0.8); color: #c7d2fe;
      }
      .wtr-sbtn-discord:hover { background: #5865f2; border-color: #a5b4fc; color: #fff; }
      .wtr-sbtn-facebook {
        background: rgba(24, 119, 242, 0.22); border: 1px solid rgba(96, 165, 250, 0.8); color: #bfdbfe;
      }
      .wtr-sbtn-facebook:hover { background: #1877f2; border-color: #93c5fd; color: #fff; }
      .wtr-sbtn-steam {
        background: rgba(27, 40, 56, 0.88); border: 1px solid rgba(102, 192, 244, 0.8); color: #66c0f4;
      }
      .wtr-sbtn-steam:hover { background: #2a475e; border-color: #bae6fd; color: #fff; }

      .wtr-share-backdrop {
        position: fixed; inset: 0; z-index: 12000;
        background: rgba(3, 7, 12, 0.86);
        -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px);
        display: none; align-items: center; justify-content: center; padding: 14px;
      }
      .wtr-share-backdrop.open { display: flex; }
      .wtr-share-modal {
        width: 100%; max-width: 720px; max-height: 92vh;
        background: #0b1118; border: 1.5px solid #00e676; border-radius: 8px;
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.94), 0 0 24px rgba(0, 230, 118, 0.2);
        display: flex; flex-direction: column; overflow: hidden;
        color: #e2e8f0; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      }
      .wtr-share-top {
        display: flex; align-items: center; justify-content: space-between; gap: 12px;
        padding: 12px 16px;
        background: linear-gradient(90deg, #0d2218 0%, #0b1118 65%, #111c29 100%);
        border-bottom: 1px solid #1f3b2b;
      }
      .wtr-share-brand {
        display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1;
        font-size: 13px; line-height: 1.35;
      }
      .wtr-share-logo-3line {
        height: 4.05em; width: 4.05em; min-width: 4.05em;
        border-radius: 50%; object-fit: cover; display: block;
        border: 2px solid #ffd700;
        box-shadow: 0 0 12px rgba(0, 230, 118, 0.35);
        background: #05080c; flex-shrink: 0;
      }
      .wtr-share-brand-lines { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .wtr-share-kicker {
        font-family: monospace; font-size: 10.5px; font-weight: 900;
        color: #00e676; letter-spacing: 0.8px; text-transform: uppercase;
      }
      .wtr-share-title {
        font-family: 'Arial Black', sans-serif; font-size: 14.5px; color: #ffffff;
        letter-spacing: 0.6px; text-transform: uppercase;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .wtr-share-sub { font-family: monospace; font-size: 11px; color: #94a3b8; }
      .wtr-share-close {
        background: #241215; border: 1px solid #ef4444; color: #fca5a5;
        font-family: monospace; font-size: 12px; font-weight: 900;
        padding: 5px 10px; border-radius: 4px; cursor: pointer; flex-shrink: 0;
      }
      .wtr-share-close:hover { background: #ef4444; color: #fff; }
      .wtr-share-tabs {
        display: flex; align-items: center; gap: 7px; flex-wrap: wrap;
        padding: 10px 16px; background: #070c11; border-bottom: 1px solid #1a2d3d;
      }
      .wtr-share-tab {
        padding: 6px 13px; border-radius: 999px; border: 1px solid #2b3f54;
        background: #0d1620; color: #cbd5e1; font-family: monospace;
        font-size: 11.5px; font-weight: 900; cursor: pointer; transition: all 0.14s ease;
      }
      .wtr-share-tab:hover { border-color: #94a3b8; color: #fff; }
      .wtr-share-tab.active-discord { background: #5865f2; color: #fff; border-color: #a5b4fc; }
      .wtr-share-tab.active-facebook { background: #1877f2; color: #fff; border-color: #93c5fd; }
      .wtr-share-tab.active-steam { background: #1b2838; color: #66c0f4; border-color: #66c0f4; }
      .wtr-share-body { padding: 14px 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
      .wtr-share-hint {
        font-family: monospace; font-size: 11px; color: #94a3b8;
        background: rgba(15, 25, 36, 0.9); border: 1px solid #1e3448;
        border-left: 3px solid #ffd700; padding: 7px 10px; border-radius: 4px; line-height: 1.45;
      }
      .wtr-share-textarea {
        width: 100%; min-height: 185px; max-height: 300px; resize: vertical;
        background: #05080c; border: 1px solid #243b4f; border-radius: 5px;
        color: #e2e8f0; font-family: 'JetBrains Mono', Consolas, monospace;
        font-size: 12px; line-height: 1.48; padding: 10px 12px; outline: none;
        box-sizing: border-box;
      }
      .wtr-share-textarea:focus { border-color: #00e676; }
      .wtr-share-foot {
        display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;
        padding: 10px 16px; background: #070c11; border-top: 1px solid #1a2d3d;
      }
      .wtr-share-actions { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
      .wtr-share-copy-btn {
        background: #00e676; color: #03140a; border: 1px solid #b9f6ca;
        padding: 7px 14px; border-radius: 4px; font-family: monospace;
        font-size: 11.5px; font-weight: 900; letter-spacing: 0.5px;
        text-transform: uppercase; cursor: pointer;
      }
      .wtr-share-copy-btn:hover { background: #69f0ae; }
      .wtr-share-img-btn {
        background: rgba(255, 215, 0, 0.14); color: #ffd700; border: 1px solid rgba(255, 215, 0, 0.7);
        padding: 7px 11px; border-radius: 4px; font-family: monospace;
        font-size: 11px; font-weight: 900; letter-spacing: 0.4px;
        text-transform: uppercase; cursor: pointer;
      }
      .wtr-share-img-btn:hover { background: #ffd700; color: #05080c; }
    `;
    document.head.appendChild(st);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectStyles);
  } else {
    injectStyles();
  }

  let currentPayloads = null;
  let currentMeta = { title: "SHARE WATCHTOWER BRIEF", subtitle: "" };
  let currentFormat = "discord";

  function ensureModal() {
    injectStyles();
    let el = document.getElementById("wtrSocialShareBackdrop");
    if (el) return el;
    el = document.createElement("div");
    el.id = "wtrSocialShareBackdrop";
    el.className = "wtr-share-backdrop";
    el.innerHTML = `
      <div class="wtr-share-modal" role="dialog" aria-modal="true" aria-label="Share WatchToweR Brief">
        <div class="wtr-share-top">
          <div class="wtr-share-brand">
            <img id="wtrShareLogoImg" class="wtr-share-logo-3line" src="${WTR_BADGE_LOCAL}" onerror="this.onerror=null;this.src='${WTR_BADGE_REMOTE}';" alt="WatchToweR Logo">
            <div class="wtr-share-brand-lines">
              <span class="wtr-share-kicker">[-WTR-] WATCHTOWER SHARE BRIEF</span>
              <span class="wtr-share-title" id="wtrShareModalTitle">SHARE BRIEF</span>
              <span class="wtr-share-sub" id="wtrShareModalSub">Discord Markdown • Facebook Plain Text • Steam BBCode</span>
            </div>
          </div>
          <button type="button" class="wtr-share-close" id="wtrShareCloseBtn">✕ CLOSE</button>
        </div>
        <div class="wtr-share-tabs">
          <button type="button" class="wtr-share-tab active-discord" data-wtr-fmt="discord">💬 DISCORD</button>
          <button type="button" class="wtr-share-tab" data-wtr-fmt="facebook">📘 FACEBOOK</button>
          <button type="button" class="wtr-share-tab" data-wtr-fmt="steam">🎮 STEAM (BBCode)</button>
        </div>
        <div class="wtr-share-body">
          <div class="wtr-share-hint" id="wtrSharePlatformHint"></div>
          <textarea id="wtrShareOutputArea" class="wtr-share-textarea" aria-label="Formatted share text" spellcheck="false"></textarea>
        </div>
        <div class="wtr-share-foot">
          <span id="wtrShareCharStat" style="font-family:monospace; font-size:11px; color:#94a3b8;">0 chars</span>
          <div class="wtr-share-actions">
            <button type="button" class="wtr-share-img-btn" id="wtrShareLogoBtn" title="Copy or download the 64x64 (3-line-height) WTR Logo PNG to paste into your post">🛡️ 3-LINE LOGO PNG</button>
            <button type="button" class="wtr-share-img-btn" id="wtrShareCardBtn" title="Render this brief + 3-line-height WTR Logo as a graphic PNG card (Ctrl+V into Discord/Facebook)">🖼️ COPY CARD PNG</button>
            <button type="button" class="wtr-share-copy-btn" id="wtrShareCopyBtn">📋 COPY FOR DISCORD</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(el);

    el.addEventListener("click", (e) => {
      if (e.target === el) closeShareModal();
    });
    el.querySelector("#wtrShareCloseBtn").addEventListener("click", closeShareModal);
    el.querySelectorAll(".wtr-share-tab").forEach(btn => {
      btn.addEventListener("click", () => switchFormat(btn.getAttribute("data-wtr-fmt") || "discord"));
    });
    el.querySelector("#wtrShareCopyBtn").addEventListener("click", copyActiveText);
    el.querySelector("#wtrShareCardBtn").addEventListener("click", copyOrDownloadCardPng);
    el.querySelector("#wtrShareLogoBtn").addEventListener("click", copyOrDownloadBadgePng);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && el.classList.contains("open")) closeShareModal();
    });
    return el;
  }

  function closeShareModal() {
    const el = document.getElementById("wtrSocialShareBackdrop");
    if (el) el.classList.remove("open");
  }

  function switchFormat(fmt) {
    currentFormat = fmt;
    const el = ensureModal();
    el.querySelectorAll(".wtr-share-tab").forEach(btn => {
      const f = btn.getAttribute("data-wtr-fmt");
      btn.className = "wtr-share-tab" + (f === fmt ? (" active-" + fmt) : "");
    });
    const txt = (currentPayloads && currentPayloads[fmt]) ? currentPayloads[fmt] : "";
    const ta = el.querySelector("#wtrShareOutputArea");
    if (ta) ta.value = txt;
    const stat = el.querySelector("#wtrShareCharStat");
    if (stat) stat.textContent = `${txt.length} chars • 3-Line Logo Ready`;
    const copyBtn = el.querySelector("#wtrShareCopyBtn");
    if (copyBtn) {
      copyBtn.textContent = fmt === "discord" ? "📋 COPY FOR DISCORD" : (fmt === "facebook" ? "📋 COPY FOR FACEBOOK" : "📋 COPY FOR STEAM");
    }
    const hint = el.querySelector("#wtrSharePlatformHint");
    if (hint) {
      if (fmt === "discord") {
        hint.innerHTML = "💬 <strong>Discord Tip:</strong> Plain text cannot embed inline images. Click <strong>🖼️ COPY CARD PNG</strong> to paste a graphic card with the 3-line WTR Logo via <code>Ctrl+V</code>, or paste the Markdown text below.";
      } else if (fmt === "facebook") {
        hint.innerHTML = "📘 <strong>Facebook Tip:</strong> Facebook strips inline image tags from text. Use <strong>🖼️ COPY CARD PNG</strong> (or <strong>🛡️ 3-LINE LOGO PNG</strong>) to attach the branded graphic, then paste the text below.";
      } else {
        hint.innerHTML = "🎮 <strong>Steam Tip:</strong> Uses compact 64×64 <code>[img]wtr-logo-badge.png[/img]</code> (3-line height) for Steam Guides &amp; Announcements.";
      }
    }
  }

  function flashBtn(btn, msg) {
    if (!btn) return;
    const prev = btn.textContent;
    btn.textContent = msg;
    setTimeout(() => { btn.textContent = prev; }, 2200);
  }

  function copyActiveText() {
    const el = ensureModal();
    const ta = el.querySelector("#wtrShareOutputArea");
    const copyBtn = el.querySelector("#wtrShareCopyBtn");
    if (!ta) return;
    const txt = ta.value || "";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(() => flashBtn(copyBtn, "✅ COPIED TEXT!")).catch(() => {
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        flashBtn(copyBtn, "✅ COPIED TEXT!");
      });
    } else {
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      flashBtn(copyBtn, "✅ COPIED TEXT!");
    }
  }

  function loadLogoImage() {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => {
        const img2 = new Image();
        img2.onload = () => resolve(img2);
        img2.onerror = () => resolve(null);
        img2.src = WTR_BADGE_LOCAL;
      };
      img.src = window.location.protocol === "file:" ? WTR_BADGE_LOCAL : WTR_BADGE_REMOTE;
    });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  async function writePngBlobOrDownload(blob, filename, btn, copiedLabel, dlLabel) {
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        flashBtn(btn, copiedLabel);
        return;
      }
    } catch (e) {}
    downloadBlob(blob, filename);
    flashBtn(btn, dlLabel);
  }

  async function copyOrDownloadBadgePng() {
    const btn = document.getElementById("wtrShareLogoBtn");
    const img = await loadLogoImage();
    const canvas = document.createElement("canvas");
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 64, 64);
    ctx.save();
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    if (img) ctx.drawImage(img, 2, 2, 60, 60);
    ctx.restore();
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.stroke();
    canvas.toBlob((blob) => {
      if (blob) writePngBlobOrDownload(blob, "wtr-logo-badge-64px.png", btn, "✅ LOGO COPIED (CTRL+V)!", "⬇️ LOGO PNG SAVED!");
    }, "image/png");
  }

  function stripMarkupForCard(txt) {
    return String(txt || "")
      .replace(/\[img\][^\[]*\[\/img\]\s*/gi, "")
      .replace(/\[url=([^\]]+)\]([^\[]+)\[\/url\]/gi, "$2 ($1)")
      .replace(/\[\/?(?:b|i|u|list|\*)\]/gi, "")
      .replace(/\*\*/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/<((?:https?:\/\/)[^>]+)>/g, "$1");
  }

  async function copyOrDownloadCardPng() {
    const btn = document.getElementById("wtrShareCardBtn");
    const ta = document.getElementById("wtrShareOutputArea");
    const rawLines = stripMarkupForCard(ta ? ta.value : "").split(/\r?\n/).filter(l => l.trim().length > 0);
    const width = 760;
    const padX = 24;
    const lineH = 22;
    const headerH = 88; // exact 3-line-height logo header
    const maxW = width - padX * 2;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = "14px Consolas, 'Segoe UI', monospace";

    const wrapped = [];
    rawLines.forEach(line => {
      const words = line.split(" ");
      let cur = "";
      words.forEach(w => {
        const test = cur ? (cur + " " + w) : w;
        if (ctx.measureText(test).width > maxW && cur) {
          wrapped.push(cur);
          cur = w;
        } else {
          cur = test;
        }
      });
      if (cur) wrapped.push(cur);
    });

    const height = Math.max(210, headerH + 22 + wrapped.length * lineH + 24);
    canvas.width = width;
    canvas.height = height;

    // Tactical dark background
    ctx.fillStyle = "#080e14";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#00e676";
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, width - 3, height - 3);

    // Header gradient bar
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, "#0d2218");
    grad.addColorStop(0.65, "#0b1118");
    grad.addColorStop(1, "#122030");
    ctx.fillStyle = grad;
    ctx.fillRect(3, 3, width - 6, headerH);
    ctx.fillStyle = "#1f3b2b";
    ctx.fillRect(3, headerH + 2, width - 6, 1.5);

    // 3-line-height WTR Logo (62x62)
    const img = await loadLogoImage();
    const lx = 22, ly = 14, ls = 62;
    ctx.save();
    ctx.beginPath();
    ctx.arc(lx + ls / 2, ly + ls / 2, ls / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    if (img) ctx.drawImage(img, lx, ly, ls, ls);
    ctx.restore();
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(lx + ls / 2, ly + ls / 2, ls / 2, 0, Math.PI * 2);
    ctx.stroke();

    // Header 3 lines next to logo
    ctx.fillStyle = "#00e676";
    ctx.font = "bold 12px Consolas, monospace";
    ctx.fillText("[-WTR-] WATCHTOWER TACTICAL DATA HUB", 98, 30);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 18px 'Arial Black', Arial, sans-serif";
    ctx.fillText(String(currentMeta.title || "WATCHTOWER BRIEF").toUpperCase().slice(0, 48), 98, 53);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px Consolas, monospace";
    ctx.fillText(String(currentMeta.subtitle || "highanxiety-labs.github.io/watchtower-data-hub").slice(0, 74), 98, 72);

    // Body lines
    let y = headerH + 28;
    wrapped.forEach((line, idx) => {
      if (idx === 0) {
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 14px Consolas, 'Segoe UI', monospace";
      } else if (/https?:\/\//i.test(line)) {
        ctx.fillStyle = "#38bdf8";
        ctx.font = "13.5px Consolas, 'Segoe UI', monospace";
      } else {
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "14px Consolas, 'Segoe UI', monospace";
      }
      ctx.fillText(line, padX, y);
      y += lineH;
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const slug = String(currentMeta.title || "wtr-brief").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 32);
        writePngBlobOrDownload(blob, `${slug}-card.png`, btn, "✅ CARD PNG COPIED (CTRL+V)!", "⬇️ CARD PNG SAVED!");
      }
    }, "image/png");
  }

  window.WTRSocialShare = {
    LOGO_URL: WTR_LOGO_REMOTE,
    LOGO_BADGE_URL: WTR_BADGE_REMOTE,
    open: function(opts) {
      const el = ensureModal();
      const steamFixed = String(opts.steam || "").replace(/wtr-logo\.png/gi, "wtr-logo-badge.png");
      currentPayloads = {
        discord: opts.discord || "",
        facebook: opts.facebook || "",
        steam: steamFixed
      };
      currentMeta = {
        title: opts.title || "SHARE WATCHTOWER BRIEF",
        subtitle: opts.subtitle || "Discord Markdown • Facebook Plain Text • Steam BBCode"
      };
      const titleEl = el.querySelector("#wtrShareModalTitle");
      if (titleEl) titleEl.textContent = currentMeta.title;
      const subEl = el.querySelector("#wtrShareModalSub");
      if (subEl) subEl.textContent = currentMeta.subtitle;
      switchFormat(opts.initialFormat || opts.defaultFormat || "discord");
      el.classList.add("open");
    }
  };
})();
