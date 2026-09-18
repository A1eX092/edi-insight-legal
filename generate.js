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

// Article de référence « adresses structurées » : le texte vit dans data/,
// le gabarit ici. Une mise à jour de dates ne touche donc pas au moteur.
const ARTICLE = {
  fr: require('./data/article-adresses.fr.js'),
  en: require('./data/article-adresses.en.js'),
};
ARTICLE.de = require('./data/article-adresses.de.js');
const PRODUCT = {
  fr: require('./data/produit.fr.js'),
  en: require('./data/produit.en.js'),
  de: require('./data/produit.de.js'),
};
const EBICS_DE = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ebics.de.json'), 'utf8')).codes;
const ISO_DE   = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/iso.de.json'),  'utf8'));
const ISO_EN   = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/iso.en.json'),  'utf8'));

const DATA = {
  fr: { ebics: EBICS, iso: ISO },
  en: { ebics: EBICS_EN, iso: ISO_EN },
  de: { ebics: EBICS_DE, iso: ISO_DE },
};

/**
 * Chemins par langue. Le français ne bouge PAS — aucune URL existante n'est
 * modifiée, aucun lien entrant ni position acquise n'est cassé.
 *
 * L'anglais vit sous /en/ avec de VRAIS slugs anglais : un anglophone qui
 * cherche « ebics error code 061001 » ne tape pas « referentiel-ebics ».
 */
const PATHS = {
  fr: { home: '', ebics: 'referentiel-ebics/', iso: 'iso-rejet/', article: 'adresses-structurees/',
        produit: 'produit/', ressources: 'ressources/' },
  en: { home: 'en/', ebics: 'en/ebics-error-codes/', iso: 'en/sepa-reject-codes/', article: 'en/structured-addresses/',
        produit: 'en/product/', ressources: 'en/resources/' },
  de: { home: 'de/', ebics: 'de/ebics-fehlercodes/', iso: 'de/sepa-rueckweisungscodes/',
        article: 'de/strukturierte-adressen/',
        produit: 'de/produkt/', ressources: 'de/ressourcen/' },
};

const SITE = 'https://ediinsight.app/';

/**
 * Liens vers l'app web. Ils ouvrent directement la fiche du code dans le bon
 * référentiel (paramètre `c`, pas `code` : réservé au retour du lien magique
 * côté app) et, depuis les pages /en/, l'app en anglais.
 */
const APP = 'https://app.ediinsight.app/';
function appUrl(lang, kind, code) {
  const p = new URLSearchParams();
  if (kind === 'iso') { p.set('tab', 'referentiels'); p.set('r', 'rejets'); }
  else if (kind === 'ebics') p.set('tab', 'ebics');
  else if (kind === 'converter') { p.set('tab', 'analyser'); p.set('a', 'addresses'); }
  if (code) p.set('c', code);
  if (lang === 'en') p.set('lang', 'en');
  const q = p.toString();
  // &amp; : ces liens ne servent que dans des attributs HTML.
  return q ? APP + '?' + q.replace(/&/g, '&amp;') : APP;
}

/** URL absolue d'une fiche, dans une langue donnée. */
const ebicsUrl = (lang, code) => SITE + PATHS[lang].ebics + code + '/';
const isoUrl   = (lang, code) => SITE + PATHS[lang].iso   + code + '/';

/** Groupe hreflang FR/EN d'une fiche — les deux langues se citent mutuellement. */
const altEbics = code => ({
  fr: PATHS.fr.ebics + code + '/', en: PATHS.en.ebics + code + '/', de: PATHS.de.ebics + code + '/',
});
const altIso   = code => ({
  fr: PATHS.fr.iso + code + '/', en: PATHS.en.iso + code + '/', de: PATHS.de.iso + code + '/',
});

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
    lockedLabel: 'Inclus dans les 3 résolutions offertes', lockedCta: 'Débloquer gratuitement, sans mot de passe →',
    asideEbicsTitle: 'Résoudre ce code',
    asideEbicsText: "Causes précises, marche à suivre complète et exemples dans l'outil EDI Insight. 3 résolutions offertes avec un compte gratuit, sans mot de passe.",
    asideIsoTitle: 'Résoudre ce motif',
    asideIsoText: "Causes détaillées, marche à suivre complète et exemples de messages dans l'outil EDI Insight. 3 résolutions offertes avec un compte gratuit, sans mot de passe.",
    hubCtaIsoText: "Un motif vous bloque ? Les causes et la marche à suivre sont dans l'outil EDI Insight : 3 résolutions offertes avec un compte gratuit, sans mot de passe.",
    hubCtaIsoBtn: "Voir les résolutions dans l'app →",
    hubCtaEbicsText: "Un code vous bloque ? Les causes et l'action à mener sont dans l'outil EDI Insight : 3 résolutions offertes avec un compte gratuit, sans mot de passe.",
    hubCtaEbicsBtn: "Voir les résolutions dans l'app →",
    openApp: 'Ouvrir EDI Insight →',
    sevBlocking: 'Bloquant', sevInformational: 'Informatif',
    sevError: 'Erreur', sevWarning: 'Avertissement', sevInfo: 'Info',
    keyCode: 'Code', keyCat: 'Catégorie', keySev: 'Sévérité',
    keyIsoCode: 'Code ISO', keyCfonb: 'Code CFONB', keyRetry: 'Rejeu',
    retryYes: 'Possible', retryNo: 'Non recommandé',
    relatedEbics: 'Autres codes de la même catégorie',
    relatedIso: 'Autres motifs de la même famille',
    cat: {
      authentification: 'Authentification', certificat: 'Certificat',
      technique: 'Technique', metier: 'Métier', information: 'Information',
    },
  },
  en: {
    home: 'Home', crumbAria: 'Breadcrumb',
    ebicsHub: 'EBICS reference', isoHub: 'ISO reject reasons',
    ebicsKicker: 'EBICS error code', isoKicker: 'SEPA / ISO 20022 reject code',
    description: 'Description', meaning: 'Meaning',
    causes: 'Common causes', action: 'Recommended action', resolution: 'Resolution',
    lockedLabel: 'Included in the 3 free resolutions', lockedCta: 'Unlock for free, no password →',
    asideEbicsTitle: 'Resolve this code',
    asideEbicsText: 'Precise causes, the full procedure and examples in the EDI Insight app. 3 resolutions free with an account, no password needed.',
    asideIsoTitle: 'Resolve this reason',
    asideIsoText: 'Detailed causes, the full procedure and message examples in the EDI Insight app. 3 resolutions free with an account, no password needed.',
    hubCtaIsoText: 'Stuck on a reject reason? The causes and the step-by-step fix are in the EDI Insight app: 3 resolutions free with an account, no password needed.',
    hubCtaIsoBtn: 'See the resolutions in the app →',
    hubCtaEbicsText: 'Stuck on an EBICS code? The causes and the action to take are in the EDI Insight app: 3 resolutions free with an account, no password needed.',
    hubCtaEbicsBtn: 'See the resolutions in the app →',
    openApp: 'Open EDI Insight →',
    sevBlocking: 'Blocking', sevInformational: 'Informational',
    sevError: 'Error', sevWarning: 'Warning', sevInfo: 'Info',
    keyCode: 'Code', keyCat: 'Category', keySev: 'Severity',
    keyIsoCode: 'ISO code', keyCfonb: 'CFONB code', keyRetry: 'Retry',
    retryYes: 'Possible', retryNo: 'Not recommended',
    relatedEbics: 'Other codes in the same category',
    relatedIso: 'Other reasons in the same family',
    cat: {
      authentification: 'Authentication', certificat: 'Certificate',
      technique: 'Technical', metier: 'Business', information: 'Information',
    },
  },
};

STR.de = {
  home: 'Startseite', crumbAria: 'Brotkrümelnavigation',
  ebicsHub: 'EBICS-Fehlercodes', isoHub: 'ISO-Rückweisungsgründe',
  ebicsKicker: 'EBICS-Fehlercode', isoKicker: 'SEPA- / ISO-20022-Rückweisungscode',
  description: 'Beschreibung', meaning: 'Bedeutung',
  causes: 'Häufige Ursachen', action: 'Empfohlene Maßnahme', resolution: 'Lösungsweg',
  lockedLabel: 'In den 3 kostenlosen Lösungswegen enthalten',
  lockedCta: 'Kostenlos freischalten, ohne Passwort →',
  asideEbicsTitle: 'Diesen Code lösen',
  asideEbicsText: 'Genaue Ursachen, vollständiger Lösungsweg und Beispiele in der App EDI Insight. 3 Lösungswege kostenlos mit einem Konto, ohne Passwort.',
  asideIsoTitle: 'Diesen Grund lösen',
  asideIsoText: 'Ausführliche Ursachen, vollständiger Lösungsweg und Beispielnachrichten in der App EDI Insight. 3 Lösungswege kostenlos mit einem Konto, ohne Passwort.',
  hubCtaIsoText: 'Ein Grund blockiert Sie? Ursachen und Lösungsweg stehen in der App EDI Insight: 3 Lösungswege kostenlos mit einem Konto, ohne Passwort.',
  hubCtaIsoBtn: 'Lösungswege in der App ansehen →',
  hubCtaEbicsText: 'Ein Code blockiert Sie? Ursachen und Maßnahme stehen in der App EDI Insight: 3 Lösungswege kostenlos mit einem Konto, ohne Passwort.',
  hubCtaEbicsBtn: 'Lösungswege in der App ansehen →',
  openApp: 'EDI Insight öffnen →',
  sevBlocking: 'Blockierend', sevInformational: 'Hinweis',
  sevError: 'Fehler', sevWarning: 'Warnung', sevInfo: 'Info',
  keyCode: 'Code', keyCat: 'Kategorie', keySev: 'Schweregrad',
  keyIsoCode: 'ISO-Code', keyCfonb: 'CFONB-Code', keyRetry: 'Wiedereinreichung',
  retryYes: 'Möglich', retryNo: 'Nicht empfohlen',
  relatedEbics: 'Weitere Codes derselben Kategorie',
  relatedIso: 'Weitere Gründe derselben Familie',
  cat: {
    authentification: 'Authentifizierung', certificat: 'Zertifikat',
    technique: 'Technik', metier: 'Fachlich', information: 'Information',
  },
};

