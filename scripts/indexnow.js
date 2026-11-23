#!/usr/bin/env node
'use strict';
/**
 * IndexNow — signale à Bing (et aux autres moteurs IndexNow : Yandex, Seznam,
 * Naver…) les pages nouvelles ou modifiées de ediinsight.app, sans attendre
 * qu'ils relisent le sitemap. Google n'utilise pas IndexNow.
 *
 * La clé est publique par nature : le fichier <clé>.txt à la racine du site
 * prouve que l'envoi vient bien du propriétaire du domaine. Il doit être EN
 * LIGNE (poussé sur GitHub Pages) avant tout envoi.
 *
 * Usage (depuis le dossier edi-insight-legal) :
 *   node scripts/indexnow.js --since 2026-11-19          → affiche les pages du sitemap datées de ce jour ou après (rien n'est envoyé)
 *   node scripts/indexnow.js https://ediinsight.app/…    → affiche ces adresses (rien n'est envoyé)
 *   … --send                                             → envoie réellement la liste
 *
 * Mis en place le 20/11/2026 : Bing apporte autant de visites que Google
 * (96 contre 99 du 21/10 au 19/11/2026).
 */

const fs = require('fs');
const path = require('path');

const HOST = 'ediinsight.app';
const ROOT = path.join(__dirname, '..');
const ENDPOINT = 'https://api.indexnow.org/indexnow';

function findKey() {
  const files = fs.readdirSync(ROOT).filter(f => /^[0-9a-f]{32}\.txt$/.test(f));
  if (files.length !== 1) throw new Error(`Une seule clé IndexNow attendue à la racine, trouvé : ${files.length}`);
  const key = fs.readFileSync(path.join(ROOT, files[0]), 'utf8').trim();
  if (`${key}.txt` !== files[0]) throw new Error(`Le fichier ${files[0]} ne contient pas sa propre clé.`);
  return key;
}

function urlsSince(since) {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const out = [];
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) {
    if (m[2] >= since) out.push(m[1]);
  }
  return out;
}

async function main() {
  const args = process.argv.slice(2);
  const send = args.includes('--send');
  const sinceIdx = args.indexOf('--since');
  const since = sinceIdx >= 0 ? args[sinceIdx + 1] : null;
  const explicit = args.filter(a => a.startsWith('https://'));

  const key = findKey();
  let urls = since ? urlsSince(since) : explicit;
  urls = [...new Set(urls)];
  const foreign = urls.filter(u => new URL(u).host !== HOST);
  if (foreign.length) throw new Error(`Adresses hors ${HOST} refusées : ${foreign.join(', ')}`);
  if (!urls.length) { console.log('Aucune adresse à signaler.'); return; }

  console.log(`${urls.length} adresse(s) :`);
  for (const u of urls) console.log('  ' + u);

  if (!send) {
    console.log('\nRien n\'a été envoyé. Ajouter --send pour envoyer à IndexNow.');
    return;
  }

  const keyLocation = `https://${HOST}/${key}.txt`;
  const live = await fetch(keyLocation, { cache: 'no-store' }).then(r => (r.ok ? r.text() : '')).catch(() => '');
  if (live.trim() !== key) {
    throw new Error(`La clé n'est pas en ligne à ${keyLocation} : pousser le dépôt et attendre GitHub Pages avant d'envoyer.`);
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key, keyLocation, urlList: urls }),
  });
  // 200 = reçu ; 202 = reçu, clé en cours de vérification ; 4xx = refusé.
  console.log(`\nIndexNow a répondu ${res.status} ${res.statusText}`);
  if (res.status >= 400) {
    console.log(await res.text());
    process.exitCode = 1;
  }
}

main().catch(err => { console.error('✗ ' + err.message); process.exitCode = 1; });
