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

// Jeux ANGLAIS — mêmes codes, prose traduite. Produits depuis les calques de
// l'app (src/i18n/isoReasonsEn.ts, ebicsCodesEn.ts) : une seule source de
// vérité pour la traduction, partagée entre l'app et la vitrine.
const EBICS_EN = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ebics.en.json'), 'utf8')).codes;
const ISO_EN   = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/iso.en.json'),  'utf8'));

const DATA = { fr: { ebics: EBICS, iso: ISO }, en: { ebics: EBICS_EN, iso: ISO_EN } };

/**
 * Chemins par langue. Le français ne bouge PAS — aucune URL existante n'est
 * modifiée, aucun lien entrant ni position acquise n'est cassé.
 *
 * L'anglais vit sous /en/ avec de VRAIS slugs anglais : un anglophone qui
 * cherche « ebics error code 061001 » ne tape pas « referentiel-ebics ».
 */
const PATHS = {
  fr: { home: '', ebics: 'referentiel-ebics/', iso: 'iso-rejet/' },
  en: { home: 'en/', ebics: 'en/ebics-error-codes/', iso: 'en/sepa-reject-codes/' },
};

const SITE = 'https://ediinsight.app/';

/** URL absolue d'une fiche, dans une langue donnée. */
const ebicsUrl = (lang, code) => SITE + PATHS[lang].ebics + code + '/';
const isoUrl   = (lang, code) => SITE + PATHS[lang].iso   + code + '/';

/** Groupe hreflang FR/EN d'une fiche — les deux langues se citent mutuellement. */
const altEbics = code => ({ fr: PATHS.fr.ebics + code + '/', en: PATHS.en.ebics + code + '/' });
const altIso   = code => ({ fr: PATHS.fr.iso   + code + '/', en: PATHS.en.iso   + code + '/' });

/**
 * Libellés d'interface des pages générées.
 *
 * Ne sont PAS traduits : les codes eux-mêmes, les noms de famille SEPA
 * (SCT Reject/Return, Recall…) et les codes CFONB — ce sont des identifiants
 * du standard, que l'utilisateur retrouve tels quels dans son reporting.
 */
const STR = {
  fr: {
    home: 'Accueil', crumbAria: "Fil d'Ariane",
    ebicsHub: 'Référentiel EBICS', isoHub: 'Motifs de rejet ISO',
    ebicsKicker: 'Code erreur EBICS', isoKicker: 'Code rejet SEPA / ISO 20022',
    description: 'Description', meaning: 'Signification',
    causes: 'Causes fréquentes', action: 'Action recommandée', resolution: 'Résolution',
    lockedLabel: "Contenu réservé à l'outil", lockedCta: "Résolution complète dans l'outil →",
    asideEbicsTitle: 'Résoudre ce code',
    asideEbicsText: "Causes précises, marche à suivre complète et exemples dans l'outil EDI Insight.",
    asideIsoTitle: 'Résoudre ce motif',
    asideIsoText: "Causes détaillées, marche à suivre complète et exemples de messages dans l'outil EDI Insight.",
    openApp: 'Ouvrir EDI Insight →',
    sevBlocking: 'Bloquant', sevInformational: 'Informatif',
    sevError: 'Erreur', sevWarning: 'Avertissement', sevInfo: 'Info',
    keyCode: 'Code', keyCat: 'Catégorie', keySev: 'Sévérité',
    keyIsoCode: 'Code ISO', keyCfonb: 'Code CFONB', keyRetry: 'Rejeu',
    retryYes: 'Possible', retryNo: 'Non recommandé',
    cat: {},
  },
  en: {
    home: 'Home', crumbAria: 'Breadcrumb',
    ebicsHub: 'EBICS reference', isoHub: 'ISO reject reasons',
    ebicsKicker: 'EBICS error code', isoKicker: 'SEPA / ISO 20022 reject code',
    description: 'Description', meaning: 'Meaning',
    causes: 'Common causes', action: 'Recommended action', resolution: 'Resolution',
    lockedLabel: 'Available in the app', lockedCta: 'Full resolution in the app →',
    asideEbicsTitle: 'Resolve this code',
    asideEbicsText: 'Precise causes, the full procedure and examples in the EDI Insight app.',
    asideIsoTitle: 'Resolve this reason',
    asideIsoText: 'Detailed causes, the full procedure and message examples in the EDI Insight app.',
    openApp: 'Open EDI Insight →',
    sevBlocking: 'Blocking', sevInformational: 'Informational',
    sevError: 'Error', sevWarning: 'Warning', sevInfo: 'Info',
    keyCode: 'Code', keyCat: 'Category', keySev: 'Severity',
    keyIsoCode: 'ISO code', keyCfonb: 'CFONB code', keyRetry: 'Retry',
    retryYes: 'Possible', retryNo: 'Not recommended',
    cat: {
      authentification: 'Authentication', certificat: 'Certificate',
      technique: 'Technical', metier: 'Business', information: 'Information',
    },
  },
};

