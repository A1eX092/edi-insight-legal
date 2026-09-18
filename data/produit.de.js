/** Produktseiten — Deutsch. Gleiche Reihenfolge wie produit.fr.js. */
module.exports = {
  hubTitle: 'Die Module von EDI Insight',
  hubDesc: 'Vier Module, eine Datei zum Ablegen: Prüfung, Adressumwandlung, Dateierzeugung und Rückweisungsdiagnose. Alles läuft im Browser, ohne Installation und ohne Integrationsprojekt.',
  modules: [
    {
      slug: 'sepa-dateipruefung',
      nav: 'Dateiprüfung',
      navDesc: 'SCT, SDD, XCT, ICT — Regel für Regel',
      kicker: 'Modul — Prüfung',
      teaser: 'Schema-Struktur, Pflichtfelder, IBAN, Zeichensatz, Feldlängen und Kontrollsummen: die Datei wird Regel für Regel geprüft, jede Abweichung wird im XML verortet.',
      h1: 'Eine SEPA-Datei prüfen, bevor sie zur Bank geht',
      title: 'SEPA-Datei prüfen (SCT, SDD, XCT, ICT) vor dem Versand — EDI Insight',
      desc: 'Legen Sie eine Überweisungs- oder Lastschriftdatei ab: Schema-Struktur, Pflichtfelder, IBAN, Zeichensatz, Längen und Summen werden geprüft, jede Abweichung im XML verortet. Kostenlos, ohne Installation, lokale Verarbeitung.',
      lead: 'Eine von der Bank abgewiesene Datei bedeutet einen Tag Verzug, einen zu spät bezahlten Lieferanten und einen halben Tag Suche nach der fehlerhaften Zeile in einem XML mit tausenden Zeilen. Die Prüfung beantwortet genau eine Frage: geht diese Datei durch?',
      sections: [
        {
          h2: 'Was geprüft wird',
          p: 'Die Datei wird an den Regeln gemessen, die tatsächlich zu Rückweisungen führen — nicht nur an der XML-Grammatik.',
          list: [
            '<b>Schema-Struktur</b> — Konformität zur angegebenen ISO-20022-Nachricht, unbekannte oder falsch verschachtelte Felder.',
            '<b>Pflichtfelder</b> — Vorhandensein und Reihenfolge der von Nachricht und Rulebook geforderten Elemente.',
            '<b>Bankverbindungen</b> — IBAN-Format und Prüfziffer, Stimmigkeit von IBAN, BIC und Land.',
            '<b>Zeichensatz</b> — Zeichen außerhalb des akzeptierten Bankzeichensatzes, Umlaute und Sonderzeichen, die eine Einreichung scheitern lassen.',
            '<b>Längen und Formate</b> — abgeschnittene Felder, Ausführungsdaten, Währungen, Betragsformate.',
            '<b>Summen und Zähler</b> — angegebene Postenzahl und Kontrollsumme gegen den tatsächlichen Inhalt.',
            '<b>Adressen</b> — Erkennung unstrukturierter Adressen im Übergang zum ISO-20022-Format.',
          ],
        },
        {
          h2: 'Was Sie erhalten',
          p: 'Einen lesbaren Bericht statt einer Liste von Parser-Fehlern. Jede Abweichung nennt das betroffene Feld und seine Position in der Datei, mit der nötigen Korrektur und der Herkunft der Regel.',
          list: [
            'Die Liste der Abweichungen, von blockierend bis Hinweis.',
            'Feld und Zeile genau, zur Korrektur im Quellsystem.',
            'Die zugrunde liegende Regel: Rulebook, Schema oder Bankpraxis.',
            'Die Zusammenfassung der Einreichung: Postenzahl, Summe, Daten, Auftraggeber.',
          ],
        },
        {
          h2: 'Worauf sich die Prüfungen stützen',
          p: 'Die Regeln sind nicht aus Beispielen abgeleitet: sie stammen aus den Referenztexten und werden mit ihnen aktualisiert.',
          list: [
            'Die geltenden EPC-Rulebooks für SEPA-Überweisung und -Lastschrift.',
            'Die CFONB-Leitfäden, insbesondere für Adressen und Zeichensatz.',
            'Die ISO-20022-Schemata für pain.001, pain.008, pain.002 und pacs.002.',
            'Die bekannten Abweichungen zwischen Norm und tatsächlicher Bankpraxis.',
          ],
        },
      ],
      faq: [
        { q: 'Wird meine Datei an einen Server gesendet?', a: 'Nein. Die Analyse läuft in Ihrem Browser: die Datei wird weder übertragen noch gespeichert. Genau das erlaubt den Einsatz an echten Einreichungen ohne IT-Sicherheitsfreigabe.' },
        { q: 'Welche Dateitypen werden akzeptiert?', a: 'SEPA-Überweisungen und -Lastschriften (SCT, SCT Inst, SDD Core und B2B) sowie Überweisungen außerhalb des SEPA-Raums und internationale Überweisungen (XCT, ICT), in den Nachrichten pain.001 und pain.008. Statusmeldungen pain.002 und pacs.002 liest das Diagnosemodul.' },
        { q: 'Kostet die Prüfung etwas?', a: 'Nein, die Dateiprüfung ist kostenlos und unbegrenzt, ebenso der Vergleich zweier Dateien und die Einsicht in die Referenzdaten.' },
        { q: 'Ersetzt das einen Test mit meiner Bank?', a: 'Nein. Die Prüfung beseitigt Formfehler, die den Großteil der Rückweisungen ausmachen, aber jede Bank behält ihre eigenen Kontrollen. Das Werkzeug weist zudem auf Stellen hin, an denen die Bankpraxis von der Norm abweicht.' },
      ],
    },
    {
      slug: 'adressumwandlung',
      nav: 'Adressumwandlung',
      navDesc: 'Freies Format nach ISO 20022',
      kicker: 'Modul — strukturierte Adressen',
      teaser: 'Von freien Adresszeilen zu ISO-20022-Feldern nach dem CFONB-Leitfaden — einschließlich der Fälle, in denen die Zeile nicht zerlegt werden darf. Konfidenzwert und XML-Export.',
      h1: 'Eine Adresse in das ISO-20022-Format umwandeln',
      title: 'Adressumwandlung in strukturierte ISO-20022-Adressen — EDI Insight',
      desc: 'Wandeln Sie Adressen im freien Format in strukturierte ISO-20022-Adressen um: StrtNm, BldgNb, PstCd, TwnNm, Ctry, nach dem CFONB-Leitfaden, mit Konfidenzwert und XML-Export.',
      lead: 'Eine Adresse passt in drei freie Zeilen. Die Bank erwartet jetzt getrennte Felder. Dazwischen liegen Umsetzungsregeln, Fälle in denen man die Zeile nicht zerlegen darf, und ein ganzer Stammdatenbestand.',
      sections: [
        {
          h2: 'Vom freien Format zu den Feldern',
          p: 'Jede Adresszeile wird analysiert und auf die Elemente des Blocks <code>PstlAdr</code> verteilt: Straßenname, Hausnummer, Gebäude, Etage, Postfach, Postleitzahl, Ort, Verwaltungseinheit und Land.',
          list: [
            '<b>Strukturiertes Format</b> — jede Information in ihrem Feld, so wie es die neuen Formate verlangen.',
            '<b>Hybrides Format</b> — Ort, Postleitzahl und Land strukturiert, der Rest als Adresszeilen, wo dies der zulässige Kompromiss ist.',
            '<b>Konfidenzwert</b> — mehrdeutige Adressen werden markiert statt willkürlich zerlegt.',
            '<b>Export</b> — der XML-Block, bereit zur Übernahme in Ihre Stammdaten.',
          ],
        },
        {
          h2: 'Die Fälle, in denen nicht zerlegt wird',
          p: 'Hier gehen die meisten Umwandlungen schief. Ein Abteilungsname, ein Adresszusatz, ein Ortsteil oder eine Zustellstelle ist kein Straßenname: wer ihn in <code>StrtNm</code> zwingt, erzeugt eine schemakonforme, aber falsche Adresse — und mitunter eine von der Bank abgewiesene. Die Umwandlung folgt den CFONB-Regeln, einschließlich derer, die vorsehen, die Zeile unverändert zu lassen.',
        },
        {
          h2: 'Warum jetzt',
          p: 'Swift hat seine Frist am 27. August 2026 verschoben und das EPC seine am 9. September aufgehoben — die Pflicht entfällt damit nicht, sie verschiebt sich. Die deutschen Banken halten bei den Dateiformaten am 15. November 2026 fest. Diese Verschiebung ist das ideale Fenster, um den Adressbestand ohne Druck umzustellen.',
          link: { label: 'Den vollständigen Leitfaden zu strukturierten Adressen lesen', href: 'ARTICLE' },
        },
      ],
      faq: [
        { q: 'Was unterscheidet strukturiert von hybrid?', a: 'Im strukturierten Format hat jede Information ihr eigenes Feld (Straßenname, Hausnummer, Postleitzahl, Ort, Land). Im hybriden Format sind nur Ort, Postleitzahl und Land strukturiert, der Rest bleibt in Adresszeilen. Beide bestehen heute nebeneinander, je nach Kanal und Bank.' },
        { q: 'Kann ich meinen gesamten Bestand auf einmal umwandeln?', a: 'Ja, die Stapelverarbeitung gehört zum Umwandlungs-Abo. Adressen mit niedrigem Konfidenzwert werden zur manuellen Prüfung ausgesondert statt blind umgewandelt.' },
        { q: 'Werden ausländische Adressen unterstützt?', a: 'Die feine Umsetzung folgt dem CFONB-Leitfaden, also französischen Adressen. Ausländische Adressen werden über die universellen Elemente behandelt (Postleitzahl, Ort, Land); Zeilen bleiben erhalten, wenn die Zerlegung nicht sicher ist.' },
        { q: 'Werden meine Adressen irgendwohin übertragen?', a: 'Nein. Wie bei der Prüfung läuft die Umwandlung in Ihrem Browser: keine Stammdaten verlassen Ihren Arbeitsplatz.' },
      ],
    },
    {
      slug: 'dateigenerator',
      nav: 'Dateigenerator',
      navDesc: 'Von der CSV zur Zahlungsdatei',
      kicker: 'Modul — Erzeugung',
      teaser: 'Ein CSV-Export wird zu einer konformen Überweisung oder Lastschrift, bei der Erzeugung geprüft — oder zu einem rein fiktiven Testbestand für Ihre Kontrollen.',
      h1: 'Eine Überweisungs- oder Lastschriftdatei aus einer CSV erzeugen',
      title: 'SEPA-Datei (pain.001, pain.008) aus einer CSV erzeugen — EDI Insight',
      desc: 'Ein CSV-Export aus Ihrem System wird zu einer konformen Überweisungs- oder Lastschriftdatei, bei der Erzeugung geprüft — oder zu einem fiktiven Testbestand für Ihre eigenen Kontrollen.',
      lead: 'Nicht jede Organisation hat ein System, das eine Bankdatei erzeugen kann. Wenn die Einreichung in einer Tabelle vorbereitet wird, ist die Frage nicht theoretisch: wie werden aus diesen Zeilen eine Datei, die die Bank annimmt?',
      sections: [
        {
          h2: 'Zwei Verwendungen',
          list: [
            '<b>Eine echte Datei</b> — aus Ihrem CSV-Export: Empfänger, IBAN, Beträge, Referenzen, Ausführungsdatum. Das Ergebnis ist eine konforme Überweisung oder Lastschrift, bereit zur Einreichung.',
            '<b>Ein fiktiver Testbestand</b> — glaubwürdige, aber vollständig erfundene Einreichungen, um eigene Kontrollen, eine Abnahme oder eine Bankeinrichtung ohne echte Daten zu erproben.',
          ],
        },
        {
          h2: 'Bei der Erzeugung geprüft',
          p: 'Die erzeugte Datei durchläuft dieselben Regeln wie das Prüfmodul: sie verlässt das Werkzeug nicht mit einem bekannten Formfehler. CSV-Zeilen, die sich nicht umwandeln lassen, werden mit Begründung aufgeführt statt stillschweigend übergangen.',
          list: [
            'IBAN-Format und Prüfziffer.',
            'Bankzeichensatz und Feldlängen bei Verwendungszwecken und Referenzen.',
            'Stimmigkeit von Beträgen, Währungen und Summen der Einreichung.',
            'Pflichtfelder der Nachricht und des geltenden Rulebooks.',
          ],
        },
        {
          h2: 'Was erzeugt wird',
          p: 'Überweisungseinreichungen (pain.001) und Lastschrifteinreichungen (pain.008) in den geltenden Versionen, mit Adressblöcken im strukturierten Format, sofern die Information vorliegt.',
        },
      ],
      faq: [
        { q: 'Welche Spalten muss meine CSV enthalten?', a: 'Die erwarteten Spalten werden im Werkzeug genannt und eine Vorlage steht bereit: Empfänger, IBAN, Betrag, Referenz, Ausführungsdatum und die Adresse, falls Sie sie übermitteln. Die Reihenfolge der Spalten spielt keine Rolle.' },
        { q: 'Ist die erzeugte Datei produktiv nutzbar?', a: 'Ja, dafür ist sie gedacht. Wie bei jeder ersten Einreichung über einen neuen Kanal empfiehlt sich vorher ein Test mit Ihrer Bank.' },
        { q: 'Und die Mandatsverwaltung bei Lastschriften?', a: 'Mandatsreferenzen und Sequenzangaben werden aus Ihrer CSV übernommen: das Werkzeug erzeugt die Datei und prüft die Stimmigkeit, es führt kein Mandatsregister für Sie.' },
      ],
    },
    {
      slug: 'rueckweisungsdiagnose',
      nav: 'Rückweisungsdiagnose',
      navDesc: 'Vom Code zur Kundennachricht',
      kicker: 'Modul — Diagnose',
      teaser: 'Vom Code der Bank zur echten Ursache: die Maßnahme, wer handeln muss, ob eine Wiedereinreichung möglich ist, und die Nachricht für den Kunden.',
      h1: 'Eine Rückweisung verstehen, vom Code bis zur Kundennachricht',
      title: 'SEPA- oder EBICS-Rückweisung diagnostizieren: Ursachen und Maßnahmen — EDI Insight',
      desc: 'Mit einer pacs.002, einer pain.002 oder einer EBICS-Rückmeldung wird aus dem Grund eine echte Ursache, eine Korrektur und eine Nachricht für den Kunden. 29 ISO-Gründe und 43 EBICS-Codes dokumentiert.',
      lead: 'Ein Code aus vier Zeichen und eine Bezeichnung in Großbuchstaben: mehr gibt die Bank nicht zurück. Zu klären bleibt, was passiert ist, wer handeln muss, ob erneut eingereicht werden darf, und was dem Kunden zu antworten ist.',
      sections: [
        {
          h2: 'Was die Diagnose liefert',
          list: [
            '<b>Den Klartext</b> des Grundes, über die normierte Bezeichnung hinaus.',
            '<b>Die wahrscheinlichen Ursachen</b>, von der häufigsten zur seltensten.',
            '<b>Die Maßnahme</b> und wer sie ergreift: Auftraggeber, Bank oder Empfänger.',
            '<b>Die Wiedereinreichung</b>: nach Korrektur möglich, oder zu unterlassen.',
            '<b>Die CFONB-Entsprechung</b> des ISO-Grundes, unverzichtbar wenn interne Systeme noch in CFONB-Codes denken.',
            '<b>Eine weitergebbare Nachricht</b> für den Kunden, ohne Bankjargon.',
          ],
        },
        {
          h2: 'Zwei vollständige Referenzdatensätze',
          p: 'Die 29 ISO-20022-Rückweisungsgründe und die 43 EBICS-Fehlercodes sind frei einsehbar, Code für Code. Die öffentlichen Seiten geben Bedeutung und Kontext; die ausführlichen Ursachen und der vollständige Lösungsweg liegen in der App, mit drei kostenlosen Lösungswegen je Datensatz ab Kontoerstellung, ohne Passwort.',
          links: [
            { label: 'Die 29 ISO-20022-Rückweisungsgründe ansehen', href: 'ISO' },
            { label: 'Die 43 EBICS-Fehlercodes ansehen', href: 'EBICS' },
          ],
        },
        {
          h2: 'Der Fall der EBICS-Rückmeldungen',
          p: 'Eine Rückweisung trifft nicht immer die Zahlung, oft trifft sie den Transport. Abgelaufenes Zertifikat, fehlende Signatur, ungültiger Unterzeichnerstatus, nicht zugelassener OrderType — der EBICS-Datensatz deckt die Versionen 2.5 und 3.0 ab, mit Kategorie und Schweregrad jedes Codes, denn ein Hinweis wird anders behandelt als eine blockierende Ablehnung.',
        },
      ],
      faq: [
        { q: 'Welche Rückmeldedateien werden gelesen?', a: 'Statusmeldungen (pain.002), Interbank-Rückweisungen und -Rückgaben (pacs.002) sowie Rückmeldungen des EBICS-Protokolls.' },
        { q: 'Warum sind manche Lösungswege vorbehalten?', a: 'Die Bedeutung eines Codes ist öffentlich und bleibt es. Die Qualifizierungsarbeit — geordnete Ursachen, Lösungsweg, Sonderfälle aus der Praxis — ist das, was Zeit kostet und gepflegt werden muss: sie gehört zum Abo. Drei Lösungswege je Datensatz sind kostenlos, damit Sie selbst urteilen können.' },
        { q: 'Kann eine Rückweisung unverändert erneut eingereicht werden?', a: 'Das hängt vom Grund ab: manche verlangen nur eine Korrektur und einen erneuten Versand, andere schließen die Wiedereinreichung aus, etwa bei geschlossenem Konto oder widerrufenem Mandat. Jede Seite sagt das ausdrücklich.' },
      ],
    },
  ],
};
