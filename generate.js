#!/usr/bin/env node
'use strict';
/**
 * generate.js — génère les pages HTML statiques de référence SEO
 * Usage : node generate.js          → génère tout
 *         node generate.js --sample → génère 3 pages seulement
 */

const fs   = require('fs');
const path = require('path');

const ROOT   = __dirname;
const SAMPLE = process.argv.includes('--sample');

// ── Données ─────────────────────────────────────────────────────────────────

const EBICS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ebics.json'), 'utf8')).codes;
const ISO   = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/iso.json'),  'utf8'));

// ── Helpers ──────────────────────────────────────────────────────────────────

const esc = s => s
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

function truncate(str, words = 30) {
  const w = str.split(/\s+/);
  return w.length > words ? w.slice(0, words).join(' ') + '…' : str;
}

function write(filePath, html) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html, 'utf8');
}

// ── Palette / styles partagés ─────────────────────────────────────────────

const SHARED_CSS = `
  :root{
    --bg:#0E1015;--bg2:#13161F;--surface:#161A24;--surface2:#1C2230;
    --border:#2A3346;--border2:#33405C;
    --text:#F4F6FA;--muted:#9AA4BC;--dim:#7A8398;
    --accent:#6FA0F0;--accent2:#3E6BCB;--green:#4ED08A;--red:#F0758A;--orange:#F0A348;
    --maxw:1120px;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text);font-family:'IBM Plex Sans',sans-serif;
    line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
  body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;
    background:
      radial-gradient(60% 50% at 75% 8%,rgba(59,91,143,.22),transparent 70%),
      radial-gradient(50% 40% at 10% 90%,rgba(62,107,203,.12),transparent 70%);}
  .wrap{max-width:var(--maxw);margin:0 auto;padding:0 28px;position:relative;z-index:1}
  a{color:inherit;text-decoration:none}
  .mono{font-family:'IBM Plex Mono',monospace}
  .serif{font-family:'Fraunces',serif}
  /* NAV */
  nav{position:sticky;top:0;z-index:50;backdrop-filter:blur(12px);
    background:rgba(14,16,21,.72);border-bottom:1px solid var(--border)}
  .nav-in{display:flex;align-items:center;justify-content:space-between;height:72px}
  .brand{display:flex;align-items:center;gap:12px;font-family:'Fraunces',serif;
    font-weight:600;font-size:22px;letter-spacing:.04em}
  .brand .bar{width:5px;height:26px;border-radius:3px;
    background:linear-gradient(180deg,var(--accent),var(--accent2))}
  .nav-links{display:flex;align-items:center;gap:26px}
  .nav-links a{color:var(--muted);font-size:15px;transition:color .2s}
  .nav-links a:hover,.nav-links a.here{color:var(--text)}
  .navdrop{position:relative}
  .navdropbtn{color:var(--muted);font-size:15px;background:none;border:none;cursor:pointer;
    font-family:'IBM Plex Sans',sans-serif;display:inline-flex;align-items:center;gap:5px;
    padding:0;line-height:1}
  .navdropbtn:hover{color:var(--text)}
  .navdropbtn svg{width:12px;height:12px;color:var(--dim);transition:transform .2s}
  .navdrop:hover .navdropbtn svg{transform:rotate(180deg)}
  .navdropmenu{display:none;position:absolute;top:calc(100% + 10px);left:50%;
    transform:translateX(-50%);min-width:220px;background:var(--surface);
    border:1px solid var(--border2);border-radius:12px;padding:6px;
    box-shadow:0 18px 40px rgba(0,0,0,.5);flex-direction:column;gap:2px;z-index:60}
  .navdrop:hover .navdropmenu{display:flex}
  .navdropmenu a{color:var(--muted);font-size:14.5px;padding:9px 12px;
    border-radius:8px;display:block;transition:.15s}
  .navdropmenu a:hover{background:var(--surface2);color:var(--text)}
  .btn{display:inline-flex;align-items:center;gap:9px;font-weight:600;font-size:15px;
    padding:11px 20px;border-radius:11px;transition:transform .15s,box-shadow .2s;cursor:pointer;border:none}
  .btn-primary{background:linear-gradient(180deg,var(--accent),var(--accent2));color:#0B0D12;
    box-shadow:0 6px 22px rgba(62,107,203,.35)}
  .btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(62,107,203,.45)}
  @media(max-width:820px){.nav-links>a:not(.btn),.navdrop{display:none}}
  /* BREADCRUMB */
  .breadcrumb{display:flex;align-items:center;gap:8px;padding:18px 0 4px;
    font-size:13.5px;color:var(--dim);flex-wrap:wrap}
  .breadcrumb a{color:var(--accent);transition:color .15s}
  .breadcrumb a:hover{color:var(--text)}
  .breadcrumb .sep{color:var(--border2)}
  /* PAGE HEADER */
  .ref-head{padding:52px 0 40px}
  .ref-kicker{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.14em;
    text-transform:uppercase;color:var(--accent);margin-bottom:14px}
  .ref-code{font-family:'Fraunces',serif;font-weight:600;font-size:52px;line-height:1;
    letter-spacing:-.02em;margin-bottom:10px}
  .ref-label{font-family:'IBM Plex Mono',monospace;font-size:15px;color:var(--muted);
    margin-bottom:18px}
  .badge-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:0}
  .badge{display:inline-flex;align-items:center;font-family:'IBM Plex Mono',monospace;
    font-size:12px;font-weight:500;padding:5px 10px;border-radius:20px;letter-spacing:.04em}
  .badge-blocking{background:rgba(240,117,138,.15);color:var(--red);border:1px solid rgba(240,117,138,.3)}
  .badge-info{background:rgba(111,160,240,.12);color:var(--accent);border:1px solid rgba(111,160,240,.25)}
  .badge-warning{background:rgba(240,163,72,.12);color:var(--orange);border:1px solid rgba(240,163,72,.25)}
  .badge-cat{background:var(--surface2);color:var(--muted);border:1px solid var(--border2)}
  .badge-ver{background:var(--surface2);color:var(--muted);border:1px solid var(--border2)}
  .badge-family{background:rgba(111,160,240,.1);color:var(--accent);border:1px solid rgba(111,160,240,.2)}
  .badge-cfonb{background:var(--surface2);color:var(--dim);border:1px solid var(--border)}
  /* CONTENT LAYOUT */
  .ref-body{display:grid;grid-template-columns:1fr 340px;gap:40px;align-items:start;
    padding-bottom:80px}
  .ref-main{}
  .ref-aside{position:sticky;top:90px}
  @media(max-width:900px){.ref-body{grid-template-columns:1fr}}
  /* SECTIONS */
  .ref-section{margin-bottom:28px}
  .ref-section-title{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:500;
    letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:12px}
  .ref-section-box{background:var(--surface);border:1px solid var(--border);
    border-radius:14px;padding:22px}
  .ref-desc{font-size:16px;color:var(--text);line-height:1.7}
  /* LOCKED SECTIONS */
  .locked-section{position:relative;margin-bottom:28px}
  .locked-content{filter:blur(5px);user-select:none;pointer-events:none;
    background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:22px}
  .locked-overlay{position:absolute;inset:0;display:flex;flex-direction:column;
    align-items:center;justify-content:center;gap:14px;
    background:linear-gradient(180deg,rgba(14,16,21,0) 0%,rgba(14,16,21,.82) 45%)}
  .locked-label{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.1em;
    text-transform:uppercase;color:var(--dim)}
  .locked-cta{display:inline-flex;align-items:center;gap:9px;
    background:linear-gradient(180deg,var(--accent),var(--accent2));color:#0B0D12;
    font-weight:600;font-size:14.5px;padding:11px 22px;border-radius:11px;
    box-shadow:0 6px 22px rgba(62,107,203,.35);transition:transform .15s,box-shadow .2s}
  .locked-cta:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(62,107,203,.45)}
  /* ASIDE CARD */
  .aside-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;
    padding:24px;margin-bottom:20px}
  .aside-card h3{font-family:'Fraunces',serif;font-size:18px;font-weight:600;margin-bottom:8px}
  .aside-card p{font-size:14px;color:var(--muted);margin-bottom:18px;line-height:1.6}
  .aside-row{display:flex;justify-content:space-between;align-items:center;
    padding:9px 0;border-bottom:1px solid var(--border);font-size:14px}
  .aside-row:last-of-type{border-bottom:none}
  .aside-key{color:var(--muted)}
  .aside-val{font-family:'IBM Plex Mono',monospace;font-size:12.5px;color:var(--text)}
  /* HUB PAGE */
  .hub-head{padding:60px 0 44px}
  .hub-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;
    padding-bottom:80px}
  .hub-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;
    padding:20px 22px;transition:border-color .2s,transform .2s;display:block}
  .hub-card:hover{border-color:var(--border2);transform:translateY(-3px)}
  .hub-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
  .hub-code{font-family:'IBM Plex Mono',monospace;font-size:14px;font-weight:600;
    color:var(--accent)}
  .hub-desc{font-size:14px;color:var(--muted);line-height:1.55;margin-bottom:12px}
  .hub-badges{display:flex;flex-wrap:wrap;gap:6px}
  .hub-title{font-size:15px;font-weight:600;color:var(--text);margin-bottom:4px}
  /* SEARCH */
  .hub-search-wrap{margin-bottom:28px}
  .hub-search{width:100%;background:var(--surface);border:1px solid var(--border);
    border-radius:12px;padding:13px 18px;font-size:15px;color:var(--text);
    font-family:'IBM Plex Sans',sans-serif;outline:none;transition:border-color .2s}
  .hub-search:focus{border-color:var(--accent)}
  .hub-search::placeholder{color:var(--dim)}
  /* FILTER PILLS */
  .hub-filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px}
  .hub-filter{background:var(--surface2);border:1px solid var(--border2);color:var(--muted);
    font-size:13px;padding:7px 14px;border-radius:30px;cursor:pointer;
    transition:.18s;font-family:'IBM Plex Mono',monospace;border:none}
  .hub-filter:hover,.hub-filter.active{background:var(--accent);color:#0B0D12;border-color:var(--accent)}
  /* FOOTER */
  footer{border-top:1px solid var(--border);padding:48px 0 60px;margin-top:40px}
  .foot-grid{display:flex;justify-content:space-between;flex-wrap:wrap;gap:30px}
  .foot-links{display:flex;gap:22px;flex-wrap:wrap}
  .foot-links a{color:var(--muted);font-size:14px;transition:color .2s}
  .foot-links a:hover{color:var(--text)}
  .copy{color:var(--dim);font-size:13px;margin-top:24px}
  /* UL */
  ul{list-style:none;display:flex;flex-direction:column;gap:8px}
  ul li{display:flex;align-items:flex-start;gap:10px;font-size:15px;color:var(--text);line-height:1.6}
  ul li::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--accent);
    flex-shrink:0;margin-top:9px}
`;