/** Libellés des deux pages de référentiel, par langue. */
const HUB_STR = {
  fr: {
    ebicsTitle: 'Référentiel des codes erreurs EBICS — Signification et résolution | EDI Insight',
    ebicsDesc: n => `Référentiel complet des ${n} codes erreurs EBICS (9xxxx, 06xxxx, 09xxxx…). Signification, catégorie, versions EBICS 2.5 et 3.0. Résolution dans l'outil EDI Insight.`,
    ebicsKicker: 'Référentiel', ebicsH1: 'Codes erreurs',
    ebicsLede: n => `${n} codes référencés : signification, catégorie, versions EBICS 2.5 et 3.0.`,
    ebicsSearch: 'Rechercher un code ou un mot-clé (ex : 091002, certificat, authentification…)',
    isoTitle: 'Motifs de rejet SEPA ISO 20022 — Signification et résolution | EDI Insight',
    isoDesc: n => `Référentiel complet des ${n} motifs de rejet SEPA ISO 20022, avec leur équivalent CFONB. Signification, causes et résolution dans l'outil EDI Insight.`,
    isoKicker: 'Référentiel SEPA', isoH1: 'Motifs de rejet',
    isoLede: n => `${n} codes référencés : SCT, SCT Inst, Recall, RFRO.`,
    isoSearch: 'Rechercher un code ou un mot-clé (ex : AC01, IBAN, doublon, délai…)',
    inApp: "La résolution complète est disponible dans l'outil EDI Insight.",
    all: 'Tous',
  },
  en: {
    ebicsTitle: 'EBICS error codes reference — meaning and resolution | EDI Insight',
    ebicsDesc: n => `Complete reference of the ${n} EBICS error codes (9xxxx, 06xxxx, 09xxxx…). Meaning, category, EBICS 2.5 and 3.0 versions. Resolution in the EDI Insight app.`,
    ebicsKicker: 'Reference', ebicsH1: 'Error codes',
    ebicsLede: n => `${n} codes listed: meaning, category, EBICS 2.5 and 3.0 versions.`,
    ebicsSearch: 'Search a code or a keyword (e.g. 091002, certificate, authentication…)',
    isoTitle: 'SEPA ISO 20022 reject reasons — meaning and resolution | EDI Insight',
    isoDesc: n => `Complete reference of the ${n} SEPA ISO 20022 reject reasons, with their CFONB equivalent. Meaning, causes and resolution in the EDI Insight app.`,
    isoKicker: 'SEPA reference', isoH1: 'Reject reasons',
    isoLede: n => `${n} codes listed: SCT, SCT Inst, Recall, RFRO.`,
    isoSearch: 'Search a code or a keyword (e.g. AC01, IBAN, duplicate, timeout…)',
    inApp: 'The full resolution is available in the EDI Insight app.',
    all: 'All',
  },
  de: {
    ebicsTitle: 'EBICS-Fehlercodes — Bedeutung und Lösungsweg | EDI Insight',
    ebicsDesc: n => `Vollständige Referenz der ${n} EBICS-Fehlercodes (9xxxx, 06xxxx, 09xxxx…). Bedeutung, Kategorie, Versionen EBICS 2.5 und 3.0. Lösungsweg in der App EDI Insight.`,
    ebicsKicker: 'Referenzdaten', ebicsH1: 'Fehlercodes',
    ebicsLede: n => `${n} erfasste Codes: Bedeutung, Kategorie, Versionen EBICS 2.5 und 3.0.`,
    ebicsSearch: 'Code oder Stichwort suchen (z. B. 091002, Zertifikat, Authentifizierung…)',
    isoTitle: 'SEPA-Rückweisungsgründe nach ISO 20022 — Bedeutung und Lösungsweg | EDI Insight',
    isoDesc: n => `Vollständige Referenz der ${n} SEPA-Rückweisungsgründe nach ISO 20022, mit CFONB-Entsprechung. Bedeutung, Ursachen und Lösungsweg in der App EDI Insight.`,
    isoKicker: 'SEPA-Referenzdaten', isoH1: 'Rückweisungsgründe',
    isoLede: n => `${n} erfasste Codes: SCT, SCT Inst, Recall, RFRO.`,
    isoSearch: 'Code oder Stichwort suchen (z. B. AC01, IBAN, Dublette, Zeitlimit…)',
    inApp: 'Der vollständige Lösungsweg steht in der App EDI Insight.',
    all: 'Alle',
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
    --bg:#0D1117;--bg2:#151B26;--surface:#151B26;--surface2:#1B2332;
    --border:#232C3C;--border2:#313D52;
    --text:#F5F7FA;--muted:#98A2B8;--dim:#727C92;
    --accent:#6FA0F0;--accent2:#3E6BCB;--accent-hover:#8AB3F5;--ink:#0B0E14;
    --signal:#E9B872;--green:#4ED08A;--red:#F0758A;--orange:#F0A348;
    --display:'Archivo','Helvetica Neue',Arial,sans-serif;
    --maxw:1140px;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text);font-family:'IBM Plex Sans',sans-serif;
    line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
  h1,h2,h3,h4{font-family:var(--display);font-weight:700;letter-spacing:-.025em;
    line-height:1.12;text-wrap:balance}
  .eyebrow{font-family:'IBM Plex Mono',monospace;font-size:11.5px;letter-spacing:.16em;
    text-transform:uppercase;color:var(--dim);display:block}
  .wrap{max-width:var(--maxw);margin:0 auto;padding:0 28px;position:relative;z-index:1}
  a{color:inherit;text-decoration:none}
  .mono{font-family:'IBM Plex Mono',monospace}
  .serif{font-family:'Fraunces',serif}
  /* CHROME : bandeau d'actualite, barre utilitaire, navigation */
  .alert{background:var(--surface);border-bottom:1px solid var(--border)}
  .alert .wrap{display:flex;align-items:center;justify-content:center;gap:12px;
    padding:11px 28px;font-size:14px;text-align:center;flex-wrap:wrap;color:var(--muted)}
  .alert .tag{font-family:'IBM Plex Mono',monospace;font-size:10.5px;letter-spacing:.14em;
    text-transform:uppercase;color:var(--signal);border:1px solid rgba(233,184,114,.35);
    border-radius:4px;padding:3px 7px}
  .alert a{color:var(--text);border-bottom:1px solid var(--border2);padding-bottom:1px}
  .alert a:hover{border-color:var(--accent)}
  .util{border-bottom:1px solid var(--border);font-size:13px;color:var(--dim)}
  .util .wrap{display:flex;justify-content:flex-end;gap:22px;padding:8px 28px}
  .util a:hover{color:var(--muted)}
  nav{position:sticky;top:0;z-index:50;background:rgba(13,17,23,.95);
    border-bottom:1px solid var(--border);backdrop-filter:saturate(140%) blur(8px)}
  .nav-in{display:flex;align-items:center;justify-content:space-between;gap:24px;height:72px}
  .brand{display:flex;align-items:center;gap:10px;font-family:'Fraunces',Georgia,serif;
    font-weight:600;font-size:20px;letter-spacing:.01em}
  .brand .bar{width:3px;height:22px;border-radius:2px;background:var(--accent);display:block}
  .nav-links{display:flex;align-items:center;gap:2px;font-size:15px}
  .nav-links>a{color:var(--muted);padding:9px 13px;border-radius:7px;transition:.15s}
  .nav-links>a:hover,.nav-links>a.here{color:var(--text);background:var(--surface)}
  .nav-links>a.btn{color:var(--ink);background:var(--accent);padding:11px 18px;margin-left:10px}
  .nav-links>a.btn:hover{background:var(--accent-hover);color:var(--ink)}
  .navdrop{position:relative}
  .navdropbtn{color:var(--muted);font-size:15px;background:none;border:0;cursor:pointer;
    font-family:'IBM Plex Sans',sans-serif;display:inline-flex;align-items:center;gap:6px;
    padding:9px 13px;border-radius:7px;line-height:1.3;transition:.15s}
  .navdrop:hover .navdropbtn{color:var(--text);background:var(--surface)}
  .navdropbtn svg{width:12px;height:12px;color:var(--dim);transition:transform .2s}
  .navdrop:hover .navdropbtn svg{transform:rotate(180deg)}
  .navdropmenu{display:none;position:absolute;top:calc(100% + 8px);left:0;min-width:300px;
    background:var(--surface);border:1px solid var(--border2);border-radius:12px;padding:8px;
    box-shadow:0 20px 46px rgba(0,0,0,.5);z-index:60}
  .navdrop:hover .navdropmenu,.navdrop:focus-within .navdropmenu{display:block}
  .navdropmenu a{display:block;padding:10px 12px;border-radius:8px;font-size:14.5px;
    color:var(--text);transition:background .15s}
  .navdropmenu a span{display:block;font-size:12.5px;color:var(--dim);margin-top:2px;
    line-height:1.45}
  .navdropmenu a:hover{background:var(--surface2)}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;font-weight:600;
    font-size:15px;padding:12px 20px;border-radius:8px;border:1px solid transparent;
    cursor:pointer;font-family:inherit;transition:background .15s,border-color .15s}
  .btn-primary{background:var(--accent);color:var(--ink)}
  .btn-primary:hover{background:var(--accent-hover)}
  .btn-ghost{border-color:var(--border2);color:var(--text)}
  .btn-ghost:hover{background:var(--surface)}
  :focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:4px}
  @media(prefers-reduced-motion:reduce){*{transition:none!important}}
  @media(max-width:900px){.nav-links>a:not(.btn),.navdrop,.util{display:none}}
  /* ARTICLE */
  .art-wrap{max-width:780px;margin:0 auto}
  .art-lead{font-size:19px;line-height:1.75;color:var(--muted);margin-bottom:34px}
  .art-updated{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.06em;
    text-transform:uppercase;color:var(--dim);margin-bottom:26px}
  /* <nav> est stylé en barre collante plus bas : on annule tout ça pour le
     sommaire de l'article, qui est un simple encart dans le fil du texte. */
  .art-toc{position:static;top:auto;z-index:auto;backdrop-filter:none;
    background:var(--surface);border:1px solid var(--border);border-bottom:1px solid var(--border);
    border-radius:14px;padding:20px 24px;margin-bottom:40px}
  .art-toc h2{font-family:var(--display);font-size:17px;font-weight:600;margin-bottom:12px}
  .art-toc ol{margin:0;padding-left:20px;color:var(--muted);font-size:15px;line-height:1.9}
  .art-toc a{color:var(--accent)}
  .art-toc a:hover{color:var(--text)}
  .art h2{font-family:var(--display);font-size:29px;font-weight:600;line-height:1.25;
    letter-spacing:-.01em;margin:46px 0 16px;scroll-margin-top:96px}
  .art h3{font-size:19px;font-weight:600;margin:30px 0 10px;color:var(--text)}
  .art p{font-size:16.5px;line-height:1.8;color:var(--muted);margin-bottom:16px}
  .art strong{color:var(--text);font-weight:600}
  .art ul,.art ol{margin:0 0 18px 22px;color:var(--muted);font-size:16.5px;line-height:1.8}
  .art ul{list-style:disc;display:block}
  .art ol{list-style:decimal;display:block}
  .art ul li,.art ol li{display:list-item;margin-bottom:9px;font-size:16.5px;
    color:var(--muted);line-height:1.8;gap:0}
  .art-toc ol li{font-size:15px;line-height:1.9;margin-bottom:0}
  .art code{font-family:'IBM Plex Mono',monospace;font-size:14px;color:var(--accent);
    background:rgba(111,160,240,.10);border-radius:5px;padding:2px 6px}
  .art-code{font-family:'IBM Plex Mono',monospace;font-size:13.5px;line-height:1.65;
    background:var(--surface);border:1px solid var(--border);border-radius:12px;
    padding:16px 18px;margin:0 0 20px;overflow-x:auto;color:var(--text)}
  .art-table{width:100%;border-collapse:collapse;margin:0 0 22px;font-size:15px}
  .art-table th{text-align:left;font-size:12.5px;letter-spacing:.06em;text-transform:uppercase;
    color:var(--dim);font-weight:600;padding:10px 12px;border-bottom:1px solid var(--border2)}
  .art-table td{padding:11px 12px;border-bottom:1px solid var(--border);color:var(--muted);
    vertical-align:top;line-height:1.6}
  .art-table td code{white-space:nowrap}
  .art-cta{background:var(--surface);border:1px solid var(--border2);border-radius:16px;
    padding:24px;margin:34px 0;display:flex;flex-wrap:wrap;align-items:center;gap:16px 22px}
  .art-cta p{flex:1 1 320px;margin:0;font-size:15.5px}
  .art-faq{margin-top:18px}
  .art-faq details{background:var(--surface);border:1px solid var(--border);border-radius:12px;
    padding:14px 18px;margin-bottom:10px}
  .art-faq summary{cursor:pointer;font-weight:600;color:var(--text);font-size:16px;line-height:1.5}
  .art-faq details[open] summary{margin-bottom:10px}
  .art-faq p{margin:0}
  .art-note{font-size:14px;color:var(--dim);border-left:2px solid var(--border2);
    padding-left:14px;margin:34px 0 0;line-height:1.7}
  @media(max-width:700px){.art h2{font-size:24px}.art-table{font-size:14px}}
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
  .ref-code{font-family:var(--display);font-weight:600;font-size:52px;line-height:1;
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
  .locked-cta{display:inline-flex;align-items:center;gap:9px;background:var(--accent);
    color:var(--ink);font-weight:600;font-size:14.5px;padding:12px 22px;border-radius:8px;
    transition:background .15s}
  .locked-cta:hover{background:var(--accent-hover)}
  /* RELATED CODES */
  .related-list{list-style:none;margin:0;padding:0;display:grid;gap:2px}
  .related-list a{display:flex;gap:14px;align-items:baseline;padding:9px 10px;
    border-radius:9px;color:var(--text);text-decoration:none;transition:background .15s}
  .related-list a:hover{background:var(--surface2)}
  .related-list .rel-code{font-family:'IBM Plex Mono',monospace;font-size:13.5px;
    color:var(--accent);flex:0 0 auto}
  .related-list .rel-desc{font-size:14px;color:var(--muted);line-height:1.5}
  /* ASIDE CARD */
  .aside-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;
    padding:24px;margin-bottom:20px}
  .aside-card h3{font-family:var(--display);font-size:18px;font-weight:600;margin-bottom:8px}
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
  footer{background:var(--surface);border-top:1px solid var(--border);
    padding:48px 0;margin-top:60px;font-size:14px;color:var(--dim)}
  .foot-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
    gap:30px;margin-bottom:34px}
  .foot-col h4{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.14em;
    text-transform:uppercase;color:var(--dim);font-weight:500;margin-bottom:12px}
  .foot-col a{display:block;color:var(--muted);padding:3px 0;font-size:14px;transition:color .2s}
  .foot-col a:hover{color:var(--text)}
  .foot-legal{border-top:1px solid var(--border);padding-top:20px;display:flex;
    flex-wrap:wrap;gap:8px 24px;justify-content:space-between;font-size:13px}
  /* UL */
  ul{list-style:none;display:flex;flex-direction:column;gap:8px}
  ul li{display:flex;align-items:flex-start;gap:10px;font-size:15px;color:var(--text);line-height:1.6}
  ul li::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--accent);
    flex-shrink:0;margin-top:9px}
`;

// ── Nav & Footer ──────────────────────────────────────────────────────────

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Fraunces:opsz,wght@9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">`;

/**
 * Bandeau d'actualite. Un seul endroit a mettre a jour quand un calendrier
 * bouge : il apparait en tete de toutes les pages generees.
 */
const ALERT = {
  fr: {
    tag: 'Échéances',
    text: "Adresses structurées : Swift et l'EPC ont reporté leurs échéances.",
    linkLabel: 'Lire le point à jour',
  },
  en: {
    tag: 'Deadlines',
    text: 'Structured addresses: Swift and the EPC have postponed their deadlines.',
    linkLabel: 'Read the latest update',
  },
  de: {
    tag: 'Fristen',
    text: 'Strukturierte Adressen: Swift und das EPC haben ihre Fristen verschoben.',
    linkLabel: 'Den aktuellen Stand lesen',
  },
};

function ALERT_BAR(lang = 'fr') {
  const a = ALERT[lang];
  return `<div class="alert">
  <div class="wrap">
    <span class="tag">${a.tag}</span>
    <span>${a.text}</span>
    <a href="${SITE}${PATHS[lang].article}">${a.linkLabel}</a>
  </div>
</div>`;
}

/**
 * Libellés de l'ossature, par langue. Tout ce qui apparaît dans la barre
 * utilitaire, la navigation et le pied de page vit ici.
 */
