/* ==========================================================================
 * [-WTR-] WATCHTOWER GLOBAL DISPLAY & TYPOGRAPHY ENGINE (v2.1)
 * Shared across Command Center & All Standalone Modules / Event Briefs / Vault
 * Collapsible Gear Trigger : Reduced pill until hovered; stays open while mouse is inside box
 * Display Modes : "auto" (Auto-Detect) | "wide" (97% Widescreen) | "standard" (1360px) | "mobile" (Compact/Phone)
 * Text Scaling  : "std" (A 100% — 15px Hub Baseline) | "lg" (A+ 112%) | "xl" (A++ 125%)
 * ========================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "wtr_global_view_mode";
  var FONT_STORAGE_KEY = "wtr_global_font_scale";

  var VALID_MODES = ["auto", "wide", "standard", "mobile"];
  var VALID_FONTS = ["std", "lg", "xl"];

  var MODE_META = [
    { id: "auto",     short: "Auto",     full: "Auto-Detect",    icon: "⚡", tip: "Auto-fits your screen (expands on QHD/Ultrawide, standard on laptop, mobile on phone)" },
    { id: "wide",     short: "Wide",     full: "Wide (96%)",     icon: "🖥️", tip: "Full Widescreen (up to 97% width) for 27\" QHD, Ultrawide & 4K monitors" },
    { id: "standard", short: "Standard", full: "Standard",       icon: "💻", tip: "Classic centered 1360px desktop frame" },
    { id: "mobile",   short: "Mobile",   full: "Compact/Mobile", icon: "📱", tip: "Single-column Cellphone & Half-Screen Split view (great next to War Commander!)" }
  ];

  var FONT_META = [
    { id: "std", label: "A",   pct: "100%", tip: "Standard Text Size (100% — unified 15px Command Center baseline)" },
    { id: "lg",  label: "A+",  pct: "112%", tip: "Larger Text (+12% across all pages & tables without shrinking frame width)" },
    { id: "xl",  label: "A++", pct: "125%", tip: "Extra-Large Text (+25% maximum readability across all pages)" }
  ];

  function sanitizeMode(val) {
    var v = String(val || "").toLowerCase().trim();
    return VALID_MODES.indexOf(v) !== -1 ? v : "";
  }

  function sanitizeFont(val) {
    var v = String(val || "").toLowerCase().trim();
    return VALID_FONTS.indexOf(v) !== -1 ? v : "";
  }

  function getModeMeta(id) {
    for (var i = 0; i < MODE_META.length; i++) {
      if (MODE_META[i].id === id) return MODE_META[i];
    }
    return MODE_META[0];
  }

  function getFontMeta(id) {
    for (var i = 0; i < FONT_META.length; i++) {
      if (FONT_META[i].id === id) return FONT_META[i];
    }
    return FONT_META[0];
  }

  function readInitialMode() {
    try {
      var params = new URLSearchParams(window.location.search || "");
      var qMode = sanitizeMode(params.get("wtrView"));
      if (qMode) {
        try { localStorage.setItem(STORAGE_KEY, qMode); } catch (e) {}
        return qMode;
      }
    } catch (e) {}
    try {
      var saved = sanitizeMode(localStorage.getItem(STORAGE_KEY));
      if (saved) return saved;
    } catch (e) {}
    return "auto";
  }

  function readInitialFont() {
    try {
      var params = new URLSearchParams(window.location.search || "");
      var qFont = sanitizeFont(params.get("wtrFont"));
      if (qFont) {
        try { localStorage.setItem(FONT_STORAGE_KEY, qFont); } catch (e) {}
        return qFont;
      }
    } catch (e) {}
    try {
      var saved = sanitizeFont(localStorage.getItem(FONT_STORAGE_KEY));
      if (saved) return saved;
    } catch (e) {}
    return "std";
  }

  var stylesInjectedThisLoad = false;
  function injectGlobalStyles() {
    if (stylesInjectedThisLoad && document.getElementById("wtrViewModeStyles")) return;
    var style = document.getElementById("wtrViewModeStyles");
    var isNew = !style;
    if (isNew) {
      style = document.createElement("style");
      style.id = "wtrViewModeStyles";
    }
    style.textContent = [
      "/* [-WTR-] Global Display Size & Unified Typography Overrides (v2.1) */",
      ":root {",
      "  --wtr-font-sans: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;",
      "  --font-body: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;",
      "  --wtr-font-zoom: 1;",
      "  --wtr-shell-wide-raw: min(97vw, 2320px);",
      "  --wtr-shell-auto-xl-raw: min(94vw, 1840px);",
      "  --wtr-shell-std-raw: 1360px;",
      "  --wtr-shell-mobile-raw: 480px;",
      "  --wtr-shell-wide: calc(var(--wtr-shell-wide-raw) / var(--wtr-font-zoom, 1));",
      "  --wtr-shell-auto-xl: calc(var(--wtr-shell-auto-xl-raw) / var(--wtr-font-zoom, 1));",
      "  --wtr-shell-std: calc(var(--wtr-shell-std-raw) / var(--wtr-font-zoom, 1));",
      "  --wtr-shell-mobile: calc(var(--wtr-shell-mobile-raw) / var(--wtr-font-zoom, 1));",
      "}",
      "html[data-wtr-font='lg'] { --wtr-font-zoom: 1.12; }",
      "html[data-wtr-font='xl'] { --wtr-font-zoom: 1.25; }",

      /* Ensure Command Center header sits cleanly above menu buttons when floating settings popover opens */
      "#terminalMainFrame .header { position: relative; z-index: 80; }",

      /* ==================== UNIFIED WATCHTOWER BASELINE TYPOGRAPHY ==================== */
      "html body {",
      "  font-family: var(--wtr-font-sans) !important;",
      "  font-size: 15px !important;",
      "  line-height: 1.5;",
      "}",
      "html input, html select, html textarea {",
      "  font-family: var(--wtr-font-sans);",
      "}",

      /* ==================== GLOBAL TEXT SCALING (A / A+ / A++) ==================== */
      "html[data-wtr-font='lg'] #terminalMainFrame .header-logo-frame,",
      "html[data-wtr-font='lg'] #terminalMainFrame .title-group,",
      "html[data-wtr-font='lg'] #terminalMainFrame .header-status-subrow,",
      "html[data-wtr-font='lg'] #terminalMainFrame #mainMenuPanel,",
      "html[data-wtr-font='lg'] #terminalMainFrame #commandDrawerWrap > *:not(#inlineModuleViewport),",
      "html[data-wtr-font='lg'] #terminalMainFrame #inlineModuleViewport .viewport-control-bar,",
      "html[data-wtr-font='lg'] #terminalMainFrame #homeDefaultDashboard,",
      "html[data-wtr-font='xl'] #terminalMainFrame .header-logo-frame,",
      "html[data-wtr-font='xl'] #terminalMainFrame .title-group,",
      "html[data-wtr-font='xl'] #terminalMainFrame .header-status-subrow,",
      "html[data-wtr-font='xl'] #terminalMainFrame #mainMenuPanel,",
      "html[data-wtr-font='xl'] #terminalMainFrame #commandDrawerWrap > *:not(#inlineModuleViewport),",
      "html[data-wtr-font='xl'] #terminalMainFrame #inlineModuleViewport .viewport-control-bar,",
      "html[data-wtr-font='xl'] #terminalMainFrame #homeDefaultDashboard {",
      "  zoom: var(--wtr-font-zoom, 1);",
      "}",

      "html[data-wtr-font='lg']:not(:has(#terminalMainFrame)) body > *:not(script):not(style):not(link):not(#wtrSubpageViewPill):not(#printModalOverlay):not(#studioTopControlBar):not(#studioConfigDrawer):not(.studio-visibility-bar):not(.studio-control-bar):not(.control-panel):not(.control-panel-wrapper),",
      "html[data-wtr-font='xl']:not(:has(#terminalMainFrame)) body > *:not(script):not(style):not(link):not(#wtrSubpageViewPill):not(#printModalOverlay):not(#studioTopControlBar):not(#studioConfigDrawer):not(.studio-visibility-bar):not(.studio-control-bar):not(.control-panel):not(.control-panel-wrapper) {",
      "  zoom: var(--wtr-font-zoom, 1);",
      "}",
      "@media (max-width: 1719px) {",
      "  html[data-wtr-view='auto'][data-wtr-font='lg'] .dossier-card,",
      "  html[data-wtr-view='auto'][data-wtr-font='lg'] .brief-card,",
      "  html[data-wtr-view='auto'][data-wtr-font='lg'] .board-shell,",
      "  html[data-wtr-view='auto'][data-wtr-font='lg'] .master-shell,",
      "  html[data-wtr-view='auto'][data-wtr-font='lg'] .record-card,",
      "  html[data-wtr-view='auto'][data-wtr-font='lg'] .report-card,",
      "  html[data-wtr-view='auto'][data-wtr-font='lg'] .calc-dossier-card,",
      "  html[data-wtr-view='auto'][data-wtr-font='lg'] .calc-container,",
      "  html[data-wtr-view='auto'][data-wtr-font='lg'] .vault-frame,",
      "  html[data-wtr-view='auto'][data-wtr-font='lg'] .container,",
      "  html[data-wtr-view='auto'][data-wtr-font='xl'] .dossier-card,",
      "  html[data-wtr-view='auto'][data-wtr-font='xl'] .brief-card,",
      "  html[data-wtr-view='auto'][data-wtr-font='xl'] .board-shell,",
      "  html[data-wtr-view='auto'][data-wtr-font='xl'] .master-shell,",
      "  html[data-wtr-view='auto'][data-wtr-font='xl'] .record-card,",
      "  html[data-wtr-view='auto'][data-wtr-font='xl'] .report-card,",
      "  html[data-wtr-view='auto'][data-wtr-font='xl'] .calc-dossier-card,",
      "  html[data-wtr-view='auto'][data-wtr-font='xl'] .calc-container,",
      "  html[data-wtr-view='auto'][data-wtr-font='xl'] .vault-frame,",
      "  html[data-wtr-view='auto'][data-wtr-font='xl'] .container {",
      "    max-width: var(--wtr-shell-std) !important; width: 100%;",
      "  }",
      "}",

      /* ==================== COLLAPSIBLE GEAR PILL & HOVER POPOVER ==================== */
      ".wtr-view-size-pod {",
      "  position: relative; display: inline-flex; flex-direction: column; align-items: flex-end;",
      "  flex-shrink: 0; z-index: 950;",
      "}",
      "#wtrSubpageViewPill {",
      "  width: 100%; max-width: var(--wtr-shell-std-raw); margin: 0 auto 8px auto;",
      "  display: flex; justify-content: flex-end; align-items: center;",
      "  padding: 0 2px; box-sizing: border-box; position: relative; z-index: 950;",
      "}",
      ".wtr-gear-wrap {",
      "  position: relative; display: inline-flex; flex-direction: column; align-items: flex-end;",
      "}",
      ".wtr-gear-trigger {",
      "  display: inline-flex; align-items: center; gap: 7px;",
      "  background: linear-gradient(180deg, #131e2c 0%, #090e15 100%);",
      "  border: 1px solid #354b63; border-top: 2px solid var(--lead-accent, #2b8cbe);",
      "  border-radius: 4px; padding: 6px 11px; cursor: pointer; user-select: none;",
      "  font-family: monospace; font-size: 11.5px; font-weight: 900; letter-spacing: 0.7px;",
      "  color: #e2e8f0; box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 3px 10px rgba(0,0,0,0.65);",
      "  transition: all 0.16s ease; white-space: nowrap;",
      "}",
      ".wtr-gear-trigger:hover, .wtr-gear-wrap.is-open .wtr-gear-trigger {",
      "  border-color: #00e676; color: #ffffff;",
      "  background: linear-gradient(180deg, #172838 0%, #0b141e 100%);",
      "  box-shadow: 0 0 14px rgba(0, 230, 118, 0.25), 0 4px 12px rgba(0,0,0,0.75);",
      "}",
      ".wtr-gear-icon {",
      "  font-size: 14px; line-height: 1; display: inline-block;",
      "  transition: transform 0.28s ease;",
      "}",
      ".wtr-gear-wrap.is-open .wtr-gear-icon, .wtr-gear-trigger:hover .wtr-gear-icon {",
      "  transform: rotate(60deg);",
      "}",
      ".wtr-gear-label { color: #e2c547; text-transform: uppercase; }",
      ".wtr-gear-status {",
      "  background: rgba(0, 230, 118, 0.14); border: 1px solid rgba(0, 230, 118, 0.55);",
      "  color: #00e676; padding: 1px 7px; border-radius: 3px; font-size: 10.5px; font-weight: 800;",
      "  letter-spacing: 0.4px;",
      "}",
      ".wtr-gear-caret { color: #94a3b8; font-size: 10px; transition: transform 0.18s ease; }",
      ".wtr-gear-wrap.is-open .wtr-gear-caret { transform: rotate(180deg); color: #00e676; }",

      /* Invisible 8px hover bridge (padding-top) keeps hover active while moving cursor from Gear into Box */
      ".wtr-settings-drop-bridge {",
      "  position: absolute; top: 100%; right: 0; padding-top: 7px;",
      "  opacity: 0; visibility: hidden; pointer-events: none;",
      "  transform: translateY(-4px); transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;",
      "  z-index: 999;",
      "}",
      ".wtr-gear-wrap.is-open .wtr-settings-drop-bridge {",
      "  opacity: 1; visibility: visible; pointer-events: auto; transform: translateY(0);",
      "}",
      ".wtr-settings-box {",
      "  background: linear-gradient(180deg, #0f1924 0%, #070b11 100%);",
      "  border: 1px solid #3d5670; border-top: 2px solid #00e676;",
      "  border-radius: 5px; padding: 11px 13px; min-width: 356px;",
      "  box-shadow: 0 12px 32px rgba(0,0,0,0.92), 0 0 18px rgba(0, 230, 118, 0.16);",
      "  display: flex; flex-direction: column; gap: 10px;",
      "}",
      "@media (max-width: 480px) {",
      "  .wtr-settings-box { min-width: min(92vw, 330px); right: 0; }",
      "}",
      ".wtr-settings-sec { display: flex; flex-direction: column; gap: 6px; }",
      ".wtr-settings-sec + .wtr-settings-sec {",
      "  border-top: 1px solid rgba(255,255,255,0.09); padding-top: 9px;",
      "}",
      ".wtr-settings-sec-hdr {",
      "  font-family: monospace; font-size: 10.5px; font-weight: 900;",
      "  letter-spacing: 0.9px; text-transform: uppercase; color: #e2c547;",
      "  display: flex; align-items: center; justify-content: space-between; gap: 8px;",
      "}",
      ".wtr-settings-sec-hdr span.sub { color: #94a3b8; font-weight: 700; font-size: 10px; letter-spacing: 0.4px; }",
      ".wtr-view-chk-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }",
      ".wtr-view-chk-lbl {",
      "  display: inline-flex; align-items: center; gap: 5px;",
      "  font-family: monospace; font-size: 11.5px; font-weight: 800;",
      "  color: #cbd5e1; background: #111a24; border: 1px solid #2a3b4c;",
      "  border-radius: 3px; padding: 5px 8px; cursor: pointer; user-select: none;",
      "  transition: all 0.14s ease; white-space: nowrap;",
      "}",
      ".wtr-view-chk-lbl:hover { border-color: #38bdf8; color: #ffffff; background: #172432; }",
      ".wtr-view-chk-lbl.active {",
      "  background: rgba(0, 230, 118, 0.15); border-color: #00e676; color: #00e676;",
      "  box-shadow: 0 0 10px rgba(0, 230, 118, 0.22);",
      "}",
      ".wtr-view-chk-lbl input[type='checkbox'] {",
      "  width: 13px; height: 13px; margin: 0; cursor: pointer; accent-color: #00e676;",
      "}",
      ".wtr-font-scale-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }",
      ".wtr-font-btn {",
      "  flex: 1; min-width: 92px; display: inline-flex; align-items: center; justify-content: center; gap: 5px;",
      "  font-family: var(--wtr-font-sans); font-size: 12px; font-weight: 900;",
      "  line-height: 1.1; color: #cbd5e1; background: #111a24;",
      "  border: 1px solid #2a3b4c; border-radius: 3px;",
      "  padding: 6px 9px; cursor: pointer; user-select: none;",
      "  transition: all 0.14s ease; white-space: nowrap;",
      "}",
      ".wtr-font-btn span.pct { font-family: monospace; font-size: 10.5px; font-weight: 700; opacity: 0.8; }",
      ".wtr-font-btn:hover { border-color: #38bdf8; color: #ffffff; background: #172432; }",
      ".wtr-font-btn.active {",
      "  background: rgba(0, 230, 118, 0.16); border-color: #00e676; color: #00e676;",
      "  box-shadow: 0 0 8px rgba(0, 230, 118, 0.22);",
      "}",
      ".wtr-settings-foot {",
      "  font-family: monospace; font-size: 10px; color: #7c93ab; text-align: right;",
      "  letter-spacing: 0.3px; margin-top: -2px;",
      "}",

      /* ==================== 1. AUTO MODE (Smart QHD / Ultrawide Boost) ==================== */
      "@media (min-width: 1720px) {",
      "  html[data-wtr-view='auto'] .terminal-frame,",
      "  html[data-wtr-view='auto'] .control-panel,",
      "  html[data-wtr-view='auto'] .control-panel-wrapper,",
      "  html[data-wtr-view='auto'] #wtrSubpageViewPill {",
      "    max-width: var(--wtr-shell-auto-xl-raw) !important; width: 100%;",
      "  }",
      "  html[data-wtr-view='auto'] .dossier-card,",
      "  html[data-wtr-view='auto'] .brief-card,",
      "  html[data-wtr-view='auto'] .board-shell,",
      "  html[data-wtr-view='auto'] .master-shell,",
      "  html[data-wtr-view='auto'] .record-card,",
      "  html[data-wtr-view='auto'] .report-card,",
      "  html[data-wtr-view='auto'] .calc-dossier-card,",
      "  html[data-wtr-view='auto'] .calc-container,",
      "  html[data-wtr-view='auto'] .vault-frame,",
      "  html[data-wtr-view='auto'] .container {",
      "    max-width: var(--wtr-shell-auto-xl) !important; width: 100%;",
      "  }",
      "}",

      /* ==================== 2. WIDE MODE (96% Full-Width Widescreen) ==================== */
      "html[data-wtr-view='wide'] .terminal-frame,",
      "html[data-wtr-view='wide'] .control-panel,",
      "html[data-wtr-view='wide'] .control-panel-wrapper,",
      "html[data-wtr-view='wide'] .studio-visibility-bar,",
      "html[data-wtr-view='wide'] .studio-control-bar,",
      "html[data-wtr-view='wide'] #studioTopControlBar,",
      "html[data-wtr-view='wide'] #studioConfigDrawer,",
      "html[data-wtr-view='wide'] #wtrSubpageViewPill {",
      "  max-width: var(--wtr-shell-wide-raw) !important; width: 100% !important;",
      "}",
      "html[data-wtr-view='wide'] .dossier-card,",
      "html[data-wtr-view='wide'] .brief-card,",
      "html[data-wtr-view='wide'] .board-shell,",
      "html[data-wtr-view='wide'] .master-shell,",
      "html[data-wtr-view='wide'] .record-card,",
      "html[data-wtr-view='wide'] .report-card,",
      "html[data-wtr-view='wide'] .calc-dossier-card,",
      "html[data-wtr-view='wide'] .calc-container,",
      "html[data-wtr-view='wide'] .vault-frame,",
      "html[data-wtr-view='wide'] .container,",
      "html[data-wtr-view='wide'] .store-container,",
      "html[data-wtr-view='wide'] .store-terminal,",
      "html[data-wtr-view='wide'] .columns-grid,",
      "html[data-wtr-view='wide'] .caution-banner,",
      "html[data-wtr-view='wide'] .footer-note,",
      "html[data-wtr-view='wide'] .inline-studio-drawer,",
      "html[data-wtr-view='wide'] .studio-wrap,",
      "html[data-wtr-view='wide'] .studio-shell,",
      "html[data-wtr-view='wide'] .archive-viewer-wrapper,",
      "html[data-wtr-view='wide'] .master-editor-panel {",
      "  max-width: var(--wtr-shell-wide) !important; width: 100% !important;",
      "}",
      "html[data-wtr-view='wide'] .bento-links-grid { width: 68% !important; max-width: 980px !important; }",
      "html[data-wtr-view='wide'] .bento-links-grid.double-up-grid {",
      "  width: 96% !important; max-width: 2100px !important;",
      "  grid-template-columns: repeat(auto-fit, minmax(390px, 1fr)) !important;",
      "}",
      "@media (min-width: 1620px) {",
      "  html[data-wtr-view='wide'] .timer-card { min-width: calc(25% - 11px) !important; flex: 0 0 calc(25% - 11px) !important; }",
      "  html[data-wtr-view='wide'] .defect-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important; }",
      "  html[data-wtr-view='wide'] .unit-gallery-dynamic { grid-template-columns: repeat(auto-fit, minmax(225px, 285px)) !important; }",
      "}",

      /* ==================== 3. STANDARD MODE (1360px Classic Desktop Lock) ==================== */
      "html[data-wtr-view='standard'] .terminal-frame,",
      "html[data-wtr-view='standard'] .control-panel,",
      "html[data-wtr-view='standard'] .control-panel-wrapper,",
      "html[data-wtr-view='standard'] #wtrSubpageViewPill {",
      "  max-width: var(--wtr-shell-std-raw) !important; width: 100%;",
      "}",
      "html[data-wtr-view='standard'] .dossier-card,",
      "html[data-wtr-view='standard'] .brief-card,",
      "html[data-wtr-view='standard'] .board-shell,",
      "html[data-wtr-view='standard'] .master-shell,",
      "html[data-wtr-view='standard'] .record-card,",
      "html[data-wtr-view='standard'] .report-card,",
      "html[data-wtr-view='standard'] .calc-dossier-card,",
      "html[data-wtr-view='standard'] .calc-container,",
      "html[data-wtr-view='standard'] .vault-frame,",
      "html[data-wtr-view='standard'] .container {",
      "  max-width: var(--wtr-shell-std) !important; width: 100%;",
      "}",

      /* ==================== 4. MOBILE / COMPACT MODE (Cellphone & Split-Screen) ==================== */
      "html[data-wtr-view='mobile'] body { padding: 8px !important; }",
      "html[data-wtr-view='mobile'] .control-panel,",
      "html[data-wtr-view='mobile'] .control-panel-wrapper,",
      "html[data-wtr-view='mobile'] #wtrSubpageViewPill {",
      "  max-width: var(--wtr-shell-mobile-raw) !important; width: 100% !important;",
      "  margin-left: auto !important; margin-right: auto !important;",
      "}",
      "html[data-wtr-view='mobile'] .dossier-card,",
      "html[data-wtr-view='mobile'] .brief-card,",
      "html[data-wtr-view='mobile'] .board-shell,",
      "html[data-wtr-view='mobile'] .master-shell,",
      "html[data-wtr-view='mobile'] .record-card,",
      "html[data-wtr-view='mobile'] .report-card,",
      "html[data-wtr-view='mobile'] .calc-dossier-card,",
      "html[data-wtr-view='mobile'] .calc-container,",
      "html[data-wtr-view='mobile'] .vault-frame,",
      "html[data-wtr-view='mobile'] .container,",
      "html[data-wtr-view='mobile'] .store-container,",
      "html[data-wtr-view='mobile'] .store-terminal,",
      "html[data-wtr-view='mobile'] .columns-grid,",
      "html[data-wtr-view='mobile'] .caution-banner,",
      "html[data-wtr-view='mobile'] .footer-note {",
      "  max-width: var(--wtr-shell-mobile) !important; width: 100% !important;",
      "  margin-left: auto !important; margin-right: auto !important;",
      "}",
      "html[data-wtr-view='mobile'] #terminalMainFrame { max-width: 510px !important; margin-left: auto !important; margin-right: auto !important; }",
      "html[data-wtr-view='mobile'] #inlineViewportIframe {",
      "  max-width: 460px !important; width: 100% !important; margin: 0 auto !important; display: block !important;",
      "}",
      "html[data-wtr-view='mobile'] .header { padding: 12px 14px !important; }",
      "html[data-wtr-view='mobile'] .header-left-cluster { flex-direction: column !important; align-items: stretch !important; gap: 12px !important; }",
      "html[data-wtr-view='mobile'] .header-logo-frame { width: 76px !important; height: 76px !important; margin: 0 auto !important; }",
      "html[data-wtr-view='mobile'] .title-group h1 .title-row-main,",
      "html[data-wtr-view='mobile'] .title-group h1 .title-row-sub { white-space: normal !important; }",
      "html[data-wtr-view='mobile'] .main-menu-panel { padding: 12px 12px 14px 12px !important; }",
      "html[data-wtr-view='mobile'] .brief-buttons-grid,",
      "html[data-wtr-view='mobile'] .mode-tabs-grid,",
      "html[data-wtr-view='mobile'] .hud-cards-grid,",
      "html[data-wtr-view='mobile'] .division-tabs-bar {",
      "  grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 7px !important;",
      "}",
      "html[data-wtr-view='mobile'] .tab-conduit-svg { display: none !important; }",
      "html[data-wtr-view='mobile'] .bento-links-grid,",
      "html[data-wtr-view='mobile'] .bento-links-grid.double-up-grid {",
      "  width: 100% !important; min-width: 0 !important; grid-template-columns: 1fr !important;",
      "}",
      "html[data-wtr-view='mobile'] .calc-workspace-grid,",
      "html[data-wtr-view='mobile'] .tracks-side-by-side-grid,",
      "html[data-wtr-view='mobile'] .set-run-summary-strip,",
      "html[data-wtr-view='mobile'] .pg-chests-grid,",
      "html[data-wtr-view='mobile'] .unit-gallery-4col,",
      "html[data-wtr-view='mobile'] .unit-gallery-dynamic,",
      "html[data-wtr-view='mobile'] .overlay-unit-grid,",
      "html[data-wtr-view='mobile'] .dossier-3col,",
      "html[data-wtr-view='mobile'] .briefing-grid,",
      "html[data-wtr-view='mobile'] .doctrine-grid,",
      "html[data-wtr-view='mobile'] .infusion-grid,",
      "html[data-wtr-view='mobile'] .workshop-grid,",
      "html[data-wtr-view='mobile'] .faction-ws-grid,",
      "html[data-wtr-view='mobile'] .warpaints-grid,",
      "html[data-wtr-view='mobile'] .ai-tier-cards-grid,",
      "html[data-wtr-view='mobile'] .ws-inputs-row,",
      "html[data-wtr-view='mobile'] .sfr-two-cols,",
      "html[data-wtr-view='mobile'] .dm-body,",
      "html[data-wtr-view='mobile'] .comp-grid,",
      "html[data-wtr-view='mobile'] .defect-grid,",
      "html[data-wtr-view='mobile'] .boost-pills-grid {",
      "  grid-template-columns: 1fr !important;",
      "}",
      "html[data-wtr-view='mobile'] .left-tracks-column { position: static !important; }",
      "html[data-wtr-view='mobile'] .classification-bar,",
      "html[data-wtr-view='mobile'] .class-bar { --corner-w: 110px !important; }",
      "html[data-wtr-view='mobile'] .bar-center-label { font-size: 10px !important; letter-spacing: 0.8px !important; }",
      "html[data-wtr-view='mobile'] .dossier-header { flex-direction: column !important; align-items: stretch !important; }",
      "html[data-wtr-view='mobile'] .header-schedule-box { min-width: 0 !important; width: 100% !important; }",
      "html[data-wtr-view='mobile'] .store-table-wrap { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }",
      "html[data-wtr-view='mobile'] .timer-card { min-width: 100% !important; flex: 0 0 100% !important; }",
      "html[data-wtr-view='mobile'] .carousel-btn { width: 32px !important; height: 110px !important; }",
      "html[data-wtr-view='mobile'] .calendar-side-rail,",
      "html[data-wtr-view='mobile'] .weekday-row { display: none !important; }",
      "html[data-wtr-view='mobile'] .mobile-cal-controls { display: flex !important; }",
      "html[data-wtr-view='mobile'] .calendar-viewport { max-height: none !important; overflow-y: visible !important; padding: 8px !important; }",
      "html[data-wtr-view='mobile'] .calendar-grid { grid-template-columns: 1fr !important; gap: 10px !important; grid-auto-rows: auto !important; }",
      "html[data-wtr-view='mobile'] .day-cell.blank-day, html[data-wtr-view='mobile'] .day-cell.inactive { display: none !important; }",
      "html[data-wtr-view='mobile'] .day-cell.past-day { display: none !important; }",
      "html[data-wtr-view='mobile'] .calendar-grid.show-mobile-past .day-cell.past-day { display: flex !important; opacity: 0.55 !important; }",
      "html[data-wtr-view='mobile'] .day-cell { height: auto !important; min-height: 110px !important; max-height: none !important; padding: 12px !important; }",
      "html[data-wtr-view='mobile'] .event-tag.beam-connect-left, html[data-wtr-view='mobile'] .event-tag.beam-connect-right { margin-left: 0 !important; margin-right: 0 !important; border-radius: 3px !important; border-left: 3px solid var(--beam-hex) !important; }",
      "html[data-wtr-view='mobile'] .beam-span-text { width: 100% !important; left: 0 !important; }",

      /* Never keep A-Size Print Sheet wider than 860px */
      "html .a-size-sheet { max-width: 860px !important; zoom: 1 !important; }",

      /* Hide view selectors during Print / PDF */
      "@media print {",
      "  .wtr-view-size-pod, #wtrSubpageViewPill { display: none !important; }",
      "}"
    ].join("\n");

    if (isNew) {
      (document.head || document.documentElement).appendChild(style);
    }
    stylesInjectedThisLoad = true;
  }

  var activeMode = readInitialMode();
  var activeFont = readInitialFont();
  document.documentElement.setAttribute("data-wtr-view", activeMode);
  document.documentElement.setAttribute("data-wtr-font", activeFont);
  injectGlobalStyles();

  var bc = null;
  try {
    if (typeof BroadcastChannel !== "undefined") {
      bc = new BroadcastChannel("wtr_view_mode_channel");
      bc.onmessage = function (ev) {
        if (!ev || !ev.data) return;
        if (ev.data.type === "WTR_SET_VIEW_MODE") {
          if (ev.data.mode) applyMode(ev.data.mode, { skipBroadcast: true });
          if (ev.data.font) applyFont(ev.data.font, { skipBroadcast: true });
        }
      };
    }
  } catch (e) {}

  function buildActiveSummaryText() {
    var m = getModeMeta(activeMode);
    var f = getFontMeta(activeFont);
    return m.icon + " " + m.short + " • " + f.label;
  }

  function syncControlsInDom() {
    var inputs = document.querySelectorAll("input[data-wtr-view-chk]");
    for (var i = 0; i < inputs.length; i++) {
      var inp = inputs[i];
      var m = inp.getAttribute("data-wtr-view-chk");
      var isChecked = (m === activeMode);
      inp.checked = isChecked;
      var lbl = inp.closest ? inp.closest(".wtr-view-chk-lbl") : inp.parentNode;
      if (lbl && lbl.classList) {
        lbl.classList.toggle("active", isChecked);
      }
    }

    var fontBtns = document.querySelectorAll("button[data-wtr-font-btn]");
    for (var j = 0; j < fontBtns.length; j++) {
      var btn = fontBtns[j];
      var f = btn.getAttribute("data-wtr-font-btn");
      var isFontActive = (f === activeFont);
      if (btn.classList) {
        btn.classList.toggle("active", isFontActive);
      }
      btn.setAttribute("aria-pressed", isFontActive ? "true" : "false");
    }

    var statusBadges = document.querySelectorAll("[data-wtr-gear-status]");
    var summary = buildActiveSummaryText();
    for (var k = 0; k < statusBadges.length; k++) {
      statusBadges[k].textContent = summary;
    }
  }

  function pushStateToEmbeddedIframes() {
    var iframes = document.querySelectorAll("iframe");
    for (var i = 0; i < iframes.length; i++) {
      try {
        if (iframes[i].contentWindow) {
          iframes[i].contentWindow.postMessage({
            type: "WTR_SET_VIEW_MODE",
            mode: activeMode,
            font: activeFont
          }, "*");
        }
      } catch (e) {}
    }
  }

  function decorateRelativeHtmlUrl(rawUrl) {
    var u = String(rawUrl || "").trim();
    if (!u || u === "#" || /^https?:\/\//i.test(u) || /^javascript:/i.test(u)) return u;
    if (!/\.html($|\?|#)/i.test(u)) return u;
    var hashIdx = u.indexOf("#");
    var hash = hashIdx !== -1 ? u.slice(hashIdx) : "";
    var base = hashIdx !== -1 ? u.slice(0, hashIdx) : u;
    base = base
      .replace(/([?&])wtrView=[^&]*(&|$)/gi, function (_, p1, p2) { return p2 === "&" ? p1 : ""; })
      .replace(/([?&])wtrFont=[^&]*(&|$)/gi, function (_, p1, p2) { return p2 === "&" ? p1 : ""; })
      .replace(/[?&]$/, "");
    if (activeMode && activeMode !== "auto") {
      base += (base.indexOf("?") === -1 ? "?" : "&") + "wtrView=" + encodeURIComponent(activeMode);
    }
    if (activeFont && activeFont !== "std") {
      base += (base.indexOf("?") === -1 ? "?" : "&") + "wtrFont=" + encodeURIComponent(activeFont);
    }
    return base + hash;
  }

  function triggerLayoutReflow() {
    try {
      window.dispatchEvent(new Event("resize"));
      setTimeout(function () { window.dispatchEvent(new Event("resize")); }, 90);
    } catch (e) {}
  }

  function applyMode(nextMode, opts) {
    opts = opts || {};
    var clean = sanitizeMode(nextMode) || "auto";
    activeMode = clean;
    document.documentElement.setAttribute("data-wtr-view", clean);
    injectGlobalStyles();

    if (!opts.skipStorage) {
      try { localStorage.setItem(STORAGE_KEY, clean); } catch (e) {}
    }

    syncControlsInDom();
    pushStateToEmbeddedIframes();

    if (!opts.skipBroadcast && bc) {
      try { bc.postMessage({ type: "WTR_SET_VIEW_MODE", mode: clean, font: activeFont }); } catch (e) {}
    }

    triggerLayoutReflow();
  }

  function applyFont(nextFont, opts) {
    opts = opts || {};
    var clean = sanitizeFont(nextFont) || "std";
    activeFont = clean;
    document.documentElement.setAttribute("data-wtr-font", clean);
    injectGlobalStyles();

    if (!opts.skipStorage) {
      try { localStorage.setItem(FONT_STORAGE_KEY, clean); } catch (e) {}
    }

    syncControlsInDom();
    pushStateToEmbeddedIframes();

    if (!opts.skipBroadcast && bc) {
      try { bc.postMessage({ type: "WTR_SET_VIEW_MODE", mode: activeMode, font: clean }); } catch (e) {}
    }

    triggerLayoutReflow();
  }

  function buildCheckboxesHtml() {
    return MODE_META.map(function (m) {
      var checked = (m.id === activeMode) ? "checked" : "";
      var activeCls = (m.id === activeMode) ? "active" : "";
      return (
        '<label class="wtr-view-chk-lbl ' + activeCls + '" title="' + m.tip.replace(/"/g, "&quot;") + '">' +
          '<input type="checkbox" data-wtr-view-chk="' + m.id + '" ' + checked + ' onchange="window.WTRViewMode.toggle(\'' + m.id + '\', this.checked)">' +
          '<span>' + m.icon + ' ' + m.short + '</span>' +
        '</label>'
      );
    }).join("");
  }

  function buildFontButtonsHtml() {
    return FONT_META.map(function (f) {
      var activeCls = (f.id === activeFont) ? "active" : "";
      var pressed = (f.id === activeFont) ? "true" : "false";
      return (
        '<button type="button" class="wtr-font-btn ' + activeCls + '" data-wtr-font-btn="' + f.id + '" aria-pressed="' + pressed + '" title="' + f.tip.replace(/"/g, "&quot;") + '" onclick="window.WTRViewMode.setFont(\'' + f.id + '\')">' +
          '<span>' + f.label + '</span><span class="pct">(' + f.pct + ')</span>' +
        '</button>'
      );
    }).join("");
  }

  function buildCollapsibleGearWidgetHtml() {
    return (
      '<div class="wtr-gear-wrap" data-wtr-gear-wrap="true">' +
        '<button type="button" class="wtr-gear-trigger" aria-expanded="false" title="Hover or click to adjust Display Size &amp; Text Size across all pages">' +
          '<span class="wtr-gear-icon">⚙️</span>' +
          '<span class="wtr-gear-label">DISPLAY &amp; TEXT</span>' +
          '<span class="wtr-gear-status" data-wtr-gear-status="true">' + buildActiveSummaryText() + '</span>' +
          '<span class="wtr-gear-caret">▾</span>' +
        '</button>' +
        '<div class="wtr-settings-drop-bridge">' +
          '<div class="wtr-settings-box">' +
            '<div class="wtr-settings-sec">' +
              '<div class="wtr-settings-sec-hdr">' +
                '<span>📐 DISPLAY SIZE</span>' +
                '<span class="sub">APPLIES TO ALL PAGES</span>' +
              '</div>' +
              '<div class="wtr-view-chk-row">' + buildCheckboxesHtml() + '</div>' +
            '</div>' +
            '<div class="wtr-settings-sec">' +
              '<div class="wtr-settings-sec-hdr">' +
                '<span>🔤 TEXT SIZE</span>' +
                '<span class="sub">15PX HUB BASELINE</span>' +
              '</div>' +
              '<div class="wtr-font-scale-row">' + buildFontButtonsHtml() + '</div>' +
            '</div>' +
            '<div class="wtr-settings-foot">✓ Saves automatically • Move mouse out when done</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function bindGearHoverAndClick(containerEl) {
    if (!containerEl) return;
    var wrap = containerEl.querySelector("[data-wtr-gear-wrap]");
    var trigger = wrap ? wrap.querySelector(".wtr-gear-trigger") : null;
    if (!wrap || !trigger || wrap._wtrGearBound) return;
    wrap._wtrGearBound = true;

    var closeTimer = null;

    function openMenu() {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      wrap.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    }

    function scheduleClose(delayMs) {
      if (closeTimer) clearTimeout(closeTimer);
      closeTimer = setTimeout(function () {
        wrap.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        closeTimer = null;
      }, typeof delayMs === "number" ? delayMs : 180);
    }

    wrap.addEventListener("mouseenter", openMenu);
    wrap.addEventListener("mouseleave", function () {
      scheduleClose(180);
    });

    trigger.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (wrap.classList.contains("is-open")) {
        scheduleClose(0);
      } else {
        openMenu();
      }
    });

    document.addEventListener("click", function (ev) {
      if (!wrap.contains(ev.target)) {
        scheduleClose(0);
      }
    });

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && wrap.classList.contains("is-open")) {
        scheduleClose(0);
      }
    });
  }

  function mountSelectorsOnDomReady() {
    injectGlobalStyles();

    // 1. Hydrate Main Command Center Pod if present
    var mainPod = document.getElementById("wtrMainViewSizePod");
    if (mainPod) {
      mainPod.setAttribute("data-html2canvas-ignore", "true");
      mainPod.innerHTML = buildCollapsibleGearWidgetHtml();
      bindGearHoverAndClick(mainPod);
      syncControlsInDom();

      var vpIframe = document.getElementById("inlineViewportIframe");
      if (vpIframe && !vpIframe._wtrViewBound) {
        vpIframe._wtrViewBound = true;
        vpIframe.addEventListener("load", function () {
          pushStateToEmbeddedIframes();
        });
      }
      return;
    }

    // 2. Subpage Mode: If inside Command Center iframe, hide any subpage pill & ask parent for current state
    var existingSubPill = document.getElementById("wtrSubpageViewPill");
    var isEmbeddedInIframe = false;
    try { isEmbeddedInIframe = (window.self !== window.top); } catch (e) { isEmbeddedInIframe = true; }

    if (isEmbeddedInIframe) {
      if (existingSubPill) existingSubPill.style.display = "none";
      try { window.parent.postMessage({ type: "WTR_REQUEST_VIEW_MODE" }, "*"); } catch (e) {}
      return;
    }

    // Skip mounting subpage pill on WTR_STUDIO_LAUNCHER
    if ((document.title || "").indexOf("Local Master Studio Launcher") !== -1) return;

    // Mount compact top-right Gear pill for direct Discord / Bookmark / Pop-Out visitors
    if (!existingSubPill) {
      existingSubPill = document.createElement("div");
      existingSubPill.id = "wtrSubpageViewPill";
      existingSubPill.setAttribute("data-html2canvas-ignore", "true");
      if (document.body && document.body.firstChild) {
        var studioBar = document.getElementById("studioTopControlBar") ||
                        document.querySelector(".studio-visibility-bar, .studio-control-bar, .control-panel, .control-panel-wrapper, .workbench-bar");
        if (studioBar && studioBar.parentNode === document.body) {
          var drawer = document.getElementById("studioConfigDrawer");
          var anchor = (drawer && drawer.parentNode === document.body) ? drawer.nextSibling : studioBar.nextSibling;
          document.body.insertBefore(existingSubPill, anchor);
        } else {
          document.body.insertBefore(existingSubPill, document.body.firstChild);
        }
      }
    }

    if (existingSubPill) {
      existingSubPill.style.display = "flex";
      existingSubPill.innerHTML = buildCollapsibleGearWidgetHtml();
      bindGearHoverAndClick(existingSubPill);
      syncControlsInDom();
    }
  }

  window.addEventListener("message", function (ev) {
    if (!ev || !ev.data) return;
    if (ev.data.type === "WTR_SET_VIEW_MODE") {
      if (ev.data.mode) applyMode(ev.data.mode, { skipBroadcast: true });
      if (ev.data.font) applyFont(ev.data.font, { skipBroadcast: true });
    } else if (ev.data.type === "WTR_REQUEST_VIEW_MODE") {
      pushStateToEmbeddedIframes();
    } else if (ev.data.type === "WTR_CLOSE_VIEWPORT_RETURN_LIST") {
      if (typeof window.closeInlineModuleViewport === "function") {
        window.closeInlineModuleViewport(true);
      }
    }
  });

  // Intercept "Return to Command Center / <- HUB" clicks across all subpages:
  // - Inside the inline iframe viewport: close the viewport and restore the previously viewed tab list without reloading index.html.
  // - On a standalone full-page subpage: flag sessionStorage so index.html re-opens the previously viewed tab list on arrival.
  document.addEventListener("click", function (ev) {
    if (!ev || !ev.target || typeof ev.target.closest !== "function") return;
    if (document.getElementById("terminalMainFrame") && document.getElementById("commandDrawerWrap")) return;

    var el = ev.target.closest("a[href], [onclick]");
    if (!el) return;

    var isReturnToHub = false;
    var rawHref = el.getAttribute("href") || "";
    var rawOnclick = el.getAttribute("onclick") || "";

    if (rawHref) {
      var cleanHref = rawHref.split("?")[0].split("#")[0].trim().toLowerCase();
      if (cleanHref === "index.html" || cleanHref === "./index.html" || cleanHref === "../index.html" || /\/index\.html$/.test(cleanHref)) {
        isReturnToHub = true;
      }
    }
    if (!isReturnToHub && rawOnclick) {
      if (/returnToCommandCenter\s*\(|['"`]\.?\.?\/?index\.html['"`]/i.test(rawOnclick)) {
        isReturnToHub = true;
      }
    }
    if (!isReturnToHub) return;

    if (IS_EMBEDDED_FRAME) {
      ev.preventDefault();
      ev.stopPropagation();
      var handledDirect = false;
      try {
        if (window.parent && window.parent !== window && typeof window.parent.closeInlineModuleViewport === "function") {
          window.parent.closeInlineModuleViewport(true);
          handledDirect = true;
        }
      } catch (e) {}
      if (!handledDirect) {
        try {
          window.parent.postMessage({ type: "WTR_CLOSE_VIEWPORT_RETURN_LIST" }, "*");
        } catch (e2) {}
      }
    } else {
      try {
        window.sessionStorage.setItem("wtr_hub_restore_on_load", "1");
      } catch (e3) {}
    }
  }, true);

  window.addEventListener("storage", function (ev) {
    if (!ev || !ev.newValue) return;
    if (ev.key === STORAGE_KEY) {
      applyMode(ev.newValue, { skipStorage: true, skipBroadcast: true });
    } else if (ev.key === FONT_STORAGE_KEY) {
      applyFont(ev.newValue, { skipStorage: true, skipBroadcast: true });
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountSelectorsOnDomReady);
  } else {
    mountSelectorsOnDomReady();
  }

  window.WTRViewMode = {
    get: function () { return activeMode; },
    set: function (mode) { applyMode(mode); },
    getFont: function () { return activeFont; },
    setFont: function (font) { applyFont(font); },
    toggle: function (mode, isChecked) {
      if (!isChecked && activeMode === mode) {
        applyMode("auto");
      } else {
        applyMode(mode);
      }
    },
    syncIframes: pushStateToEmbeddedIframes,
    decorateUrl: decorateRelativeHtmlUrl
  };
})();
