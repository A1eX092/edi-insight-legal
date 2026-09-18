/** Product pages — English. Same structure as produit.fr.js, same slugs order. */
module.exports = {
  hubTitle: 'The EDI Insight modules',
  hubDesc: "Four modules, one file to drop in: validation, address conversion, file generation and reject diagnosis. Everything runs in the browser, with no installation and no integration project.",
  modules: [
    {
      slug: 'sepa-file-validation',
      nav: 'File validation',
      navDesc: 'SCT, SDD, XCT, ICT — rule by rule',
      kicker: 'Module — validation',
      teaser: 'Schema structure, mandatory tags, IBAN, character set, field lengths and control totals: the file is checked rule by rule, and every finding is located in the XML.',
      h1: 'Check a SEPA file before sending it to the bank',
      title: 'Validate a SEPA file (SCT, SDD, XCT, ICT) before sending — EDI Insight',
      desc: 'Drop in a credit transfer or direct debit file: schema structure, mandatory tags, IBAN, character set, lengths and totals are checked, and every finding is located in the XML. Free, no installation, local processing.',
      lead: "A file refused by the bank means a batch that goes out a day late, a supplier paid late, and half a day spent hunting for the offending line in an XML file thousands of lines long. Validation answers one question: will this file go through?",
      sections: [
        {
          h2: 'What is checked',
          p: 'The file is measured against the rules that actually get a batch rejected, not just XML grammar.',
          list: [
            '<b>Schema structure</b> — conformity to the declared ISO 20022 message, unknown or badly nested tags.',
            '<b>Mandatory tags</b> — presence and order of the elements required by the message and the applicable rulebook.',
            '<b>Bank details</b> — IBAN format and check digits, IBAN / BIC / country consistency.',
            '<b>Character set</b> — characters outside the accepted banking set, accents and signs that make a batch fail.',
            '<b>Lengths and formats</b> — truncated fields, execution dates, currencies, amount formats.',
            '<b>Totals and counters</b> — declared number of transactions and control sum against the actual content.',
            '<b>Addresses</b> — detection of unstructured addresses, as the ISO 20022 format takes over.',
          ],
        },
        {
          h2: 'What you get',
          p: 'A readable report, not a pile of parser errors. Every finding points to the tag concerned and its position in the file, with what to fix and why the rule exists.',
          list: [
            'The list of findings, ranked from blocking to warning.',
            'The exact tag and line, so you can fix it in your source system.',
            'The originating rule: rulebook, schema or banking practice.',
            'The batch summary: number of transactions, total, dates, debtor.',
          ],
        },
        {
          h2: 'What the checks are based on',
          p: 'The rules are not inferred from examples: they come from the reference texts, and are updated when those change.',
          list: [
            'The EPC rulebooks in force for SEPA credit transfers and direct debits.',
            'The CFONB guides, in particular for addresses and the character set.',
            'The ISO 20022 schemas for pain.001, pain.008, pain.002 and pacs.002.',
            'The known gaps between the standard and what banks actually accept.',
          ],
        },
      ],
      faq: [
        { q: 'Is my file sent to a server?', a: 'No. The analysis runs in your browser: the file is neither transmitted nor stored. That is what makes it usable on real payment batches without a security review.' },
        { q: 'Which file types are accepted?', a: 'SEPA credit transfers and direct debits (SCT, SCT Inst, SDD Core and B2B), as well as non-SEPA and international credit transfers (XCT, ICT), in the pain.001 and pain.008 messages. Status reports pain.002 and pacs.002 are read by the diagnosis module.' },
        { q: 'Is validation a paid feature?', a: 'No, file validation is free and unlimited, as is comparing two files and consulting the reference data.' },
        { q: 'Does this replace a test with my bank?', a: 'No. Validation removes format rejects, which are the vast majority of refusals, but every bank keeps its own checks. The tool does flag the points where banking practice diverges from the standard.' },
      ],
    },
    {
      slug: 'address-converter',
      nav: 'Address converter',
      navDesc: 'Free-format to ISO 20022',
      kicker: 'Module — structured addresses',
      teaser: 'From free-format lines to ISO 20022 tags, following the CFONB guide — including the cases where the rule is not to split the line. Confidence score and XML export.',
      h1: 'Convert an address to the ISO 20022 structured format',
      title: 'Address converter to ISO 20022 structured addresses — EDI Insight',
      desc: 'Turn free-format addresses into ISO 20022 structured addresses: StrtNm, BldgNb, PstCd, TwnNm, Ctry, following the CFONB guide, with a confidence score and XML export.',
      lead: 'A French address fits in three free-format lines. The bank now expects separate tags. In between sit mapping rules, cases where you must not split the line, and a whole base of counterparties to process.',
      sections: [
        {
          h2: 'From free format to tags',
          p: 'Each address line is analysed then distributed across the elements of the <code>PstlAdr</code> block: street name, building number, building, floor, post box, postcode, town, country subdivision and country.',
          list: [
            '<b>Structured format</b> — every piece of information in its own tag, which is what the new formats require.',
            '<b>Hybrid format</b> — town, postcode and country structured, the rest kept as address lines, where that is the accepted compromise.',
            '<b>Confidence score</b> — ambiguous addresses are flagged rather than split at random.',
            '<b>Export</b> — the XML block, ready to feed back into your counterparty database.',
          ],
        },
        {
          h2: 'The cases where the rule is not to split',
          p: 'This is where most conversions go wrong. A department name, an address complement, a hamlet or a delivery point is not a street name: forcing it into <code>StrtNm</code> produces an address that is schema-valid but wrong for the postal service, and sometimes refused by the bank. The converter applies the CFONB rules, including the ones that consist in leaving the line as it is.',
        },
        {
          h2: 'Why now',
          p: 'Swift postponed its deadline on 27 August 2026 and the EPC lifted its own on 9 September, but the obligation is not cancelled, only moved. German banks are keeping 15 November 2026 for file formats. This postponement is the ideal window to convert a base of counterparties without pressure.',
          link: { label: 'Read the full structured addresses guide', href: 'ARTICLE' },
        },
      ],
      faq: [
        { q: 'What is the difference between structured and hybrid?', a: 'In the structured format, each piece of information has its own tag (street name, number, postcode, town, country). In the hybrid format, only town, postcode and country are structured, the rest stays in address lines. Both coexist today depending on the channel and the bank.' },
        { q: 'Can I convert my whole counterparty base at once?', a: 'Yes, batch processing is part of the converter plan. Addresses with a low confidence score are set aside for manual review rather than converted blindly.' },
        { q: 'Are foreign addresses handled?', a: 'The detailed mapping follows the CFONB guide, so French addresses. Foreign addresses are handled on the universal elements (postcode, town, country), with lines kept as they are when splitting is not safe.' },
        { q: 'Are my addresses sent anywhere?', a: 'No. As with validation, conversion runs in your browser: no counterparty data leaves your machine.' },
      ],
    },
    {
      slug: 'file-generator',
      nav: 'File generator',
      navDesc: 'From a CSV to a payment file',
      kicker: 'Module — generation',
      teaser: 'A CSV export becomes a compliant credit transfer or direct debit, checked as it is produced — or a fully fictitious test batch to exercise your controls.',
      h1: 'Produce a credit transfer or direct debit file from a CSV',
      title: 'Generate a SEPA file (pain.001, pain.008) from a CSV — EDI Insight',
      desc: 'A CSV export from your accounting tool becomes a compliant credit transfer or direct debit file, checked as it is produced — or a fictitious test batch to exercise your own controls.',
      lead: 'Not every organisation has a tool that can produce a bank file. When the batch is prepared in a spreadsheet, the question is not theoretical: how do these lines become a file the bank accepts?',
      sections: [
        {
          h2: 'Two uses',
          list: [
            '<b>A real file</b> — from your CSV export: creditors, IBANs, amounts, references, execution date. The result is a compliant credit transfer or direct debit, ready to be submitted.',
            '<b>A fictitious test batch</b> — credible but entirely invented batches, to exercise your own controls, a test phase or a bank setup without handling real data.',
          ],
        },
        {
          h2: 'Checked as it is produced',
          p: 'The generated file goes through the same rules as the validation module: it does not leave the tool with a known format error. CSV lines that cannot be converted are listed with their reason rather than silently dropped.',
          list: [
            'IBAN format and check digits.',
            'Banking character set and field lengths on labels and references.',
            'Consistency of amounts, currencies and batch totals.',
            'Mandatory fields of the message and the applicable rulebook.',
          ],
        },
        {
          h2: 'What is produced',
          p: 'Credit transfer batches (pain.001) and direct debit batches (pain.008), in the versions in force, with address blocks in the structured format where the information is available.',
        },
      ],
      faq: [
        { q: 'Which columns must my CSV contain?', a: 'The expected columns are listed in the tool and a template is provided: creditor, IBAN, amount, reference, execution date, and the address if you pass it. Column order does not matter.' },
        { q: 'Can the generated file be used in production?', a: 'Yes, that is what it is for. As with any first batch on a new channel, a test with your bank is still advisable before switching a recurring flow.' },
        { q: 'What about direct debit mandates?', a: 'Mandate references and sequence data are taken from your CSV: the tool produces the file and checks consistency, it does not keep the mandate register for you.' },
      ],
    },
    {
      slug: 'reject-diagnosis',
      nav: 'Reject diagnosis',
      navDesc: 'From the code to the customer message',
      kicker: 'Module — diagnosis',
      teaser: 'From the code the bank returns to the real cause: the action to take, who should act, whether a retry is possible, and the message to send the customer.',
      h1: 'Understand a payment reject, from the code to the customer message',
      title: 'Diagnose a SEPA or EBICS reject: causes and what to do — EDI Insight',
      desc: 'With a pacs.002, a pain.002 or an EBICS return in hand, the reason becomes a real cause, a correction to apply and a message you can send the customer. 29 ISO reasons and 43 EBICS codes documented.',
      lead: 'A four-character code and a label in capitals: that is all the bank returns. You still have to work out what happened, who should act, whether the transaction can be retried, and what to tell the customer who was not paid.',
      sections: [
        {
          h2: 'What the diagnosis gives you',
          list: [
            '<b>The plain-language meaning</b> of the reason, beyond the standard label.',
            '<b>The likely causes</b>, ranked from the most frequent to the rarest.',
            '<b>The action to take</b>, and by whom: the originator, the bank, or the beneficiary.',
            '<b>Retry</b>: possible after correction, or to be avoided.',
            '<b>The CFONB equivalent</b> of the ISO reason, essential when your internal tools still think in CFONB codes.',
            '<b>A message you can pass on</b> to the customer, free of banking jargon.',
          ],
        },
        {
          h2: 'Two complete reference sets',
          p: 'The 29 ISO 20022 reject reasons and the 43 EBICS error codes are free to consult, code by code. The public pages give the meaning and the context; the detailed causes and the full procedure are in the app, with three free resolutions per reference set as soon as you create an account, no password needed.',
          links: [
            { label: 'See the 29 ISO 20022 reject reasons', href: 'ISO' },
            { label: 'See the 43 EBICS error codes', href: 'EBICS' },
          ],
        },
        {
          h2: 'The case of EBICS returns',
          p: 'A reject does not always land on the payment: it often lands on the transport. Expired certificate, missing signature, invalid signer state, unauthorised OrderType — the EBICS reference set covers versions 2.5 and 3.0, with the category and severity of each code, because an informational code is not handled like a blocking refusal.',
        },
      ],
      faq: [
        { q: 'Which return files are read?', a: 'Payment status reports (pain.002), interbank rejects and returns (pacs.002), and EBICS protocol returns.' },
        { q: 'Why are some resolutions reserved?', a: 'The meaning of a code is public and will stay public. The qualification work — ranked causes, the procedure, the edge cases seen in the field — is what takes time to produce and keep current: that is what the plan includes. Three resolutions per reference set are free so you can judge for yourself.' },
        { q: 'Can a reject be retried as is?', a: 'It depends on the reason: some call for a simple correction and a resend, others rule out a retry, in particular when the account is closed or the mandate revoked. Every page states this explicitly.' },
      ],
    },
  ],
};