const CHROME = {
  fr: {
    support: 'Support', contact: 'Nous contacter',
    ebicsMenu: 'Codes erreurs EBICS', ebicsDesc: 'codes, EBICS 2.5 et 3.0',
    isoDesc: 'motifs de rejet, avec leur équivalent CFONB',
    articleMenu: 'Adresses structurées ISO 20022', articleDesc: 'Guide complet, calendriers et champs XML',
    deadlines: 'Suivi des échéances', deadlinesDesc: "Swift, EPC, T2 : l'état du calendrier",
    pricing: 'Tarifs', about: 'À propos', aboutHref: 'a-propos.html',
    openApp: "Ouvrir l'app", allRes: 'Toutes les ressources',
    colProduct: 'Produit', colRef: 'Référentiels', colRes: 'Ressources', colCompany: 'Société',
    terms: "Conditions d'utilisation", privacy: 'Politique de confidentialité',
    legalNotice: 'Mentions légales', appLine: 'Application web et iOS · FR / EN / DE',
  },
  en: {
    support: 'Support', contact: 'Contact',
    ebicsMenu: 'EBICS error codes', ebicsDesc: 'codes, EBICS 2.5 and 3.0',
    isoDesc: 'reject reasons, with their CFONB equivalent',
    articleMenu: 'ISO 20022 structured addresses', articleDesc: 'Complete guide, deadlines and XML fields',
    deadlines: 'Deadline tracking', deadlinesDesc: 'Swift, EPC, T2: the state of the calendar',
    pricing: 'Pricing', about: 'About', aboutHref: 'en/about.html',
    openApp: 'Open the app', allRes: 'All resources',
    colProduct: 'Product', colRef: 'Reference', colRes: 'Resources', colCompany: 'Company',
    terms: 'Terms of use', privacy: 'Privacy policy',
    legalNotice: 'Legal notice', appLine: 'Web and iOS app · FR / EN / DE',
  },
  de: {
    support: 'Support', contact: 'Kontakt',
    ebicsMenu: 'EBICS-Fehlercodes', ebicsDesc: 'Codes, EBICS 2.5 und 3.0',
    isoDesc: 'Rückweisungsgründe, mit CFONB-Entsprechung',
    articleMenu: 'Strukturierte Adressen ISO 20022', articleDesc: 'Vollständiger Leitfaden, Fristen und XML-Felder',
    deadlines: 'Stand der Fristen', deadlinesDesc: 'Swift, EPC, T2: der Kalender',
    pricing: 'Preise', about: 'Über mich', aboutHref: 'de/about.html',
    openApp: 'App öffnen', allRes: 'Alle Ressourcen',
    colProduct: 'Produkt', colRef: 'Referenzdaten', colRes: 'Ressourcen', colCompany: 'Unternehmen',
    terms: 'Nutzungsbedingungen', privacy: 'Datenschutzerklärung',
    legalNotice: 'Impressum', appLine: 'Web- und iOS-App · FR / EN / DE',
  },
};

const LANG_NAME = { fr: 'Français', en: 'English', de: 'Deutsch' };
const SUPPORT_HREF = { fr: 'support.html', en: 'en/support.html', de: 'de/support.html' };
const TERMS_HREF   = { fr: 'Terms.html', en: 'en/Terms.html', de: 'de/Terms.html' };
const PRIVACY_HREF = { fr: 'privacy.html', en: 'en/privacy.html', de: 'de/privacy.html' };

function UTIL_BAR(lang = 'fr') {
  const C = CHROME[lang];
  const others = ['fr', 'en', 'de'].filter(l => l !== lang);
  return `<div class="util">
  <div class="wrap">
    <a href="${SITE}${SUPPORT_HREF[lang]}">${C.support}</a>
    <a href="mailto:support@ediinsight.app">${C.contact}</a>
    ${others.map(l => `<a href="${SITE}${PATHS[l].home}" hreflang="${l}">${LANG_NAME[l]}</a>`).join('\n    ')}
  </div>
</div>`;
}

const CHEV = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;

function NAV(lang = 'fr') {
  const S = STR[lang];
  const P = PATHS[lang];
  const N = NAV_STR[lang];
  const C = CHROME[lang];
  const fr = lang === 'fr';
  const home = SITE + P.home;
  return `${ALERT_BAR(lang)}
${UTIL_BAR(lang)}
<nav>
  <div class="wrap nav-in">
    <a href="${home}" class="brand"><span class="bar"></span>EDI INSIGHT</a>
    <div class="nav-links">
      <div class="navdrop">
        <button class="navdropbtn" type="button">${N.produit}${CHEV}</button>
        <div class="navdropmenu">
          ${PRODUCT[lang].modules.map(m => `<a href="${SITE}${P.produit}${m.slug}/">${m.nav}<span>${m.navDesc}</span></a>`).join('\n          ')}
          <a href="${SITE}${P.produit}">${N.overview}<span>${N.overviewDesc}</span></a>
        </div>
      </div>
      <div class="navdrop">
        <button class="navdropbtn" type="button">${C.colRef}${CHEV}</button>
        <div class="navdropmenu">
          <a href="${SITE}${P.ebics}">${C.ebicsMenu}<span>${DATA[lang].ebics.length} ${C.ebicsDesc}</span></a>
          <a href="${SITE}${P.iso}">${S.isoHub}<span>${DATA[lang].iso.length} ${C.isoDesc}</span></a>
        </div>
      </div>
      <div class="navdrop">
        <button class="navdropbtn" type="button">${N.ressources}${CHEV}</button>
        <div class="navdropmenu">
          <a href="${SITE}${P.article}">${C.articleMenu}<span>${C.articleDesc}</span></a>
          <a href="${SITE}${P.ressources}">${C.deadlines}<span>${C.deadlinesDesc}</span></a>
          ${fr ? `<a href="${SITE}guide.html">Guide de prise en main<span>Premiers pas dans l'outil</span></a>
          <a href="${SITE}telecharger">Télécharger<span>Application iOS et version web</span></a>` : ''}
        </div>
      </div>
      <a href="${home}#pro">${C.pricing}</a>
      <a href="${SITE}${C.aboutHref}">${C.about}</a>
      <a class="btn btn-primary" href="${APP}${lang === 'en' ? '?lang=en' : ''}" target="_blank" rel="noopener">${C.openApp}</a>
    </div>
  </div>
</nav>`;
}

function FOOTER(lang = 'fr') {
  const S = STR[lang];
  const P = PATHS[lang];
  const C = CHROME[lang];
  const fr = lang === 'fr';
  return `<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-col">
        <h4>${C.colProduct}</h4>
        ${PRODUCT[lang].modules.map(m => `<a href="${SITE}${P.produit}${m.slug}/">${m.nav}</a>`).join('\n        ')}
      </div>
      <div class="foot-col">
        <h4>${C.colRef}</h4>
        <a href="${SITE}${P.ebics}">${S.ebicsHub}</a>
        <a href="${SITE}${P.iso}">${S.isoHub}</a>
      </div>
      <div class="foot-col">
        <h4>${C.colRes}</h4>
        <a href="${SITE}${P.article}">${C.articleMenu}</a>
        <a href="${SITE}${P.ressources}">${C.allRes}</a>
        ${fr ? `<a href="${SITE}guide.html">Guide de prise en main</a>
        <a href="${SITE}telecharger">Télécharger</a>` : ''}
        <a href="https://apps.apple.com/app/edi-insight/id6769721055" target="_blank" rel="noopener">App Store</a>
      </div>
      <div class="foot-col">
        <h4>${C.colCompany}</h4>
        <a href="${SITE}${C.aboutHref}">${C.about}</a>
        <a href="${SITE}${TERMS_HREF[lang]}">${C.terms}</a>
        <a href="${SITE}${PRIVACY_HREF[lang]}">${C.privacy}</a>
        ${fr ? `<a href="${SITE}mentions-legales.html">${C.legalNotice}</a>` : ''}
        <a href="${SITE}${SUPPORT_HREF[lang]}">${C.support}</a>
      </div>
    </div>
    <div class="foot-legal">
      <span>© 2026 EDI Insight · Voisin Alexandre, entrepreneur individuel · Issy-les-Moulineaux · SIRET 104 758 826 00010</span>
      <span class="mono">${C.appLine}</span>
    </div>
  </div>
</footer>`;
}

const ANALYTICS = `<script data-goatcounter="https://ediinsight-app.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>`;

// ── Shared head builder ───────────────────────────────────────────────────

function head({ title, desc, canonical, ogTitle, lang = 'fr', alt, paywalled = false, article = null }) {
  // hreflang : indispensable pour que Google comprenne que /en/… est la
  // TRADUCTION de la page française, et non un doublon à pénaliser.
  const hreflang = !alt ? '' : Object.keys(alt)
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
  "publisher": {"@type":"Organization","name":"EDI Insight","url":"https://ediinsight.app"}${article ? `,
  "datePublished": "${article.published}",
  "dateModified": "${article.modified}"` : ''}${paywalled ? `,
  "isAccessibleForFree": false,
  "hasPart": [{
    "@type": "WebPageElement",
    "isAccessibleForFree": false,
    "cssSelector": ".locked-content"
  }]` : ''}
}
</script>
${FONTS}
<style>${SHARED_CSS}${PRODUCT_CSS}${SIMPLE_CSS}</style>
</head>
<body>`;
}

// ── Codes liés (maillage interne) ─────────────────────────────────────────

/** Rend le bloc « codes liés ». Vide si aucun voisin : pas de section fantôme. */
function relatedSection(title, items) {
  if (!items.length) return '';
  return `
<div class="ref-section">
  <div class="ref-section-title">${esc(title)}</div>
  <div class="ref-section-box">
    <ul class="related-list">
      ${items.map(i => `<li><a href="${i.href}"><span class="rel-code">${esc(i.code)}</span><span class="rel-desc">${esc(i.text)}</span></a></li>`).join('\n      ')}
    </ul>
  </div>
</div>`;
}

/** Voisins EBICS : même catégorie, code courant exclu, 6 au plus. */
function relatedEbicsItems(c, lang) {
  return DATA[lang].ebics
    .filter(x => x.code !== c.code && x.category === c.category)
    .slice(0, 6)
    .map(x => ({ code: x.code, text: truncate(x.description || '', 9),
                 href: '/' + PATHS[lang].ebics + x.code + '/' }));
}

/** Voisins ISO : au moins une famille en commun, code courant exclu, 6 au plus. */
function relatedIsoItems(c, lang) {
  const fams = c.families || [c.family];
  return DATA[lang].iso
    .filter(x => x.isoCode !== c.isoCode
                 && (x.families || [x.family]).some(f => fams.includes(f)))
    .slice(0, 6)
    .map(x => ({ code: x.isoCode,
                 text: truncate(x.plainLanguageLabel || x.standardLabel || '', 9),
                 href: '/' + PATHS[lang].iso + x.isoCode + '/' }));
}

// ── Locked section builder ────────────────────────────────────────────────

function lockedSection(title, innerHtml, lang = 'fr', kind, code) {
  const S = STR[lang];
  return `
<div class="locked-section" aria-label="${esc(title)}">
  <div class="ref-section-title">${esc(title)}</div>
  <div class="locked-content" aria-hidden="true">
    ${innerHtml}
  </div>
  <div class="locked-overlay">
    <span class="locked-label">${S.lockedLabel}</span>
    <a class="locked-cta" href="${appUrl(lang, kind, code)}"
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
                lang, alt: altEbics(c.code), paywalled: true }) + `
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
        ${lockedSection(S.causes, ulHtml(c.causes), lang, 'ebics', c.code)}

        <!-- ACTION — FLOUTÉE -->
        ${lockedSection(S.action, `<p style="font-size:15px;line-height:1.7">${esc(c.action)}</p>`, lang, 'ebics', c.code)}

        <!-- CODES LIÉS — MAILLAGE INTERNE -->
        ${relatedSection(S.relatedEbics, relatedEbicsItems(c, lang))}

      </div>

      <aside class="ref-aside">
        <div class="aside-card">
          <h3>${S.asideEbicsTitle}</h3>
          <p>${S.asideEbicsText}</p>
          <a class="btn btn-primary" style="width:100%;justify-content:center"
             href="${appUrl(lang, 'ebics', c.code)}"
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
  // La description Google ne redonne pas la signification (déjà dans le titre) :
  // elle promet ce que la page apporte en plus, pour donner une raison de cliquer.
  const metaDesc  = lang === 'en'
    ? `SEPA reject ${c.isoCode} (${title}): why it happens, what to check and how to fix it. Causes and step-by-step fix in EDI Insight, 3 resolutions free.`
    : `Rejet SEPA ${c.isoCode} (${title}) : pourquoi ce rejet arrive, quoi vérifier et comment régulariser. Causes et marche à suivre dans EDI Insight, 3 résolutions offertes.`;

  const usageHtml = c.usageRules
    ? `<p style="font-size:14.5px;color:var(--muted);line-height:1.7;white-space:pre-line">${esc(c.usageRules)}</p>`
    : '';

  return head({ title: pageTitle, desc: metaDesc, canonical,
                lang, alt: altIso(c.isoCode), paywalled: true }) + `
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
          ? lockedSection(S.causes, ulHtml(c.likelyCauses), lang, 'iso', c.isoCode)
          : ''}

        <!-- ACTIONS — FLOUTÉES -->
        ${c.recommendedActions && c.recommendedActions.length
          ? lockedSection(S.resolution, ulHtml(c.recommendedActions), lang, 'iso', c.isoCode)
          : ''}

        <!-- MOTIFS LIÉS — MAILLAGE INTERNE -->
        ${relatedSection(S.relatedIso, relatedIsoItems(c, lang))}

      </div>

      <aside class="ref-aside">
        <div class="aside-card">
          <h3>${S.asideIsoTitle}</h3>
          <p>${S.asideIsoText}</p>
          <a class="btn btn-primary" style="width:100%;justify-content:center"
             href="${appUrl(lang, 'iso', c.isoCode)}"
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
// ARTICLE — Adresses structurées
// ══════════════════════════════════════════════════════════════════════════

