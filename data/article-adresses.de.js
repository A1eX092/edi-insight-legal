'use strict';
/**
 * Referenzartikel „Strukturierte Adressen nach ISO 20022" — deutsche Fassung.
 * Von generate.js getrennt: Der Text lässt sich lesen und aktualisieren, ohne
 * die Generierung anzufassen. Das Datum `updated` wird angezeigt UND als
 * dateModified in den strukturierten Daten verwendet.
 */
module.exports = {
  updated: '2026-09-17',
  updatedLabel: '17. September 2026',
  metaTitle: 'Strukturierte Adressen nach ISO 20022: der vollständige Leitfaden 2026 | EDI Insight',
  metaDesc: "Strukturierte Adressen nach ISO 20022: was sich ändert, die beiden Zeitpläne von Swift und EPC nach den Verschiebungen, die genauen XML-Felder, die französischen Umsetzungsregeln des CFONB und die Fallstricke. Aktualisiert am 17. September 2026.",
  kicker: 'Referenzleitfaden',
  h1: 'Strukturierte Adressen nach ISO 20022',
  sub: 'Was sich ändert, für wen, ab wann, und wie Sie eine französische Adresse fehlerfrei in die strukturierten Felder überführen.',
  lead: "Adressen in Freitextform verschwinden aus den Zahlungsnachrichten. Das Prinzip steht seit Langem fest, doch 2026 wurden innerhalb von drei Wochen zwei Fristen aufgehoben, und die Verwirrung ist groß: Swift und SEPA folgen nicht demselben Zeitplan, Deutschland hält an einem Termin fest, den es in Frankreich nicht mehr gibt, und niemand sagt klar, welche Felder zu füllen sind. Dieser Leitfaden gibt den Stand vom 17. September 2026 wieder.",

  sections: [
    { id: 'essentiel', h2: 'Das Wichtigste in dreißig Sekunden', html: `
<ul>
  <li>Eine Zahlungsadresse muss vom <strong>Freitext</strong> (den Feldern <code>AdrLine</code>) in <strong>getrennte Felder</strong> überführt werden: Straße, Hausnummer, Postleitzahl, Ort, Land.</li>
  <li><strong>Zwei getrennte Zeitpläne</strong>: Swift für den internationalen Zahlungsverkehr, der EPC für SEPA-Zahlungen. Beide wurden im Sommer 2026 verschoben, zu unterschiedlichen Zeitpunkten und aus unterschiedlichen Gründen.</li>
  <li><strong>Ein neuer verbindlicher Termin ist bislang nicht bekannt.</strong> Swift wird den Markt bis Dezember 2026 konsultieren, der EPC wollte auf seiner Sitzung im Oktober entscheiden.</li>
  <li><strong>Einige Märkte haben nichts verschoben</strong>: Die deutschen und luxemburgischen Banken halten für das Ende der alten Dateiformate am 15. November 2026 fest.</li>
  <li>Die Verschiebung ändert nichts an der eigentlichen Aufgabe: <strong>der Qualität Ihrer Stammdaten</strong>. Eine unvollständige Adresse im ERP bleibt unvollständig, unabhängig vom Termin.</li>
</ul>` },

    { id: 'definitions', h2: 'Strukturiert, hybrid, unstrukturiert: die drei Formate', html: `
<p>ISO 20022 beschreibt eine Postanschrift im Block <code>PstlAdr</code>. Es bestehen drei Arten nebeneinander, ihn zu füllen, und ihre Verwechslung ist die häufigste Fehlerquelle.</p>
<p><strong>Unstrukturiert.</strong> Alles steht als Freitext in aufeinanderfolgenden Feldern <code>AdrLine</code>. Dieses Format verschwindet.</p>
<pre class="art-code">&lt;PstlAdr&gt;
  &lt;AdrLine&gt;12 RUE DU FAUBOURG SAINT-HONORE&lt;/AdrLine&gt;
  &lt;AdrLine&gt;75008 PARIS&lt;/AdrLine&gt;
&lt;/PstlAdr&gt;</pre>
<p><strong>Hybrid.</strong> Ort und Land stehen in ihren eigenen Feldern, der Rest bleibt Freitext. Das ist der von Swift und von den SEPA-Rulebooks akzeptierte Kompromiss, und für viele Banken das akzeptable Minimum.</p>
<pre class="art-code">&lt;PstlAdr&gt;
  &lt;TwnNm&gt;PARIS&lt;/TwnNm&gt;
  &lt;Ctry&gt;FR&lt;/Ctry&gt;
  &lt;AdrLine&gt;12 RUE DU FAUBOURG SAINT-HONORE&lt;/AdrLine&gt;
&lt;/PstlAdr&gt;</pre>
<p><strong>Vollständig strukturiert.</strong> Jede Information hat ihr eigenes Feld. Das ist das Ziel, und der EPC empfiehlt, es direkt anzusteuern, ohne den Umweg über die hybride Stufe.</p>
<pre class="art-code">&lt;PstlAdr&gt;
  &lt;StrtNm&gt;12 RUE DU FAUBOURG SAINT-HONORE&lt;/StrtNm&gt;
  &lt;PstCd&gt;75008&lt;/PstCd&gt;
  &lt;TwnNm&gt;PARIS&lt;/TwnNm&gt;
  &lt;Ctry&gt;FR&lt;/Ctry&gt;
&lt;/PstlAdr&gt;</pre>
<p>Ein Punkt sei gleich hervorgehoben, weil er oft überrascht: Im obigen Beispiel bleibt die Hausnummer mit der Straße verbunden. Das ist keine Ungenauigkeit, sondern die Regel des französischen CFONB-Leitfadens, die für französische Adressen gilt. Weiter unten kommen wir darauf zurück.</p>` },

    { id: 'champs', h2: 'Die Felder und ihre Längen', html: `
<p>Hier sind die Felder, die Ihnen in einem <code>PstlAdr</code> begegnen, mit ihrer Höchstlänge. Wird die Länge überschritten, wird die Datei bereits bei der Annahme zurückgewiesen, noch bevor sie die kontoführende Bank des Zahlungsempfängers erreicht.</p>
<table class="art-table">
  <thead><tr><th>Feld</th><th>Inhalt</th><th>Länge</th></tr></thead>
  <tbody>
    <tr><td><code>StrtNm</code></td><td>Straßenname (einschließlich Hausnummer, siehe unten)</td><td>70</td></tr>
    <tr><td><code>BldgNb</code></td><td>Hausnummer, nur wenn sie getrennt geliefert wird</td><td>16</td></tr>
    <tr><td><code>BldgNm</code></td><td>Gebäudename: nach dem französischen CFONB-Leitfaden nicht zu verwenden</td><td>35</td></tr>
    <tr><td><code>Flr</code></td><td>Etage, Wohnanlage, Gebäude, Gewerbegebiet</td><td>70</td></tr>
    <tr><td><code>Room</code></td><td>Wohnung, Tür, Büro</td><td>70</td></tr>
    <tr><td><code>PstBx</code></td><td>Postfach</td><td>16</td></tr>
    <tr><td><code>PstCd</code></td><td>Postleitzahl</td><td>16</td></tr>
    <tr><td><code>TwnNm</code></td><td>Ort</td><td>35</td></tr>
    <tr><td><code>TwnLctnNm</code></td><td>Ortsteil, Stadtviertel</td><td>35</td></tr>
    <tr><td><code>CtrySubDvsn</code></td><td>Region, Bundesland, Provinz</td><td>35</td></tr>
    <tr><td><code>Ctry</code></td><td>Ländercode nach ISO 3166-1 alpha-2, zwei Buchstaben</td><td>2</td></tr>
    <tr><td><code>AdrLine</code></td><td>Freie Zeile, im Auslaufen begriffen</td><td>70</td></tr>
  </tbody>
</table>
<p>Das überall geforderte Minimum, auch in der hybriden Fassung, sind <code>TwnNm</code> und <code>Ctry</code>. Eine Adresse ohne Ort oder ohne Land ist der häufigste Grund für eine Rückweisung und zugleich der Fall, der sich vor dem Versand am einfachsten erkennen lässt.</p>` },

    { id: 'calendriers', h2: 'Zwei Zeitpläne, die nicht verwechselt werden dürfen', html: `
<p>Hier irren sich die meisten Teams. Die von Swift angekündigte Verschiebung betrifft die SEPA-Überweisungen nicht, und umgekehrt. Beide Welten haben ihre eigenen Regeln, Gremien und Termine.</p>
<table class="art-table">
  <thead><tr><th>Bereich</th><th>Wer entscheidet</th><th>Aktueller Stand</th></tr></thead>
  <tbody>
    <tr>
      <td>Internationaler Zahlungsverkehr (CBPR+)</td>
      <td>Swift</td>
      <td>Am 27. August 2026 hat Swift die für den 14. November 2026 vorgesehene Anforderung für Zahlungen verschoben. Ein neuer Termin wird nach einer Konsultation festgelegt, bis Dezember 2026. Die Änderungen außerhalb des Zahlungsverkehrs (Wertpapiere, Trade) verschieben sich auf das erste Quartal 2027.</td>
    </tr>
    <tr>
      <td>SEPA-Überweisungen und SEPA-Lastschriften</td>
      <td>European Payments Council</td>
      <td>Am 9. September 2026 hat der EPC die Frist zum 15. November 2026 in allen fünf Rulebooks aufgehoben (SCT, SCT Inst, SDD Core, SDD B2B, OCT Inst). Der neue Termin sollte auf der Sitzung im Oktober festgelegt werden, die überarbeiteten Rulebooks und Guidelines folgen danach.</td>
    </tr>
    <tr>
      <td>Euro-Großbetragszahlungen</td>
      <td>Eurosystem (T2, TIPS, T2S, ECMS)</td>
      <td>Die November-Releases wurden vom 14. auf den 28. November 2026 verschoben, mit Nutzertests ab dem 9. Oktober. T2 toleriert vorübergehend vollständig unstrukturierte Adressen.</td>
    </tr>
    <tr>
      <td>Deutschland und Luxemburg</td>
      <td>Nationale Bankengemeinschaften</td>
      <td>Bei den Formaten wurde nichts verschoben: Das Ende der alten Dateiversionen (pain in der Version 2009, DTAZV, MT101 in Luxemburg) bleibt für den 15. November 2026 angekündigt, mit strukturierter Adresse mindestens für Ort und Land. Bei jeder Bank einzeln zu bestätigen.</td>
    </tr>
  </tbody>
</table>
<p>Mit anderen Worten: Wenn Sie ausschließlich SEPA einreichen, betrifft Sie der Swift-Termin nicht. Wenn Sie Lieferanten über eine deutsche oder luxemburgische Bank bezahlen, schützt Sie die europäische Verschiebung nicht vor einem Formatwechsel im November. Und wenn Sie beides tun, führen Sie zwei Projekte, nicht eines.</p>` },

    { id: 'report', h2: 'Was die Verschiebung ändert und was nicht', html: `
<p>Zwei Verschiebungen in drei Wochen haben eine absehbare Wirkung gehabt: gestoppte Projekte, umgewidmete Budgets, Teams, die auf andere Prioritäten verteilt wurden. Das ist das Hauptrisiko dieser Phase.</p>
<p><strong>Was die Verschiebung wirklich ändert:</strong> den Termindruck, und damit die Möglichkeit, sauber zu arbeiten. Stammdaten in einem ruhigen Zeitfenster und mit Tests zu bereinigen, ist etwas völlig anderes als dieselbe Arbeit drei Wochen vor einem Stichtag.</p>
<p><strong>Was sie nicht ändert:</strong> die Richtung. Die Pflicht ist nicht aufgehoben, sie ist verschoben. Und vor allem ändert sie nichts am Zustand Ihrer Daten. Eine Adresse ohne Ort bleibt im Juni wie im November eine Adresse ohne Ort.</p>
<p>Es gibt sogar einen weniger sichtbaren Effekt: Eine Zahlungsschnittstelle anzupassen dauert Monate, das Datenmodell anzupassen, das die Konten führt, dauert Jahre. Die zweite Arbeit ist die einzige, die langfristig zählt, und genau sie wird am leichtesten aufgeschoben, sobald der Termin wegfällt.</p>
<p>Der richtige Umgang mit diesem Zeitfenster lässt sich in einem Satz sagen: Behalten Sie den eingeplanten Zeitraum, nicht wegen der Compliance, die warten kann, sondern wegen der Datenqualität, die sich nicht von selbst verbessert.</p>` },

    { id: 'qui', h2: 'Wer wirklich betroffen ist und wann die Adresse Pflicht ist', html: `
<p>Eine Unterscheidung, die Monate unnötiger Arbeit erspart: <strong>Die Adresse des Zahlungsempfängers ist keine Pflichtangabe der SEPA-Überweisung</strong>. Viele Unternehmen übermitteln gar keine, und ihre Dateien laufen problemlos durch. Die Frage stellt sich nur in drei Fällen.</p>
<ul>
  <li><strong>Sie übermitteln bereits eine Adresse.</strong> Sobald sie in der Nachricht vorhanden ist, muss sie dem geltenden Format entsprechen. Eine unvollständige Adresse ist mitunter weniger wert als gar keine Adresse.</li>
  <li><strong>Ihre Bank verlangt sie</strong> für bestimmte Arten von Aufträgen, oder ihr Portal weist Dateien ohne Adresse ab.</li>
  <li><strong>Sie zahlen außerhalb des europäischen Raums</strong>: internationaler Zahlungsverkehr, One-Leg-Transaktionen, Sanktionsprüfungen. Dort ist die Adresse die Regel, und dort gilt der Zeitplan von Swift.</li>
</ul>
<p>Bevor Sie eine vollständige Überarbeitung Ihrer Stammdaten anstoßen, prüfen Sie also, was Sie heute tatsächlich versenden. Ein Export Ihrer letzten Zahlungsdateien beantwortet die Frage in wenigen Minuten.</p>` },

    { id: 'cfonb', h2: 'Französische Adressen umsetzen: die Regeln des französischen CFONB-Leitfadens', html: `
<p>Der CFONB hat einen Leitfaden für die Umsetzung der französischen Postnorm NF Z10-011 nach ISO 20022 veröffentlicht. Er ist in Frankreich das maßgebliche Dokument und gilt für französische Adressen. Er enthält mehrere Regeln, die der Intuition widersprechen und in Projekten zu spät entdeckt werden. Wenn Sie französische Empfänger bezahlen, betreffen sie Sie unmittelbar.</p>
<h3>Die Hausnummer wird nicht von der Straße getrennt</h3>
<p>Das ist die am wenigsten bekannte Regel. Die Hausnummer füllt <code>BldgNb</code> <strong>nur dann</strong>, wenn sie in einem eigenen Feld Ihrer Quelldatei ankommt. Steht sie in der Adresszeile, verlangt der Leitfaden ausdrücklich, nicht zu trennen: Das Ganze geht nach <code>StrtNm</code>, und <code>BldgNb</code> bleibt leer. Die Beispiele des Leitfadens sind eindeutig, „22BIS RUE DES FLEURS" geht ebenso vollständig hinein wie „25D RUE DES FLEURS".</p>
<p>Der praktische Grund liegt auf der Hand, sobald man das Gegenteil versucht: „Rue du 8 Mai 1945" und „Avenue du 11 Novembre" eignen sich schlecht für eine automatische Erkennung der Hausnummer. Um jeden Preis zu trennen heißt, falsche Adressen zu erzeugen.</p>
<h3>Der Gebäudename wird nicht verwendet</h3>
<p>Der Leitfaden untersagt <code>BldgNm</code> in beiden Fällen, bei Unternehmen wie bei Privatpersonen. Eine Wohnanlage, ein Gebäude, ein Eingang, ein Gewerbegebiet gehören nach <code>Flr</code>. Der Grund ist eine reine Rechenfrage: <code>BldgNm</code> ist auf 35 Zeichen begrenzt, während eine Zeile nach NF Z10-011 38 Zeichen umfasst. <code>Flr</code> nimmt 70 auf.</p>
<h3>Postfächer und CEDEX</h3>
<p>„BP 40122" geht nach <code>PstBx</code>. Der Zusatz CEDEX bleibt dagegen beim Ort: Aus „75008 PARIS CEDEX 08" wird <code>PstCd</code> 75008 und <code>TwnNm</code> PARIS CEDEX 08. Es handelt sich um eine Zustellangabe, nicht um eine eigene Adresszeile.</p>
<h3>Etage und Wohnung bei Privatpersonen</h3>
<p>Die zweite Zeile einer Privatadresse (Etage, Wohnung, Aufgang) füllt <code>Flr</code> und <code>Room</code>. Bei einem Unternehmen trägt dieselbe Position die Abteilung oder den Empfänger und geht nach <code>Dept</code>.</p>
<h3>Der Zeichensatz</h3>
<p>Der französische CFONB-Leitfaden beschreibt drei Stufen, und das ist eine Quelle unauffälliger Rückweisungen:</p>
<ul>
  <li>Der lateinische Basiszeichensatz wird immer akzeptiert.</li>
  <li>Akzente und das Zeichen @ sind nur aufgrund einer bilateralen Vereinbarung zwischen Ihnen und Ihrer Bank zulässig: Sie laufen also häufig durch, garantiert ist das aber nicht.</li>
  <li>Alles Übrige ist unzulässig, einschließlich zweier Zeichen, die Textverarbeitungen von selbst einsetzen: das typografische Apostroph und der lange Gedankenstrich.</li>
</ul>
<p>Ein aus einem Word-Dokument kopiertes „L'Haÿ-les-Roses" kann somit ein Zeichen enthalten, das für das Auge unsichtbar und für die Bank blockierend ist.</p>` },

    { id: 'pieges', h2: 'Fallstricke, die Zeit kosten', html: `
<ul>
  <li><strong>Das aus der Postleitzahl abgeleitete Land.</strong> Vier Ziffern, das kann Belgien, Luxemburg oder die Schweiz sein. Fünf Ziffern, Frankreich oder Deutschland. Eine automatische Ableitung ohne deklarierten Ländercode erzeugt stille Fehler: Die Datei läuft durch, die Zahlung landet in den Prüfungen an der falschen Stelle.</li>
  <li><strong>Die stimmige, aber falsche Adresse.</strong> Eine in der Fachpresse zitierte Prüfung ergab 92 % gefüllte Ortsangaben, aber nur 64 % über die Felder hinweg stimmige Adressen. Das Format sagt nichts über die Richtigkeit aus.</li>
  <li><strong>Die Längen.</strong> Ein Ort mit mehr als 35 Zeichen, eine lange ausländische Postleitzahl, und die Nachricht wird abgelehnt.</li>
  <li><strong>Das Hybridformat als Ziel missverstanden.</strong> Es wird akzeptiert, doch der EPC empfiehlt, direkt das vollständig strukturierte Format anzusteuern. Das Projekt zweimal zu machen kostet mehr, als es einmal richtig zu machen.</li>
  <li><strong>Ausländische Adressen wie französische behandelt.</strong> Die Regeln nach NF Z10-011 gelten ausschließlich für französische Adressen. Eine niederländische oder deutsche Adresse folgt einer eigenen Postleitzahlenlogik.</li>
  <li><strong>Lieber das leere als das falsche Feld.</strong> Wenn Ihnen die Information fehlt, erfinden Sie sie nicht. Eine fehlende Adresse lässt sich leichter nachholen als eine erfundene.</li>
</ul>` },

    { id: 'chantier', h2: 'Den Aufwand beziffern und das Projekt führen', html: `
<p>Die Kosten einer Adressmigration hängen nicht von den Regeln ab, die auf wenigen Seiten Platz finden. Sie hängen davon ab, welcher Anteil Ihrer Adressen von diesen Regeln nicht abgedeckt wird. Diese Zahl kann Ihnen niemand nennen: Sie steckt in Ihrem eigenen Bestand.</p>
<p>Exportieren Sie Ihre Adressspalte und stellen Sie ihr vier Fragen.</p>
<ol>
  <li><strong>Wie viele Zeilen beginnen mit einer Zahl gefolgt von einem Leerzeichen?</strong> Das sind Ihre einfachen Fälle.</li>
  <li><strong>Wie viele haben keine Hausnummer?</strong> Sie sind nicht fehlerhaft, sie verlangen eine eigene Regel.</li>
  <li><strong>Wie viele enthalten „Gebäude", „Wohnung", „Wohnanlage", „Etage", „BP", „CS" oder „CEDEX"?</strong> Das sind Ihre Zusatzangaben, und sie gehören nicht alle in dasselbe Feld.</li>
  <li><strong>Wie viele haben weder einen brauchbaren Ort noch ein brauchbares Land?</strong> Nur diese werden wirklich blockieren.</li>
</ol>
<p>Die Summe der beiden letzten Kategorien, bezogen auf Ihr Volumen, ist Ihre manuelle Nacharbeit. Diese Zahl bestimmt das Budget, und sie gehört Ihnen, noch bevor Sie einen Dienstleister ansprechen.</p>
<p>Das weitere Vorgehen hat dann drei Schritte: an der Quelle im ERP korrigieren statt am Ausgang, eine echte Datei im Portal Ihrer Bank testen, bevor Sie ausrollen, und eine Eingabeprüfung einrichten, damit der Bestand nicht erneut verfällt.</p>` },

    { id: 'banque', h2: 'Die sechs Fragen an Ihre Bank', html: `
<p>Die Marktregeln setzen einen Rahmen, doch jedes Institut wendet ihn auf seine Weise an, und die Termine unterscheiden sich von Bank zu Bank. Das sollten Sie sich klären lassen, möglichst schriftlich.</p>
<ol>
  <li><strong>Welchen Termin setzen Sie an</strong> für das Ende der unstrukturierten Adressen, im SEPA-Raum und international, nach den Verschiebungen des Sommers 2026?</li>
  <li><strong>Akzeptieren Sie das Hybridformat</strong> (Ort und Land strukturiert, der Rest als freie Zeile), und bis wann?</li>
  <li><strong>Welche Nachrichtenversionen</strong> akzeptieren Sie und bis wann: pain.001.001.03 oder .09, pain.008.001.02 oder .08, MT101?</li>
  <li><strong>Wie verfahren Sie mit einer unvollständigen Adresse</strong>: Rückweisung der gesamten Datei, Rückweisung des einzelnen Auftrags oder Annahme mit Warnung?</li>
  <li><strong>Verfügen Sie über eine Testumgebung</strong>, in der ich eine echte Datei einreichen kann, ohne sie zu signieren?</li>
  <li><strong>Wenden Ihre ausländischen Töchter dieselben Regeln an?</strong> Dort verstecken sich die Überraschungen häufig, besonders in Deutschland und Luxemburg.</li>
</ol>
<p>Die vierte Frage ist die nützlichste: Sie entscheidet darüber, ob eine unvollkommene Adresse eine Zahlung oder eine ganze Datei kostet.</p>` },
  ],

  faq: [
    { q: 'Ist der 15. November 2026 weiterhin die Frist für SEPA-Überweisungen?', a: 'Nein. Am 9. September 2026 hat der EPC diesen Termin in allen fünf Rulebooks aufgehoben. Ein neuer Termin sollte auf der Sitzung im Oktober 2026 festgelegt werden. Die deutsche und die luxemburgische Bankengemeinschaft halten dagegen für das Ende der alten Dateiformate am 15. November 2026 fest.' },
    { q: 'Sollte man über das Hybridformat gehen oder direkt vollständig strukturiert?', a: 'Beides wird akzeptiert. Der EPC empfiehlt den direkten Übergang zum vollständig strukturierten Format, ohne hybride Zwischenstufe, damit das Projekt nicht zweimal geführt werden muss. Das Hybridformat bleibt nützlich, solange Ihre Daten noch nicht mehr hergeben: Ort und Land in ihren eigenen Feldern, der Rest als freie Zeile.' },
    { q: 'Muss ich die Adresse meiner SEPA-Zahlungsempfänger angeben?', a: 'Sie ist keine Pflichtangabe der SEPA-Überweisung. Wenn Sie keine übermitteln, stellt sich die Frage nicht. Sobald Sie eine übermitteln, muss sie dem geltenden Format entsprechen. Bei Zahlungen außerhalb des europäischen Raums ist die Adresse dagegen die Regel.' },
    { q: 'Muss die Hausnummer vom Straßennamen getrennt werden?', a: 'Nur wenn die Hausnummer in einem eigenen Feld Ihrer Quelldatei ankommt. Steht sie in der Adresszeile, verlangt der französische CFONB-Leitfaden, nicht zu trennen: Hausnummer und Straße gehen zusammen nach StrtNm, BldgNb bleibt leer. Diese Regel gilt für französische Adressen.' },
    { q: 'Was macht man mit CEDEX und Postfächern?', a: 'Das Postfach geht nach PstBx. Der Zusatz CEDEX, eine französische Besonderheit, bleibt beim Ort: Aus „75008 PARIS CEDEX 08" wird PstCd 75008 und TwnNm PARIS CEDEX 08.' },
    { q: 'Darf ich Umlaute und Akzente in den Adressen behalten?', a: 'Akzente, Umlaute und das Zeichen @ sind nur aufgrund einer bilateralen Vereinbarung mit Ihrer Bank zulässig: In den meisten Fällen werden sie toleriert, garantiert ist das aber nicht. Unzulässig sind dagegen das typografische Apostroph und der lange Gedankenstrich, die von Textverarbeitungen oft automatisch eingesetzt werden.' },
    { q: 'Ich habe nur Ort und Land. Reicht das?', a: 'Für das Hybridformat ja, es verlangt genau diese beiden Angaben in ihren eigenen Feldern. Es ist nicht das empfohlene Ziel, aber es wird akzeptiert und es steht weit über einer vollständig freien Adresse.' },
    { q: 'Werden meine Dateien im Format pain.001.001.03 noch akzeptiert?', a: 'Das hängt von Ihrer Bank und von Ihrem Land ab. In Frankreich schreibt derzeit nichts einen Wechsel zu einem festen Termin vor. In Deutschland und Luxemburg ist das Ende der Versionen von 2009 für den 15. November 2026 angekündigt, zugunsten von pain.001.001.09 und pain.008.001.08. Fragen Sie bei jeder Bank einzeln nach, die Termine unterscheiden sich von Institut zu Institut.' },
    { q: 'Wer muss die Adressen korrigieren: mein ERP oder meine Bank?', a: 'Ihr ERP. Die Bank kann prüfen und zurückweisen, sie kann eine fehlende Angabe nicht erfinden. Die Adressen leben in Ihren Stammdaten, dort ist die Korrektur dauerhaft; eine Korrektur am Dateiausgang wiederholt sich bei jeder Einreichung.' },
    { q: 'Wie finde ich heraus, wie viele Adressen Probleme machen werden?', a: 'Indem Sie in Ihrem eigenen Bestand zählen: den Anteil der Adressen ohne brauchbaren Ort und ohne brauchbares Land, und den Anteil der Zusatzangaben (Gebäude, Wohnung, Postfach, CEDEX). Dieses Volumen bestimmt die Kosten des Projekts, nicht die Regeln.' },
  ],

  ctaMid: {
    text: 'Sie können diese Regeln an Ihren eigenen Daten testen: Der Konverter von EDI Insight wendet den französischen CFONB-Leitfaden auf eine pain.001-Datei oder einen CSV-Export an, einschließlich der Fälle, in denen die Regel lautet, nicht zu trennen, und gibt Ihnen die konvertierten Adressen zurück, die zu prüfenden und die blockierenden.',
    btn: 'Adresskonverter testen →',
  },
  ctaEnd: {
    title: 'Ihre Adressen konvertieren',
    text: 'Laden Sie eine pain.001-Datei oder einen CSV-Export hoch und erhalten Sie Ihre Adressen im strukturierten oder hybriden Format, mit der Liste derjenigen, die eine manuelle Nacharbeit erfordern. Die Auswertung läuft in Ihrem Browser, Ihre Dateien werden nicht übertragen.',
    btn: 'Konverter öffnen →',
  },
  faqTitle: 'Häufige Fragen',
  tocTitle: 'Inhalt',
  updatedPrefix: 'Aktualisiert am',
  note: 'Dieser Leitfaden verfolgt die Entwicklung der Fristen: Die Termine werden bei jeder Aktualisierung geprüft. Sobald Swift oder der EPC einen neuen Termin bekannt geben, wird diese Seite korrigiert.',
};