// ── Nav & Footer ──────────────────────────────────────────────────────────

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">`;

const NAV = `<nav>
  <div class="wrap nav-in">
    <a href="https://ediinsight.app/" class="brand"><span class="bar"></span>EDI INSIGHT</a>
    <div class="nav-links">
      <a href="https://ediinsight.app/#modules">Fonctionnalités</a>
      <div class="navdrop">
        <button class="navdropbtn" type="button">
          Référentiels
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="navdropmenu">
          <a href="/referentiel-ebics/">Codes erreurs EBICS</a>
          <a href="/iso-rejet/">Motifs de rejet ISO</a>
        </div>
      </div>
      <a href="https://ediinsight.app/#convertisseur">Convertisseur</a>
      <a href="https://ediinsight.app/a-propos.html">À propos</a>
      <a class="btn btn-primary" href="https://apps.apple.com/app/edi-insight/id6769721055" target="_blank" rel="noopener">
        Télécharger
      </a>
    </div>
  </div>
</nav>`;

const FOOTER = `<footer>
  <div class="wrap">
    <div class="foot-grid">
      <a href="https://ediinsight.app/" class="brand"><span class="bar"></span>EDI INSIGHT</a>
      <div class="foot-links">
        <a href="/referentiel-ebics/">Référentiel EBICS</a>
        <a href="/iso-rejet/">Motifs de rejet ISO</a>
        <a href="https://ediinsight.app/a-propos.html">À propos</a>
        <a href="https://apps.apple.com/app/edi-insight/id6769721055" target="_blank" rel="noopener">App Store</a>
        <a href="https://ediinsight.app/privacy.html">Politique de confidentialité</a>
        <a href="https://ediinsight.app/Terms.html">Conditions d'utilisation</a>
        <a href="https://ediinsight.app/support.html">Support</a>
      </div>
    </div>
    <div class="copy">© 2026 EDI INSIGHT — Voisin Alexandre, entrepreneur individuel · Issy-les-Moulineaux, France</div>
  </div>
</footer>`;