/**
 * Article de référence, une page par langue. Deux données structurées :
 * `Article` (avec dateModified, que Google affiche) et `FAQPage`, qui rend la
 * FAQ éligible aux résultats enrichis — aucun concurrent n'en publie.
 */
function articlePage(lang = 'fr') {
  const S = STR[lang], P = PATHS[lang], A = ARTICLE[lang];
  const canonical = SITE + P.article;
  const ALT = { fr: PATHS.fr.article, en: PATHS.en.article };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: A.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const toc = A.sections.map((sec, i) =>
    `<li><a href="#${sec.id}">${esc(sec.h2)}</a></li>`).join('\n      ');

  const body = A.sections.map((sec) => {
    const mid = sec.id === 'cfonb' ? `
<div class="art-cta">
  <p>${A.ctaMid.text}</p>
  <a class="btn btn-primary" href="${appUrl(lang, 'converter')}" target="_blank" rel="noopener">${A.ctaMid.btn}</a>
</div>` : '';
    return `
<h2 id="${sec.id}">${esc(sec.h2)}</h2>
${sec.html}${mid}`;
  }).join('\n');

  const faq = A.faq.map(f => `
  <details>
    <summary>${esc(f.q)}</summary>
    <p>${esc(f.a)}</p>
  </details>`).join('');

  return head({ title: A.metaTitle, desc: A.metaDesc, canonical, lang, alt: ALT,
                article: { published: '2026-09-17', modified: A.updated } }) + `
<script type="application/ld+json">
${JSON.stringify(faqLd, null, 2)}
</script>
${NAV(lang)}
<main>
  <div class="wrap art-wrap">
    <nav class="breadcrumb" aria-label="${S.crumbAria}">
      <a href="${SITE}${P.home}">${S.home}</a>
      <span class="sep">›</span>
      <span>${esc(A.h1)}</span>
    </nav>

    <header class="ref-head">
      <p class="ref-kicker">${esc(A.kicker)}</p>
      <h1 class="serif" style="font-size:42px;font-weight:600;line-height:1.15;letter-spacing:-.02em;margin-bottom:14px">${esc(A.h1)}</h1>
      <p style="font-size:18px;color:var(--muted);margin-bottom:0">${esc(A.sub)}</p>
    </header>

    <article class="art">
      <p class="art-updated">${esc(A.updatedPrefix)} ${esc(A.updatedLabel)}</p>
      <p class="art-lead">${esc(A.lead)}</p>

      <nav class="art-toc" aria-label="${esc(A.tocTitle)}">
        <h2>${esc(A.tocTitle)}</h2>
        <ol>
      ${toc}
        </ol>
      </nav>
${body}

      <h2 id="faq">${esc(A.faqTitle)}</h2>
      <div class="art-faq">${faq}
      </div>

      <div class="art-cta">
        <p><strong>${esc(A.ctaEnd.title)}.</strong> ${esc(A.ctaEnd.text)}</p>
        <a class="btn btn-primary" href="${appUrl(lang, 'converter')}" target="_blank" rel="noopener">${esc(A.ctaEnd.btn)}</a>
      </div>

      <p class="art-note">${esc(A.note)}</p>
    </article>
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
  const HUB_ALT = ALT_EBICS_HUB;
  const canonical = SITE + P.ebics;
  const H = HUB_STR[lang];
  const pageTitle = H.ebicsTitle;
  const metaDesc  = H.ebicsDesc(D.length);

  const categories = [...new Set(D.map(c => c.category))].sort();

  const cards = D.map(c => {
    const catLabel = catLabelFor(lang, c.category);
    const sevClass = c.severity === 'blocking' ? 'badge-blocking' : 'badge-info';
    const sevLabel = c.severity === 'blocking' ? S.sevBlocking : S.sevInfo;
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
    const label = cat === 'Tous' ? H.all : catLabelFor(lang, cat);
    return `<button class="hub-filter${cat === 'Tous' ? ' active' : ''}" onclick="filter('${cat}')">${esc(label)}</button>`;
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
      <p class="ref-kicker">${esc(H.ebicsKicker)}</p>
      <h1 style="font-size:48px;letter-spacing:-.025em;margin-bottom:16px">
        ${esc(H.ebicsH1)} <em style="font-style:italic;color:var(--accent)">EBICS</em>
      </h1>
      <p style="font-size:17px;color:var(--muted);max-width:580px;margin-bottom:32px">
        ${esc(H.ebicsLede(D.length))} ${esc(H.inApp)}
      </p>

      <div class="aside-card" style="max-width:680px;margin-bottom:28px;display:flex;flex-wrap:wrap;align-items:center;gap:14px 20px">
        <p style="flex:1 1 320px;font-size:15px;color:var(--muted);margin:0">${S.hubCtaEbicsText}</p>
        <a class="btn btn-primary" href="${appUrl(lang, 'ebics')}" target="_blank" rel="noopener">${S.hubCtaEbicsBtn}</a>
      </div>

      <div class="hub-search-wrap">
        <input class="hub-search" type="search" id="q"
          placeholder="${esc(H.ebicsSearch)}"
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
  const HUB_ALT = ALT_ISO_HUB;
  const canonical = SITE + P.iso;
  const H = HUB_STR[lang];
  const pageTitle = H.isoTitle;
  const metaDesc  = H.isoDesc(D.length);

  const families = [...new Set(D.flatMap(c => c.families || [c.family]))].sort();

  const cards = D.map(c => {
    const fams = c.families || [c.family];
    const title = c.plainLanguageLabel || c.standardLabel;
    const sevClass = c.severity === 'error' ? 'badge-blocking' : c.severity === 'warning' ? 'badge-warning' : 'badge-info';
    const sevLabel = c.severity === 'error' ? S.sevError : c.severity === 'warning' ? S.sevWarning : S.sevInfo;
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
    const label = fam === 'Tous' ? H.all : fam;
    return `<button class="hub-filter${fam === 'Tous' ? ' active' : ''}" onclick="filter('${esc(fam)}')">${esc(label)}</button>`;
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
      <p class="ref-kicker">${esc(H.isoKicker)}</p>
      <h1 style="font-size:48px;letter-spacing:-.025em;margin-bottom:16px">
        ${esc(H.isoH1)} <em style="font-style:italic;color:var(--accent)">ISO 20022</em>
      </h1>
      <p style="font-size:17px;color:var(--muted);max-width:580px;margin-bottom:32px">
        ${esc(H.isoLede(D.length))} ${esc(H.inApp)}
      </p>

      <div class="aside-card" style="max-width:680px;margin-bottom:28px;display:flex;flex-wrap:wrap;align-items:center;gap:14px 20px">
        <p style="flex:1 1 320px;font-size:15px;color:var(--muted);margin:0">${S.hubCtaIsoText}</p>
        <a class="btn btn-primary" href="${appUrl(lang, 'iso')}" target="_blank" rel="noopener">${S.hubCtaIsoBtn}</a>
      </div>

      <div class="hub-search-wrap">
        <input class="hub-search" type="search" id="q"
          placeholder="${esc(H.isoSearch)}"
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
const ALT_EBICS_HUB = { fr: PATHS.fr.ebics, en: PATHS.en.ebics, de: PATHS.de.ebics };
const ALT_ARTICLE   = { fr: PATHS.fr.article, en: PATHS.en.article, de: PATHS.de.article };
const ALT_ISO_HUB   = { fr: PATHS.fr.iso, en: PATHS.en.iso, de: PATHS.de.iso };
const ALT_PRODUIT_HUB = { fr: PATHS.fr.produit, en: PATHS.en.produit, de: PATHS.de.produit };
const ALT_RESSOURCES  = { fr: PATHS.fr.ressources, en: PATHS.en.ressources, de: PATHS.de.ressources };
/** Les modules se correspondent par leur rang dans les trois fichiers de données. */
const ALT_MODULE = PRODUCT.fr.modules.map((m, i) => ({
  fr: PATHS.fr.produit + m.slug + '/',
  en: PATHS.en.produit + PRODUCT.en.modules[i].slug + '/',
  de: PATHS.de.produit + PRODUCT.de.modules[i].slug + '/',
}));

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
  { url: 'produit/',             prio: '0.9', freq: 'monthly', alt: ALT_PRODUIT_HUB },
  { url: 'produit/validation-fichiers-sepa/', prio: '0.8', freq: 'monthly', alt: ALT_MODULE[0] },
  { url: 'produit/convertisseur-adresses/',   prio: '0.8', freq: 'monthly', alt: ALT_MODULE[1] },
  { url: 'produit/generateur-fichiers/',      prio: '0.8', freq: 'monthly', alt: ALT_MODULE[2] },
  { url: 'produit/diagnostic-rejets/',        prio: '0.8', freq: 'monthly', alt: ALT_MODULE[3] },
  { url: 'ressources/',          prio: '0.8', freq: 'weekly',  alt: ALT_RESSOURCES },
  { url: 'en/product/',          prio: '0.8', freq: 'monthly', alt: ALT_PRODUIT_HUB },
  { url: 'en/product/sepa-file-validation/', prio: '0.7', freq: 'monthly', alt: ALT_MODULE[0] },
  { url: 'en/product/address-converter/',    prio: '0.7', freq: 'monthly', alt: ALT_MODULE[1] },
  { url: 'en/product/file-generator/',       prio: '0.7', freq: 'monthly', alt: ALT_MODULE[2] },
  { url: 'en/product/reject-diagnosis/',     prio: '0.7', freq: 'monthly', alt: ALT_MODULE[3] },
  { url: 'en/resources/',        prio: '0.7', freq: 'weekly',  alt: ALT_RESSOURCES },
  { url: 'de/produkt/',          prio: '0.8', freq: 'monthly', alt: ALT_PRODUIT_HUB },
  { url: 'de/produkt/sepa-dateipruefung/',     prio: '0.7', freq: 'monthly', alt: ALT_MODULE[0] },
  { url: 'de/produkt/adressumwandlung/',       prio: '0.7', freq: 'monthly', alt: ALT_MODULE[1] },
  { url: 'de/produkt/dateigenerator/',         prio: '0.7', freq: 'monthly', alt: ALT_MODULE[2] },
  { url: 'de/produkt/rueckweisungsdiagnose/',  prio: '0.7', freq: 'monthly', alt: ALT_MODULE[3] },
  { url: 'de/ressourcen/',       prio: '0.7', freq: 'weekly',  alt: ALT_RESSOURCES },
  { url: 'adresses-structurees/',    prio: '0.9', freq: 'weekly', alt: ALT_ARTICLE },
  { url: 'en/structured-addresses/', prio: '0.8', freq: 'weekly', alt: ALT_ARTICLE },
  { url: 'de/strukturierte-adressen/', prio: '0.8', freq: 'weekly', alt: ALT_ARTICLE },
  { url: 'de/ebics-fehlercodes/',      prio: '0.8', freq: 'monthly', alt: ALT_EBICS_HUB },
  { url: 'de/sepa-rueckweisungscodes/',prio: '0.8', freq: 'monthly', alt: ALT_ISO_HUB },
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
  for (const lang of ['fr', 'en', 'de']) {
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
// PAGES PRODUIT — une par module, + la vue d'ensemble /produit/.
// Le contenu éditorial vit dans data/produit.<lang>.js.
// ══════════════════════════════════════════════════════════════════════════

const PRODUCT_CSS = `
  .appstore{display:inline-flex;align-items:center;gap:10px;border:1px solid var(--border2);
    border-radius:8px;padding:9px 16px;color:var(--text)}
  .appstore svg{width:22px;height:22px}
  .appstore .small{font-size:10.5px;color:var(--dim);display:block;line-height:1.2}
  .appstore .big{font-size:14.5px;font-weight:600}
  .final{padding:64px 0}
  .final-in{display:flex;flex-wrap:wrap;gap:22px;align-items:center;justify-content:space-between}
  .final h2{font-size:clamp(24px,3vw,32px);max-width:24ch}
  .final p{color:var(--muted);margin-top:10px;max-width:56ch}
  .actions{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
  .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(248px,1fr));gap:18px}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:14px;
    overflow:hidden;display:flex;flex-direction:column;transition:border-color .2s}
  a.card:hover{border-color:var(--border2)}
  .card .shot{background:var(--bg);border-bottom:1px solid var(--border);padding:16px;
    min-height:134px;font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--muted);
    line-height:1.75}
  .card .ln{display:flex;gap:9px;align-items:baseline}
  .card .ko{color:var(--red)}.card .ok{color:var(--green)}.card .wn{color:var(--signal)}
  .card .body{padding:18px 20px 22px}
  .card h3{font-family:'IBM Plex Sans',sans-serif;font-size:16.5px;font-weight:600;
    letter-spacing:0;line-height:1.35;margin-bottom:8px}
  .card p{font-size:14.5px;color:var(--muted);line-height:1.6}
  .card .lnk{margin-top:14px;display:inline-block;font-size:14.5px;color:var(--accent)}
  .prod-head{padding:56px 0 34px}
  .prod-head h1{font-size:clamp(32px,4.6vw,50px);max-width:20ch;margin:14px 0 18px}
  .prod-lead{font-size:18.5px;color:var(--muted);max-width:62ch;line-height:1.75;margin-bottom:26px}
  .prod-body{display:grid;grid-template-columns:1fr 320px;gap:46px;align-items:start;
    padding-bottom:70px}
  .prod-main h2{font-size:26px;margin:44px 0 14px}
  .prod-main h2:first-child{margin-top:0}
  .prod-main p{font-size:16.5px;color:var(--muted);line-height:1.8;margin-bottom:16px}
  .prod-main code{font-family:'IBM Plex Mono',monospace;font-size:14px;color:var(--accent);
    background:rgba(111,160,240,.10);border-radius:5px;padding:2px 6px}
  .prod-list{list-style:none;display:block;margin:0 0 18px;padding:0}
  .prod-list li{display:flex;gap:12px;align-items:flex-start;font-size:16px;color:var(--muted);
    line-height:1.7;padding:9px 0;border-bottom:1px solid var(--border)}
  .prod-list li::before{content:"";width:6px;height:6px;border-radius:50%;
    background:var(--accent);flex-shrink:0;margin-top:11px}
  .prod-list li b{color:var(--text);font-weight:600}
  .prod-inline{display:inline-block;color:var(--accent);font-size:15.5px;margin-bottom:10px}
  .prod-aside{position:sticky;top:96px;display:grid;gap:16px}
  .prod-faq{border-top:1px solid var(--border);padding:44px 0 0}
  .prod-faq h2{font-size:26px;margin-bottom:18px}
  .prod-other{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;
    padding:36px 0 70px}
  .prod-other a{border:1px solid var(--border);border-radius:12px;padding:16px 18px;
    background:var(--surface);transition:border-color .2s}
  .prod-other a:hover{border-color:var(--border2)}
  .prod-other .t{font-size:15px;font-weight:600;margin-bottom:4px}
  .prod-other .d{font-size:13.5px;color:var(--dim);line-height:1.5}
  @media(max-width:900px){.prod-body{grid-template-columns:1fr;gap:30px}.prod-aside{position:static}}
