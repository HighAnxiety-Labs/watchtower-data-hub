/* ============================================================================
   [-WTR-] WATCHTOWER MULTI-PLATFORM SHARE ENGINE (DISCORD • FACEBOOK • STEAM)
   Renders WTR Logo scaled to exact 3 line heights (3.9em) + 1-Click Copy
   ============================================================================ */
(function initWtrSocialShare() {
  const WTR_LOGO_REMOTE = "https://highanxiety-labs.github.io/watchtower-data-hub/assets/images/wtr-logo.png";

  function injectStyles() {
    if (document.getElementById("wtrSocialShareStyles")) return;
    const st = document.createElement("style");
    st.id = "wtrSocialShareStyles";
    st.textContent = `
      .wtr-share-backdrop {
        position: fixed; inset: 0; z-index: 12000;
        background: rgba(3, 7, 12, 0.86);
        -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px);
        display: none; align-items: center; justify-content: center; padding: 14px;
      }
      .wtr-share-backdrop.open { display: flex; }
      .wtr-share-modal {
        width: 100%; max-width: 680px; max-height: 90vh;
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
      .wtr-share-textarea {
        width: 100%; min-height: 190px; max-height: 320px; resize: vertical;
        background: #05080c; border: 1px solid #243b4f; border-radius: 5px;
        color: #e2e8f0; font-family: 'JetBrains Mono', Consolas, monospace;
        font-size: 12px; line-height: 1.48; padding: 10px 12px; outline: none;
      }
      .wtr-share-textarea:focus { border-color: #00e676; }
      .wtr-share-foot {
        display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
        padding: 10px 16px; background: #070c11; border-top: 1px solid #1a2d3d;
      }
      .wtr-share-copy-btn {
        background: #00e676; color: #03140a; border: 1px solid #b9f6ca;
        padding: 7px 16px; border-radius: 4px; font-family: monospace;
        font-size: 12px; font-weight: 900; letter-spacing: 0.6px;
        text-transform: uppercase; cursor: pointer;
      }
      .wtr-share-copy-btn:hover { background: #69f0ae; }
    `;
    document.head.appendChild(st);
  }

  let currentPayloads = null;
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
            <img class="wtr-share-logo-3line" src="./assets/images/wtr-logo.png" onerror="this.onerror=null;this.src='${WTR_LOGO_REMOTE}';" alt="WatchToweR Logo">
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
          <textarea id="wtrShareOutputArea" class="wtr-share-textarea" aria-label="Formatted share text" spellcheck="false"></textarea>
        </div>
        <div class="wtr-share-foot">
          <span id="wtrShareCharStat" style="font-family:monospace; font-size:11px; color:#94a3b8;">0 chars</span>
          <button type="button" class="wtr-share-copy-btn" id="wtrShareCopyBtn">📋 COPY FOR DISCORD</button>
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
    if (stat) stat.textContent = `${txt.length} chars • WTR Logo Ready`;
    const copyBtn = el.querySelector("#wtrShareCopyBtn");
    if (copyBtn) {
      copyBtn.textContent = fmt === "discord" ? "📋 COPY FOR DISCORD" : (fmt === "facebook" ? "📋 COPY FOR FACEBOOK" : "📋 COPY FOR STEAM");
    }
  }

  function copyActiveText() {
    const el = ensureModal();
    const ta = el.querySelector("#wtrShareOutputArea");
    const copyBtn = el.querySelector("#wtrShareCopyBtn");
    if (!ta) return;
    const txt = ta.value || "";
    const done = () => {
      if (copyBtn) {
        const prev = copyBtn.textContent;
        copyBtn.textContent = "✅ COPIED TO CLIPBOARD!";
        setTimeout(() => { copyBtn.textContent = prev; }, 2000);
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done).catch(() => {
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        done();
      });
    } else {
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      done();
    }
  }

  window.WTRSocialShare = {
    LOGO_URL: WTR_LOGO_REMOTE,
    open: function(opts) {
      const el = ensureModal();
      currentPayloads = {
        discord: opts.discord || "",
        facebook: opts.facebook || "",
        steam: opts.steam || ""
      };
      const titleEl = el.querySelector("#wtrShareModalTitle");
      if (titleEl) titleEl.textContent = opts.title || "SHARE WATCHTOWER BRIEF";
      const subEl = el.querySelector("#wtrShareModalSub");
      if (subEl) subEl.textContent = opts.subtitle || "Discord Markdown • Facebook Plain Text • Steam BBCode";
      switchFormat(opts.defaultFormat || "discord");
      el.classList.add("open");
    }
  };
})();
