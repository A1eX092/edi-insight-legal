'use strict';
/**
 * Page anglaise « ACH return codes and their ISO 20022 mappings » (19/11/2026).
 *
 * Source des correspondances : Nacha, ISO 20022 Guide to Mapping U.S. ACH Return
 * Items and Notifications of Change, version 2.01, août 2023, et son tableur
 * (onglets « Nacha-ISO Return Reason Codes » et « Nacha-ISO Change Codes »).
 * Les 50 paires ont été comparées par script au tableur : identiques.
 * `name` = nom officiel Nacha (cité) ; `text` = reformulation EDI Insight (les
 * guides sont © Nacha, All rights reserved — ne jamais recopier leurs définitions).
 * Source du changement de 2028 (R90) : règle Nacha « New Return Reason Code for
 * Sanctions Compliance Obligations ».
 * Volontairement absent : les délais de retour (Nacha Operating Rules, payantes).
 */
module.exports = {
  path: 'en/ach-return-codes/',
  metaTitle: "ACH return codes: Nacha's ISO 20022 mappings | EDI Insight",
  metaDesc: 'Look up U.S. ACH return codes such as R01 and R02, see how Nacha maps them in camt.053 statements, and identify notifications of change.',
  kicker: 'U.S. ACH · ISO 20022',
  h1: 'ACH return codes and their ISO 20022 mappings',
  lead: "When a U.S. ACH payment is returned, the ACH return record carries a reason code such as R01 (Insufficient Funds). If your bank reports the return in a camt.053 statement, you may see AM04 instead. The tables below show the mappings in Nacha's August 2023 camt.053 guide.",
  intro: 'The guide covers returns after settlement and notifications of change. A notification of change is not a return: it tells the originator what to correct for future payments. Nacha covers rejections before settlement in a separate pain.002 guide.',
  whereH2: 'Where the reason appears in the file',
  wherePara: "In a camt.053, the reason for a return sits in the return information of the entry: <code>&lt;RtrInf&gt;&lt;Rsn&gt;&lt;Cd&gt;</code>. Nacha's guide puts the ISO code there, for example <code>&lt;Cd&gt;AM04&lt;/Cd&gt;</code> for R01. Instead of <code>&lt;Cd&gt;</code>, a bank may use <code>&lt;Prtry&gt;</code> to carry a proprietary reason. Separately, <code>&lt;AddtlInf&gt;</code> carries complementary text, such as the addenda information of the ACH return or a date of death.",
  manyPara: "<strong>One ISO code does not always identify one ACH code.</strong> For example, R26, R27 and R85 all map to FF02. NARR, AG01 and ED05 also cover several ACH codes. When you see one of them, read <code>&lt;AddtlInf&gt;</code> or ask your bank for the ACH code.",
  returnsH2: 'ACH return codes and ISO 20022 codes',
  scopeNote: "These mappings apply within the scope of Nacha's camt.053 guide. A listed reason code does not by itself mean that the guide supports the corresponding ACH entry class.",
  returnCols: ['ACH code', 'Nacha name (2023 guide)', 'What it means', 'ISO code'],
  returns: [
  {
    "code": "R01",
    "name": "Insufficient Funds",
    "text": "The available balance does not cover the debit.",
    "iso": "AM04"
  },
  {
    "code": "R02",
    "name": "Account Closed",
    "text": "The account was closed by the customer or by the bank.",
    "iso": "AC04"
  },
  {
    "code": "R03",
    "name": "No Account / Unable to Locate Account",
    "text": "The account number is well formed but does not exist, or does not belong to the person named in the payment.",
    "iso": "BE01"
  },
  {
    "code": "R04",
    "name": "Invalid Account Number Structure",
    "text": "The account number is not in a valid format.",
    "iso": "AC01"
  },
  {
    "code": "R05",
    "name": "Unauthorized Debit to Consumer Account Using Corporate SEC Code",
    "text": "A business debit (CCD or CTX) reached a consumer account without the consumer's authorization.",
    "iso": "AG03"
  },
  {
    "code": "R06",
    "name": "Returned per ODFI's Request",
    "text": "The originator's bank asked for the return, for example of an erroneous entry.",
    "iso": "NARR"
  },
  {
    "code": "R07",
    "name": "Authorization Revoked by Customer",
    "text": "The customer withdrew the authorization given to the originator.",
    "iso": "AG07"
  },
  {
    "code": "R08",
    "name": "Payment Stopped",
    "text": "The customer placed a stop payment on this debit.",
    "iso": "DS02"
  },
  {
    "code": "R09",
    "name": "Uncollected Funds",
    "text": "The ledger balance would cover the debit, but the funds are not yet available (uncollected deposits). Unlike R01, the money is there but not yet usable.",
    "iso": "AM07"
  },
  {
    "code": "R10",
    "name": "Customer Advises Originator is Not Known to Receiver and/or Originator is Not Authorized by Receiver to Debit Receiver's Account",
    "text": "The receiver says they do not recognize the originator or did not authorize the debit.",
    "iso": "AG01"
  },
  {
    "code": "R11",
    "name": "Customer Advises Entry Not in Accordance with the Terms of the Authorization",
    "text": "An authorization exists, but the debit does not match it (amount, date, improper reinitiation…).",
    "iso": "NARR"
  },
  {
    "code": "R12",
    "name": "Account Sold to Another DFI",
    "text": "The account now belongs to another financial institution.",
    "iso": "NARR"
  },
  {
    "code": "R13",
    "name": "Invalid ACH Routing Number",
    "text": "The receiving bank's routing number is not a valid ACH routing number.",
    "iso": "RC08"
  },
  {
    "code": "R14",
    "name": "Representative Payee Deceased or Unable to Continue in That Capacity",
    "text": "The person managing the account for the beneficiary has died or can no longer act.",
    "iso": "NARR"
  },
  {
    "code": "R15",
    "name": "Beneficiary or Account Holder (Other Than a Representative Payee) Deceased",
    "text": "The beneficiary or the account holder has died.",
    "iso": "MD07"
  },
  {
    "code": "R16",
    "name": "Account Frozen / Entry Returned Per OFAC Instruction",
    "text": "The account is frozen, or OFAC instructed the bank to return the entry.",
    "iso": "AC06"
  },
  {
    "code": "R17",
    "name": "File Record Edit Criteria / Entry with Invalid Account Number Initiated Under Questionable Circumstances / Return of Improperly Initiated Reversal",
    "text": "A field cannot be processed, the entry looks suspicious (\"QUESTIONABLE\" in the addenda), or a reversal was improper.",
    "iso": "NARR"
  },
  {
    "code": "R18",
    "name": "Improper Effective Entry Date",
    "text": "The effective date is too far after the processing date.",
    "iso": "DT01"
  },
  {
    "code": "R19",
    "name": "Amount Field Error",
    "text": "The amount is missing, not numeric, or not allowed for this type of entry.",
    "iso": "AM12"
  },
  {
    "code": "R20",
    "name": "Non-Transaction Account",
    "text": "The account does not allow this kind of transaction.",
    "iso": "AG01"
  },
  {
    "code": "R22",
    "name": "Invalid Individual ID Number",
    "text": "The receiver says the identification number under which the originator identified them is wrong.",
    "iso": "RR01"
  },
  {
    "code": "R23",
    "name": "Credit Entry Refused by Receiver",
    "text": "The receiver refused the credit.",
    "iso": "NARR"
  },
  {
    "code": "R24",
    "name": "Duplicate Entry",
    "text": "The entry looks like a duplicate of another one.",
    "iso": "AM05"
  },
  {
    "code": "R25",
    "name": "Addenda Error",
    "text": "The addenda record is wrong, missing or out of sequence.",
    "iso": "RR07"
  },
  {
    "code": "R26",
    "name": "Mandatory Field Error",
    "text": "A mandatory field is missing or wrong.",
    "iso": "FF02"
  },
  {
    "code": "R27",
    "name": "Trace Number Error",
    "text": "The trace number is missing or does not match.",
    "iso": "FF02"
  },
  {
    "code": "R28",
    "name": "Routing Number Check Digit Error",
    "text": "The check digit of the routing number is wrong.",
    "iso": "FF09",
    "note": 1
  },
  {
    "code": "R29",
    "name": "Corporate Customer Advises Not Authorized",
    "text": "A business receiver says it did not authorize this debit.",
    "iso": "AG01"
  },
  {
    "code": "R30",
    "name": "RDFI Not Participant in Check Truncation Program",
    "text": "The receiving bank does not take part in check truncation.",
    "iso": "NARR"
  },
  {
    "code": "R31",
    "name": "Permissible Return Entry (CCD and CTX only)",
    "text": "A business payment returned with the originator's bank's agreement.",
    "iso": "NARR"
  },
  {
    "code": "R32",
    "name": "RDFI Non-Settlement",
    "text": "The receiving bank cannot settle the entry.",
    "iso": "ED05"
  },
  {
    "code": "R34",
    "name": "Limited Participation DFI",
    "text": "A regulator has limited the receiving bank's participation.",
    "iso": "NARR"
  },
  {
    "code": "R35",
    "name": "Return of Improper Debit Entry",
    "text": "Debits are not allowed here (loan accounts, CIE entries).",
    "iso": "MD05"
  },
  {
    "code": "R36",
    "name": "Return of Improper Credit Entry",
    "text": "Credits are not allowed for this type of entry.",
    "iso": "NARR"
  },
  {
    "code": "R80",
    "name": "IAT Entry Coding Error",
    "text": "An international (IAT) entry has a coding error (country, currency, bank identifier…).",
    "iso": "AG02"
  },
  {
    "code": "R81",
    "name": "Non-Participant in IAT Program",
    "text": "The gateway has no agreement to send this international entry.",
    "iso": "BE06"
  },
  {
    "code": "R82",
    "name": "Invalid Foreign Receiving DFI Identification",
    "text": "The identifier of the foreign bank is invalid.",
    "iso": "RC02"
  },
  {
    "code": "R83",
    "name": "Foreign Receiving DFI Unable to Settle",
    "text": "Settlement failed in the foreign payment system.",
    "iso": "ED05"
  },
  {
    "code": "R84",
    "name": "Entry Not Processed by Gateway",
    "text": "The gateway refused to process the entry because of the risk.",
    "iso": "RR04"
  },
  {
    "code": "R85",
    "name": "Incorrectly Coded Outbound International Payment",
    "text": "An international payment was sent with a domestic entry type, without the information needed for sanctions screening.",
    "iso": "FF02"
  }
],
  footnote: "This is Nacha's mapping, even though the ISO name of FF09 refers to a cheque number.",
  changesH2: 'Notifications of change (C codes)',
  changesIntro: 'A notification of change does not return the payment. It tells the originator to correct its data for the next payments. In a camt.053, Nacha maps them as follows.',
  changeCols: ['ACH code', 'Nacha name (2023 guide)', 'What to correct', 'ISO code'],
  changes: [
  {
    "code": "C01",
    "name": "Incorrect DFI Account Number",
    "text": "The account number.",
    "iso": "AC01"
  },
  {
    "code": "C02",
    "name": "Incorrect Routing Number",
    "text": "The routing number (often after a bank merger).",
    "iso": "RC01"
  },
  {
    "code": "C03",
    "name": "Incorrect Routing Number and Incorrect DFI Account Number",
    "text": "The routing number and the account number.",
    "iso": "NARR"
  },
  {
    "code": "C05",
    "name": "Incorrect Transaction Code",
    "text": "The transaction code (checking versus savings).",
    "iso": "AG03"
  },
  {
    "code": "C06",
    "name": "Incorrect DFI Account Number and Incorrect Transaction Code",
    "text": "The account number and the transaction code.",
    "iso": "NARR"
  },
  {
    "code": "C07",
    "name": "Incorrect Routing Number, Incorrect DFI Account Number, and Incorrect Transaction Code",
    "text": "All three.",
    "iso": "NARR"
  },
  {
    "code": "C08",
    "name": "Incorrect Receiving DFI Identification",
    "text": "The foreign bank identifier (international entries).",
    "iso": "RC01"
  },
  {
    "code": "C09",
    "name": "Incorrect Individual Identification Number / Incorrect Receiver Identification Number",
    "text": "The receiver's identification number.",
    "iso": "BE15"
  },
  {
    "code": "C13",
    "name": "Addenda Format Error",
    "text": "The format of the addenda (the payment went through).",
    "iso": "NARR"
  },
  {
    "code": "C14",
    "name": "Incorrect SEC Code for Outbound International Payment",
    "text": "Future payments must be sent as international (IAT) entries.",
    "iso": "NARR"
  }
],
  changesAfter: "For a notification of change, Nacha maps the corrected ACH data to the first occurrence of <code>&lt;AddtlInf&gt;</code>.",
  unmappedH2: "Codes not mapped in Nacha's camt.053 guide",
  unmapped: [
    '<strong>R21, R33, R37–R47 and R50–R53</strong>: codes specific to certain entry types (company identification for CIE, destroyed checks XCK, check conversion ARC, BOC and POP, government enrollments ENR, re-presented checks RCK). The guide does not map them.',
    '<strong>R61–R70</strong>: dishonored returns. The guide states they must be sent in the Nacha file format to the ACH Network.',
    '<strong>R71–R77</strong>: contested dishonored returns. The guide does not currently support or map them.',
  ],
  r90H2: 'A new code in 2028: R90',
  r90: "Effective March 17, 2028, Nacha adds R90 for entries returned because of the receiving bank's sanctions compliance obligations. R16 will then be named Account Frozen and cover frozen accounts only. Nacha's 2023 mapping guide predates R90 and gives no ISO mapping for it.",
  // Diagnostiquer est réservé aux abonnés : le texte le dit.
  cta: 'Open your camt.053 statement or pain.002 status report in EDI Insight to read the reason code provided by your bank. Reading bank files is part of the subscription. The file stays in your browser.',
  ctaBtn: 'Open the app',
  source: 'Sources: mappings from Nacha, ISO 20022 Guide to Mapping U.S. ACH Return Items and Notifications of Change, version 2.01, August 2023, and its mapping spreadsheet. The 2028 change from Nacha\'s rule "New Return Reason Code for Sanctions Compliance Obligations" (R90). Descriptions are EDI Insight\'s own summaries; the Nacha Operating Rules remain the reference.',
  // Liens ajoutés ailleurs sur le site.
  hubLink: 'U.S. ACH return codes (R01, R02…) and how Nacha maps them to ISO 20022 →',
  asideKey: 'U.S. ACH mapping',
  menuLabel: 'ACH return codes',
  menuDesc: "U.S. return codes, with Nacha's ISO 20022 mapping",
  asideReturn: 'return',
  asideChange: 'notification of change',
};