`;

function crumb(lang, items) {
  const S = STR[lang];
  const parts = [`<a href="${SITE}${PATHS[lang].home}">${S.home}</a>`];
  items.forEach((it, i) => {
    parts.push('<span class="sep">/</span>');
    parts.push(it.href ? `<a href="${it.href}">${esc(it.label)}</a>` : `<span>${esc(it.label)}</span>`);
  });
  return `<div class="wrap"><nav class="breadcrumb" aria-label="${S.crumbAria}">${parts.join('')}</nav></div>`;
}

function resolveHref(lang, href) {
  const P = PATHS[lang];
  if (href === 'ARTICLE') return SITE + P.article;
  if (href === 'ISO') return SITE + P.iso;
  if (href === 'EBICS') return SITE + P.ebics;
  return href;
}

const NAV_STR = {
  fr: { produit: 'Produit', ressources: 'Ressources', overview: "Vue d'ensemble",
        overviewDesc: 'Les quatre modules en une page', others: 'Voir les autres modules',
        faq: 'Questions fréquentes', tryTitle: 'Essayer sur un vrai fichier',
        tryText: "Le traitement s'exécute dans votre navigateur : rien n'est transmis ni stocké. La validation et les référentiels sont gratuits.",
        refTitle: 'Les référentiels', ebicsKey: 'Codes erreurs EBICS', isoKey: 'Motifs de rejet ISO',
        addrKey: 'Adresses structurées', guideVal: 'Guide →' },
  en: { produit: 'Product', ressources: 'Resources', overview: 'Overview',
        overviewDesc: 'The four modules on one page', others: 'See the other modules',
        faq: 'Frequently asked questions', tryTitle: 'Try it on a real file',
        tryText: 'Processing runs in your browser: nothing is transmitted or stored. Validation and the reference data are free.',
        refTitle: 'Reference data', ebicsKey: 'EBICS error codes', isoKey: 'ISO reject reasons',
        addrKey: 'Structured addresses', guideVal: 'Guide →' },
  de: { produit: 'Produkt', ressources: 'Ressourcen', overview: 'Überblick',
        overviewDesc: 'Die vier Module auf einer Seite', others: 'Die anderen Module ansehen',
        faq: 'Häufige Fragen', tryTitle: 'An einer echten Datei testen',
        tryText: 'Die Verarbeitung läuft in Ihrem Browser: nichts wird übertragen oder gespeichert. Prüfung und Referenzdaten sind kostenlos.',
        refTitle: 'Die Referenzdaten', ebicsKey: 'EBICS-Fehlercodes', isoKey: 'ISO-Rückweisungsgründe',
        addrKey: 'Strukturierte Adressen', guideVal: 'Leitfaden →' },
};

function productPage(mod, lang = 'fr') {
  const PR = PRODUCT[lang];
  const P = PATHS[lang];
  const N = NAV_STR[lang];
  const idx = PR.modules.indexOf(mod);
  const canonical = `${SITE}${P.produit}${mod.slug}/`;
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: mod.faq.map(f => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const body = mod.sections.map(sec => {
    const list = sec.list ? `<ul class="prod-list">${sec.list.map(li => `<li><span>${li}</span></li>`).join('')}</ul>` : '';
    const p = sec.p ? `<p>${sec.p}</p>` : '';
    const link = sec.link ? `<a class="prod-inline" href="${resolveHref(lang, sec.link.href)}">${esc(sec.link.label)} →</a>` : '';
    const links = sec.links ? sec.links.map(l => `<a class="prod-inline" style="display:block" href="${resolveHref(lang, l.href)}">${esc(l.label)} →</a>`).join('') : '';
    return `<h2>${esc(sec.h2)}</h2>${p}${list}${link}${links}`;
  }).join('\n');

  const faq = mod.faq.map(f => `
  <details>
    <summary>${esc(f.q)}</summary>
    <p>${esc(f.a)}</p>
  </details>`).join('');

  const others = PR.modules.filter(m => m.slug !== mod.slug).map(m => `
    <a href="${SITE}${P.produit}${m.slug}/">
      <div class="t">${esc(m.nav)}</div>
      <div class="d">${esc(m.navDesc)}</div>
    </a>`).join('');

  return head({ title: mod.title, desc: mod.desc, canonical, lang, alt: ALT_MODULE[idx] })
+ `
<script type="application/ld+json">
${JSON.stringify(faqLd, null, 2)}
</script>
${NAV(lang)}
${crumb(lang, [{ label: N.produit, href: SITE + P.produit }, { label: mod.nav }])}
<main class="wrap">
  <header class="prod-head">
    <span class="eyebrow">${esc(mod.kicker)}</span>
    <h1>${esc(mod.h1)}</h1>
    <p class="prod-lead">${esc(mod.lead)}</p>
    <div class="actions">
      <a class="btn btn-primary" href="${APP}${lang === 'en' ? '?lang=en' : ''}" target="_blank" rel="noopener">${esc(HOME[lang].ctaApp)}</a>
      <a class="btn btn-ghost" href="${SITE}${P.produit}">${esc(N.others)}</a>
    </div>
  </header>
  <div class="prod-body">
    <div class="prod-main art">
      ${body}
      <div class="prod-faq art-faq">
        <h2>${esc(N.faq)}</h2>
        ${faq}
      </div>
    </div>
    <aside class="prod-aside">
      <div class="aside-card">
        <h3>${esc(N.tryTitle)}</h3>
        <p>${esc(N.tryText)}</p>
        <a class="btn btn-primary" href="${APP}${lang === 'en' ? '?lang=en' : ''}" target="_blank" rel="noopener">${esc(HOME[lang].ctaApp)}</a>
      </div>
      <div class="aside-card">
        <h3>${esc(N.refTitle)}</h3>
        <div class="aside-row"><span class="aside-key">${esc(N.ebicsKey)}</span><a class="aside-val" href="${SITE}${P.ebics}">${DATA[lang].ebics.length} →</a></div>
        <div class="aside-row"><span class="aside-key">${esc(N.isoKey)}</span><a class="aside-val" href="${SITE}${P.iso}">${DATA[lang].iso.length} →</a></div>
        <div class="aside-row"><span class="aside-key">${esc(N.addrKey)}</span><a class="aside-val" href="${SITE}${P.article}">${esc(N.guideVal)}</a></div>
      </div>
    </aside>
  </div>
  <div class="prod-other">${others}</div>
</main>
${FOOTER(lang)}
${ANALYTICS}
</body>
</html>`;
}

function produitHub(lang = 'fr') {
  const PR = PRODUCT[lang];
  const P = PATHS[lang];
  const canonical = SITE + P.produit;
  const cards = PR.modules.map(m => `
    <a class="card" href="${SITE}${P.produit}${m.slug}/">
      <div class="body">
        <span class="eyebrow">${esc(m.kicker.replace(/^Module — /, ''))}</span>
        <h3 style="margin-top:8px">${esc(m.h1)}</h3>
        <p>${esc(m.teaser || m.lead)}</p>
        <span class="lnk">${lang === 'en' ? 'Explore this module →' : 'Découvrir ce module →'}</span>
      </div>
    </a>`).join('');

  const hubTitle = lang === 'en'
    ? 'The EDI Insight modules — validation, addresses, generation, diagnosis'
    : 'Les modules d’EDI Insight — validation, adresses, génération, diagnostic';
  return head({ title: hubTitle, desc: PR.hubDesc, canonical, lang, alt: ALT_PRODUIT_HUB })
+ `
${NAV(lang)}
${crumb(lang, [{ label: NAV_STR[lang].produit }])}
<main class="wrap">
  <header class="prod-head">
    <span class="eyebrow">${esc(HOME[lang].modules.eyebrow)}</span>
    <h1>${esc(PR.hubTitle)}</h1>
    <p class="prod-lead">${esc(PR.hubDesc)}</p>
    <div class="actions">
      <a class="btn btn-primary" href="${APP}${lang === 'en' ? '?lang=en' : ''}" target="_blank" rel="noopener">${esc(HOME[lang].ctaApp)}</a>
      <a class="btn btn-ghost" href="${SITE}${P.iso}">${esc(HOME[lang].ctaRef)}</a>
    </div>
  </header>
  <div class="cards" style="padding-bottom:70px">${cards}</div>
