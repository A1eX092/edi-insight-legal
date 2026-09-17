'use strict';
/** Reference article on ISO 20022 structured addresses — English version. */
module.exports = {
  updated: '2026-09-17',
  updatedLabel: '17 September 2026',
  metaTitle: 'ISO 20022 structured addresses: the complete 2026 guide | EDI Insight',
  metaDesc: 'ISO 20022 structured addresses: what changes, the two calendars (Swift and SEPA) after the 2026 deferrals, the exact XML fields, the French CFONB mapping rules and the pitfalls. Updated 17 September 2026.',
  kicker: 'Reference guide',
  h1: 'ISO 20022 structured addresses',
  sub: 'What changes, for whom, when, and how to map an address without getting it wrong.',
  lead: "Free-text addresses are being removed from payment messages. The principle has been settled for years, but 2026 brought two deferrals in three weeks, and confusion followed: Swift and SEPA do not share a calendar, Germany keeps a date that France no longer has, and few sources say plainly which fields to fill. This guide sets out the state of play as of 17 September 2026.",

  sections: [
    { id: 'summary', h2: 'The short version', html: `
<ul>
  <li>A payment address must move from <strong>free text</strong> (the <code>AdrLine</code> tags) to <strong>discrete fields</strong>: street, number, post code, town, country.</li>
  <li><strong>Two separate calendars</strong>: Swift for cross-border payments, the EPC for SEPA. Both were deferred in the summer of 2026, on different dates and for different reasons.</li>
  <li><strong>No firm new date is known.</strong> Swift will consult the community and decide by December 2026; the EPC was due to settle its own date at its October meeting.</li>
  <li><strong>Some communities deferred nothing</strong>: German and Luxembourg banks still announce 15 November 2026 for the end of the legacy file versions.</li>
  <li>The deferral changes nothing about the real work: <strong>the quality of your counterparty data</strong>. An address with no town stays an address with no town, whatever the deadline.</li>
</ul>` },

    { id: 'formats', h2: 'Structured, hybrid, unstructured', html: `
<p>ISO 20022 carries a postal address in a <code>PstlAdr</code> block. Three ways of filling it coexist, and mixing them up is the first source of error.</p>
<p><strong>Unstructured.</strong> Everything sits in free-text <code>AdrLine</code> tags. This is the format being removed.</p>
<pre class="art-code">&lt;PstlAdr&gt;
  &lt;AdrLine&gt;12 RUE DU FAUBOURG SAINT-HONORE&lt;/AdrLine&gt;
  &lt;AdrLine&gt;75008 PARIS&lt;/AdrLine&gt;
&lt;/PstlAdr&gt;</pre>
<p><strong>Hybrid.</strong> Town and country move into their own tags, the rest stays free text. Swift and the SEPA rulebooks accept it, and many banks treat it as the acceptable minimum.</p>
<pre class="art-code">&lt;PstlAdr&gt;
  &lt;TwnNm&gt;PARIS&lt;/TwnNm&gt;
  &lt;Ctry&gt;FR&lt;/Ctry&gt;
  &lt;AdrLine&gt;12 RUE DU FAUBOURG SAINT-HONORE&lt;/AdrLine&gt;
&lt;/PstlAdr&gt;</pre>
<p><strong>Fully structured.</strong> Every element has its tag. This is the target, and the EPC recommends reaching it directly rather than stopping at hybrid.</p>
<pre class="art-code">&lt;PstlAdr&gt;
  &lt;StrtNm&gt;12 RUE DU FAUBOURG SAINT-HONORE&lt;/StrtNm&gt;
  &lt;PstCd&gt;75008&lt;/PstCd&gt;
  &lt;TwnNm&gt;PARIS&lt;/TwnNm&gt;
  &lt;Ctry&gt;FR&lt;/Ctry&gt;
&lt;/PstlAdr&gt;</pre>
<p>One detail in that last example often surprises readers: the house number stays attached to the street. That is not sloppiness, it is the rule in the French CFONB mapping guide, covered below.</p>` },

    { id: 'fields', h2: 'The fields and their lengths', html: `
<p>These are the tags you will meet inside <code>PstlAdr</code>, with their maximum length. Exceeding a length means a file rejected on submission, before it ever reaches the beneficiary bank.</p>
<table class="art-table">
  <thead><tr><th>Tag</th><th>Content</th><th>Max length</th></tr></thead>
  <tbody>
    <tr><td><code>StrtNm</code></td><td>Street name, house number included (see below)</td><td>70</td></tr>
    <tr><td><code>BldgNb</code></td><td>House number, only when supplied in its own field</td><td>16</td></tr>
    <tr><td><code>BldgNm</code></td><td>Building name: not to be used per the CFONB guide</td><td>35</td></tr>
    <tr><td><code>Flr</code></td><td>Floor, residence, building, industrial estate</td><td>70</td></tr>
    <tr><td><code>Room</code></td><td>Flat, door, office</td><td>70</td></tr>
    <tr><td><code>PstBx</code></td><td>Post office box</td><td>16</td></tr>
    <tr><td><code>PstCd</code></td><td>Post code</td><td>16</td></tr>
    <tr><td><code>TwnNm</code></td><td>Town</td><td>35</td></tr>
    <tr><td><code>TwnLctnNm</code></td><td>Locality, district name</td><td>35</td></tr>
    <tr><td><code>CtrySubDvsn</code></td><td>Region, state, province</td><td>35</td></tr>
    <tr><td><code>Ctry</code></td><td>ISO 3166-1 alpha-2 country code, two letters</td><td>2</td></tr>
    <tr><td><code>AdrLine</code></td><td>Free line, being phased out</td><td>70</td></tr>
  </tbody>
</table>
<p>The minimum required everywhere, hybrid included, is <code>TwnNm</code> and <code>Ctry</code>. An address with no town or no country is the most common rejection case, and the easiest to catch before sending.</p>` },

    { id: 'calendars', h2: 'Two calendars, not one', html: `
<p>This is where most teams go wrong. Swift's deferral does not cover SEPA credit transfers, and the EPC decision does not cover cross-border payments.</p>
<table class="art-table">
  <thead><tr><th>Scope</th><th>Decided by</th><th>Where things stand</th></tr></thead>
  <tbody>
    <tr><td>Cross-border payments (CBPR+)</td><td>Swift</td><td>On 27 August 2026 Swift deferred the requirement set for 14 November 2026 for payments. A new date will follow a market consultation, by December 2026. Non-payment changes (securities, trade) move to the first quarter of 2027.</td></tr>
    <tr><td>SEPA credit transfers and direct debits</td><td>European Payments Council</td><td>On 9 September 2026 the EPC lifted the 15 November 2026 end date across the five rulebooks (SCT, SCT Inst, SDD Core, SDD B2B, OCT Inst). A new date was due at the October meeting, with revised rulebooks and guidelines to follow.</td></tr>
    <tr><td>Euro high-value payments</td><td>Eurosystem (T2, TIPS, T2S, ECMS)</td><td>The November releases moved from 14 to 28 November 2026, with user testing from 9 October. T2 temporarily tolerates fully unstructured addresses.</td></tr>
    <tr><td>Germany and Luxembourg</td><td>National banking communities</td><td>Nothing was deferred on file formats: the end of the legacy versions (2009 pain versions, DTAZV, MT101 in Luxembourg) is still announced for 15 November 2026, with a structured address required at least for town and country. Confirm with each bank.</td></tr>
  </tbody>
</table>
<p>In short: if you only send SEPA, the Swift date is not yours. If you pay suppliers through a German or Luxembourg bank, the European deferral does not shield you from a format change in November. If you do both, you are running two projects, not one.</p>` },

    { id: 'deferral', h2: 'What the deferral changes, and what it does not', html: `
<p>Two deferrals in three weeks had a predictable effect: projects paused, budgets moved elsewhere, teams reassigned. That is the real risk of this period.</p>
<p><strong>What it genuinely changes:</strong> the time pressure, and therefore the ability to do the work properly. Cleaning a counterparty database during a quiet window, with tests, is a different job from doing it three weeks before a hard date.</p>
<p><strong>What it does not change:</strong> the direction of travel, and the state of your data. Adapting a payment gateway takes months; adapting the data model behind your ledgers takes years. The second is the one that matters, and the first to be dropped when the deadline disappears.</p>` },

    { id: 'who', h2: 'Who is affected, and when the address is actually required', html: `
<p>One distinction saves months of unnecessary work: <strong>the beneficiary address is not a mandatory field of a SEPA credit transfer</strong>. Many companies send none at all, and their files go through. The question only arises in three cases.</p>
<ul>
  <li><strong>You already send an address.</strong> Once it is in the message, it must follow the format in force. A partial address can be worse than none.</li>
  <li><strong>Your bank requires it</strong> for certain operations, or its portal rejects files without it.</li>
  <li><strong>You pay outside the European Economic Area</strong>: cross-border payments, one-leg operations, sanctions screening. There the address is the rule, and Swift's calendar applies.</li>
</ul>
<p>So before rebuilding your entire counterparty base, check what you actually send today. An export of your recent payment files answers that in minutes.</p>` },

    { id: 'cfonb', h2: 'Mapping a French address: the CFONB rules', html: `
<p>The CFONB published a guide mapping the French postal standard NF Z10-011 to ISO 20022. It is the reference in France, and it holds several counter-intuitive rules that projects discover late.</p>
<h3>The house number is not split from the street</h3>
<p>The number feeds <code>BldgNb</code> <strong>only when it arrives in a dedicated field</strong> of your source file. When it sits inside the address line, the guide explicitly asks not to split: the whole string goes to <code>StrtNm</code> and <code>BldgNb</code> stays empty. The guide's own examples are unambiguous.</p>
<p>The practical reason is obvious once you try the opposite: French street names such as "Rue du 8 Mai 1945" defeat any position-based number detection. Splitting at all costs manufactures wrong addresses.</p>
<h3>Building name is not to be used</h3>
<p>The guide rules out <code>BldgNm</code> for both companies and individuals. A residence, a building, an entrance or an industrial estate goes to <code>Flr</code>. The reason is arithmetic: <code>BldgNm</code> caps at 35 characters where an NF Z10-011 line holds 38. <code>Flr</code> takes 70.</p>
<h3>PO boxes and CEDEX</h3>
<p>"BP 40122" goes to <code>PstBx</code>. The French CEDEX marker stays attached to the town: "75008 PARIS CEDEX 08" gives <code>PstCd</code> 75008 and <code>TwnNm</code> PARIS CEDEX 08. It is delivery information, not a separate address line.</p>
<h3>Character set</h3>
<p>The guide describes three levels, and this is a quiet source of rejections: the basic Latin set is always accepted; accented characters and @ are allowed under a bilateral agreement with your bank, which means usually but not always; everything else is forbidden, including two characters word processors insert by themselves, the typographic apostrophe and the em dash.</p>` },

    { id: 'pitfalls', h2: 'The pitfalls that cost time', html: `
<ul>
  <li><strong>Country inferred from the post code.</strong> Four digits could be Belgium, Luxembourg or Switzerland; five could be France or Germany. Inference without a declared country code produces silent errors.</li>
  <li><strong>Addresses that are consistent but wrong.</strong> One audit reported in the trade press found 92% of towns populated but only 64% of addresses internally coherent. Format says nothing about accuracy.</li>
  <li><strong>Lengths.</strong> A town over 35 characters, a long foreign post code, and the message is refused.</li>
  <li><strong>Treating hybrid as the destination.</strong> It is accepted, but the EPC recommends going straight to fully structured. Doing the work twice costs more than doing it once.</li>
  <li><strong>Applying French rules to foreign addresses.</strong> NF Z10-011 covers French addresses only.</li>
  <li><strong>Inventing data.</strong> A missing address is easier to fix later than a fabricated one.</li>
</ul>` },

    { id: 'project', h2: 'Sizing and running the project', html: `
<p>The cost of an address migration does not come from the rules, which fit in a few pages. It comes from the share of your addresses the rules do not cover, and that number lives in your own database.</p>
<p>Export your address column and ask it four questions.</p>
<ol>
  <li><strong>How many lines start with a number followed by a space?</strong> Those are your simple cases.</li>
  <li><strong>How many have no street number?</strong> Not faulty, but they need their own rule.</li>
  <li><strong>How many contain building, flat, residence, floor, PO box or CEDEX markers?</strong> Those are your complements, and they do not all go to the same field.</li>
  <li><strong>How many have no usable town or country?</strong> Those are the ones that will actually block.</li>
</ol>
<p>The last two categories, as a share of your volume, are your manual rework. That figure sets the budget, and it belongs to you before you consult any vendor.</p>
<p>Then the method is simple: fix at source in the ERP rather than on the way out, test a real file on your bank's portal before rolling out, and add an input control so the database does not degrade again.</p>` },

    { id: 'bank', h2: 'Six questions for your bank', html: `
<p>Market rules set a framework, but each bank applies it its own way and dates differ between institutions. Get these confirmed in writing where you can.</p>
<ol>
  <li><strong>Which date do you apply</strong> for the end of unstructured addresses, in SEPA and cross-border, after the summer 2026 deferrals?</li>
  <li><strong>Do you accept the hybrid format</strong>, and until when?</li>
  <li><strong>Which message versions</strong> do you accept, and until when: pain.001.001.03 or .09, pain.008.001.02 or .08, MT101?</li>
  <li><strong>What happens to an incomplete address</strong>: whole file rejected, single transaction rejected, or accepted with a warning?</li>
  <li><strong>Is there a test environment</strong> where I can upload a real file without signing it?</li>
  <li><strong>Do your foreign branches apply the same rules?</strong> This is where the surprises hide, Germany and Luxembourg in particular.</li>
</ol>` },
  ],

  faq: [
    { q: 'Is 15 November 2026 still the SEPA deadline?', a: 'No. On 9 September 2026 the EPC lifted that date across the five rulebooks, with a new date due at its October 2026 meeting. German and Luxembourg banking communities, however, still apply 15 November 2026 to the end of the legacy file versions.' },
    { q: 'Hybrid or fully structured?', a: 'Both are accepted. The EPC recommends going straight to fully structured, without a hybrid stage, so the work is done once. Hybrid remains useful when your data cannot yet support more: town and country in their tags, the rest in a free line.' },
    { q: 'Do I have to send an address for SEPA payments?', a: 'It is not a mandatory field of a SEPA credit transfer. If you send none, the question does not arise. As soon as you do send one, it must follow the format in force. Outside the European Economic Area, an address is the rule.' },
    { q: 'Should the house number be split from the street name?', a: 'Only if the number comes in its own field in your source data. Inside an address line, the CFONB guide asks not to split: number and street go together into StrtNm, and BldgNb stays empty.' },
    { q: 'What about PO boxes and CEDEX?', a: 'The PO box goes to PstBx. The CEDEX marker stays with the town: "75008 PARIS CEDEX 08" gives PstCd 75008 and TwnNm PARIS CEDEX 08.' },
    { q: 'Can I keep accented characters?', a: 'Accents and @ are allowed under a bilateral agreement with your bank, so usually yes but without guarantee. The typographic apostrophe and the em dash, often inserted automatically by word processors, are not allowed.' },
    { q: 'I only have town and country. Is that enough?', a: 'Yes for the hybrid format, which requires exactly those two elements in their own tags. It is not the recommended target, but it is accepted and far better than a fully free-text address.' },
    { q: 'Are pain.001.001.03 files still accepted?', a: 'It depends on your bank and your country. France imposes no fixed switch date for now. In Germany and Luxembourg, the end of the 2009 versions is announced for 15 November 2026, in favour of pain.001.001.09 and pain.008.001.08. Check with each bank: dates differ.' },
    { q: 'Who should fix the addresses, my ERP or my bank?', a: 'Your ERP. A bank can validate and reject, it cannot invent missing data. Addresses live in your counterparty database, so that is where a fix lasts; a fix applied to the outgoing file has to be repeated every time.' },
    { q: 'How do I know how many addresses will be a problem?', a: 'By counting on your own data: the share with no usable town or country, and the share carrying complements (building, flat, PO box, CEDEX). That volume, not the rules, drives the cost.' },
  ],

  ctaMid: {
    text: "You can test these rules on your own data: the EDI Insight converter applies the CFONB guide to a pain.001 file or a CSV export, including the cases where the rule is not to split, and returns the converted addresses, those needing review and those that block.",
    btn: 'Try the address converter →',
  },
  ctaEnd: {
    title: 'Convert your addresses',
    text: 'Upload a pain.001 file or a CSV export, get your addresses in structured or hybrid format, with the list of those needing manual rework. Everything runs in your browser; your files are not uploaded anywhere.',
    btn: 'Open the converter →',
  },
  faqTitle: 'Frequently asked questions',
  tocTitle: 'Contents',
  updatedPrefix: 'Updated',
  note: 'This guide tracks the deadlines: dates are re-checked at every update. If Swift or the EPC announces a new date, this page is corrected.',
};
