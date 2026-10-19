/** Pages éditoriales simples : À propos et Télécharger. */
module.exports = {
  apropos: {
    file: 'a-propos.html',
    title: "À propos — Alexandre Voisin, fondateur d'EDI Insight",
    desc: "Près de dix ans au cœur des flux de paiement en banque, comme consultant EDI puis chargé d'affaires Cash Management, condensés dans EDI Insight.",
    kicker: 'À propos · le fondateur',
    h1: 'Alexandre Voisin',
    role: "Fondateur d'EDI Insight · expert EBICS et cash management",
    lead: "Près de dix ans au cœur des flux de paiement en banque, condensés dans l'outil que j'aurais voulu avoir sous la main.",
    photo: '/alexandre.jpg',
    sections: [
      {
        h2: 'Le parcours',
        paras: [
          "Pendant près de dix ans, j'ai travaillé au cœur des flux EDI et du cash management en banque : d'abord comme consultant EDI, puis comme chargé d'affaires Cash Management grands comptes à la Caisse d'Épargne Île-de-France. J'ai accompagné des entreprises dans la mise en place de leurs flux via EBICS, leurs projets de migration logicielle, la validation de leurs certificats et le diagnostic de leurs fichiers XML ou de leurs codes erreurs EBICS.",
          "C'est ce quotidien qui a donné naissance à EDI Insight. Trop de temps perdu à chercher un code erreur dans une documentation éparpillée, à traquer une balise fautive au fond d'un XML, à réexpliquer les mêmes motifs de rejet SEPA. J'ai construit l'outil que j'aurais voulu avoir sous la main.",
          "EDI Insight est un projet indépendant, pensé et développé en solo, au plus près du terrain. L'objectif : rendre ces standards, EBICS, ISO 20022 et SEPA, moins opaques et plus actionnables pour les professionnels qui les manipulent chaque jour.",
        ],
      },
      {
        h2: 'Autres projets',
        paras: [
          "EDI Insight n'est pas mon seul projet. Je développe aussi <b>Vigie Micro</b>, une application pour les auto-entrepreneurs et les micro-entreprises : elle suit leur chiffre d'affaires, les prévient avant un seuil de TVA ou de régime, et leur rappelle chaque échéance Urssaf. Un autre public, mais le même travail : rendre lisible une règle qu'on subit au lieu de la comprendre.",
          '<a href="/vigie/">Découvrir Vigie Micro →</a>',
        ],
      },
    ],
    facts: [
      { n: '10 ans', d: "d'expérience bancaire sur les flux EDI et le cash management." },
      { n: 'Terrain', d: 'Mise en place EBICS, migrations logicielles, validation de certificats, diagnostic de fichiers.' },
      { n: 'Indépendant', d: 'EDI Insight, pensé et développé en solo, au plus près du métier.' },
    ],
    finalH2: "Envie de voir l'outil à l'œuvre ?",
    finalP: "La validation de fichiers et les deux référentiels sont gratuits, sans compte.",
  },

  telecharger: {
    file: 'telecharger/index.html',
    title: "Télécharger EDI Insight — il n'y a rien à installer",
    desc: "Sur ordinateur, EDI Insight est une application web : rien à installer, aucun droit administrateur, aucun passage par la DSI. La version iOS, elle, se télécharge sur l'App Store.",
    kicker: "Accéder à l'application",
    h1: "Télécharger EDI Insight ? Il n'y a rien à installer.",
    lead: "Sur ordinateur, EDI Insight est une application web : vous ouvrez une page, vous déposez votre fichier, vous travaillez. Pas d'installeur, pas de ticket à la DSI, pas de mise à jour à surveiller. Si vous cherchiez un téléchargement, c'est pour la version iOS, sur l'App Store.",
    cards: [
      {
        tag: '✓ Recommandé — ordinateur', h3: 'Version web',
        p: "Le poste de travail complet, dans votre navigateur. C'est la version la plus à jour et la plus outillée.",
        list: [
          'Aucune installation, aucun droit administrateur',
          'Chrome, Edge, Firefox ou Safari — Windows, macOS, Linux',
          'Vos fichiers sont analysés dans votre navigateur, pas envoyés sur un serveur',
          "Toujours à jour : la dernière version est celle que vous ouvrez",
        ],
        cta: { label: "Ouvrir l'app web →", to: 'APP' },
        note: 'app.ediinsight.app — gratuit pour commencer, sans compte pour les référentiels.',
      },
      {
        tag: 'Mobilité — iPhone et iPad', h3: 'Version iOS',
        p: "Le référentiel dans la poche, pour retrouver un code au pied levé : en réunion, chez le client, au téléphone avec sa banque.",
        list: [
          'Codes erreurs EBICS et motifs de rejet SEPA hors ligne',
          'Référentiel ISO 20022 et glossaire métier',
          'Gratuit, avec une offre Pro intégrée',
        ],
        store: true,
        note: "iOS 16 ou plus récent. Pas de version Android à ce jour — utilisez la version web.",
      },
    ],
    sections: [
      {
        h2: "Pourquoi une app web plutôt qu'un logiciel à installer ?",
        paras: [
          "Parce que le métier des flux de paiement bouge en permanence : un code de rejet change de libellé, une banque durcit une contrainte, une version de <code>pain.001</code> remplace la précédente. Un logiciel installé serait périmé au premier référentiel modifié, et il faudrait le faire valider, déployer, puis mettre à jour sur chaque poste.",
          "Avec la version web, la mise à jour est déjà faite quand vous arrivez. Et surtout, dans un service bancaire ou une DSI, <b>faire installer un exécutable est souvent le vrai obstacle</b>. Ouvrir une page ne demande l'autorisation de personne. C'est aussi ce qui garantit la confidentialité de vos fichiers : l'analyse tourne dans votre navigateur, le contenu de vos virements et prélèvements ne part sur aucun serveur.",
        ],
      },
    ],
    faq: [
      { q: "Faut-il télécharger EDI Insight pour l'utiliser sur ordinateur ?", a: "Non. Sur ordinateur, EDI Insight est une application web : elle s'ouvre sur app.ediinsight.app dans n'importe quel navigateur récent. Aucun installeur, aucun .exe, aucun droit administrateur, aucun passage par la DSI." },
      { q: "Existe-t-il une application à installer sur iPhone ?", a: "Oui, sur l'App Store. La version iOS est pensée pour la consultation en mobilité : les référentiels EBICS et les codes de rejet, disponibles hors ligne. Les modules d'analyse et de génération de fichiers vivent dans la version web." },
      { q: "Et une version Android ou un client lourd Windows ?", a: "Il n'y en a pas, et c'est volontaire : la version web couvre déjà Windows, macOS, Linux et Android depuis le navigateur, sans rien installer ni maintenir sur les postes." },
      { q: "Mes fichiers de paiement sont-ils envoyés sur un serveur ?", a: "Non. L'analyse des fichiers XML se fait dans votre navigateur : le contenu de vos fichiers ne quitte pas votre poste." },
      { q: "Faut-il créer un compte pour commencer ?", a: "Pas pour consulter les référentiels ni pour valider un fichier. Un compte n'est nécessaire que pour les modules sur abonnement : diagnostic complet, convertisseur d'adresses, génération de fichiers réels." },
    ],
    finalH2: 'Le plus court chemin : ouvrir la page.',
    finalP: 'Déposez un fichier, obtenez le rapport. Gratuit pour commencer, sans installation.',
  },

  vigie: {
    file: 'vigie/index.html',
    title: 'Vigie Micro — seuils de TVA et Urssaf pour auto-entrepreneurs',
    desc: "Vigie Micro suit votre chiffre d'affaires et vous prévient avant un seuil de TVA ou de régime micro. iPhone, iPad et Android. 7 jours d'essai gratuit.",
    kicker: 'Vigie Micro · seuils · TVA · Urssaf · micro-entreprise',
    h1: 'Savoir combien vous pouvez vraiment dépenser, et ne jamais dépasser un seuil sans le voir venir.',
    lead: "Vigie a été conçue par un auto-entrepreneur, pour les auto-entrepreneurs. Elle suit le chiffre d'affaires que vous encaissez et vous prévient avant que vous franchissiez un seuil : franchise de TVA, plafond du régime, échéance Urssaf. Toutes les règles utilisées sont datées et sourcées, consultables dans l'application.",
    stores: {
      apple: 'https://apps.apple.com/fr/app/id6798221499',
      google: 'https://play.google.com/store/apps/details?id=com.alexandrevoisin.vigie',
      brochure: '/vigie/plaquette-vigie.pdf',
    },
    marks: [
      { n: 'Chez vous', d: "Vos données restent chez vous. Pas de compte à créer, pas de banque à connecter, aucun serveur chez l'éditeur." },
      { n: 'Sourcées', d: 'Des règles sourcées et datées. Chaque seuil et chaque taux porte sa référence officielle et sa date de vérification.' },
      { n: 'Partout', d: "iPhone, iPad et Android. 7 jours d'essai gratuit, puis abonnement mensuel ou annuel." },
    ],
    doH2: 'Ce que Vigie fait pour vous',
    features: [
      { h: 'Combien il vous reste vraiment', p: "Vous notez ce que vous encaissez ; Vigie calcule ce qu'il faut mettre de côté pour l'Urssaf, la TVA et l'impôt, et ce qui reste réellement disponible." },
      { h: 'Pas de mauvaise surprise', p: "Jauges de franchise de TVA (seuil de base et seuil majoré) et de plafond du régime micro, avec projection de franchissement. Vous êtes prévenu avant." },
      { h: 'Déclarer sans stress', p: "Le chiffre exact à reporter sur autoentrepreneur.urssaf.fr, période par période, avec la date d'échéance et un rappel avant chaque échéance." },
      { h: 'Devis et factures en quelques minutes', p: 'Avec votre logo et toutes les mentions obligatoires.' },
      { h: 'Vos livres tenus pour vous', p: "Livre des recettes et registre des achats, exports PDF et CSV, prêts pour votre expert-comptable." },
      { h: "Simulez avant de vous engager", p: "Ajoutez un devis en attente ou un contrat espéré pour voir quels seuils vous franchiriez, sans que cela entre dans vos livres." },
    ],
    shots: [
      { src: '/vigie/vigie-iphone.png', alt: "Vigie sur iPhone : somme à réserver ce mois-ci, jauge de franchise de TVA à 76 % et prochaine échéance Urssaf.", cap: "Sur iPhone : seuil de TVA, où vous en êtes, et quand vous le franchirez", w: 456, h: 1000 },
      { src: '/vigie/vigie-android.png', alt: "Vigie sur Android : écran « Déclaration à faire » avec la période, la date limite, le chiffre d'affaires total et les cotisations estimées.", cap: "Sur Android : déclaration, le montant exact et la date limite", w: 455, h: 1000 },
    ],
    sections: [
      {
        h2: 'Pour qui',
        paras: [
          "<b>Vous démarrez.</b> Vous ne savez pas encore quand tombe votre première déclaration ni ce que vous devez mettre de côté : Vigie vous le dit dès la saisie de votre première recette.",
          "<b>Vous approchez d'un seuil.</b> Franchise de TVA en particulier : le passage se joue parfois sur une seule facture.",
          "<b>Vous faites vos factures sur Word, sur papier ou sur un tableur.</b> Devis et factures en quelques minutes avec votre logo et les mentions obligatoires, livre des recettes et registre des achats exportables.",
        ],
      },
      {
        h2: 'Une information fiable',
        paras: [
          "Chaque règle affichée porte sa source officielle et sa date de vérification, consultables dans l'application. Aucune règle fiscale n'est générée par une IA : elles sont écrites à la main.",
        ],
      },
      {
        h2: 'Vos données restent chez vous',
        paras: [
          "Pas de compte à créer, pas de banque à connecter, aucun serveur chez l'éditeur. Vos chiffres d'affaires, vos clients et vos justificatifs restent dans votre appareil.",
          "<b>Sauvegarde.</b> Sur iPhone et iPad, la synchronisation iCloud est optionnelle et reste sur votre compte personnel. Sur Android, le système peut sauvegarder automatiquement vers votre Google Drive si vous l'avez activé, et l'application propose un export manuel dans un fichier.",
          "Fiche de confidentialité de l'App Store : aucune donnée collectée. Sur Google Play, la déclaration de sécurité des données est consultable depuis la page de l'application. <a href=\"https://a1ex092.github.io/vigie-legal/politique-confidentialite.html\" target=\"_blank\" rel=\"noopener\">Politique de confidentialité</a>.",
        ],
      },
      {
        h2: "Ce que Vigie n'est pas",
        paras: [
          "Ni logiciel de comptabilité, ni télédéclarant, ni conseil personnalisé. Vigie ne se substitue ni à l'Urssaf, ni à impots.gouv.fr, ni à un professionnel du chiffre. Elle ne transmet rien à l'Urssaf ni à l'administration fiscale à votre place : elle prépare le chiffre, vous le reportez vous-même.",
        ],
      },
      {
        h2: 'Essai et tarifs',
        paras: [
          "<b>7 jours d'essai gratuit</b>, sans engagement, avec toutes les fonctions et sans compte à créer. Ensuite, un abonnement mensuel ou annuel, résiliable à tout moment. Les prix et la résiliation sont gérés par l'App Store ou Google Play : ils sont affichés sur la fiche de l'application.",
        ],
      },
      {
        h2: 'Qui est derrière Vigie',
        paras: [
          "Je m'appelle Alexandre Voisin. Vigie est conçue par un auto-entrepreneur, et vos retours l'améliorent directement : écrivez-moi, je réponds personnellement.",
          "Je suis aussi le fondateur d'<a href=\"/\">EDI Insight</a>, un outil pour les flux de paiement en banque. <a href=\"/a-propos.html\">Mon parcours</a>.",
          "Contact : <a href=\"mailto:alexandre.voisin@ediinsight.app\">alexandre.voisin@ediinsight.app</a> · Support : <a href=\"mailto:support@ediinsight.app\">support@ediinsight.app</a>",
        ],
      },
    ],
    faq: [
      { q: 'Vigie remplace-t-elle ma déclaration Urssaf ?', a: "Non. Vigie calcule le chiffre à reporter, la période et la date d'échéance, et vous rappelle avant chaque échéance. La déclaration reste à faire sur autoentrepreneur.urssaf.fr." },
      { q: 'Mes données sont-elles envoyées quelque part ?', a: "Non. Il n'y a aucun serveur chez l'éditeur. Elles restent sur votre appareil, avec une sauvegarde optionnelle sur votre iCloud (iPhone, iPad) ou votre Google Drive (Android)." },
      { q: 'Vigie est-elle gratuite ?', a: "Vous l'essayez 7 jours gratuitement, avec toutes les fonctions. Ensuite, un abonnement mensuel ou annuel est nécessaire." },
      { q: 'Sur quels appareils ?', a: 'iPhone, iPad et Android.' },
      { q: 'Les règles fiscales sont-elles à jour ?', a: "Chaque règle affichée porte sa source officielle et sa date de vérification, consultables dans l'application." },
    ],
    finalH2: "7 jours d'essai gratuit, sans compte à créer.",
    finalP: "Vous téléchargez, vous saisissez votre activité et votre date de création, et vous voyez immédiatement vos seuils, votre prochaine échéance et ce que vous devez mettre de côté.",
  },
};