</main>
${FOOTER(lang)}
${ANALYTICS}
</body>
</html>`;
}

// ── Ressources ────────────────────────────────────────────────────────────

const RES_STR = {
  fr: {
    title: 'Ressources EDI Insight — guides, référentiels et suivi des échéances',
    desc: "Les guides et référentiels d'EDI Insight : adresses structurées ISO 20022, suivi des échéances Swift, EPC et T2, codes erreurs EBICS, motifs de rejet SEPA et prise en main de l'outil.",
    crumb: 'Ressources', eyebrow: 'Ressources',
    h1: 'Guides, référentiels et échéances',
    lead: "Tout ce qui est publié librement sur le site, au même endroit : les guides de fond, les deux référentiels de codes et l'état des calendriers de migration.",
    guideTag: 'Guide de référence', refTag: 'Référentiel', startTag: 'Prise en main',
    articleH3: 'Adresses structurées ISO 20022',
    articleP: "Les deux calendriers, les champs XML, les règles de transposition du guide CFONB, les pièges et une FAQ. Mis à jour le ",
    articleCta: 'Lire le guide →',
    ebicsH3: 'codes erreurs EBICS',
    ebicsP: "EBICS 2.5 et 3.0, classés par catégorie et sévérité, avec le libellé normalisé, les causes fréquentes et l'action recommandée.",
    isoH3: 'motifs de rejet ISO 20022',
    isoP: "Les motifs des virements et prélèvements SEPA, avec leur équivalent CFONB, qui doit agir et si le rejeu est possible.",
    refCta: 'Ouvrir le référentiel →',
    startH3: 'Guide de prise en main',
    startP: "Les premiers pas dans l'outil : déposer un fichier, lire un rapport, convertir un lot d'adresses.",
    tableH2: 'État des échéances',
    th: ['Échéance', 'Périmètre', 'Statut au '],
    rows: [
      ['Swift', 'Paiements cross-border, adresses structurées', "Reportée le 27 août 2026, nouvelle date annoncée d'ici décembre 2026"],
      ['EPC', 'Virements et prélèvements SEPA', 'Échéance du 15 novembre 2026 levée le 9 septembre 2026, nouvelle date attendue'],
      ['T2 / TIPS', 'Paiements de gros montant', 'Release décalée du 14 au 28 novembre 2026, tolérance temporaire'],
      ['Allemagne, Luxembourg', 'Formats de fichiers clients', '15 novembre 2026 maintenu à ce jour'],
    ],
    note: "Ce tableau est tenu à jour avec le guide des adresses structurées. Une date qui bouge y apparaît le jour même.",
  },
  en: {
    title: 'EDI Insight resources — guides, reference data and deadline tracking',
    desc: "The EDI Insight guides and reference data: ISO 20022 structured addresses, Swift, EPC and T2 deadline tracking, EBICS error codes, SEPA reject reasons and getting started.",
    crumb: 'Resources', eyebrow: 'Resources',
    h1: 'Guides, reference data and deadlines',
    lead: 'Everything published freely on the site, in one place: the in-depth guides, both code reference sets and the state of the migration calendars.',
    guideTag: 'Reference guide', refTag: 'Reference data', startTag: 'Getting started',
    articleH3: 'ISO 20022 structured addresses',
    articleP: 'Both calendars, the XML fields, the CFONB mapping rules, the traps and an FAQ. Updated on ',
    articleCta: 'Read the guide →',
    ebicsH3: 'EBICS error codes',
    ebicsP: 'EBICS 2.5 and 3.0, sorted by category and severity, with the standard label, the common causes and the recommended action.',
    isoH3: 'ISO 20022 reject reasons',
    isoP: 'The reasons for SEPA credit transfers and direct debits, with their CFONB equivalent, who should act and whether a retry is possible.',
    refCta: 'Open the reference set →',
    startH3: 'Getting started guide',
    startP: 'First steps in the tool: drop in a file, read a report, convert a batch of addresses.',
    tableH2: 'Deadline status',
    th: ['Deadline', 'Scope', 'Status on '],
    rows: [
      ['Swift', 'Cross-border payments, structured addresses', 'Postponed on 27 August 2026, new date to be announced by December 2026'],
      ['EPC', 'SEPA credit transfers and direct debits', 'The 15 November 2026 deadline was lifted on 9 September 2026, new date expected'],
      ['T2 / TIPS', 'Large-value payments', 'Release moved from 14 to 28 November 2026, temporary tolerance'],
      ['Germany, Luxembourg', 'Customer file formats', '15 November 2026 maintained to date'],
    ],
    note: 'This table is kept in step with the structured addresses guide. A date that moves appears here the same day.',
  },
  de: {
    title: 'EDI-Insight-Ressourcen — Leitfäden, Referenzdaten und Fristen',
    desc: 'Die Leitfäden und Referenzdaten von EDI Insight: strukturierte Adressen nach ISO 20022, Stand der Fristen von Swift, EPC und T2, EBICS-Fehlercodes und SEPA-Rückweisungsgründe.',
    crumb: 'Ressourcen', eyebrow: 'Ressourcen',
    h1: 'Leitfäden, Referenzdaten und Fristen',
    lead: 'Alles, was auf der Website frei verfügbar ist, an einem Ort: die Leitfäden, beide Code-Referenzdatensätze und der Stand der Migrationskalender.',
    guideTag: 'Referenz-Leitfaden', refTag: 'Referenzdaten', startTag: 'Erste Schritte',
    articleH3: 'Strukturierte Adressen nach ISO 20022',
    articleP: 'Beide Kalender, die XML-Felder, die CFONB-Umsetzungsregeln, die Fallstricke und eine FAQ. Aktualisiert am ',
    articleCta: 'Leitfaden lesen →',
    ebicsH3: 'EBICS-Fehlercodes',
    ebicsP: 'EBICS 2.5 und 3.0, nach Kategorie und Schweregrad, mit normierter Bezeichnung, häufigen Ursachen und empfohlener Maßnahme.',
    isoH3: 'ISO-20022-Rückweisungsgründe',
    isoP: 'Die Gründe bei SEPA-Überweisungen und -Lastschriften, mit CFONB-Entsprechung, wer handeln muss und ob eine Wiedereinreichung möglich ist.',
    refCta: 'Referenzdaten öffnen →',
    startH3: 'Erste Schritte', startP: '',
    tableH2: 'Stand der Fristen',
    th: ['Frist', 'Geltungsbereich', 'Stand am '],
    rows: [
      ['Swift', 'Grenzüberschreitende Zahlungen, strukturierte Adressen', 'Am 27. August 2026 verschoben, neues Datum bis Dezember 2026 angekündigt'],
      ['EPC', 'SEPA-Überweisungen und -Lastschriften', 'Frist zum 15. November 2026 am 9. September 2026 aufgehoben, neues Datum erwartet'],
      ['T2 / TIPS', 'Großbetragszahlungen', 'Release vom 14. auf den 28. November 2026 verschoben, befristete Toleranz'],
      ['Deutschland, Luxemburg', 'Kundendateiformate', '15. November 2026 bleibt bis heute bestehen'],
    ],
    note: 'Diese Tabelle wird gemeinsam mit dem Leitfaden zu strukturierten Adressen gepflegt. Ein verschobenes Datum erscheint hier am selben Tag.',
  },
};

function ressourcesPage(lang = 'fr') {
  const P = PATHS[lang];
  const A = ARTICLE[lang];
  const R = RES_STR[lang];
  const canonical = SITE + P.ressources;
  const maj = fmtDate(A.updated, lang);
  const rows = R.rows.map(([a, b, c]) =>
    `<tr><td><b>${esc(a)}</b></td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join('\n        ');

  return head({ title: R.title, desc: R.desc, canonical, lang, alt: ALT_RESSOURCES })
+ `
${NAV(lang)}
${crumb(lang, [{ label: R.crumb }])}
<main class="wrap">
  <header class="prod-head">
    <span class="eyebrow">${esc(R.eyebrow)}</span>
    <h1>${esc(R.h1)}</h1>
    <p class="prod-lead">${esc(R.lead)}</p>
  </header>
  <div class="cards" style="padding-bottom:26px">
    <a class="card" href="${SITE}${P.article}">
      <div class="body">
        <span class="eyebrow">${esc(R.guideTag)}</span>
        <h3 style="margin-top:8px">${esc(R.articleH3)}</h3>
        <p>${esc(R.articleP)}${maj}.</p>
        <span class="lnk">${esc(R.articleCta)}</span>
      </div>
    </a>
    <a class="card" href="${SITE}${P.ebics}">
      <div class="body">
        <span class="eyebrow">${esc(R.refTag)}</span>
        <h3 style="margin-top:8px">${DATA[lang].ebics.length} ${esc(R.ebicsH3)}</h3>
        <p>${esc(R.ebicsP)}</p>
        <span class="lnk">${esc(R.refCta)}</span>
      </div>
    </a>
    <a class="card" href="${SITE}${P.iso}">
      <div class="body">
        <span class="eyebrow">${esc(R.refTag)}</span>
        <h3 style="margin-top:8px">${DATA[lang].iso.length} ${esc(R.isoH3)}</h3>
        <p>${esc(R.isoP)}</p>
        <span class="lnk">${esc(R.refCta)}</span>
      </div>
    </a>
    ${lang !== 'fr' ? '' : `<a class="card" href="${SITE}guide.html">
      <div class="body">
        <span class="eyebrow">${esc(R.startTag)}</span>
        <h3 style="margin-top:8px">${esc(R.startH3)}</h3>
        <p>${esc(R.startP)}</p>
        <span class="lnk">${esc(R.articleCta)}</span>
      </div>
    </a>`}
  </div>
  <section style="padding-bottom:70px">
    <h2 style="font-size:24px;margin:26px 0 16px">${esc(R.tableH2)}</h2>
    <table class="art-table">
      <thead><tr><th>${esc(R.th[0])}</th><th>${esc(R.th[1])}</th><th>${esc(R.th[2])}${maj}</th></tr></thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <p class="art-note">${esc(R.note)}</p>
  </section>
</main>
${FOOTER(lang)}
${ANALYTICS}
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════════════
// ACCUEIL — générée à partir des données : l'inventaire affiché est toujours
// celui des fiches réellement publiées (43 EBICS + 29 ISO aujourd'hui).
// ══════════════════════════════════════════════════════════════════════════

const HOME_CSS = `
  .hero-h{padding:86px 0 70px;border-bottom:1px solid var(--border)}
  .hero-h h1{font-size:clamp(38px,6vw,64px);max-width:16ch;margin:16px 0 22px}
  .hero-h .lead{font-size:19px;color:var(--muted);max-width:60ch;margin-bottom:30px}
  .hero-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:54px;align-items:center}
  .hero-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;
    padding:22px 24px}
  .hc-head{display:flex;align-items:center;gap:13px;padding-bottom:14px;
    border-bottom:1px solid var(--border);margin-bottom:6px}
  .hc-ico{width:38px;height:38px;border-radius:10px;background:var(--surface2);
    border:1px solid var(--border2);display:grid;place-items:center;font-size:13px;color:var(--accent)}
  .hc-title{font-family:'IBM Plex Mono',monospace;font-size:14px;color:var(--text)}
  .hc-sub{font-size:12.5px;color:var(--dim)}
  .hc-row{display:flex;align-items:center;gap:11px;padding:11px 0;
    border-bottom:1px solid var(--border);font-size:14px}
  .hc-st{width:18px;text-align:center;font-size:12px}
  .hc-st.ok,.hc-v.ok{color:var(--green)}
  .hc-st.ko,.hc-v.ko{color:var(--red)}
  .hc-st.wn,.hc-v.wn{color:var(--signal)}
  .hc-l{flex:1;color:var(--muted)}
  .hc-v{font-family:'IBM Plex Mono',monospace;font-size:12.5px;color:var(--text)}
  .hc-foot{font-size:13px;color:var(--dim);padding-top:14px}
  .proof{display:flex;flex-wrap:wrap;gap:14px 34px;margin-top:40px;padding-top:26px;
    border-top:1px solid var(--border);font-size:14.5px;color:var(--dim)}
  .proof b{color:var(--muted);font-weight:500}
  .feature{border-bottom:1px solid var(--border);
    background:linear-gradient(180deg,var(--surface) 0%,var(--bg) 100%)}
  .feature .wrap{padding:56px 28px}
  .fx{display:grid;grid-template-columns:1.25fr .75fr;gap:44px;align-items:center}
  .feature h2{font-size:clamp(26px,3.4vw,38px);margin:14px 0 16px;max-width:22ch}
  .feature p{color:var(--muted);margin-bottom:22px;max-width:56ch;font-size:16px}
  .feature .meta{font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--dim);
    margin-top:18px;display:flex;gap:18px;flex-wrap:wrap}
  .snippet{background:var(--bg);border:1px solid var(--border);border-radius:14px;padding:20px}
  .snippet h4{font-size:12.5px;font-weight:600;letter-spacing:.06em;color:var(--dim);
    text-transform:uppercase;margin-bottom:10px;font-family:'IBM Plex Sans',sans-serif}
  .snippet .row{display:flex;justify-content:space-between;gap:14px;padding:11px 0;
    border-bottom:1px solid var(--border);font-size:14px;color:var(--muted)}
  .snippet .row:last-child{border-bottom:0}
  .snippet .row b{color:var(--text);font-weight:500}
  .snippet .state{font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--signal)}
  .sec{padding:72px 0;border-bottom:1px solid var(--border)}
  .sec-head{max-width:64ch;margin-bottom:38px}
  .sec-head h2{font-size:clamp(27px,3.5vw,39px);margin:12px 0 14px}
  .sec-head p{color:var(--muted);font-size:16.5px}
  .inv{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:22px}
  .inv-box{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:26px}
  .inv-top{display:flex;align-items:baseline;gap:14px;margin-bottom:6px}
  .inv-n{font-family:var(--display);font-size:42px;font-weight:700;line-height:1;
    font-variant-numeric:tabular-nums;letter-spacing:-.03em}
  .inv-t{font-size:16px;font-weight:600}
  .inv-d{color:var(--muted);font-size:15px;margin-bottom:16px}
  .inv-cats{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:18px}
  .inv-cat{font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--muted);
    background:var(--surface2);border:1px solid var(--border2);border-radius:20px;padding:4px 11px}
  .inv-cat b{color:var(--text);font-weight:500}
  .inv-list{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px;max-height:none}
  .inv-list a{font-family:'IBM Plex Mono',monospace;font-size:12.5px;color:var(--accent);
    border:1px solid var(--border);border-radius:6px;padding:4px 9px;transition:.15s;
    background:var(--bg)}
  .inv-list a:hover{border-color:var(--accent);background:var(--surface2)}
  .inv-what{border-top:1px solid var(--border);padding-top:16px;font-size:14px;color:var(--muted)}
  .inv-what b{color:var(--text);font-weight:500}
  .cover{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px}
  .cover-col{border:1px solid var(--border);border-radius:14px;padding:22px;background:var(--surface)}
  .cover-col h4{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.14em;
    text-transform:uppercase;color:var(--dim);font-weight:500;margin-bottom:12px}
  .cover-col ul{list-style:none;display:block;margin:0;padding:0}
  .cover-col li{display:block;font-size:14.5px;color:var(--muted);padding:5px 0;line-height:1.5}
  .cover-col li::before{display:none}
  .cover-col li b{color:var(--text);font-weight:500}
  .conv{display:grid;grid-template-columns:1fr auto 1fr;gap:18px;align-items:stretch;
    margin-top:26px}
  .conv-p{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px}
  .conv-h{display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;
    font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--dim);
    margin-bottom:12px;gap:12px}
  .conv-addr,.conv-xml{font-family:'IBM Plex Mono',monospace;font-size:13px;line-height:1.75;
    white-space:pre-wrap;color:var(--text)}
  .conv-xml .tg{color:var(--accent)}
  .conv-xml .vl{color:var(--text)}
  .conv-xml .ind{color:var(--dim)}
  .conv-arrow{display:grid;place-items:center;color:var(--dim);font-size:22px}
  .chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}
  .chip{background:var(--surface2);border:1px solid var(--border2);color:var(--muted);
    font-size:13px;padding:6px 13px;border-radius:30px;cursor:pointer;
    font-family:'IBM Plex Mono',monospace;transition:.15s}
  .chip.active,.chip:hover{background:var(--accent);color:var(--ink);border-color:var(--accent)}
  .prices{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px}
  .price{border:1px solid var(--border);border-radius:14px;padding:22px;background:var(--surface)}
  .price.hi{border-color:var(--accent);background:var(--surface2)}
  .price .n{font-size:15px;font-weight:600;margin-bottom:8px}
  .price .v{font-family:var(--display);font-size:30px;font-weight:700;letter-spacing:-.02em;
    font-variant-numeric:tabular-nums}
  .price .per{font-size:13px;color:var(--dim);font-weight:400;
    font-family:'IBM Plex Sans',sans-serif;letter-spacing:0}
  .price p{font-size:14px;color:var(--muted);margin-top:10px}
  .about{display:grid;grid-template-columns:auto 1fr;gap:26px;align-items:start;
    border:1px solid var(--border);border-radius:14px;padding:30px;background:var(--surface)}
  .about img{width:88px;height:88px;border-radius:50%;object-fit:cover;
    border:1px solid var(--border2)}
  .about h3{font-family:'IBM Plex Sans',sans-serif;font-size:18px;font-weight:600;letter-spacing:0}
  .about .role{font-size:14px;color:var(--dim);margin:4px 0 14px}
  .about p{color:var(--muted);max-width:66ch;font-size:15.5px}
  @media(max-width:860px){
    .fx{grid-template-columns:1fr;gap:28px}
    .about{grid-template-columns:1fr}
    .conv{grid-template-columns:1fr}
    .conv-arrow{transform:rotate(90deg)}
    .sec,.final{padding:52px 0}
    .hero-h{padding:56px 0 48px}
    .hero-grid{grid-template-columns:1fr;gap:34px}
  }