/** Catégorie EBICS : traduite si une correspondance existe, capitalisée sinon. */
function catLabelFor(lang, category) {
  const m = STR[lang].cat[category];
  return m || (category.charAt(0).toUpperCase() + category.slice(1));
}

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

function NAV(lang = 'fr') {
  const S = STR[lang];
  const P = PATHS[lang];
  return `<nav>
  <div class="wrap nav-in">
    <a href="${SITE}${P.home}" class="brand"><span class="bar"></span>EDI INSIGHT</a>
    <div class="nav-links">
      <a href="${SITE}${P.home}${lang === 'en' ? '' : '#modules'}">${lang === 'en' ? 'Features' : 'Fonctionnalités'}</a>
      <div class="navdrop">
        <button class="navdropbtn" type="button">
          ${lang === 'en' ? 'Reference' : 'Référentiels'}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="navdropmenu">
          <a href="/${P.ebics}">${lang === 'en' ? 'EBICS error codes' : 'Codes erreurs EBICS'}</a>
          <a href="/${P.iso}">${S.isoHub}</a>
        </div>
      </div>
      ${lang === 'en' ? '' : `<a href="${SITE}#convertisseur">Convertisseur</a>`}
      <a href="${SITE}${lang === 'en' ? 'en/about.html' : 'a-propos.html'}">${lang === 'en' ? 'About' : 'À propos'}</a>
      ${lang === 'en' ? '' : `<a href="${SITE}telecharger">Télécharger</a>`}
      <a class="btn btn-primary" href="https://app.ediinsight.app" target="_blank" rel="noopener">
        ${lang === 'en' ? 'Open the app' : "Ouvrir l'app"}
      </a>
    </div>
  </div>
</nav>`;
}

function FOOTER(lang = 'fr') {
  const S = STR[lang];
  const P = PATHS[lang];
  return `<footer>
  <div class="wrap">
    <div class="foot-grid">
      <a href="https://ediinsight.app/" class="brand"><span class="bar"></span>EDI INSIGHT</a>
      <div class="foot-links">
        <a href="/${P.ebics}">${S.ebicsHub}</a>
        <a href="/${P.iso}">${S.isoHub}</a>
        <a href="${SITE}${lang === 'en' ? 'en/about.html' : 'a-propos.html'}">${lang === 'en' ? 'About' : 'À propos'}</a>
        ${lang === 'en' ? '' : `<a href="${SITE}telecharger">Télécharger</a>`}
        <a href="https://apps.apple.com/app/edi-insight/id6769721055" target="_blank" rel="noopener">App Store</a>
        <a href="${SITE}${lang === 'en' ? 'en/privacy.html' : 'privacy.html'}">${lang === 'en' ? 'Privacy policy' : 'Politique de confidentialité'}</a>
        <a href="${SITE}${lang === 'en' ? 'en/Terms.html' : 'Terms.html'}">${lang === 'en' ? 'Terms of use' : "Conditions d'utilisation"}</a>
        <a href="${SITE}${lang === 'en' ? 'en/support.html' : 'support.html'}">Support</a>
      </div>
    </div>
    <div class="copy">© 2026 EDI INSIGHT — Voisin Alexandre, entrepreneur individuel · Issy-les-Moulineaux, France</div>
  </div>
</footer>`;
}

