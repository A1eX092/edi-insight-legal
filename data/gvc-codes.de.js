'use strict';
/**
 * Page allemande « GVC-Codes » (20/11/2026) — Geschäftsvorfallcodes et leur
 * code de transaction ISO 20022 (BTC).
 *
 * Sources : DK, Anhang 1 der Anlage 3 des DFÜ-Abkommens, Mapping GVC – ISO 20022
 * BTC, version 3.9 du 12/03/2025 (tableur officiel, ebics.de, « Ergänzende
 * Dokumente ») — généré par script depuis l'onglet « GVC ► ISO BTC » ; DK,
 * Anlage 3, version 26.11 du 09/04/2026, chap. 7.1.8.5 (format de <Prtry><Cd>).
 * `name` = désignation DK citée telle quelle ; les commentaires longs de la DK
 * ne sont pas recopiés, seule la condition « Purpose Code … » est gardée.
 */
module.exports = {
  path: 'de/gvc-codes/',
  metaTitle: 'GVC-Codes (Geschäftsvorfallcodes): Liste mit ISO-Bank-Transaction-Codes | EDI Insight',
  metaDesc: 'Alle Geschäftsvorfallcodes (GVC) der Deutschen Kreditwirtschaft mit ihrem ISO 20022 Bank Transaction Code und ihrer Darstellung im camt.053-Kontoauszug.',
  kicker: 'Kontoauszug · camt.053',
  h1: 'GVC-Codes: Geschäftsvorfallcodes und ISO-Bank-Transaction-Codes',
  lead: 'Der Geschäftsvorfallcode (GVC) ist die dreistellige Zahl, mit der deutsche Banken die Art einer Buchung kennzeichnen, zum Beispiel 166 für eine SEPA-Überweisungsgutschrift oder 109 für eine zurückbelastete SEPA-Lastschrift. Im camt.053-Kontoauszug steht neben dem GVC der internationale ISO 20022 Bank Transaction Code. Die Tabelle zeigt, welcher GVC welchem ISO-Code entspricht.',
  intro: 'Die Zuordnung ist von der Deutschen Kreditwirtschaft festgelegt (Anhang 1 der Anlage 3 des DFÜ-Abkommens). Der GVC stammt ursprünglich aus dem MT940-Kontoauszug und wird im camt.053 weiterhin verwendet.',
  whereH2: 'Wo steht der GVC im camt.053?',
  wherePara: 'Der Bank Transaction Code steht im Element <code>&lt;BkTxCd&gt;</code>. Nach der Spezifikation der Deutschen Kreditwirtschaft ist dort immer der ISO-Code anzugeben, unter <code>&lt;Domn&gt;</code>: Domain, Family und SubFamily, zum Beispiel PMNT / RCDT / ESCT für eine SEPA-Überweisungsgutschrift. Zusätzlich kann die Bank unter <code>&lt;Prtry&gt;&lt;Cd&gt;</code> einen zusammengesetzten Code angeben, dessen Teile mit „+“ verbunden sind:',
  whereList: ['der vierstellige SWIFT-Transaction-Code,', 'der Geschäftsvorfallcode (GVC),', 'optional die Primanota-Nummer,', 'die Textschlüsselergänzung, falls vorhanden.'],
  whereExamples: 'Beispiele aus der Spezifikation: <code>NRTI+109+9002/405+901</code> für eine SEPA-Lastschriftrückgabe, <code>NTRF+116</code> für eine SEPA-Überweisung. Fehlt die Primanota, stehen zwei Pluszeichen hintereinander: <code>NRTI+109++901</code>.',
  returnsH2: 'Rückgaben: GVC und Rückgabegrund',
  // {link} est remplacé par le lien vers la page des Rückgabegründe.
  returnsPara: 'Bei den GVC 108, 109, 110, 111, 159, 160, 181, 183 und 184 nennt der vierte Teil des Codes den Rückgabegrund als dreistellige Textschlüsselergänzung, zum Beispiel 901 für eine fehlerhafte IBAN. Die Bedeutung dieser Nummern und ihren ISO-Code finden Sie in der {link}.',
  returnsLinkText: 'Übersicht der Rückgabegründe auf dem Kontoauszug',
  multiH2: 'Ein GVC, mehrere ISO-Codes',
  multiPara: 'Für manche GVC sieht die Tabelle mehrere ISO-Codes vor, etwa je nach Purpose Code der Zahlung. Die Spalte „Hinweis“ nennt dann das Unterscheidungsmerkmal. Gibt es mehrere zulässige Varianten, entscheidet die Bank, welche sie verwendet.',
  cols: ['GVC', 'Bezeichnung (DK)', 'Soll/Haben', 'ISO BTC (Domain / Family / SubFamily)', 'Hinweis'],
  sections: [
 {
  "range": "0XX und 100",
  "title": "Zahlungsverkehr in Euro innerhalb der EU und des EWR",
  "rows": [
   {
    "gvc": "006",
    "name": "Kreditkartenabrechnung",
    "dc": "Soll",
    "btc": "PMNT / CCRD / POSC",
    "hint": ""
   },
   {
    "gvc": "058",
    "name": "Bank-an-Bank-Zahlung (Überweisungsgutschrift)",
    "dc": "Haben",
    "btc": "PMNT / RCDT / FICT",
    "hint": ""
   },
   {
    "gvc": "072",
    "name": "Wechseleinreichung",
    "dc": "Haben",
    "btc": "PMNT / DRFT / STLR",
    "hint": ""
   },
   {
    "gvc": "073",
    "name": "Wechsel",
    "dc": "Soll",
    "btc": "PMNT / DRFT / STAM",
    "hint": ""
   },
   {
    "gvc": "079",
    "name": "Sammler",
    "dc": "Haben",
    "btc": "PMNT / MCOP / OTHR",
    "hint": ""
   },
   {
    "gvc": "079",
    "name": "Sammler",
    "dc": "Soll",
    "btc": "PMNT / MDOP / OTHR",
    "hint": ""
   },
   {
    "gvc": "082",
    "name": "Einzahlungen",
    "dc": "Haben",
    "btc": "PMNT / CNTR / CDPT",
    "hint": ""
   },
   {
    "gvc": "083",
    "name": "Auszahlungen",
    "dc": "Soll",
    "btc": "PMNT / CNTR / CWDL",
    "hint": ""
   },
   {
    "gvc": "084",
    "name": "Online-Einzugsauftrag",
    "dc": "Soll",
    "btc": "PMNT / RDDT / OODD",
    "hint": ""
   },
   {
    "gvc": "087",
    "name": "Eilüberweisung",
    "dc": "Soll",
    "btc": "PMNT / ICDT / SDVA",
    "hint": ""
   },
   {
    "gvc": "088",
    "name": "Überweisungsgutschrift mit Festvaluta",
    "dc": "Haben",
    "btc": "PMNT / RCDT / SDVA",
    "hint": ""
   },
   {
    "gvc": "093",
    "name": "Diskont-Wechsel",
    "dc": "Haben",
    "btc": "PMNT / DRFT / DDFT",
    "hint": ""
   },
   {
    "gvc": "095",
    "name": "Aval (Inland)",
    "dc": "Haben",
    "btc": "TRAD / GUAR / OTHR",
    "hint": ""
   },
   {
    "gvc": "095",
    "name": "Aval (Inland)",
    "dc": "Soll",
    "btc": "TRAD / GUAR / OTHR",
    "hint": ""
   },
   {
    "gvc": "098",
    "name": "GeldKarte: Sammelgutschrift für Händler",
    "dc": "Haben",
    "btc": "PMNT / MCRD / SMCD",
    "hint": ""
   },
   {
    "gvc": "101",
    "name": "Inhaberscheck",
    "dc": "Soll",
    "btc": "PMNT / ICHQ / CCHQ",
    "hint": "Purpose Code BCDM"
   },
   {
    "gvc": "102",
    "name": "Orderscheck",
    "dc": "Soll",
    "btc": "PMNT / ICHQ / ORCQ",
    "hint": "Purpose Code OCDM"
   },
   {
    "gvc": "103",
    "name": "Reisescheck",
    "dc": "Soll",
    "btc": "PMNT / ICHQ / CCHQ",
    "hint": "Purpose Code TRVC"
   },
   {
    "gvc": "104",
    "name": "SEPA Direct Debit (Einzelbuchung-Soll, B2B)",
    "dc": "Soll",
    "btc": "PMNT / RDDT / BBDD",
    "hint": ""
   },
   {
    "gvc": "105",
    "name": "SEPA Direct Debit (Einzelbuchung-Soll, Core)",
    "dc": "Soll",
    "btc": "PMNT / RDDT / ESDD",
    "hint": ""
   },
   {
    "gvc": "106",
    "name": "SEPA Cards Clearing (Einzelbuchung-Soll)",
    "dc": "Soll",
    "btc": "PMNT / CCRD / CWDL",
    "hint": "Purpose Code CDCD und CDCS"
   },
   {
    "gvc": "106",
    "name": "SEPA Cards Clearing (Einzelbuchung-Soll)",
    "dc": "Soll",
    "btc": "PMNT / CCRD / SMRT",
    "hint": "Purpose Code ETUP"
   },
   {
    "gvc": "106",
    "name": "SEPA Cards Clearing (Einzelbuchung-Soll)",
    "dc": "Soll",
    "btc": "PMNT / CCRD / POSD",
    "hint": "Purpose Code IDCP, CDDP, DCRD, CDCB und CDQC"
   },
   {
    "gvc": "106",
    "name": "SEPA Cards Clearing (Einzelbuchung-Soll)",
    "dc": "Soll",
    "btc": "PMNT / MCRD / CHRG",
    "hint": "Purpose Code FCOL"
   },
   {
    "gvc": "106",
    "name": "SEPA Cards Clearing (Einzelbuchung-Soll)",
    "dc": "Soll",
    "btc": "PMNT / CCRD / OTHR",
    "hint": "Purpose Code MTUP"
   },
   {
    "gvc": "107",
    "name": "SEPA Direct Debit (Einzelbuchung-Soll, mittels Karte am Point of Sale generierte Lastschrift)",
    "dc": "Soll",
    "btc": "PMNT / CCRD / OTHR",
    "hint": "Purpose Code CGDD"
   },
   {
    "gvc": "108",
    "name": "SEPA Direct Debit (Soll, Rückbelastung, B2B)",
    "dc": "Soll",
    "btc": "PMNT / IDDT / UPDD",
    "hint": ""
   },
   {
    "gvc": "109",
    "name": "SEPA Direct Debit (Soll, Rückbelastung, Core)",
    "dc": "Soll",
    "btc": "PMNT / IDDT / UPDD",
    "hint": ""
   },
   {
    "gvc": "110",
    "name": "SEPA Cards Clearing (Soll, Rückbelastung)",
    "dc": "Soll",
    "btc": "PMNT / MCRD / UPCT",
    "hint": ""
   },
   {
    "gvc": "111",
    "name": "Rückrechnung von Schecks",
    "dc": "Soll",
    "btc": "PMNT / ICHQ / UPCQ",
    "hint": ""
   },
   {
    "gvc": "112",
    "name": "Zahlungsanweisung zur Verrechnung",
    "dc": "Soll",
    "btc": "PMNT / ICHQ / OTHR",
    "hint": "Purpose Code DSMT"
   },
   {
    "gvc": "112",
    "name": "Rückrechnung Zahlungsanweisung zur Verrechnung",
    "dc": "Haben",
    "btc": "PMNT / RCHQ / OTHR",
    "hint": "Purpose Code DSMT"
   },
   {
    "gvc": "116",
    "name": "SEPA Credit Transfer (Einzelbuchung-Soll)",
    "dc": "Soll",
    "btc": "PMNT / ICDT / ESCT",
    "hint": ""
   },
   {
    "gvc": "117",
    "name": "SEPA Credit Transfer (Dauerauftrag-Soll)",
    "dc": "Soll",
    "btc": "PMNT / ICDT / STDO",
    "hint": "Purpose Code RINP"
   },
   {
    "gvc": "118",
    "name": "SEPA Credit Transfer Instant (Einzelbuchung-Soll)",
    "dc": "Soll",
    "btc": "PMNT / IRCT / ESCT",
    "hint": ""
   },
   {
    "gvc": "119",
    "name": "SEPA Credit Transfer (Einzelbuchung-Soll, Spende)",
    "dc": "Soll",
    "btc": "PMNT / ICDT / ESCT",
    "hint": "Purpose Code CHAR"
   },
   {
    "gvc": "122",
    "name": "Währungsscheck auf Euro",
    "dc": "Soll",
    "btc": "PMNT / ICHQ / CCHQ",
    "hint": "Purpose Code MCDM"
   },
   {
    "gvc": "152",
    "name": "SEPA Dauerauftragsgutschrift",
    "dc": "Haben",
    "btc": "PMNT / RCDT / STDO",
    "hint": "Purpose Code RINP"
   },
   {
    "gvc": "153",
    "name": "SEPA Credit Transfer (Einzelbuchung-Haben, Lohn-, Gehalts-, Rentengutschrift)",
    "dc": "Haben",
    "btc": "PMNT / RCDT / SALA",
    "hint": "Purpose Code BONU, PENS, SALA, PAYR, SPSP"
   },
   {
    "gvc": "154",
    "name": "SEPA Credit Transfer (Einzelbuchung-Haben, Vermögenswirksame Leistungen)",
    "dc": "Haben",
    "btc": "PMNT / RCDT / ESCT",
    "hint": "Purpose Code CBFF"
   },
   {
    "gvc": "155",
    "name": "SEPA Credit Transfer (Einzelbuchung-Haben, Alternsvermögenswirksame Leistungen)",
    "dc": "Haben",
    "btc": "PMNT / RCDT / ESCT",
    "hint": "Purpose Code CBFR"
   },
   {
    "gvc": "156",
    "name": "SEPA Credit Transfer (Einzelbuchung-Haben, Überweisung öffentlicher Kassen)",
    "dc": "Haben",
    "btc": "PMNT / RCDT / ESCT",
    "hint": "Purpose Code GOVT, SSBE, BENE"
   },
   {
    "gvc": "157",
    "name": "SEPA Credit Transfer Instant (Einzelbuchung-Haben, Lohn-, Gehalts-, Rentengutschrift)",
    "dc": "Haben",
    "btc": "PMNT / RRCT / SALA",
    "hint": "Purpose Code BONU, PENS, SALA, PAYR, SPSP"
   },
   {
    "gvc": "159",
    "name": "SEPA Credit Transfer Rückbuchung (resultierend aus unanbringlicher Überweisung oder Rückruf)",
    "dc": "Haben",
    "btc": "PMNT / ICDT / RRTN",
    "hint": ""
   },
   {
    "gvc": "159",
    "name": "SEPA Credit Transfer Rückbuchung (resultierend aus unanbringlicher Überweisung oder Rückruf)",
    "dc": "Soll",
    "btc": "PMNT / RCDT / RRTN",
    "hint": ""
   },
   {
    "gvc": "160",
    "name": "SEPA Credit Transfer Instant Rückbuchung (resultierend aus unanbringlicher Überweisung oder Rückruf)",
    "dc": "Haben",
    "btc": "PMNT / IRCT / RRTN",
    "hint": ""
   },
   {
    "gvc": "160",
    "name": "SEPA Credit Transfer Instant Rückbuchung (resultierend aus unanbringlicher Überweisung oder Rückruf)",
    "dc": "Soll",
    "btc": "PMNT / RRCT / RRTN",
    "hint": ""
   },
   {
    "gvc": "161",
    "name": "SEPA Credit Transfer Instant (Einzelbuchung-Haben, Vermögenswirksame Leistungen)",
    "dc": "Haben",
    "btc": "PMNT / RRCT / ESCT",
    "hint": "Purpose Code CBFF"
   },
   {
    "gvc": "162",
    "name": "SEPA Credit Transfer Instant (Einzelbuchung-Haben, Alternsvermögenswirksame Leistungen)",
    "dc": "Haben",
    "btc": "PMNT / RRCT / ESCT",
    "hint": "Purpose Code CBFR"
   },
   {
    "gvc": "163",
    "name": "SEPA Credit Transfer Instant (Einzelbuchung-Haben, Überweisung öffentlicher Kassen)",
    "dc": "Haben",
    "btc": "PMNT / RRCT / ESCT",
    "hint": "Purpose Code GOVT, SSBE, BENE"
   },
   {
    "gvc": "164",
    "name": "SEPA Credit Transfer Instant (Einzelbuchung-Haben, Überweisung mit prüfziffergesicherten Referenzdaten (RF))",
    "dc": "Haben",
    "btc": "PMNT / RRCT / ESCT",
    "hint": "Purpose Code IVPT"
   },
   {
    "gvc": "165",
    "name": "SEPA Credit Transfer Instant (Einzelbuchung-Haben, Spende)",
    "dc": "Haben",
    "btc": "PMNT / RRCT / ESCT",
    "hint": "Purpose Code CHAR"
   },
   {
    "gvc": "166",
    "name": "SEPA Credit Transfer (Einzelbuchung-Haben)",
    "dc": "Haben",
    "btc": "PMNT / RCDT / ESCT",
    "hint": ""
   },
   {
    "gvc": "167",
    "name": "SEPA Credit Transfer (Einzelbuchung-Haben, Überweisung mit prüfziffergesicher-ten Referenzdaten (RF))",
    "dc": "Haben",
    "btc": "PMNT / RCDT / ESCT",
    "hint": "Purpose Code IVPT"
   },
   {
    "gvc": "168",
    "name": "SEPA Credit Transfer Instant (Einzelbuchung-Haben)",
    "dc": "Haben",
    "btc": "PMNT / RRCT / ESCT",
    "hint": ""
   },
   {
    "gvc": "169",
    "name": "SEPA Credit Transfer (Einzelbuchung-Haben, Spende)",
    "dc": "Haben",
    "btc": "PMNT / RCDT / ESCT",
    "hint": "Purpose Code CHAR"
   },
   {
    "gvc": "170",
    "name": "Gutschrift aus Scheckeinreichung",
    "dc": "Haben",
    "btc": "PMNT / RCHQ / URCQ",
    "hint": ""
   },
   {
    "gvc": "171",
    "name": "SEPA Direct Debit Einreichung (Einzelbuchung-Haben, Core)",
    "dc": "Haben",
    "btc": "PMNT / IDDT / ESDD",
    "hint": ""
   },
   {
    "gvc": "174",
    "name": "SEPA Direct Debit (Einzelbuchung-Haben, B2B)",
    "dc": "Haben",
    "btc": "PMNT / IDDT / BBDD",
    "hint": ""
   },
   {
    "gvc": "177",
    "name": "SEPA Credit Transfer Online (Einzelbuchung-Soll)",
    "dc": "Soll",
    "btc": "PMNT / ICDT / ESCT",
    "hint": ""
   },
   {
    "gvc": "181",
    "name": "SEPA Direct Debit (Haben Wiedergutschrift, Core)",
    "dc": "Haben",
    "btc": "PMNT / RDDT / UPDD",
    "hint": ""
   },
   {
    "gvc": "182",
    "name": "SEPA Card Clearing (Haben Wiedergutschrift)",
    "dc": "Haben",
    "btc": "PMNT / CCRD / RIMB",
    "hint": ""
   },
   {
    "gvc": "183",
    "name": "Scheckrückgabe (Habenbuchung)",
    "dc": "Haben",
    "btc": "PMNT / RCHQ / UPCQ",
    "hint": ""
   },
   {
    "gvc": "184",
    "name": "SEPA Direct Debit (Haben Wiedergutschrift, B2B)",
    "dc": "Haben",
    "btc": "PMNT / RDDT / UPDD",
    "hint": ""
   },
   {
    "gvc": "185",
    "name": "Scheckbelastung (Sammler, Soll)",
    "dc": "Soll",
    "btc": "PMNT / ICHQ / CCHQ",
    "hint": ""
   },
   {
    "gvc": "188",
    "name": "reserviert für: SEPA Credit Transfer Instant (Sammler-Soll)",
    "dc": "Soll",
    "btc": "PMNT / IRCT / ESCT",
    "hint": ""
   },
   {
    "gvc": "189",
    "name": "SEPA Credit Transfer Instant (Sammler-Haben)",
    "dc": "Haben",
    "btc": "PMNT / RRCT / ESCT",
    "hint": ""
   },
   {
    "gvc": "190",
    "name": "SEPA Card Clearing (Sammler-Soll)",
    "dc": "Soll",
    "btc": "PMNT / CCRD / OTHR",
    "hint": ""
   },
   {
    "gvc": "191",
    "name": "SEPA Credit Transfer (Sammler-Soll)",
    "dc": "Soll",
    "btc": "PMNT / ICDT / ESCT",
    "hint": ""
   },
   {
    "gvc": "192",
    "name": "SEPA Direct Debit (Sammler-Haben, Core)",
    "dc": "Haben",
    "btc": "PMNT / IDDT / ESDD",
    "hint": ""
   },
   {
    "gvc": "193",
    "name": "SEPA Direct Debit (Soll, Reversal)",
    "dc": "Soll",
    "btc": "PMNT / IDDT / RCDD",
    "hint": ""
   },
   {
    "gvc": "194",
    "name": "SEPA Credit Transfer (Sammler-Haben)",
    "dc": "Haben",
    "btc": "PMNT / RCDT / ESCT",
    "hint": ""
   },
   {
    "gvc": "195",
    "name": "SEPA Direct Debit (Sammler-Soll, Core)",
    "dc": "Soll",
    "btc": "PMNT / RDDT / ESDD",
    "hint": ""
   },
   {
    "gvc": "196",
    "name": "SEPA Direct Debit (Sammler-Haben, B2B)",
    "dc": "Haben",
    "btc": "PMNT / IDDT / BBDD",
    "hint": ""
   },
   {
    "gvc": "197",
    "name": "SEPA Direct Debit (Sammler-Soll, B2B)",
    "dc": "Soll",
    "btc": "PMNT / RDDT / BBDD",
    "hint": ""
   },
   {
    "gvc": "198",
    "name": "SEPA Card Clearing (Sammler-Haben)",
    "dc": "Haben",
    "btc": "PMNT / MCRD / POSP",
    "hint": ""
   },
   {
    "gvc": "199",
    "name": "SEPA Card Clearing (Soll, Reversal)",
    "dc": "Soll",
    "btc": "PMNT / MCRD / DAJT",
    "hint": ""
   }
  ]
 },
 {
  "range": "2XX",
  "title": "Auslandsgeschäft / Auslandszahlungsverkehr",
  "rows": [
   {
    "gvc": "201",
    "name": "Zahlungsauftrag",
    "dc": "Soll",
    "btc": "PMNT / ICDT / XBCT",
    "hint": ""
   },
   {
    "gvc": "202",
    "name": "Zahlungseingang Ausland",
    "dc": "Haben",
    "btc": "PMNT / RCDT / XBCT",
    "hint": ""
   },
   {
    "gvc": "201",
    "name": "Zahlungsauftrag Gehalt",
    "dc": "Soll",
    "btc": "PMNT / ICDT / XBSA",
    "hint": ""
   },
   {
    "gvc": "202",
    "name": "Zahlungseingang Ausland Gehalt",
    "dc": "Haben",
    "btc": "PMNT / RCDT / XBSA",
    "hint": ""
   },
   {
    "gvc": "201",
    "name": "Rückgabe Zahlungseingang",
    "dc": "Soll",
    "btc": "PMNT / RCDT / XRTN",
    "hint": ""
   },
   {
    "gvc": "202",
    "name": "Wiedergutschrift AZV Zahlung",
    "dc": "Haben",
    "btc": "PMNT / ICDT / XRTN",
    "hint": ""
   },
   {
    "gvc": "203",
    "name": "Inkasso",
    "dc": "Haben",
    "btc": "TRAD / CLNC / OTHR",
    "hint": ""
   },
   {
    "gvc": "203",
    "name": "Inkasso",
    "dc": "Soll",
    "btc": "TRAD / CLNC / OTHR",
    "hint": ""
   },
   {
    "gvc": "204",
    "name": "Akkreditiv",
    "dc": "Haben",
    "btc": "TRAD / DCCT / OTHR",
    "hint": ""
   },
   {
    "gvc": "204",
    "name": "Akkreditiv",
    "dc": "Soll",
    "btc": "TRAD / DCCT / OTHR",
    "hint": ""
   },
   {
    "gvc": "205",
    "name": "Aval",
    "dc": "Haben",
    "btc": "TRAD / GUAR / OTHR",
    "hint": ""
   },
   {
    "gvc": "205",
    "name": "Aval",
    "dc": "Soll",
    "btc": "TRAD / GUAR / OTHR",
    "hint": ""
   },
   {
    "gvc": "206",
    "name": "Auslandsüberweisung",
    "dc": "Haben",
    "btc": "PMNT / RCDT / XBCT",
    "hint": ""
   },
   {
    "gvc": "208",
    "name": "Rembourse",
    "dc": "Haben",
    "btc": "TRAD / MCOP / RIMB",
    "hint": ""
   },
   {
    "gvc": "208",
    "name": "Rembourse",
    "dc": "Soll",
    "btc": "TRAD / MDOP / RIMB",
    "hint": ""
   },
   {
    "gvc": "209",
    "name": "Zahlung per Scheck",
    "dc": "Soll",
    "btc": "PMNT / ICHQ / CCCH",
    "hint": ""
   },
   {
    "gvc": "210",
    "name": "Zahlung über elektronische Medien",
    "dc": "Soll",
    "btc": "PMNT / ICDT / XBCT",
    "hint": ""
   },
   {
    "gvc": "212",
    "name": "Dauerauftrag",
    "dc": "Soll",
    "btc": "PMNT / ICDT / XBST",
    "hint": ""
   },
   {
    "gvc": "213",
    "name": "Lastschrift-Einzug aus dem Ausland",
    "dc": "Soll",
    "btc": "PMNT / RDDT / XBDD",
    "hint": ""
   },
   {
    "gvc": "214",
    "name": "Dokumenten-Inkasso (Import)",
    "dc": "Soll",
    "btc": "TRAD / DOCC / OTHR",
    "hint": ""
   },
   {
    "gvc": "215",
    "name": "Dokumenten-Inkasso (Export)",
    "dc": "Haben",
    "btc": "TRAD / DOCC / OTHR",
    "hint": ""
   },
   {
    "gvc": "216",
    "name": "Wechsel-Inkasso (Import)",
    "dc": "Soll",
    "btc": "PMNT / DRFT / STAM",
    "hint": ""
   },
   {
    "gvc": "217",
    "name": "Wechsel-Inkasso (Export)",
    "dc": "Haben",
    "btc": "PMNT / DRFT / STAM",
    "hint": ""
   },
   {
    "gvc": "217",
    "name": "Wechsel-Inkasso (Export)",
    "dc": "Haben",
    "btc": "PMNT / DRFT / STLR",
    "hint": ""
   },
   {
    "gvc": "218",
    "name": "Import-Akkreditiv",
    "dc": "Soll",
    "btc": "TRAD / DCCT / SOSI",
    "hint": ""
   },
   {
    "gvc": "219",
    "name": "Export-Akkreditiv",
    "dc": "Haben",
    "btc": "TRAD / DCCT / SOSE",
    "hint": ""
   },
   {
    "gvc": "220",
    "name": "Gutschrift E.v. eines Auslands-Schecks",
    "dc": "Haben",
    "btc": "PMNT / RCHQ / XRCQ",
    "hint": ""
   },
   {
    "gvc": "221",
    "name": "Gutschrift Auslands-Scheck-Inkasso",
    "dc": "Haben",
    "btc": "PMNT / RCHQ / XBCQ",
    "hint": ""
   },
   {
    "gvc": "222",
    "name": "Belastung Auslands-Scheck",
    "dc": "Soll",
    "btc": "PMNT / ICHQ / XBCQ",
    "hint": ""
   },
   {
    "gvc": "224",
    "name": "Sorten-Ankauf",
    "dc": "Haben",
    "btc": "PMNT / CNTR / FCDP",
    "hint": ""
   },
   {
    "gvc": "225",
    "name": "Sorten-Verkauf",
    "dc": "Soll",
    "btc": "PMNT / CNTR / FCWD",
    "hint": ""
   }
  ]
 },
 {
  "range": "3XX",
  "title": "Wertpapiergeschäft",
  "rows": [
   {
    "gvc": "301",
    "name": "Inkasso",
    "dc": "Haben",
    "btc": "SECU / CUST / OTHR",
    "hint": ""
   },
   {
    "gvc": "302",
    "name": "Kupon/Dividenden",
    "dc": "Haben",
    "btc": "SECU / CUST / DVCA",
    "hint": ""
   },
   {
    "gvc": "303",
    "name": "Effekten",
    "dc": "Haben",
    "btc": "SECU / SETT / TRAD",
    "hint": ""
   },
   {
    "gvc": "303",
    "name": "Effekten",
    "dc": "Soll",
    "btc": "SECU / SETT / TRAD",
    "hint": ""
   },
   {
    "gvc": "304",
    "name": "Übertrag",
    "dc": "Haben",
    "btc": "SECU / MCOP / ADJT",
    "hint": ""
   },
   {
    "gvc": "304",
    "name": "Übertrag",
    "dc": "Soll",
    "btc": "SECU / MDOP / ADJT",
    "hint": ""
   },
   {
    "gvc": "305",
    "name": "Namensschuldverschreibung",
    "dc": "Soll",
    "btc": "SECU / CUST / OTHR",
    "hint": ""
   },
   {
    "gvc": "306",
    "name": "Schuldschein",
    "dc": "Soll",
    "btc": "SECU / OTHR / OTHR",
    "hint": ""
   },
   {
    "gvc": "307",
    "name": "Wertpapierzeichnung",
    "dc": "Soll",
    "btc": "SECU / SETT / SUBS",
    "hint": ""
   },
   {
    "gvc": "308",
    "name": "Handel von Bezugsrechten",
    "dc": "Haben",
    "btc": "SECU / CORP / EXWA",
    "hint": ""
   },
   {
    "gvc": "308",
    "name": "Handel von Bezugsrechten",
    "dc": "Soll",
    "btc": "SECU / CORP / EXWA",
    "hint": ""
   },
   {
    "gvc": "309",
    "name": "Handel von Bonusrechten",
    "dc": "Haben",
    "btc": "SECU / CORP / BONU",
    "hint": ""
   },
   {
    "gvc": "309",
    "name": "Handel von Bonusrechten",
    "dc": "Soll",
    "btc": "SECU / CORP / BONU",
    "hint": ""
   },
   {
    "gvc": "310",
    "name": "Handel von Optionen",
    "dc": "Haben",
    "btc": "SECU / MCOP / OTHR",
    "hint": ""
   },
   {
    "gvc": "310",
    "name": "Handel von Optionen",
    "dc": "Soll",
    "btc": "SECU / MDOP / OTHR",
    "hint": ""
   },
   {
    "gvc": "311",
    "name": "Termingeschäfte",
    "dc": "Haben",
    "btc": "DERV / OTHR / OTHR",
    "hint": ""
   },
   {
    "gvc": "311",
    "name": "Termingeschäfte",
    "dc": "Soll",
    "btc": "DERV / OTHR / OTHR",
    "hint": ""
   },
   {
    "gvc": "320",
    "name": "Gebühren für Wertpapiergeschäfte",
    "dc": "Soll",
    "btc": "SECU / CASH / TRFE",
    "hint": ""
   },
   {
    "gvc": "321",
    "name": "Depotgebühren",
    "dc": "Soll",
    "btc": "SECU / CUST / CHRG",
    "hint": ""
   },
   {
    "gvc": "321",
    "name": "Erstattung Depotgebühren",
    "dc": "Haben",
    "btc": "SECU / CUST / CHRG",
    "hint": ""
   },
   {
    "gvc": "330",
    "name": "Erträge aus Wertpapieren",
    "dc": "Haben",
    "btc": "SECU / CUST / INTR",
    "hint": ""
   },
   {
    "gvc": "340",
    "name": "Gutschrift für fällige Wertpapiere",
    "dc": "Haben",
    "btc": "SECU / CUST / REDM",
    "hint": ""
   },
   {
    "gvc": "399",
    "name": "Storno",
    "dc": "Haben",
    "btc": "ACMT / ACOP / PSTE",
    "hint": ""
   },
   {
    "gvc": "399",
    "name": "Storno",
    "dc": "Soll",
    "btc": "ACMT / ADOP / PSTE",
    "hint": ""
   }
  ]
 },
 {
  "range": "4XX",
  "title": "Devisengeschäft",
  "rows": [
   {
    "gvc": "403",
    "name": "Reisedevisen",
    "dc": "Soll",
    "btc": "FORX / MDOP / OTHR",
    "hint": ""
   },
   {
    "gvc": "404",
    "name": "Devisenscheck",
    "dc": "Soll",
    "btc": "FORX / OTHR / OTHR",
    "hint": ""
   },
   {
    "gvc": "405",
    "name": "Finanzinnovationen",
    "dc": "Soll",
    "btc": "FORX / OTHR / OTHR",
    "hint": ""
   },
   {
    "gvc": "406",
    "name": "Devisenhandel",
    "dc": "Haben",
    "btc": "FORX / SPOT / OTHR",
    "hint": ""
   },
   {
    "gvc": "406",
    "name": "Devisenhandel",
    "dc": "Soll",
    "btc": "FORX / SPOT / OTHR",
    "hint": ""
   },
   {
    "gvc": "407",
    "name": "Geldhandel",
    "dc": "Haben",
    "btc": "FORX / OTHR / OTHR",
    "hint": ""
   },
   {
    "gvc": "407",
    "name": "Geldhandel",
    "dc": "Soll",
    "btc": "FORX / OTHR / OTHR",
    "hint": ""
   },
   {
    "gvc": "408",
    "name": "Zinsen Geldhandel",
    "dc": "Haben",
    "btc": "FORX / MCOP / INTR",
    "hint": ""
   },
   {
    "gvc": "409",
    "name": "Kapital plus Zinsen",
    "dc": "Haben",
    "btc": "FORX / MCOP / OTHR",
    "hint": ""
   },
   {
    "gvc": "411",
    "name": "Devisenkassa-Kauf",
    "dc": "Soll",
    "btc": "FORX / SPOT / OTHR",
    "hint": ""
   },
   {
    "gvc": "412",
    "name": "Devisenkassa-Verkauf",
    "dc": "Haben",
    "btc": "FORX / SPOT / OTHR",
    "hint": ""
   },
   {
    "gvc": "413",
    "name": "Devisentermin-Kauf",
    "dc": "Soll",
    "btc": "FORX / FWRD / OTHR",
    "hint": ""
   },
   {
    "gvc": "414",
    "name": "Devisentermin-Verkauf",
    "dc": "Haben",
    "btc": "FORX / FWRD / OTHR",
    "hint": ""
   },
   {
    "gvc": "415",
    "name": "FW-Tagegeld-Aktiv",
    "dc": "Soll",
    "btc": "FORX / MDOP / OTHR",
    "hint": ""
   },
   {
    "gvc": "416",
    "name": "FW-Tagegeld-Passiv",
    "dc": "Haben",
    "btc": "FORX / MCOP / OTHR",
    "hint": ""
   },
   {
    "gvc": "417",
    "name": "FW-Termingeld-Aktiv",
    "dc": "Soll",
    "btc": "FORX / MDOP / OTHR",
    "hint": ""
   },
   {
    "gvc": "418",
    "name": "FW-Termingeld-Passiv",
    "dc": "Haben",
    "btc": "FORX / MCOP / OTHR",
    "hint": ""
   },
   {
    "gvc": "419",
    "name": "Call-Geld-Aktiv",
    "dc": "Soll",
    "btc": "FORX / MDOP / OTHR",
    "hint": ""
   },
   {
    "gvc": "420",
    "name": "Call-Geld-Passiv",
    "dc": "Haben",
    "btc": "FORX / MCOP / OTHR",
    "hint": ""
   },
   {
    "gvc": "421",
    "name": "Optionen",
    "dc": "Haben",
    "btc": "FORX / MCOP / OTHR",
    "hint": ""
   },
   {
    "gvc": "421",
    "name": "Optionen",
    "dc": "Soll",
    "btc": "FORX / MDOP / OTHR",
    "hint": ""
   },
   {
    "gvc": "422",
    "name": "Swap",
    "dc": "Haben",
    "btc": "FORX / SWAP / OTHR",
    "hint": ""
   },
   {
    "gvc": "422",
    "name": "Swap",
    "dc": "Soll",
    "btc": "FORX / SWAP / OTHR",
    "hint": ""
   },
   {
    "gvc": "423",
    "name": "Edelmetall-Ankauf",
    "dc": "Haben",
    "btc": "PMET / SPOT / OTHR",
    "hint": ""
   },
   {
    "gvc": "424",
    "name": "Edelmetall-Verkauf",
    "dc": "Soll",
    "btc": "PMET / SPOT / OTHR",
    "hint": ""
   }
  ]
 },
 {
  "range": "6XX",
  "title": "Kreditgeschäft",
  "rows": [
   {
    "gvc": "601",
    "name": "Einzug von Raten/Annuitäten",
    "dc": "Soll",
    "btc": "LDAS / FTLN / OTHR",
    "hint": ""
   },
   {
    "gvc": "602",
    "name": "Überweisung von Raten/Annuitäten",
    "dc": "Haben",
    "btc": "LDAS / FTLN / OTHR",
    "hint": ""
   },
   {
    "gvc": "603",
    "name": "Tilgung",
    "dc": "Soll",
    "btc": "LDAS / FTLN / PPAY",
    "hint": ""
   },
   {
    "gvc": "604",
    "name": "Darlehenszinsen",
    "dc": "Soll",
    "btc": "LDAS / MDOP / INTR",
    "hint": ""
   },
   {
    "gvc": "605",
    "name": "Darlehenszinsen mit Nebenleistungen",
    "dc": "Soll",
    "btc": "LDAS / MDOP / INTR",
    "hint": ""
   },
   {
    "gvc": "606",
    "name": "Kredit Kapital",
    "dc": "Haben",
    "btc": "LDAS / FTLN / DDWN",
    "hint": ""
   },
   {
    "gvc": "606",
    "name": "Kredit Kapital",
    "dc": "Soll",
    "btc": "LDAS / FTLN / DDWN",
    "hint": ""
   },
   {
    "gvc": "607",
    "name": "Kredit- und/oder Zinszahlung",
    "dc": "Soll",
    "btc": "LDAS / OTHR / OTHR",
    "hint": ""
   }
  ]
 },
 {
  "range": "8XX",
  "title": "Sonstige",
  "rows": [
   {
    "gvc": "801",
    "name": "Scheckkarte",
    "dc": "Soll",
    "btc": "ACMT / MDOP / CHRG",
    "hint": ""
   },
   {
    "gvc": "802",
    "name": "Scheckheft",
    "dc": "Soll",
    "btc": "ACMT / MDOP / CHRG",
    "hint": ""
   },
   {
    "gvc": "805",
    "name": "Abschluss",
    "dc": "Haben",
    "btc": "ACMT / OPCL / ACCC",
    "hint": ""
   },
   {
    "gvc": "805",
    "name": "Abschluss",
    "dc": "Soll",
    "btc": "ACMT / OPCL / ACCC",
    "hint": ""
   },
   {
    "gvc": "806",
    "name": "Erstattung von Porto/Zustellgebühren",
    "dc": "Haben",
    "btc": "ACMT / MCOP / CHRG",
    "hint": ""
   },
   {
    "gvc": "806",
    "name": "Porto/Zustellgebühren",
    "dc": "Soll",
    "btc": "ACMT / MDOP / CHRG",
    "hint": ""
   },
   {
    "gvc": "807",
    "name": "Erstattung von Preisen/Spesen",
    "dc": "Haben",
    "btc": "ACMT / MCOP / CHRG",
    "hint": ""
   },
   {
    "gvc": "807",
    "name": "Preise/Spesen",
    "dc": "Soll",
    "btc": "ACMT / MDOP / CHRG",
    "hint": ""
   },
   {
    "gvc": "808",
    "name": "Erstattung von Gebühren",
    "dc": "Haben",
    "btc": "ACMT / MCOP / CHRG",
    "hint": ""
   },
   {
    "gvc": "808",
    "name": "Gebühren",
    "dc": "Soll",
    "btc": "ACMT / MDOP / CHRG",
    "hint": ""
   },
   {
    "gvc": "808",
    "name": "Erstattung von Gebühren",
    "dc": "Haben",
    "btc": "PMNT / MCOP / CHRG",
    "hint": ""
   },
   {
    "gvc": "808",
    "name": "Gebühren",
    "dc": "Soll",
    "btc": "PMNT / MDOP / CHRG",
    "hint": ""
   },
   {
    "gvc": "808",
    "name": "Erstattung von Gebühren",
    "dc": "Haben",
    "btc": "TRAD / MCOP / CHRG",
    "hint": ""
   },
   {
    "gvc": "808",
    "name": "Gebühren",
    "dc": "Soll",
    "btc": "TRAD / MDOP / CHRG",
    "hint": ""
   },
   {
    "gvc": "809",
    "name": "Provisionen",
    "dc": "Soll",
    "btc": "ACMT / MDOP / COMM",
    "hint": ""
   },
   {
    "gvc": "809",
    "name": "Erstattung von Provisionen",
    "dc": "Haben",
    "btc": "ACMT / MCOP / COMM",
    "hint": ""
   },
   {
    "gvc": "809",
    "name": "Provisionen",
    "dc": "Soll",
    "btc": "PMNT / MDOP / COMM",
    "hint": ""
   },
   {
    "gvc": "809",
    "name": "Erstattung von Provisionen",
    "dc": "Haben",
    "btc": "PMNT / MCOP / COMM",
    "hint": ""
   },
   {
    "gvc": "809",
    "name": "Provisionen",
    "dc": "Soll",
    "btc": "TRAD / MDOP / COMM",
    "hint": ""
   },
   {
    "gvc": "809",
    "name": "Erstattung von Provisionen",
    "dc": "Haben",
    "btc": "TRAD / MCOP / COMM",
    "hint": ""
   },
   {
    "gvc": "809",
    "name": "Provisionen",
    "dc": "Soll",
    "btc": "LDAS / MDOP / COMM",
    "hint": ""
   },
   {
    "gvc": "809",
    "name": "Erstattung von Provisionen",
    "dc": "Haben",
    "btc": "LDAS / MCOP / COMM",
    "hint": ""
   },
   {
    "gvc": "810",
    "name": "Mahngebühren",
    "dc": "Soll",
    "btc": "ACMT / MDOP / CHRG",
    "hint": ""
   },
   {
    "gvc": "810",
    "name": "Erstattung von Mahngebühren",
    "dc": "Haben",
    "btc": "ACMT / MCOP / CHRG",
    "hint": ""
   },
   {
    "gvc": "811",
    "name": "Kreditkosten",
    "dc": "Soll",
    "btc": "LDAS / MDOP / CHRG",
    "hint": ""
   },
   {
    "gvc": "811",
    "name": "Erstattung von Kreditkosten",
    "dc": "Haben",
    "btc": "LDAS / MCOP / CHRG",
    "hint": ""
   },
   {
    "gvc": "812",
    "name": "Stundungszinsen",
    "dc": "Soll",
    "btc": "LDAS / MDOP / INTR",
    "hint": ""
   },
   {
    "gvc": "812",
    "name": "Erstattung von Stundungszinsen",
    "dc": "Haben",
    "btc": "LDAS / MCOP / INTR",
    "hint": ""
   },
   {
    "gvc": "813",
    "name": "Disagio",
    "dc": "Soll",
    "btc": "LDAS / MDOP / INTR",
    "hint": ""
   },
   {
    "gvc": "814",
    "name": "Zinsen",
    "dc": "Haben",
    "btc": "ACMT / MCOP / INTR",
    "hint": ""
   },
   {
    "gvc": "814",
    "name": "Zinsen",
    "dc": "Soll",
    "btc": "ACMT / MDOP / INTR",
    "hint": ""
   },
   {
    "gvc": "815",
    "name": "kapitalisierte Zinsen",
    "dc": "Haben",
    "btc": "ACMT / OTHR / OTHR",
    "hint": ""
   },
   {
    "gvc": "816",
    "name": "Zinssatzänderung",
    "dc": "Haben",
    "btc": "ACMT / OTHR / OTHR",
    "hint": ""
   },
   {
    "gvc": "817",
    "name": "Zinsberichtigung",
    "dc": "Haben",
    "btc": "ACMT / OTHR / OTHR",
    "hint": ""
   },
   {
    "gvc": "817",
    "name": "Zinsberichtigung",
    "dc": "Soll",
    "btc": "ACMT / OTHR / OTHR",
    "hint": ""
   },
   {
    "gvc": "819",
    "name": "Bezüge",
    "dc": "Haben",
    "btc": "PMNT / MCOP / OTHR",
    "hint": ""
   },
   {
    "gvc": "820",
    "name": "Übertrag",
    "dc": "Haben",
    "btc": "PMNT / RCDT / BOOK",
    "hint": ""
   },
   {
    "gvc": "820",
    "name": "Übertrag",
    "dc": "Soll",
    "btc": "PMNT / ICDT / BOOK",
    "hint": ""
   },
   {
    "gvc": "821",
    "name": "Telefon",
    "dc": "Soll",
    "btc": "PMNT / MDOP / OTHR",
    "hint": ""
   },
   {
    "gvc": "822",
    "name": "Auszahlplan",
    "dc": "Haben",
    "btc": "PMNT / MCOP / OTHR",
    "hint": ""
   },
   {
    "gvc": "823",
    "name": "Festgeld",
    "dc": "Haben",
    "btc": "LDAS / FTDP / RPMT",
    "hint": ""
   },
   {
    "gvc": "823",
    "name": "Festgeld",
    "dc": "Soll",
    "btc": "LDAS / FTDP / DPST",
    "hint": ""
   },
   {
    "gvc": "824",
    "name": "Leihgeld",
    "dc": "Soll",
    "btc": "LDAS / OTHR / OTHR",
    "hint": ""
   },
   {
    "gvc": "825",
    "name": "Universaldarlehen",
    "dc": "Soll",
    "btc": "LDAS / OTHR / OTHR",
    "hint": ""
   },
   {
    "gvc": "826",
    "name": "dynamisches Sparen",
    "dc": "Soll",
    "btc": "LDAS / OTHR / OTHR",
    "hint": ""
   },
   {
    "gvc": "827",
    "name": "Überschusssparen",
    "dc": "Soll",
    "btc": "LDAS / OTHR / OTHR",
    "hint": ""
   },
   {
    "gvc": "828",
    "name": "Sparbrief",
    "dc": "Haben",
    "btc": "LDAS / FTDP / RPMT",
    "hint": ""
   },
   {
    "gvc": "828",
    "name": "Sparbrief",
    "dc": "Soll",
    "btc": "LDAS / FTDP / DPST",
    "hint": ""
   },
   {
    "gvc": "829",
    "name": "Sparplan",
    "dc": "Haben",
    "btc": "LDAS / FTDP / RPMT",
    "hint": ""
   },
   {
    "gvc": "829",
    "name": "Sparplan",
    "dc": "Soll",
    "btc": "LDAS / FTDP / DPST",
    "hint": ""
   },
   {
    "gvc": "830",
    "name": "Bonus",
    "dc": "Haben",
    "btc": "LDAS / FTDP / INTR",
    "hint": ""
   },
   {
    "gvc": "831",
    "name": "alte Rechnung",
    "dc": "Soll",
    "btc": "XTND / NTAV / NTAV",
    "hint": ""
   },
   {
    "gvc": "832",
    "name": "Hypothek",
    "dc": "Soll",
    "btc": "LDAS / OTHR / OTHR",
    "hint": ""
   },
   {
    "gvc": "833",
    "name": "Cash Concentration - Hauptkonten",
    "dc": "Haben",
    "btc": "CAMT / CAPL / OTHR",
    "hint": ""
   },
   {
    "gvc": "833",
    "name": "Cash Concentration - Hauptkonten",
    "dc": "Soll",
    "btc": "CAMT / CAPL / OTHR",
    "hint": ""
   },
   {
    "gvc": "834",
    "name": "Cash Concentration - Nebenkonten",
    "dc": "Haben",
    "btc": "CAMT / CAPL / OTHR",
    "hint": ""
   },
   {
    "gvc": "834",
    "name": "Cash Concentration - Nebenkonten",
    "dc": "Soll",
    "btc": "CAMT / CAPL / OTHR",
    "hint": ""
   },
   {
    "gvc": "835",
    "name": "Sonstige nicht definierte GV-Arten",
    "dc": "Haben",
    "btc": "XTND / NTAV / NTAV",
    "hint": ""
   },
   {
    "gvc": "835",
    "name": "Sonstige nicht definierte GV-Arten",
    "dc": "Soll",
    "btc": "XTND / NTAV / NTAV",
    "hint": ""
   },
   {
    "gvc": "836",
    "name": "Reklamationsbuchung",
    "dc": "Haben",
    "btc": "ACMT / MCOP / ADJT",
    "hint": ""
   },
   {
    "gvc": "836",
    "name": "Reklamationsbuchung",
    "dc": "Soll",
    "btc": "ACMT / MDOP / ADJT",
    "hint": ""
   },
   {
    "gvc": "837",
    "name": "Umsatzsteuer",
    "dc": "Soll",
    "btc": "ACMT / MDOP / TAXE",
    "hint": ""
   },
   {
    "gvc": "888",
    "name": "Umbuchung wegen Euro-Umstellung",
    "dc": "Haben",
    "btc": "XTND / NTAV / NTAV",
    "hint": ""
   },
   {
    "gvc": "888",
    "name": "Umbuchung wegen Euro-Umstellung",
    "dc": "Soll",
    "btc": "XTND / NTAV / NTAV",
    "hint": ""
   },
   {
    "gvc": "899",
    "name": "Storno",
    "dc": "Haben",
    "btc": "ACMT / ACOP / PSTE",
    "hint": ""
   },
   {
    "gvc": "899",
    "name": "Storno",
    "dc": "Soll",
    "btc": "ACMT / ADOP / PSTE",
    "hint": ""
   }
  ]
 },
 {
  "range": "9XX",
  "title": "Unstrukturierter Inhalt",
  "rows": [
   {
    "gvc": "997",
    "name": "Depotaufstellung -> MT 571",
    "dc": "Soll",
    "btc": "XTND / NTAV / NTAV",
    "hint": ""
   },
   {
    "gvc": "999",
    "name": "Unstrukturierte Belegung des Mehrzweckfeldes Feld '86'",
    "dc": "Haben",
    "btc": "XTND / NTAV / NTAV",
    "hint": ""
   },
   {
    "gvc": "999",
    "name": "Unstrukturierte Belegung des Mehrzweckfeldes Feld '86'",
    "dc": "Soll",
    "btc": "XTND / NTAV / NTAV",
    "hint": ""
   }
  ]
 }
],
  cta: 'Ihre camt.053-Datei in EDI Insight öffnen, um die gebuchten Umsätze und ihre Codes zu lesen. Die App ist auf Englisch; das Lesen von Bankdateien ist Teil des Abonnements. Die Datei bleibt in Ihrem Browser.',
  ctaBtn: 'App öffnen',
  source: 'Quelle: Deutsche Kreditwirtschaft, Anhang 1 der Anlage 3 des DFÜ-Abkommens: Mapping GVC – ISO 20022 Bank Transaction Codes, Version 3.9 vom 12.03.2025; Anlage 3: Spezifikation der Datenformate, Version 26.11 vom 09.04.2026, Kapitel 7.1.8.5. Die Anlage 3 V26.11 kündigt eine Aktualisierung des Anhangs an; diese Seite gibt den Stand der Version 3.9 wieder.',
  // Liens ajoutés ailleurs sur le site.
  hubLink: 'Geschäftsvorfallcodes (GVC) im camt.053 und ihr ISO-Bank-Transaction-Code →',
  menuLabel: 'GVC-Codes',
  menuDesc: 'Geschäftsvorfallcodes mit ISO-BTC',
  rueckgabeLink: 'Der GVC dieser Buchungen (108, 109, 159 …) und sein ISO-Code: GVC-Codes →',
};