`;

const HOME = {
  fr: require('./data/home.fr.js'),
  en: require('./data/home.en.js'),
  de: require('./data/home.de.js'),
};

function ebicsCatCounts(lang) {
  const out = new Map();
  for (const c of DATA[lang].ebics) out.set(c.category, (out.get(c.category) || 0) + 1);
  return [...out.entries()].sort((a, b) => b[1] - a[1]);
}

const ISO_FAM_LABEL = {
  fr: {
    'SCT Reject/Return': 'virements SEPA (rejets et retours)',
    'SCT Inst (negatives)': 'virements instantanés',
  },
  en: {
    'SCT Reject/Return': 'SEPA credit transfers (rejects and returns)',
    'SCT Inst (negatives)': 'instant credit transfers',
  },
  de: {
    'SCT Reject/Return': 'SEPA-Überweisungen (Rückweisungen und Rückgaben)',
    'SCT Inst (negatives)': 'Echtzeitüberweisungen',
  },
};

function isoFamCounts(lang) {
  const out = new Map();
  for (const c of DATA[lang].iso) {
    const raw = c.family || '';
    const f = (ISO_FAM_LABEL[lang] || {})[raw] || raw
      || (lang === 'fr' ? 'autres motifs' : lang === 'de' ? 'weitere Gründe' : 'other reasons');
    out.set(f, (out.get(f) || 0) + 1);
  }
  return [...out.entries()].sort((a, b) => b[1] - a[1]);
}

const EN_MONTHS = ['January','February','March','April','May','June','July',
  'August','September','October','November','December'];
const DE_MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli',
  'August','September','Oktober','November','Dezember'];

/** Date ISO -> format attendu par la langue de la page. */
function fmtDate(iso, lang) {
  const [y, m, d] = iso.split('-');
  if (lang === 'en') return `${Number(d)} ${EN_MONTHS[Number(m) - 1]} ${y}`;
  if (lang === 'de') return `${Number(d)}. ${DE_MONTHS[Number(m) - 1]} ${y}`;
  return `${d}/${m}/${y}`;
}

function homeHead(lang) {
  const P = PATHS[lang];
  const H = HOME[lang];
  const canonical = SITE + P.home;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(H.title)}</title>
<meta name="description" content="${esc(H.desc)}">
<meta name="google-site-verification" content="9I7qdr0xaPH4Wz-JO8p536RzjOzOSrUQfAiXodTXKhU">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="fr" href="${SITE}">
<link rel="alternate" hreflang="en" href="${SITE}en/">
<link rel="alternate" hreflang="de" href="${SITE}de/">
<link rel="alternate" hreflang="x-default" href="${SITE}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="EDI Insight">
<meta property="og:locale" content="${lang === 'en' ? 'en_GB' : 'fr_FR'}">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${esc(H.title)}">
<meta property="og:description" content="${esc(H.desc)}">
<meta property="og:image" content="https://ediinsight.app/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(H.title)}">
<meta name="twitter:description" content="${esc(H.desc)}">
<meta name="twitter:image" content="https://ediinsight.app/og-image.png">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "EDI Insight",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, iOS",
  "url": "https://ediinsight.app/",
  "description": ${JSON.stringify(H.desc)},
  "offers": [
    {"@type":"Offer","name":"Free","price":"0","priceCurrency":"EUR"},
    {"@type":"Offer","name":"Pro","price":"35","priceCurrency":"EUR"}
  ],
  "author": {"@type":"Person","name":"Alexandre Voisin"},
  "publisher": {"@type":"Organization","name":"EDI Insight","url":"https://ediinsight.app"}
}
</script>
${FONTS}
<style>${SHARED_CSS}${PRODUCT_CSS}${SIMPLE_CSS}${HOME_CSS}</style>
</head>
<body>`;
}

function storeBtn(H) {
  return `<a class="appstore" href="https://apps.apple.com/app/edi-insight/id6769721055" target="_blank" rel="noopener">
  <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M16.6 12.8c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.7-3.1.7-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2-1.4 2.5-.4 6.2 1 8.3.7 1 1.5 2.1 2.5 2.1 1 0 1.4-.6 2.6-.6s1.5.6 2.6.6c1.1 0 1.8-1 2.4-2 .8-1.1 1.1-2.3 1.1-2.3-.1 0-2.2-.8-2.3-3.3zM14.7 5.6c.5-.7.9-1.6.8-2.6-.8 0-1.8.5-2.4 1.2-.5.6-1 1.6-.8 2.5.9.1 1.8-.5 2.4-1.1z"/></svg>
  <span><span class="small">${esc(H.storeSmall)}</span><span class="big">${esc(H.storeBig)}</span></span>
</a>`;
}

function homeLink(lang, to) {
  const P = PATHS[lang];
  if (to === 'APP') return APP + (lang === 'en' ? '?lang=en' : '');
  if (to === 'ISO') return SITE + P.iso;
  if (to === 'EBICS') return SITE + P.ebics;
  if (to === 'ARTICLE') return SITE + P.article;
  if (to.startsWith('PRODUIT:')) return SITE + P.produit + to.slice(8) + '/';
  return to;
}

function homePage(lang = 'fr') {
  const H = HOME[lang];
  const P = PATHS[lang];
  const A = ARTICLE[lang];
  const ebics = DATA[lang].ebics;
  const iso = DATA[lang].iso;
  const total = ebics.length + iso.length;
  const maj = fmtDate(A.updated, lang);
  const fill = t => t.replace(/COUNT_EBICS/g, ebics.length).replace(/COUNT_ISO/g, iso.length)
    .replace(/COUNT_TOTAL/g, total);

  const ebicsChips = ebics
    .map(c => `<a href="${SITE}${P.ebics}${c.code}/" title="${esc(c.label || '')}">${c.code}</a>`).join('');
  const isoChips = iso
    .map(c => `<a href="${SITE}${P.iso}${c.isoCode}/" title="${esc(c.plainLanguageLabel || c.standardLabel || '')}">${c.isoCode}</a>`).join('');
  const ebicsCats = ebicsCatCounts(lang)
    .map(([k, n]) => `<span class="inv-cat"><b>${n}</b> ${esc(catLabelFor(lang, k).toLowerCase())}</span>`).join('');
  const isoFams = isoFamCounts(lang)
    .map(([k, n]) => `<span class="inv-cat"><b>${n}</b> ${esc(k)}</span>`).join('');

  const heroRows = H.heroCard.rows.map(([st, ic, label, val, vc]) =>
    `<div class="hc-row"><span class="hc-st ${st}">${ic}</span><span class="hc-l">${label}</span><span class="hc-v ${vc}">${val}</span></div>`).join('\n      ');

  const featRows = H.feature.rows.map(([a, b, c]) =>
    `<div class="row"><span><b>${esc(a)}</b>, ${esc(b)}</span><span class="state">${esc(c)}</span></div>`).join('\n        ');

  const cards = H.modules.cards.map(c => `
      <article class="card">
        <div class="shot">
          ${c.shot.map(([cls, ic, txt]) => `<div class="ln"><span class="${cls}">${ic}</span><span>${esc(txt)}</span></div>`).join('\n          ')}
        </div>
        <div class="body">
          <h3>${esc(c.h3)}</h3>
          <p>${esc(c.p)}</p>
          <a class="lnk" href="${homeLink(lang, c.to)}"${c.to === 'APP' ? ' target="_blank" rel="noopener"' : ''}>${esc(c.label)}</a>
        </div>
      </article>`).join('');

  const coverCols = H.cover.cols.map(col => `
      <div class="cover-col">
        <h4>${esc(col.h4)}</h4>
        <ul>${col.items.map(i => `<li>${fill(i)}</li>`).join('')}</ul>
      </div>`).join('');

  const prices = H.prices.items.map(p => `
      <div class="price${p.hi ? ' hi' : ''}">
        <div class="n">${esc(p.n)}</div>
        <div class="v">${esc(p.v)}${p.per ? `<span class="per">${esc(p.per)}</span>` : ''}</div>
        <p>${esc(fill(p.p))}</p>
      </div>`).join('');

  const chips = H.conv.chips.map((c, i) =>
    `<button class="chip${i === 0 ? ' active' : ''}" type="button" data-i="${i}">${esc(c)}</button>`).join('');

  return `${homeHead(lang)}
${NAV(lang)}
<main>
<header class="hero-h">
  <div class="wrap hero-grid">
    <div>
      <span class="eyebrow">${esc(H.heroKicker)}</span>
      <h1>${esc(H.h1)}</h1>
      <p class="lead">${esc(H.lead)}</p>
      <div class="actions">
        <a class="btn btn-primary" href="${APP}${lang === 'en' ? '?lang=en' : ''}" target="_blank" rel="noopener">${esc(H.ctaApp)}</a>
        <a class="btn btn-ghost" href="${SITE}${P.iso}">${esc(H.ctaRef)}</a>
        ${storeBtn(H)}
      </div>
    </div>
    <aside class="hero-card">
      <div class="hc-head">
        <span class="hc-ico mono">&lt;/&gt;</span>
        <div>
          <div class="hc-title">${esc(H.heroCard.file)}</div>
          <div class="hc-sub">${esc(H.heroCard.sub)}</div>
        </div>
      </div>
      ${heroRows}
      <p class="hc-foot">${esc(H.heroCard.foot)}</p>
    </aside>
  </div>
  <div class="wrap">
    <div class="proof">${H.proof.map(t => `<span>${t}</span>`).join('')}</div>
  </div>
</header>

<section class="feature">
  <div class="wrap">
    <div class="fx">
      <div>
        <span class="eyebrow">${esc(H.feature.eyebrow)}</span>
        <h2>${esc(H.feature.h2)}</h2>
        <p>${esc(H.feature.p)}</p>
        <a class="btn btn-ghost" href="${SITE}${P.article}">${esc(H.feature.cta)}</a>
        <div class="meta">
          <span>${esc(H.feature.updated)} ${maj}</span>
          <span>${esc(H.feature.read)}</span>
        </div>
      </div>
      <div class="snippet">
        <h4>${esc(H.feature.snippetTitle)}</h4>
        ${featRows}
      </div>
    </div>
  </div>
</section>

<section class="sec" id="referentiels">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">${esc(H.ref.eyebrow)}</span>
      <h2>${total} ${esc(H.ref.h2)}</h2>
      <p>${esc(H.ref.p)}</p>
    </div>
    <div class="inv">
      <div class="inv-box">
        <div class="inv-top"><span class="inv-n">${ebics.length}</span><span class="inv-t">${esc(H.ref.ebicsT)}</span></div>
        <p class="inv-d">${esc(H.ref.ebicsD)}</p>
        <div class="inv-cats">${ebicsCats}</div>
        <div class="inv-list">${ebicsChips}</div>
        <p class="inv-what">${H.ref.ebicsWhat}</p>
      </div>
      <div class="inv-box">
        <div class="inv-top"><span class="inv-n">${iso.length}</span><span class="inv-t">${esc(H.ref.isoT)}</span></div>
        <p class="inv-d">${esc(H.ref.isoD)}</p>
        <div class="inv-cats">${isoFams}</div>
        <div class="inv-list">${isoChips}</div>
        <p class="inv-what">${H.ref.isoWhat}</p>
      </div>
    </div>
  </div>
</section>

<section class="sec" id="modules">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">${esc(H.modules.eyebrow)}</span>
      <h2>${esc(H.modules.h2)}</h2>
      <p>${esc(H.modules.p)}</p>
    </div>
    <div class="cards">${cards}</div>
  </div>
</section>

<section class="sec" id="convertisseur">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">${esc(H.conv.eyebrow)}</span>
      <h2>${esc(H.conv.h2)}</h2>
      <p>${esc(H.conv.p)}</p>
    </div>
    <div class="conv">
      <div class="conv-p">
        <div class="conv-h"><span>${esc(H.conv.inLabel)}</span><span>${esc(H.conv.inNorm)}</span></div>
        <div class="conv-addr" id="addr-in"></div>
      </div>
      <div class="conv-arrow">→</div>
      <div class="conv-p">
        <div class="conv-h"><span>${esc(H.conv.outLabel)}</span><span>${esc(H.conv.outNorm)}</span></div>
        <div class="conv-xml" id="addr-out"></div>
      </div>
    </div>
    <div class="chips">
      <span class="eyebrow" style="display:inline">${esc(H.conv.chipsLabel)}</span>
      ${chips}
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">${esc(H.cover.eyebrow)}</span>
      <h2>${esc(H.cover.h2)}</h2>
      <p>${esc(H.cover.p)}</p>
    </div>
    <div class="cover">${coverCols}</div>
  </div>
</section>

<section class="sec" id="pro">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">${esc(H.prices.eyebrow)}</span>
      <h2>${esc(H.prices.h2)}</h2>
      <p>${esc(H.prices.p)}</p>
    </div>
    <div class="prices">${prices}</div>
  </div>
</section>

<section class="sec" id="apropos">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">${esc(H.about.eyebrow)}</span>
      <h2>${esc(H.about.h2)}</h2>
    </div>
    <div class="about">
      <img src="/alexandre.jpg" alt="${esc(H.about.name)}" width="88" height="88">
      <div>
        <h3>${esc(H.about.name)}</h3>
        <p class="role">${esc(H.about.role)}</p>
        <p>${esc(H.about.text)} <a href="${SITE}${H.about.moreHref}" style="color:var(--accent)">${esc(H.about.more)}</a>.</p>
      </div>
    </div>
  </div>
</section>

<section class="final">
  <div class="wrap final-in">
    <div>
      <h2>${esc(H.final.h2)}</h2>
      <p>${esc(H.final.p)}</p>
    </div>
    <div class="actions">
      <a class="btn btn-primary" href="${APP}${lang === 'en' ? '?lang=en' : ''}" target="_blank" rel="noopener">${esc(H.ctaApp)}</a>
      ${storeBtn(H)}
    </div>
  </div>
</section>
</main>
${FOOTER(lang)}
<script>
  var examples=[
    {in:"12 Rue du Faubourg Saint-Honoré\\n75008 Paris",
     out:[["StrtNm","12 Rue du Faubourg Saint-Honoré"],["PstCd","75008"],["TwnNm","Paris"],["Ctry","FR"]]},
    {in:"Résidence Les Fleurs\\n15 Rue de la Paix\\n75008 Paris",
     out:[["BldgNm","Résidence Les Fleurs"],["StrtNm","15 Rue de la Paix"],["PstCd","75008"],["TwnNm","Paris"],["Ctry","FR"]]},
    {in:"Chez M. Martin\\nAppartement 12, Bâtiment C\\n8 Avenue Foch\\n75116 Paris",
     out:[["Room","Appartement 12"],["BldgNm","Bâtiment C"],["StrtNm","8 Avenue Foch"],["PstCd","75116"],["TwnNm","Paris"],["Ctry","FR"]]}
  ];
  var inEl=document.getElementById('addr-in'),outEl=document.getElementById('addr-out');
  function render(i){
    var ex=examples[i]; inEl.textContent=ex.in;
    var html='<span class="ind">&lt;PstlAdr&gt;</span>\\n';
    ex.out.forEach(function(p){
      html+='  <span class="tg">&lt;'+p[0]+'&gt;</span><span class="vl">'+p[1]+'</span><span class="tg">&lt;/'+p[0]+'&gt;</span>\\n';
    });
    html+='<span class="ind">&lt;/PstlAdr&gt;</span>'; outEl.innerHTML=html;
  }
  render(0);
  document.querySelectorAll('.chip').forEach(function(c){
    c.addEventListener('click',function(){
      document.querySelectorAll('.chip').forEach(function(x){x.classList.remove('active')});
      c.classList.add('active'); render(+c.dataset.i);
    });
  });
</script>
${ANALYTICS}
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════════════
// PAGES ÉDITORIALES SIMPLES — À propos, Télécharger (URL inchangées).
// ══════════════════════════════════════════════════════════════════════════

const PAGES = { fr: require('./data/pages.fr.js') };

const SIMPLE_CSS = `
  .bio{display:grid;grid-template-columns:auto 1fr;gap:26px;align-items:center;margin-bottom:12px}
  .bio img{width:104px;height:104px;border-radius:50%;object-fit:cover;border:1px solid var(--border2)}
  .facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;
    margin:34px 0 10px}
  .fact{border:1px solid var(--border);border-radius:14px;padding:20px;background:var(--surface)}
  .fact .n{font-family:var(--display);font-size:24px;font-weight:700;letter-spacing:-.02em;
    margin-bottom:6px}
  .fact .d{font-size:14.5px;color:var(--muted);line-height:1.6}
  .dl-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:26px}
  .dl-card.hi{border-color:var(--accent)}
  .dl-tag{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;
    text-transform:uppercase;color:var(--accent);margin-bottom:10px;display:block}
  .dl-card h3{font-size:22px;margin-bottom:10px}
  .dl-card>p{color:var(--muted);font-size:15.5px;margin-bottom:16px;line-height:1.7}
  .dl-card ul{list-style:none;display:block;margin:0 0 20px;padding:0}
  .dl-card li{display:flex;gap:10px;align-items:flex-start;font-size:14.5px;color:var(--muted);
    line-height:1.6;padding:6px 0}
  .dl-card li::before{content:"✓";color:var(--green);flex-shrink:0;font-size:13px;margin-top:2px}
  .dl-note{font-size:13px;color:var(--dim);margin-top:14px;line-height:1.6}
  .two-col{display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:18px}
  @media(max-width:700px){.bio{grid-template-columns:1fr}}