const ANALYTICS = `<script data-goatcounter="https://ediinsight-app.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>`;

// ── Shared head builder ───────────────────────────────────────────────────

function head({ title, desc, canonical, ogTitle, lang = 'fr', alt }) {
  // hreflang : indispensable pour que Google comprenne que /en/… est la
  // TRADUCTION de la page française, et non un doublon à pénaliser.
  const hreflang = !alt ? '' : ['fr', 'en']
    .map(l => `\n<link rel="alternate" hreflang="${l}" href="${SITE}${alt[l]}">`).join('')
    + `\n<link rel="alternate" hreflang="x-default" href="${SITE}${alt.fr}">`;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">${hreflang}
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

function lockedSection(title, innerHtml, lang = 'fr') {
  const S = STR[lang];
  return `
<div class="locked-section" aria-label="${esc(title)}">
  <div class="ref-section-title">${esc(title)}</div>
  <div class="locked-content" aria-hidden="true">
    ${innerHtml}
  </div>
  <div class="locked-overlay">
    <span class="locked-label">${S.lockedLabel}</span>
    <a class="locked-cta" href="https://app.ediinsight.app"
       target="_blank" rel="noopener">
      ${S.lockedCta}
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

function ebicsPage(c, lang = 'fr') {
  const S = STR[lang], P = PATHS[lang];
  const sevLabel  = c.severity === 'blocking' ? S.sevBlocking : S.sevInformational;
  const sevClass  = c.severity === 'blocking' ? 'badge-blocking' : 'badge-info';
  const catLabel  = catLabelFor(lang, c.category);
  const canonical = ebicsUrl(lang, c.code);

  const pageTitle = lang === 'en'
    ? `EBICS error ${c.code} — ${truncate(c.description, 10)} | EDI Insight`
    : `Code EBICS ${c.code} — ${truncate(c.description, 10)} | EDI Insight`;
  const metaDesc  = lang === 'en'
    ? `EBICS error code ${c.code} (${c.label}): ${c.description} Category: ${catLabel}. EBICS ${c.ebics_version.join(' and ')}.`
    : `Code EBICS ${c.code} (${c.label}) : ${c.description} Catégorie : ${catLabel}. EBICS ${c.ebics_version.join(' et ')}.`;

  const asideRows = [
    [S.keyCode, c.code],
    [S.keyCat, catLabel],
    [S.keySev, sevLabel],
    ['EBICS', c.ebics_version.join(' / ')],
  ];

  return head({ title: pageTitle, desc: truncate(metaDesc, 35), canonical,
                lang, alt: altEbics(c.code) }) + `
${NAV(lang)}
<main>
  <div class="wrap">
    <nav class="breadcrumb" aria-label="${S.crumbAria}">
      <a href="${SITE}${P.home}">${S.home}</a>
      <span class="sep">›</span>
      <a href="/${P.ebics}">${S.ebicsHub}</a>
      <span class="sep">›</span>
      <span>${esc(c.code)}</span>
    </nav>

    <header class="ref-head">
      <p class="ref-kicker">${S.ebicsKicker}</p>
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
          <div class="ref-section-title">${S.description}</div>
          <div class="ref-section-box">
            <p class="ref-desc">${esc(c.description)}</p>
          </div>
        </div>

        <!-- CAUSES — FLOUTÉES -->
        ${lockedSection(S.causes, ulHtml(c.causes), lang)}

        <!-- ACTION — FLOUTÉE -->
        ${lockedSection(S.action, `<p style="font-size:15px;line-height:1.7">${esc(c.action)}</p>`, lang)}

      </div>

      <aside class="ref-aside">
        <div class="aside-card">
          <h3>${S.asideEbicsTitle}</h3>
          <p>${S.asideEbicsText}</p>
          <a class="btn btn-primary" style="width:100%;justify-content:center"
             href="https://app.ediinsight.app"
             target="_blank" rel="noopener">
            ${S.openApp}
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
${FOOTER(lang)}
${ANALYTICS}
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════════════
// ISO — individual fiche
// ══════════════════════════════════════════════════════════════════════════

function isoPage(c, lang = 'fr') {
  const S = STR[lang], P = PATHS[lang];
  const title     = c.plainLanguageLabel || c.standardLabel;
  const families  = c.families || [c.family];
  const sevClass  = c.severity === 'error' ? 'badge-blocking' : c.severity === 'warning' ? 'badge-warning' : 'badge-info';
  const sevLabel  = c.severity === 'error' ? S.sevError : c.severity === 'warning' ? S.sevWarning : S.sevInfo;
  const canonical = isoUrl(lang, c.isoCode);

  const pageTitle = lang === 'en'
    ? `SEPA reject code ${c.isoCode} — ${title} | EDI Insight`
    : `Code rejet SEPA ${c.isoCode} — ${title} | EDI Insight`;
  const metaDesc  = lang === 'en'
    ? `ISO 20022 reject code ${c.isoCode}: ${title}. ${truncate(c.description || '', 20)} Causes and resolution in EDI Insight.`
    : `Code rejet ISO 20022 ${c.isoCode} : ${title}. ${truncate(c.description || '', 20)} Causes et résolution dans EDI Insight.`;

  const usageHtml = c.usageRules
    ? `<p style="font-size:14.5px;color:var(--muted);line-height:1.7;white-space:pre-line">${esc(c.usageRules)}</p>`
    : '';

  return head({ title: pageTitle, desc: truncate(metaDesc, 38), canonical,
                lang, alt: altIso(c.isoCode) }) + `
${NAV(lang)}
<main>
  <div class="wrap">
    <nav class="breadcrumb" aria-label="${S.crumbAria}">
      <a href="${SITE}${P.home}">${S.home}</a>
      <span class="sep">›</span>
      <a href="/${P.iso}">${S.isoHub}</a>
      <span class="sep">›</span>
      <span>${esc(c.isoCode)}</span>
    </nav>

    <header class="ref-head">
      <p class="ref-kicker">${S.isoKicker}</p>
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
          <div class="ref-section-title">${S.meaning}</div>
          <div class="ref-section-box">
            <p class="ref-desc" style="margin-bottom:${c.usageRules ? '18px' : '0'}">${esc(c.description || title)}</p>
            ${usageHtml}
          </div>
        </div>

        <!-- CAUSES — FLOUTÉES -->
        ${c.likelyCauses && c.likelyCauses.length
          ? lockedSection(S.causes, ulHtml(c.likelyCauses), lang)
          : ''}

        <!-- ACTIONS — FLOUTÉES -->
        ${c.recommendedActions && c.recommendedActions.length
          ? lockedSection(S.resolution, ulHtml(c.recommendedActions), lang)
          : ''}

      </div>

      <aside class="ref-aside">
        <div class="aside-card">
          <h3>${S.asideIsoTitle}</h3>
          <p>${S.asideIsoText}</p>
          <a class="btn btn-primary" style="width:100%;justify-content:center"
             href="https://app.ediinsight.app"
             target="_blank" rel="noopener">
            ${S.openApp}
          </a>
        </div>
        <div class="aside-card">
          <div class="aside-row">
            <span class="aside-key">${S.keyIsoCode}</span>
            <span class="aside-val">${esc(c.isoCode)}</span>
          </div>
          ${c.cfonbCode && c.cfonbCode !== '??' ? `
          <div class="aside-row">
            <span class="aside-key">${S.keyCfonb}</span>
            <span class="aside-val">${esc(c.cfonbCode)}</span>
          </div>` : ''}
          <div class="aside-row">
            <span class="aside-key">${S.keyRetry}</span>
            <span class="aside-val" style="color:${c.retryPossible ? 'var(--green)' : 'var(--red)'}">${c.retryPossible === undefined ? '—' : c.retryPossible ? S.retryYes : S.retryNo}</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</main>
${FOOTER(lang)}
${ANALYTICS}
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════════════
// HUB — Référentiel EBICS
// ══════════════════════════════════════════════════════════════════════════

function ebicsHub(lang = 'fr') {
  const S = STR[lang], P = PATHS[lang], D = DATA[lang].ebics;
  const HUB_ALT = { fr: PATHS.fr.ebics, en: PATHS.en.ebics };
  const canonical = SITE + P.ebics;
  const pageTitle = lang === 'en'
    ? 'EBICS error codes reference — meaning and resolution | EDI Insight'
    : 'Référentiel des codes erreurs EBICS — Signification et résolution | EDI Insight';
  const metaDesc  = lang === 'en'
    ? `Complete reference of the ${D.length} EBICS error codes (9xxxx, 06xxxx, 09xxxx…). Meaning, category, EBICS 2.5 and 3.0 versions. Resolution in the EDI Insight app.`
    : `Référentiel complet des ${D.length} codes erreurs EBICS (9xxxx, 06xxxx, 09xxxx…). Signification, catégorie, versions EBICS 2.5 et 3.0. Résolution dans l'outil EDI Insight.`;

  const categories = [...new Set(D.map(c => c.category))].sort();

  const cards = D.map(c => {
    const catLabel = c.category.charAt(0).toUpperCase() + c.category.slice(1);
    const sevClass = c.severity === 'blocking' ? 'badge-blocking' : 'badge-info';
    const sevLabel = c.severity === 'blocking' ? 'Bloquant' : 'Info';
    return `<a class="hub-card" href="/${P.ebics}${c.code}/" data-cat="${esc(c.category)}">
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

  return head({ title: pageTitle, desc: metaDesc, canonical, lang, alt: HUB_ALT }) + `
${NAV(lang)}
<main>
  <div class="wrap">
    <nav class="breadcrumb" aria-label="${S.crumbAria}">
      <a href="${SITE}${P.home}">${S.home}</a>
      <span class="sep">›</span>
      <span>${S.ebicsHub}</span>
    </nav>

    <header class="hub-head">
      <p class="ref-kicker">${lang === 'en' ? 'Reference' : 'Référentiel'}</p>
      <h1 class="serif" style="font-size:48px;font-weight:600;letter-spacing:-.01em;margin-bottom:16px">
        ${lang === 'en' ? 'Error codes' : 'Codes erreurs'} <em style="font-style:italic;color:var(--accent)">EBICS</em>
      </h1>
      <p style="font-size:17px;color:var(--muted);max-width:580px;margin-bottom:32px">
        ${lang === 'en' ? `${D.length} codes listed — meaning, category, EBICS 2.5 and 3.0 versions.` : `${D.length} codes référencés — signification, catégorie, versions EBICS 2.5 et 3.0.`}
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
${FOOTER(lang)}
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

function isoHub(lang = 'fr') {
  const S = STR[lang], P = PATHS[lang], D = DATA[lang].iso;
  const HUB_ALT = { fr: PATHS.fr.iso, en: PATHS.en.iso };
  const canonical = SITE + P.iso;
  const pageTitle = lang === 'en'
    ? 'SEPA / ISO 20022 reject codes reference | EDI Insight'
    : 'Référentiel des motifs de rejet SEPA / ISO 20022 | EDI Insight';
  const metaDesc  = lang === 'en'
    ? `${D.length} ISO 20022 reject codes listed: AC01, MS03, AM04, BE01… Meaning, SEPA family (SCT, SCT Inst, Recall) and resolution in EDI Insight.`
    : `${D.length} codes de rejet ISO 20022 référencés : AC01, MS03, AM04, BE01… Signification, famille SEPA (SCT, SCT Inst, Recall) et résolution dans EDI Insight.`;

  const families = [...new Set(ISO.flatMap(c => c.families || [c.family]))].sort();

  const cards = D.map(c => {
    const fams = c.families || [c.family];
    const title = c.plainLanguageLabel || c.standardLabel;
    const sevClass = c.severity === 'error' ? 'badge-blocking' : c.severity === 'warning' ? 'badge-warning' : 'badge-info';
    const sevLabel = c.severity === 'error' ? 'Erreur' : c.severity === 'warning' ? 'Avertissement' : 'Info';
    return `<a class="hub-card" href="/${P.iso}${c.isoCode}/" data-fam="${esc(fams[0])}">
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

  return head({ title: pageTitle, desc: metaDesc, canonical, lang, alt: HUB_ALT }) + `
${NAV(lang)}
<main>
  <div class="wrap">
    <nav class="breadcrumb" aria-label="${S.crumbAria}">
      <a href="${SITE}${P.home}">${S.home}</a>
      <span class="sep">›</span>
      <span>${S.isoHub}</span>
    </nav>

    <header class="hub-head">
      <p class="ref-kicker">${lang === 'en' ? 'SEPA reference' : 'Référentiel SEPA'}</p>
      <h1 class="serif" style="font-size:48px;font-weight:600;letter-spacing:-.01em;margin-bottom:16px">
        Motifs de rejet <em style="font-style:italic;color:var(--accent)">ISO 20022</em>
      </h1>
      <p style="font-size:17px;color:var(--muted);max-width:580px;margin-bottom:32px">
        ${lang === 'en' ? `${D.length} codes listed — SCT, SCT Inst, Recall, RFRO.` : `${D.length} codes référencés — SCT, SCT Inst, Recall, RFRO.`}
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
${FOOTER(lang)}
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

const BASE = 'https://ediinsight.app/';

// Groupes de traductions → blocs <xhtml:link hreflang> réciproques.
const ALT_HOME  = { fr: '', en: 'en/', de: 'de/' };
const ALT_ABOUT = { fr: 'a-propos.html', en: 'en/about.html', de: 'de/about.html' };
const ALT_EBICS_HUB = { fr: 'referentiel-ebics/', en: 'en/ebics-error-codes/' };
const ALT_ISO_HUB   = { fr: 'iso-rejet/',         en: 'en/sepa-reject-codes/' };

/**
 * Pages statiques (tout ce qui n'est pas une fiche EBICS/ISO générée).
 * `alt` = groupe de traductions éventuel.
 *
 * ⚠ Cette liste est la SOURCE UNIQUE du sitemap : toute page ajoutée au dépôt
 * doit y figurer, ou être déclarée dans SITEMAP_EXCLUDE. checkSitemapCoverage()
 * échoue si ce n'est pas le cas — c'est ce qui empêche une page de disparaître
 * silencieusement du sitemap.
 */
const STATIC_PAGES = [
  { url: '',                     prio: '1.0', freq: 'weekly',  alt: ALT_HOME  },
  { url: 'en/',                  prio: '0.9', freq: 'weekly',  alt: ALT_HOME  },
  { url: 'de/',                  prio: '0.9', freq: 'weekly',  alt: ALT_HOME  },
  { url: 'telecharger',          prio: '0.9', freq: 'monthly' },
  { url: 'guide.html',           prio: '0.8', freq: 'monthly' },
  { url: 'a-propos.html',        prio: '0.6', freq: 'monthly', alt: ALT_ABOUT },
  { url: 'en/about.html',        prio: '0.5', freq: 'monthly', alt: ALT_ABOUT },
  { url: 'de/about.html',        prio: '0.5', freq: 'monthly', alt: ALT_ABOUT },
  { url: 'referentiel-ebics/',   prio: '0.9', freq: 'monthly', alt: ALT_EBICS_HUB },
  { url: 'iso-rejet/',           prio: '0.9', freq: 'monthly', alt: ALT_ISO_HUB },
  { url: 'en/ebics-error-codes/',prio: '0.8', freq: 'monthly', alt: ALT_EBICS_HUB },
  { url: 'en/sepa-reject-codes/',prio: '0.8', freq: 'monthly', alt: ALT_ISO_HUB },
  // Légales & support — FR / EN / DE de façon symétrique.
  { url: 'cgv.html',             prio: '0.3', freq: 'yearly' },
  { url: 'mentions-legales.html',prio: '0.3', freq: 'yearly' },
  { url: 'confidentialite.html', prio: '0.3', freq: 'yearly' },
  { url: 'privacy.html',         prio: '0.3', freq: 'yearly' },
  { url: 'Terms.html',           prio: '0.3', freq: 'yearly' },
  { url: 'support.html',         prio: '0.4', freq: 'yearly' },
  { url: 'en/privacy.html',      prio: '0.3', freq: 'yearly' },
  { url: 'en/Terms.html',        prio: '0.3', freq: 'yearly' },
  { url: 'en/support.html',      prio: '0.4', freq: 'yearly' },
  { url: 'de/privacy.html',      prio: '0.3', freq: 'yearly' },
  { url: 'de/Terms.html',        prio: '0.3', freq: 'yearly' },
  { url: 'de/support.html',      prio: '0.4', freq: 'yearly' },
];

/**
 * Pages présentes dans le dépôt mais volontairement hors sitemap.
 * Format : ['chemin/relatif.html', 'raison de l'exclusion'].
 * Vide aujourd'hui : les deux doublons historiques (about.html, doublon EN de
 * en/about.html ; de/support-2.html, doublon strict de de/support.html) ont été
 * supprimés le 2026-07-16 — aucun lien interne ni externe, et jamais présents
 * dans un sitemap déployé.
 */
const SITEMAP_EXCLUDE = new Map();

function sitemapEntries() {
  const pages = [];
  for (const lang of ['fr', 'en']) {
    const P = PATHS[lang];
    // L'anglais passe en priorité légèrement inférieure : c'est la version
    // secondaire, le français reste la référence du site.
    const prio = lang === 'fr' ? '0.7' : '0.6';
    for (const c of DATA[lang].ebics) {
      pages.push({ url: `${P.ebics}${c.code}/`, prio, freq: 'monthly', alt: altEbics(c.code) });
    }
    for (const c of DATA[lang].iso) {
      pages.push({ url: `${P.iso}${c.isoCode}/`, prio, freq: 'monthly', alt: altIso(c.isoCode) });
    }
  }
  return [...STATIC_PAGES, ...pages];
}

/** URL relative → fichier attendu sur le disque. */
function urlToFile(u) {
  if (u === '')            return 'index.html';
  if (u.endsWith('/'))     return u + 'index.html';
  if (u.endsWith('.html')) return u;
  return u + '/index.html';           // URLs propres, ex. /telecharger
}

/** Tous les .html du dépôt (hors dossiers techniques). */
function listHtmlFiles(dir = ROOT, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'data') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) listHtmlFiles(full, acc);
    else if (e.name.endsWith('.html')) acc.push(path.relative(ROOT, full));
  }
  return acc;
}

/**
 * Garde-fou : le sitemap et le disque doivent coïncider.
 * Une page ajoutée sans entrée de sitemap (ou une entrée sans fichier) est une
 * ERREUR bruyante, jamais une omission silencieuse.
 */
function checkSitemapCoverage(entries) {
  const listed  = new Set(entries.map(e => urlToFile(e.url)));
  const onDisk  = new Set(listHtmlFiles());

  const orphans = [...onDisk].filter(f => !listed.has(f) && !SITEMAP_EXCLUDE.has(f)).sort();
  const missing = [...listed].filter(f => !onDisk.has(f)).sort();
  const staleExcludes = [...SITEMAP_EXCLUDE.keys()].filter(f => !onDisk.has(f)).sort();

  for (const f of orphans) {
    console.error(`❌  ${f} existe mais n'est pas dans le sitemap.`);
    console.error(`    → ajoute-la à STATIC_PAGES, ou à SITEMAP_EXCLUDE avec la raison.`);
  }
  for (const f of missing) {
    console.error(`❌  le sitemap référence ${f}, qui n'existe pas sur le disque.`);
  }
  for (const f of staleExcludes) {
    console.error(`⚠️   SITEMAP_EXCLUDE mentionne ${f}, qui n'existe plus — entrée à retirer.`);
  }

  if (orphans.length || missing.length) {
    console.error(`\n❌  sitemap incohérent : ${orphans.length} page(s) non listée(s), ${missing.length} entrée(s) sans fichier.\n`);
    process.exitCode = 1;
    return false;
  }
  console.log(`✓  sitemap cohérent : ${entries.length} URLs, ${SITEMAP_EXCLUDE.size} exclusion(s) assumée(s)`);
  return true;
}

function sitemap(entries) {
  const today = new Date().toISOString().slice(0,10);
  // Tous les groupes n'ont pas d'allemand : les fiches EBICS/ISO n'existent
  // qu'en FR et EN. On n'émet que les langues réellement présentes, sinon on
  // déclarerait des URLs qui n'existent pas.
  const alts = p => !p.alt ? '' :
    '\n' + ['fr','en','de'].filter(l => p.alt[l] !== undefined).map(l =>
      `    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE}${p.alt[l]}"/>`
    ).join('\n') +
    `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}${p.alt.fr}"/>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map(p => `  <url>
    <loc>${BASE}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.prio}</priority>${alts(p)}
  </url>`).join('\n')}
</urlset>`;
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN — génération
// ══════════════════════════════════════════════════════════════════════════

console.log(`\n🔧  Mode : ${SAMPLE ? 'SAMPLE' : 'COMPLET'}\n`);

let generees = 0;

for (const lang of ['fr', 'en']) {
  const P = PATHS[lang];
  const ebicsList = SAMPLE ? DATA[lang].ebics.slice(0, 1) : DATA[lang].ebics;
  const isoList   = SAMPLE ? DATA[lang].iso.slice(0, 1)   : DATA[lang].iso;

  write(path.join(ROOT, `${P.ebics}index.html`), ebicsHub(lang));
  console.log(`✓  ${P.ebics}index.html`);
  write(path.join(ROOT, `${P.iso}index.html`), isoHub(lang));
  console.log(`✓  ${P.iso}index.html`);
  generees += 2;

  for (const c of ebicsList) {
    write(path.join(ROOT, `${P.ebics}${c.code}/index.html`), ebicsPage(c, lang));
    generees++;
  }
  console.log(`✓  ${P.ebics}… ${ebicsList.length} fiches`);

  for (const c of isoList) {
    write(path.join(ROOT, `${P.iso}${c.isoCode}/index.html`), isoPage(c, lang));
    generees++;
  }
  console.log(`✓  ${P.iso}… ${isoList.length} fiches`);
}

// Sitemap (toujours complet) — écrit seulement s'il est cohérent avec le disque,
// pour qu'un sitemap incomplet ne puisse pas écraser le bon.
const entries = sitemapEntries();
if (checkSitemapCoverage(entries)) {
  write(path.join(ROOT, 'sitemap.xml'), sitemap(entries));
  console.log('✓  sitemap.xml');
} else {
  console.error('⏭️   sitemap.xml laissé intact (le précédent est conservé).');
}

console.log(`\n✅  ${generees + 1} fichiers générés dans ${ROOT}\n`);
