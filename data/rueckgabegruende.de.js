'use strict';
/**
 * Page allemande « Rückgabegründe auf dem Kontoauszug » (19/11/2026).
 *
 * Les Allemands cherchent le libellé ou le numéro à trois chiffres de leur relevé
 * (« rücklastschrift sonstige gründe », « rücklastschrift grund 901 »), pas le
 * code ISO. Cette page fait la correspondance.
 *
 * Source : Deutsche Kreditwirtschaft, DFÜ-Abkommen, Anlage 3 « Spezifikation der
 * Datenformate », version 26.11 du 09/04/2026, tableau des Textschlüssel-
 * ergänzungen (p. 776-778). `klartext` = « Vorschlag für Klartext » du document.
 * Volontairement exclus : 919-927 (Recall), 934-937 (cartes), 990-994 (type de
 * prélèvement).
 */
module.exports = {
  slug: 'rueckgabegruende-kontoauszug',
  metaTitle: 'Rückgabegründe auf dem Kontoauszug: 901, 902, 914 und ihre Bedeutung | EDI Insight',
  metaDesc: 'Rücklastschrift mit „Sonstige Gründe“, 901, 902 oder 914 auf dem Kontoauszug? Die Rückgabegründe der Deutschen Kreditwirtschaft mit ihrem ISO-Code und ihrer Bedeutung.',
  kicker: 'Rücklastschrift und Rücküberweisung',
  h1: 'Rückgabegründe auf dem Kontoauszug',
  lead: 'Wird eine Lastschrift oder Überweisung zurückgegeben, zeigt der Kontoauszug einen Rückgabegrund: als Klartext (zum Beispiel „KONTO AUFGELÖST“), als dreistellige Nummer (zum Beispiel 902) oder als ISO-Code (zum Beispiel AC04). Alle drei bezeichnen denselben Grund. Die Tabelle zeigt, welcher zu welchem gehört.',
  intro: 'Die dreistellige Nummer heißt Textschlüsselergänzung. Sie ist in der Spezifikation der Datenformate der Deutschen Kreditwirtschaft (DFÜ-Abkommen, Anlage 3) festgelegt, ebenso der vorgeschlagene Klartext. Der genaue Wortlaut auf Ihrem Kontoauszug kann je nach Bank leicht abweichen.',
  tableTitle: 'Die Rückgabegründe im Überblick',
  cols: ['Nr.', 'Klartext auf dem Kontoauszug', 'ISO-Code', 'Bedeutung'],
  rows: [
    { nr: '901', klartext: 'IBAN FEHLERHAFT', iso: ['AC01'], text: 'Kontonummer fehlerhaft (ungültige IBAN)' },
    { nr: '902', klartext: 'KONTO AUFGELÖST', iso: ['AC04'], text: 'Konto aufgelöst' },
    { nr: '903', klartext: 'KONTO GESPERRT', iso: ['AC06'], text: 'Konto gesperrt' },
    { nr: '904', klartext: 'ZAHLUNGSART FÜR KTO UNZUL', iso: ['AG01'], text: 'Zahlungsart für diesen Kontotyp nicht zugelassen' },
    { nr: '905', klartext: 'TACODE/DATEIFORMAT UNGÜLTIG', iso: ['AG02'], text: 'Transaktions-Code unzulässig, falsches Dateiformat oder falscher Sequenztyp' },
    { nr: '906', klartext: 'RÜCKGABE MANGELS DECKUNG', iso: ['AM04'], text: 'Rückgabe mangels Deckung' },
    { nr: '907', klartext: 'DOPPELEINREICHUNG', iso: ['AM05'], text: 'Doppeleinreichung' },
    { nr: '908', klartext: 'ADRESSANGABEN UNVOLLSTÄNDIG', iso: ['BE04'], text: 'Adresse des Zahlungsempfängers fehlt oder ist unvollständig' },
    { nr: '909', klartext: 'KEIN GÜLTIGES MANDAT/AUTOR', iso: ['MD01'], text: 'Kein gültiges Mandat / keine Autorisierung' },
    { nr: '910', klartext: 'MANDATSDATEN FEHLERHAFT', iso: ['MD02'], text: 'Fehlerhafte oder unvollständige Mandatsinformation' },
    { nr: '911', klartext: 'DATEIFORMAT UNGÜLTIG', iso: ['FF01'], text: 'Ungültiges Dateiformat' },
    { nr: '912', klartext: 'WIDERSPRUCH DURCH ZAHLER', iso: ['MD06'], text: 'Lastschriftwiderspruch durch den Zahlungspflichtigen' },
    { nr: '913', klartext: 'KONTOINHABER VERSTORBEN', iso: ['MD07'], text: 'Kontoinhaber verstorben' },
    { nr: '914', klartext: 'SONSTIGE GRÜNDE', iso: ['MS02', 'MS03', 'AM23'], text: 'Sonstige Gründe' },
    { nr: '915', klartext: 'BIC UNGÜLTIG', iso: ['RC01'], text: 'Bankidentifikationscode fehlerhaft (ungültiger BIC)' },
    { nr: '916', klartext: 'CUT-OFF-ZEIT ÜBERSCHRITTEN', iso: ['TM01'], text: 'Cut-Off-Zeit vor Dateiempfang erreicht / Vorlage zu spät' },
    { nr: '917', klartext: 'AUFSICHTSRECHTLICHE GRÜNDE', iso: ['RR01', 'RR02', 'RR03', 'RR04'], text: 'Ablehnung auf Grund von aufsichtsrechtlichen Vorschriften (je nach Code auch: KONTO/ID ZAHLER FEHLT, NAME/ADRESSE ZAHLER FEHLT, NAME/ADRESSE EMPF. FEHLT)' },
    { nr: '918', klartext: 'SPEZ SERVICE DES ZDL ZAHLER', iso: ['SL01'], text: 'Spezifische Dienstleistung der Bank des Zahlungspflichtigen' },
    { nr: '928', klartext: 'GLÄUBIGER-ID UNGÜLTIG', iso: ['BE05'], text: 'Gläubiger-ID ungültig' },
    { nr: '930', klartext: 'ZAHLER IST VERBRAUCHER', iso: ['AC13'], text: 'Der Zahler ist ein Verbraucher (Firmenlastschrift auf ein Verbraucherkonto)' },
    { nr: '938', klartext: 'VERRECHNUNGSFEHLER', iso: ['ED05'], text: 'Verrechnungsfehler' },
    { nr: '939', klartext: 'TIMEOUT-UND PROZESSGRUENDE', iso: ['AB05', 'AB06', 'AB07', 'AB08', 'AB09', 'AB10'], text: 'Timeout- und Prozessgründe (Echtzeitüberweisung)' },
  ],
  sections: [
    { h2: 'Warum steht bei einer Rücklastschrift so oft „Sonstige Gründe“ (914)?', paras: [
      'Nach der Spezifikation der Deutschen Kreditwirtschaft dürfen einige ISO-Codes für nationale Lastschriften nicht verwendet werden, darunter AM04 (fehlende Deckung) und MD07 (Kontoinhaber verstorben). Sie werden nur weitergegeben, wenn eine ausländische Bank sie sendet. Bei einer Lastschrift innerhalb Deutschlands nennt die Bank des Zahlungspflichtigen deshalb häufig keinen genauen Grund: Auf dem Kontoauszug steht dann 914 „Sonstige Gründe“ (ISO-Code MS02 oder MS03).',
      'Für den Zahlungsempfänger heißt das: Den tatsächlichen Grund erfährt meist nur der Zahlungspflichtige von seiner eigenen Bank. Vor einer erneuten Einreichung sollte er deshalb kontaktiert werden.',
    ] },
    { h2: 'Ich bin Zahlungspflichtiger, ich bin Zahlungsempfänger: was jetzt?', paras: [
      '<strong>Als Zahlungspflichtiger</strong> (die Lastschrift wurde von Ihrem Konto zurückgegeben): Der Zahlungsempfänger hat sein Geld nicht erhalten. Klären Sie mit ihm, wie die Zahlung nachgeholt wird. Steht 914 auf dem Kontoauszug, fragen Sie Ihre Bank nach dem genauen Grund.',
      '<strong>Als Zahlungsempfänger</strong> (Ihre Lastschrift kam zurück): Der Grund entscheidet, ob eine erneute Einreichung sinnvoll ist. Bei 902 (Konto aufgelöst) brauchen Sie eine neue Bankverbindung, bei 909 (kein gültiges Mandat) ein neues Mandat, bei 914 zuerst die Rückmeldung des Zahlungspflichtigen. Die Seite jedes Codes erklärt, was zu prüfen ist.',
    ] },
  ],
  source: 'Quelle: Deutsche Kreditwirtschaft, DFÜ-Abkommen, Anlage 3: Spezifikation der Datenformate, Version 26.11 vom 09.04.2026, Tabelle der Textschlüsselergänzungen.',
  // Libellés des liens ajoutés ailleurs sur le site.
  hubLink: 'Rückgabegrund als Nummer (901, 902, 914 …) oder Klartext auf dem Kontoauszug? Zur Übersicht der Rückgabegründe →',
  asideKey: 'Kontoauszug',
};