`;

function simpleFinal(lang, h2, p, withStore) {
  const H = HOME[lang];
  return `<section class="final">
  <div class="wrap final-in">
    <div>
      <h2>${esc(h2)}</h2>
      <p>${esc(p)}</p>
    </div>
    <div class="actions">
      <a class="btn btn-primary" href="${APP}" target="_blank" rel="noopener">${esc(H.ctaApp)}</a>
      ${withStore ? storeBtn(H) : ''}
    </div>
  </div>
</section>`;
}

function aProposPage(lang = 'fr') {
  const A = PAGES[lang].apropos;
  const canonical = SITE + A.file;
  const secs = A.sections.map(s =>
    `<h2>${esc(s.h2)}</h2>${s.paras.map(p => `<p>${p}</p>`).join('')}`).join('');
  const facts = A.facts.map(f =>
    `<div class="fact"><div class="n">${esc(f.n)}</div><div class="d">${esc(f.d)}</div></div>`).join('');
  return head({ title: A.title, desc: A.desc, canonical, lang, alt: ALT_ABOUT })
+ `
${NAV(lang)}
${crumb(lang, [{ label: 'À propos' }])}
<main class="wrap">
  <header class="prod-head">
    <span class="eyebrow">${esc(A.kicker)}</span>
    <div class="bio">
      <img src="${A.photo}" alt="${esc(A.h1)}" width="104" height="104">
      <div>
        <h1 style="font-size:clamp(30px,4vw,44px);margin:0 0 8px">${esc(A.h1)}</h1>
        <p style="color:var(--dim);font-size:15px;margin-bottom:12px">${esc(A.role)}</p>
        <p class="prod-lead" style="margin-bottom:0">${esc(A.lead)}</p>
      </div>
    </div>
    <div class="actions" style="margin-top:22px">
      <a class="btn btn-primary" href="${APP}" target="_blank" rel="noopener">${esc(HOME[lang].ctaApp)}</a>
      <a class="btn btn-ghost" href="https://www.linkedin.com/in/voisin-alexandre-20551638/" target="_blank" rel="noopener">Me suivre sur LinkedIn</a>
    </div>
  </header>
  <div class="prod-body" style="grid-template-columns:1fr">
    <div class="prod-main art">
      ${secs}
      <div class="facts">${facts}</div>
    </div>
  </div>
</main>
${simpleFinal(lang, A.finalH2, A.finalP, true)}
${FOOTER(lang)}
${ANALYTICS}
</body>
</html>`;
}

function telechargerPage(lang = 'fr') {
  const T = PAGES[lang].telecharger;
  const H = HOME[lang];
  const canonical = SITE + 'telecharger';
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: T.faq.map(f => ({ '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const cards = T.cards.map((c, i) => `
    <div class="dl-card${i === 0 ? ' hi' : ''}">
      <span class="dl-tag">${esc(c.tag)}</span>
      <h3>${esc(c.h3)}</h3>
      <p>${esc(c.p)}</p>
      <ul>${c.list.map(l => `<li><span>${esc(l)}</span></li>`).join('')}</ul>
      ${c.cta ? `<a class="btn btn-primary" href="${homeLink(lang, c.cta.to)}" target="_blank" rel="noopener">${esc(c.cta.label)}</a>` : ''}
      ${c.store ? storeBtn(H) : ''}
      <p class="dl-note">${esc(c.note)}</p>
    </div>`).join('');
  const secs = T.sections.map(s =>
    `<h2>${esc(s.h2)}</h2>${s.paras.map(p => `<p>${p}</p>`).join('')}`).join('');
  const faq = T.faq.map(f => `
  <details>
    <summary>${esc(f.q)}</summary>
    <p>${esc(f.a)}</p>
  </details>`).join('');

  return head({ title: T.title, desc: T.desc, canonical, lang })
+ `
<script type="application/ld+json">
${JSON.stringify(faqLd, null, 2)}
</script>
${NAV(lang)}
${crumb(lang, [{ label: 'Télécharger' }])}
<main class="wrap">
  <header class="prod-head">
    <span class="eyebrow">${esc(T.kicker)}</span>
    <h1>${esc(T.h1)}</h1>
    <p class="prod-lead">${esc(T.lead)}</p>
  </header>
  <div class="two-col" style="margin-bottom:56px">${cards}</div>
  <div class="prod-body" style="grid-template-columns:1fr">
    <div class="prod-main art">
      ${secs}
      <div class="prod-faq art-faq">
        <h2>Questions fréquentes</h2>
        ${faq}
      </div>
    </div>
  </div>
</main>
${simpleFinal(lang, T.finalH2, T.finalP, true)}
${FOOTER(lang)}
${ANALYTICS}
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════════════
// PAGES LÉGALES ET SUPPORT — contenu conservé tel quel (extrait une fois dans
// data/legal.json), réhabillé par le générateur. Les URL ne changent pas.
// ══════════════════════════════════════════════════════════════════════════

const LEGAL = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/legal.json'), 'utf8'));

const ALT_TERMS   = { fr: 'Terms.html',   en: 'en/Terms.html',   de: 'de/Terms.html' };
const ALT_PRIVACY = { fr: 'privacy.html', en: 'en/privacy.html', de: 'de/privacy.html' };
const ALT_SUPPORT = { fr: 'support.html', en: 'en/support.html', de: 'de/support.html' };
const LEGAL_ALT = {
  'Terms.html': ALT_TERMS, 'en/Terms.html': ALT_TERMS, 'de/Terms.html': ALT_TERMS,
  'privacy.html': ALT_PRIVACY, 'en/privacy.html': ALT_PRIVACY, 'de/privacy.html': ALT_PRIVACY,
  'support.html': ALT_SUPPORT, 'en/support.html': ALT_SUPPORT, 'de/support.html': ALT_SUPPORT,
};

const LEGAL_CRUMB = {
  fr: { home: 'Accueil' }, en: { home: 'Home' }, de: { home: 'Startseite' },
};

function legalPage(file) {
  const L = LEGAL[file];
  const lang = L.lang;
  const navLang = lang;
  const canonical = SITE + file;
  const desc = L.desc || `${L.h1} — EDI Insight.`;
  return head({ title: L.title, desc, canonical, lang, alt: LEGAL_ALT[file] })
+ `
${NAV(navLang)}
<div class="wrap">
  <nav class="breadcrumb" aria-label="${STR[navLang].crumbAria}">
    <a href="${SITE}${PATHS[navLang].home}">${LEGAL_CRUMB[lang].home}</a>
    <span class="sep">/</span><span>${esc(L.h1)}</span>
  </nav>
</div>
<main class="wrap">
  <header class="prod-head">
    ${L.kicker ? `<span class="eyebrow">${esc(L.kicker)}</span>` : ''}
    <h1>${esc(L.h1)}</h1>
    ${L.lede ? `<p class="prod-lead">${esc(L.lede)}</p>` : ''}
  </header>
  <div class="prod-body" style="grid-template-columns:1fr">
    <div class="prod-main art art-faq" style="max-width:820px">
${L.html}
    </div>
  </div>
</main>
${FOOTER(navLang)}
${ANALYTICS}
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN — génération
// ══════════════════════════════════════════════════════════════════════════

console.log(`\n🔧  Mode : ${SAMPLE ? 'SAMPLE' : 'COMPLET'}\n`);

let generees = 0;

for (const lang of ['fr', 'en', 'de']) {
  const P = PATHS[lang];
  const hasRefs = true;
  const ebicsList = SAMPLE ? DATA[lang].ebics.slice(0, 1) : DATA[lang].ebics;
  const isoList   = SAMPLE ? DATA[lang].iso.slice(0, 1)   : DATA[lang].iso;

  write(path.join(ROOT, `${P.home}index.html`), homePage(lang));
  console.log(`✓  ${P.home}index.html`);
  generees++;

  write(path.join(ROOT, `${P.produit}index.html`), produitHub(lang));
  write(path.join(ROOT, `${P.ressources}index.html`), ressourcesPage(lang));
  generees += 2;
  for (const m of PRODUCT[lang].modules) {
    write(path.join(ROOT, `${P.produit}${m.slug}/index.html`), productPage(m, lang));
    generees++;
  }
  console.log(`✓  ${P.produit} : hub + ${PRODUCT[lang].modules.length} modules, ${P.ressources}`);

  if (lang === 'fr') {
    write(path.join(ROOT, 'a-propos.html'), aProposPage(lang));
    write(path.join(ROOT, 'telecharger/index.html'), telechargerPage(lang));
    console.log('✓  a-propos.html, telecharger/index.html');
    generees += 2;
  }

  if (!hasRefs) continue;

  write(path.join(ROOT, `${P.article}index.html`), articlePage(lang));
  console.log(`✓  ${P.article}index.html`);
  generees++;

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

for (const file of Object.keys(LEGAL)) {
  write(path.join(ROOT, file), legalPage(file));
  generees++;
}
console.log(`✓  ${Object.keys(LEGAL).length} pages légales et support`);

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