const ANALYTICS = `<script data-goatcounter="https://ediinsight-app.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>`;

// ── Shared head builder ───────────────────────────────────────────────────

function head({ title, desc, canonical, ogTitle }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<meta property="og:type" content="article">
<meta property="og:site_name" content="EDI Insight">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${esc(ogTitle || title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="https://ediinsight.app/og-image.png">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(ogTitle || title)}">
<meta name="twitter:description" content="${esc(desc)}">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "name": ${JSON.stringify(title)},
  "description": ${JSON.stringify(desc)},
  "url": ${JSON.stringify(canonical)},
  "publisher": {"@type":"Organization","name":"EDI Insight","url":"https://ediinsight.app"}
}
</script>
${FONTS}
<style>${SHARED_CSS}</style>
</head>
<body>`;
}

// ── Locked section builder ────────────────────────────────────────────────

function lockedSection(title, innerHtml) {
  return `
<div class="locked-section" aria-label="${esc(title)}">
  <div class="ref-section-title">${esc(title)}</div>
  <div class="locked-content" aria-hidden="true">
    ${innerHtml}
  </div>
  <div class="locked-overlay">
    <span class="locked-label">Contenu réservé à l'outil</span>
    <a class="locked-cta" href="https://apps.apple.com/app/edi-insight/id6769721055"
       target="_blank" rel="noopener">
      Résolution complète dans l'outil →
    </a>
  </div>
</div>`;
}

function ulHtml(items) {
  return `<ul>${items.map(i => `<li>${esc(i)}</li>`).join('\n')}</ul>`;
}

// ══════════════════════════════════════════════════════════════════════════
// EBICS — individual fiche
// ══════════════════════════════════════════════════════════════════════════

function ebicsPage(c) {
  const sevLabel  = c.severity === 'blocking' ? 'Bloquant' : 'Informatif';
  const sevClass  = c.severity === 'blocking' ? 'badge-blocking' : 'badge-info';
  const catLabel  = c.category.charAt(0).toUpperCase() + c.category.slice(1);
  const canonical = `https://ediinsight.app/referentiel-ebics/${c.code}/`;

  const pageTitle = `Code EBICS ${c.code} — ${truncate(c.description, 10)} | EDI Insight`;
  const metaDesc  = `Code EBICS ${c.code} (${c.label}) : ${c.description} Catégorie : ${catLabel}. EBICS ${c.ebics_version.join(' et ')}.`;

  const asideRows = [
    ['Code', c.code],
    ['Catégorie', catLabel],
    ['Sévérité', sevLabel],
    ['EBICS', c.ebics_version.join(' / ')],
  ];

  return head({ title: pageTitle, desc: truncate(metaDesc, 35), canonical }) + `
${NAV}
<main>
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Fil d'Ariane">
      <a href="https://ediinsight.app/">Accueil</a>
      <span class="sep">›</span>
      <a href="/referentiel-ebics/">Référentiel EBICS</a>
      <span class="sep">›</span>
      <span>${esc(c.code)}</span>
    </nav>

    <header class="ref-head">
      <p class="ref-kicker">Code erreur EBICS</p>
      <h1 class="ref-code mono">${esc(c.code)}</h1>
      <p class="ref-label">${esc(c.label)}</p>
      <div class="badge-row">
        <span class="badge ${sevClass}">${sevLabel}</span>
        <span class="badge badge-cat">${esc(catLabel)}</span>
        ${c.ebics_version.map(v => `<span class="badge badge-ver">EBICS ${esc(v)}</span>`).join('')}
      </div>
    </header>

    <div class="ref-body">
      <div class="ref-main">

        <!-- DESCRIPTION — PUBLIC -->
        <div class="ref-section">
          <div class="ref-section-title">Description</div>
          <div class="ref-section-box">
            <p class="ref-desc">${esc(c.description)}</p>
          </div>
        </div>

        <!-- CAUSES — FLOUTÉES -->
        ${lockedSection('Causes fréquentes', ulHtml(c.causes))}

        <!-- ACTION — FLOUTÉE -->
        ${lockedSection('Action recommandée', `<p style="font-size:15px;line-height:1.7">${esc(c.action)}</p>`)}

      </div>

      <aside class="ref-aside">
        <div class="aside-card">
          <h3>Résoudre ce code</h3>
          <p>Causes précises, marche à suivre complète et exemples dans l'outil EDI Insight.</p>
          <a class="btn btn-primary" style="width:100%;justify-content:center"
             href="https://apps.apple.com/app/edi-insight/id6769721055"
             target="_blank" rel="noopener">
            Ouvrir EDI Insight →
          </a>
        </div>
        <div class="aside-card">
          ${asideRows.map(([k,v]) => `
          <div class="aside-row">
            <span class="aside-key">${esc(k)}</span>
            <span class="aside-val">${esc(v)}</span>
          </div>`).join('')}
        </div>
      </aside>
    </div>
  </div>
</main>
${FOOTER}
${ANALYTICS}
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════════════
// ISO — individual fiche
// ══════════════════════════════════════════════════════════════════════════

function isoPage(c) {
  const title     = c.plainLanguageLabel || c.standardLabel;
  const families  = c.families || [c.family];
  const sevClass  = c.severity === 'error' ? 'badge-blocking' : c.severity === 'warning' ? 'badge-warning' : 'badge-info';
  const sevLabel  = c.severity === 'error' ? 'Erreur' : c.severity === 'warning' ? 'Avertissement' : 'Info';
  const canonical = `https://ediinsight.app/iso-rejet/${c.isoCode}/`;

  const pageTitle = `Code rejet SEPA ${c.isoCode} — ${title} | EDI Insight`;
  const metaDesc  = `Code rejet ISO 20022 ${c.isoCode} : ${title}. ${truncate(c.description || '', 20)} Causes et résolution dans EDI Insight.`;

  const usageHtml = c.usageRules
    ? `<p style="font-size:14.5px;color:var(--muted);line-height:1.7;white-space:pre-line">${esc(c.usageRules)}</p>`
    : '';

  return head({ title: pageTitle, desc: truncate(metaDesc, 38), canonical }) + `
${NAV}
<main>
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Fil d'Ariane">
      <a href="https://ediinsight.app/">Accueil</a>
      <span class="sep">›</span>
      <a href="/iso-rejet/">Motifs de rejet ISO</a>
      <span class="sep">›</span>
      <span>${esc(c.isoCode)}</span>
    </nav>

    <header class="ref-head">
      <p class="ref-kicker">Code rejet SEPA / ISO 20022</p>
      <h1 class="ref-code mono">${esc(c.isoCode)}</h1>
      <p class="ref-label">${esc(c.standardLabel)}</p>
      <div class="badge-row">
        ${c.severity ? `<span class="badge ${sevClass}">${sevLabel}</span>` : ''}
        ${families.map(f => `<span class="badge badge-family">${esc(f)}</span>`).join('')}
        ${c.cfonbCode && c.cfonbCode !== '??' ? `<span class="badge badge-cfonb">CFONB ${esc(c.cfonbCode)}</span>` : ''}
      </div>
    </header>

    <div class="ref-body">
      <div class="ref-main">

        <!-- SIGNIFICATION — PUBLIC -->
        <div class="ref-section">
          <div class="ref-section-title">Signification</div>
          <div class="ref-section-box">
            <p class="ref-desc" style="margin-bottom:${c.usageRules ? '18px' : '0'}">${esc(c.description || title)}</p>
            ${usageHtml}
          </div>
        </div>

        <!-- CAUSES — FLOUTÉES -->
        ${c.likelyCauses && c.likelyCauses.length
          ? lockedSection('Causes fréquentes', ulHtml(c.likelyCauses))
          : ''}

        <!-- ACTIONS — FLOUTÉES -->
        ${c.recommendedActions && c.recommendedActions.length
          ? lockedSection('Résolution', ulHtml(c.recommendedActions))
          : ''}

      </div>

      <aside class="ref-aside">
        <div class="aside-card">
          <h3>Résoudre ce motif</h3>
          <p>Causes détaillées, marche à suivre complète et exemples de messages dans l'outil EDI Insight.</p>
          <a class="btn btn-primary" style="width:100%;justify-content:center"
             href="https://apps.apple.com/app/edi-insight/id6769721055"
             target="_blank" rel="noopener">
            Ouvrir EDI Insight →
          </a>
        </div>
        <div class="aside-card">
          <div class="aside-row">
            <span class="aside-key">Code ISO</span>
            <span class="aside-val">${esc(c.isoCode)}</span>
          </div>
          ${c.cfonbCode && c.cfonbCode !== '??' ? `
          <div class="aside-row">
            <span class="aside-key">Code CFONB</span>
            <span class="aside-val">${esc(c.cfonbCode)}</span>
          </div>` : ''}
          <div class="aside-row">
            <span class="aside-key">Rejeu</span>
            <span class="aside-val" style="color:${c.retryPossible ? 'var(--green)' : 'var(--red)'}">${c.retryPossible === undefined ? '—' : c.retryPossible ? 'Possible' : 'Non recommandé'}</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</main>
${FOOTER}
${ANALYTICS}
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════════════
// HUB — Référentiel EBICS
// ══════════════════════════════════════════════════════════════════════════

function ebicsHub() {
  const canonical = 'https://ediinsight.app/referentiel-ebics/';
  const pageTitle = 'Référentiel des codes erreurs EBICS — Signification et résolution | EDI Insight';
  const metaDesc  = `Référentiel complet des ${EBICS.length} codes erreurs EBICS (9xxxx, 06xxxx, 09xxxx…). Signification, catégorie, versions EBICS 2.5 et 3.0. Résolution dans l'outil EDI Insight.`;

  const categories = [...new Set(EBICS.map(c => c.category))].sort();

  const cards = EBICS.map(c => {
    const catLabel = c.category.charAt(0).toUpperCase() + c.category.slice(1);
    const sevClass = c.severity === 'blocking' ? 'badge-blocking' : 'badge-info';
    const sevLabel = c.severity === 'blocking' ? 'Bloquant' : 'Info';
    return `<a class="hub-card" href="/referentiel-ebics/${c.code}/" data-cat="${esc(c.category)}">
      <div class="hub-card-top">
        <span class="hub-code">${esc(c.code)}</span>
        <span class="badge ${sevClass}" style="font-size:11px">${sevLabel}</span>
      </div>
      <div class="hub-title">${esc(truncate(c.description, 8))}</div>
      <div class="hub-desc">${esc(c.label)}</div>
      <div class="hub-badges">
        <span class="badge badge-cat" style="font-size:11px">${esc(catLabel)}</span>
        ${c.ebics_version.map(v => `<span class="badge badge-ver" style="font-size:11px">EBICS ${esc(v)}</span>`).join('')}
      </div>
    </a>`;
  }).join('\n');

  const filterBtns = ['Tous', ...categories].map(cat => {
    const label = cat === 'Tous' ? 'Tous' : cat.charAt(0).toUpperCase() + cat.slice(1);
    return `<button class="hub-filter${cat === 'Tous' ? ' active' : ''}" onclick="filter('${cat}')">${label}</button>`;
  }).join('\n');

  return head({ title: pageTitle, desc: metaDesc, canonical }) + `
${NAV}
<main>
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Fil d'Ariane">
      <a href="https://ediinsight.app/">Accueil</a>
      <span class="sep">›</span>
      <span>Référentiel EBICS</span>
    </nav>

    <header class="hub-head">
      <p class="ref-kicker">Référentiel</p>
      <h1 class="serif" style="font-size:48px;font-weight:600;letter-spacing:-.01em;margin-bottom:16px">
        Codes erreurs <em style="font-style:italic;color:var(--accent)">EBICS</em>
      </h1>
      <p style="font-size:17px;color:var(--muted);max-width:580px;margin-bottom:32px">
        ${EBICS.length} codes référencés — signification, catégorie, versions EBICS 2.5 et 3.0.
        La résolution complète est disponible dans l'outil EDI Insight.
      </p>

      <div class="hub-search-wrap">
        <input class="hub-search" type="search" id="q"
          placeholder="Rechercher un code ou un mot-clé (ex : 091002, certificat, authentification…)"
          oninput="search(this.value)">
      </div>

      <div class="hub-filters">${filterBtns}</div>
    </header>

    <div class="hub-grid" id="grid">${cards}</div>
  </div>
</main>
${FOOTER}
<script>
  var cards = Array.from(document.querySelectorAll('.hub-card'));
  var activeCat = 'Tous';
  function filter(cat) {
    activeCat = cat;
    document.querySelectorAll('.hub-filter').forEach(function(b){
      b.classList.toggle('active', b.textContent.trim().toLowerCase() === (cat === 'Tous' ? 'tous' : cat));
    });
    applyFilter();
  }
  function search(q) { applyFilter(q); }
  function applyFilter(q) {
    q = (q || document.getElementById('q').value).toLowerCase().trim();
    cards.forEach(function(c){
      var catOk = activeCat === 'Tous' || c.dataset.cat === activeCat;
      var qOk   = !q || c.textContent.toLowerCase().includes(q);
      c.style.display = (catOk && qOk) ? '' : 'none';
    });
  }
</script>
${ANALYTICS}
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════════════
// HUB — Motifs de rejet ISO
// ══════════════════════════════════════════════════════════════════════════

function isoHub() {
  const canonical = 'https://ediinsight.app/iso-rejet/';
  const pageTitle = 'Référentiel des motifs de rejet SEPA / ISO 20022 | EDI Insight';
  const metaDesc  = `${ISO.length} codes de rejet ISO 20022 référencés : AC01, MS03, AM04, BE01… Signification, famille SEPA (SCT, SCT Inst, Recall) et résolution dans EDI Insight.`;

  const families = [...new Set(ISO.flatMap(c => c.families || [c.family]))].sort();

  const cards = ISO.map(c => {
    const fams = c.families || [c.family];
    const title = c.plainLanguageLabel || c.standardLabel;
    const sevClass = c.severity === 'error' ? 'badge-blocking' : c.severity === 'warning' ? 'badge-warning' : 'badge-info';
    const sevLabel = c.severity === 'error' ? 'Erreur' : c.severity === 'warning' ? 'Avertissement' : 'Info';
    return `<a class="hub-card" href="/iso-rejet/${c.isoCode}/" data-fam="${esc(fams[0])}">
      <div class="hub-card-top">
        <span class="hub-code">${esc(c.isoCode)}</span>
        ${c.severity ? `<span class="badge ${sevClass}" style="font-size:11px">${sevLabel}</span>` : ''}
      </div>
      <div class="hub-title">${esc(title)}</div>
      <div class="hub-desc">${esc(truncate(c.description || '', 10))}</div>
      <div class="hub-badges">
        ${fams.map(f => `<span class="badge badge-family" style="font-size:11px">${esc(f)}</span>`).join('')}
        ${c.cfonbCode && c.cfonbCode !== '??' ? `<span class="badge badge-cfonb" style="font-size:11px">CFONB ${esc(c.cfonbCode)}</span>` : ''}
      </div>
    </a>`;
  }).join('\n');

  const filterBtns = ['Tous', ...families].map(fam => {
    return `<button class="hub-filter${fam === 'Tous' ? ' active' : ''}" onclick="filter('${esc(fam)}')">${esc(fam)}</button>`;
  }).join('\n');

  return head({ title: pageTitle, desc: metaDesc, canonical }) + `
${NAV}
<main>
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Fil d'Ariane">
      <a href="https://ediinsight.app/">Accueil</a>
      <span class="sep">›</span>
      <span>Motifs de rejet ISO</span>
    </nav>

    <header class="hub-head">
      <p class="ref-kicker">Référentiel SEPA</p>
      <h1 class="serif" style="font-size:48px;font-weight:600;letter-spacing:-.01em;margin-bottom:16px">
        Motifs de rejet <em style="font-style:italic;color:var(--accent)">ISO 20022</em>
      </h1>
      <p style="font-size:17px;color:var(--muted);max-width:580px;margin-bottom:32px">
        ${ISO.length} codes référencés — SCT, SCT Inst, Recall, RFRO.
        La résolution complète est disponible dans l'outil EDI Insight.
      </p>

      <div class="hub-search-wrap">
        <input class="hub-search" type="search" id="q"
          placeholder="Rechercher un code ou mot-clé (ex : AC01, IBAN, doublon, timeout…)"
          oninput="search(this.value)">
      </div>

      <div class="hub-filters">${filterBtns}</div>
    </header>

    <div class="hub-grid" id="grid">${cards}</div>
  </div>
</main>
${FOOTER}
<script>
  var cards = Array.from(document.querySelectorAll('.hub-card'));
  var activeFam = 'Tous';
  function filter(fam) {
    activeFam = fam;
    document.querySelectorAll('.hub-filter').forEach(function(b){
      b.classList.toggle('active', b.textContent.trim() === fam);
    });
    applyFilter();
  }
  function search(q) { applyFilter(q); }
  function applyFilter(q) {
    q = (q || document.getElementById('q').value).toLowerCase().trim();
    cards.forEach(function(c){
      var famOk = activeFam === 'Tous' || c.dataset.fam === activeFam;
      var qOk   = !q || c.textContent.toLowerCase().includes(q);
      c.style.display = (famOk && qOk) ? '' : 'none';
    });
  }
</script>
${ANALYTICS}
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════════════
// SITEMAP
// ══════════════════════════════════════════════════════════════════════════

function sitemap() {
  const today = new Date().toISOString().slice(0,10);

  const staticPages = [
    { url: 'https://ediinsight.app/',                 prio: '1.0', freq: 'monthly' },
    { url: 'https://ediinsight.app/en/',              prio: '0.9', freq: 'monthly' },
    { url: 'https://ediinsight.app/de/',              prio: '0.9', freq: 'monthly' },
    { url: 'https://ediinsight.app/a-propos.html',    prio: '0.5', freq: 'yearly'  },
    { url: 'https://ediinsight.app/about.html',       prio: '0.5', freq: 'yearly'  },
    { url: 'https://ediinsight.app/referentiel-ebics/',  prio: '0.9', freq: 'monthly' },
    { url: 'https://ediinsight.app/iso-rejet/',          prio: '0.9', freq: 'monthly' },
  ];

  const ebicsPages = EBICS.map(c => ({
    url: `https://ediinsight.app/referentiel-ebics/${c.code}/`,
    prio: '0.8', freq: 'yearly',
  }));

  const isoPages = ISO.map(c => ({
    url: `https://ediinsight.app/iso-rejet/${c.isoCode}/`,
    prio: '0.8', freq: 'yearly',
  }));

  const all = [...staticPages, ...ebicsPages, ...isoPages];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(p => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.prio}</priority>
  </url>`).join('\n')}
</urlset>`;
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN — génération
// ══════════════════════════════════════════════════════════════════════════

const ebicsList = SAMPLE ? EBICS.slice(0, 1) : EBICS;
const isoList   = SAMPLE ? ISO.slice(0, 1)   : ISO;

console.log(`\n🔧  Mode : ${SAMPLE ? 'SAMPLE (3 pages)' : 'COMPLET'}\n`);

// Hubs
write(path.join(ROOT, 'referentiel-ebics/index.html'), ebicsHub());
console.log('✓  referentiel-ebics/index.html');

write(path.join(ROOT, 'iso-rejet/index.html'), isoHub());
console.log('✓  iso-rejet/index.html');

// EBICS fiches
for (const c of ebicsList) {
  write(path.join(ROOT, `referentiel-ebics/${c.code}/index.html`), ebicsPage(c));
  console.log(`✓  referentiel-ebics/${c.code}/`);
}

// ISO fiches
for (const c of isoList) {
  write(path.join(ROOT, `iso-rejet/${c.isoCode}/index.html`), isoPage(c));
  console.log(`✓  iso-rejet/${c.isoCode}/`);
}

// Sitemap (toujours complet)
write(path.join(ROOT, 'sitemap.xml'), sitemap());
console.log('✓  sitemap.xml');

const totalFiles = 2 + ebicsList.length + isoList.length + 1;
console.log(`\n✅  ${totalFiles} fichiers générés dans ${ROOT}\n`);
