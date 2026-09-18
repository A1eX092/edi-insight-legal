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
};
