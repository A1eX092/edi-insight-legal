/**
 * Pages produit — une par module. Contenu éditorial pur : la mise en page vit
 * dans generate.js (productPage). Toute modification de texte se fait ici.
 */
module.exports = {
  hubTitle: 'Les modules d’EDI Insight',
  hubDesc: "Quatre modules, un seul fichier à déposer : validation, conversion d'adresses, génération de fichiers et diagnostic de rejet. Tout s'exécute dans le navigateur, sans installation ni projet d'intégration.",
  modules: [
    {
      slug: 'validation-fichiers-sepa',
      nav: 'Validation de fichiers',
      navDesc: 'SCT, SDD, XCT, ICT — règle par règle',
      kicker: 'Module — validation',
      teaser: "Structure du schéma, balises obligatoires, IBAN, jeu de caractères, longueurs et totaux : le fichier est contrôlé règle par règle, et chaque écart est localisé dans le XML.",
      h1: "Valider un fichier SEPA avant de l'envoyer à la banque",
      title: "Valider un fichier SEPA (SCT, SDD, XCT, ICT) avant envoi — EDI Insight",
      desc: "Déposez un fichier de virement ou de prélèvement : structure du schéma, balises obligatoires, IBAN, jeu de caractères, longueurs et totaux sont contrôlés, chaque écart localisé dans le XML. Gratuit, sans installation, traitement local.",
      lead: "Un fichier refusé par la banque, c'est une remise qui repart le lendemain, un fournisseur payé en retard et une demi-journée passée à chercher la ligne fautive dans un XML de plusieurs milliers de lignes. La validation répond à une seule question : est-ce que ce fichier passera ?",
      sections: [
        {
          h2: 'Ce qui est contrôlé',
          p: "Le fichier est passé au crible des règles qui font réellement rejeter une remise, pas seulement de la grammaire XML.",
          list: [
            "<b>Structure du schéma</b> — conformité au message ISO 20022 déclaré, balises inconnues ou mal imbriquées.",
            "<b>Balises obligatoires</b> — présence et ordre des éléments exigés par le message et par le rulebook applicable.",
            "<b>Coordonnées bancaires</b> — format et clé de contrôle de l'IBAN, cohérence IBAN / BIC / pays.",
            "<b>Jeu de caractères</b> — caractères hors du jeu bancaire accepté, accents et signes qui font échouer la remise.",
            "<b>Longueurs et formats</b> — champs tronqués, dates d'exécution, devises, formats de montant.",
            "<b>Totaux et compteurs</b> — nombre d'opérations et somme de contrôle annoncés contre le contenu réel.",
            "<b>Adresses</b> — repérage des adresses non structurées, à l'heure du passage au format ISO 20022.",
          ],
        },
        {
          h2: 'Ce que vous obtenez',
          p: "Un rapport lisible, pas une pile de messages d'erreur de parseur. Chaque anomalie indique la balise concernée et sa position dans le fichier, avec ce qu'il faut corriger et pourquoi cette règle existe.",
          list: [
            "La liste des écarts, classés du bloquant à l'avertissement.",
            "La balise et la ligne exactes, pour corriger dans votre outil source.",
            "La règle d'origine : rulebook, schéma ou usage bancaire.",
            "Le récapitulatif de la remise : nombre d'opérations, total, dates, débiteur.",
          ],
        },
        {
          h2: "Sur quoi s'appuient les contrôles",
          p: "Les règles ne sont pas déduites d'exemples : elles viennent des textes de référence, et sont mises à jour quand ceux-ci changent.",
          list: [
            "Les rulebooks de l'EPC en vigueur pour le virement et le prélèvement SEPA.",
            "Les guides du CFONB, notamment pour les adresses et le jeu de caractères.",
            "Les schémas ISO 20022 des messages pain.001, pain.008, pain.002 et pacs.002.",
            "Les écarts connus entre la norme et ce que les banques acceptent réellement.",
          ],
        },
      ],
      faq: [
        { q: "Mon fichier part-il sur un serveur ?", a: "Non. L'analyse s'exécute dans votre navigateur : le fichier n'est pas transmis, ni stocké. C'est ce qui permet de l'utiliser sur des remises réelles sans validation de la sécurité informatique." },
        { q: "Quels types de fichiers sont acceptés ?", a: "Les virements et prélèvements SEPA (SCT, SCT Inst, SDD Core et B2B), ainsi que les virements hors zone SEPA et internationaux (XCT, ICT), dans les messages pain.001 et pain.008. Les comptes rendus pain.002 et pacs.002 sont lus par le module de diagnostic." },
        { q: "La validation est-elle payante ?", a: "Non, la validation de fichiers est gratuite et sans limite, comme la comparaison de deux fichiers et la consultation des référentiels." },
        { q: "Est-ce que cela remplace un test avec ma banque ?", a: "Non. La validation élimine les rejets de forme, qui représentent la grande majorité des refus, mais chaque banque garde ses propres contrôles. L'outil signale d'ailleurs les points où les pratiques bancaires divergent de la norme." },
      ],
    },
    {
      slug: 'convertisseur-adresses',
      nav: "Convertisseur d'adresses",
      navDesc: 'NF Z10-011 vers ISO 20022',
      kicker: 'Module — adresses structurées',
      teaser: "Du format libre aux balises ISO 20022, selon le guide CFONB — y compris les cas où la règle est de ne pas découper la ligne. Score de confiance et export XML.",
      h1: "Convertir une adresse française au format ISO 20022",
      title: "Convertisseur d'adresses NF Z10-011 vers ISO 20022 — EDI Insight",
      desc: "Transformez vos adresses au format libre en adresses structurées ISO 20022 : StrtNm, BldgNb, PstCd, TwnNm, Ctry, selon les règles du guide CFONB, avec score de confiance et export XML.",
      lead: "Une adresse française tient en trois lignes libres. La banque, elle, attend désormais des balises distinctes. Entre les deux, il y a des règles de transposition, des cas où il ne faut surtout pas découper la ligne, et un stock de tiers à traiter.",
      sections: [
        {
          h2: 'Du format libre aux balises',
          p: "Chaque ligne d'adresse est analysée puis répartie dans les éléments du bloc <code>PstlAdr</code> : nom de voie, numéro, bâtiment, étage, boîte postale, code postal, ville, subdivision et pays.",
          list: [
            "<b>Format structuré</b> — chaque information dans sa balise, ce que demandent les nouveaux formats.",
            "<b>Format hybride</b> — ville, code postal et pays structurés, le reste en lignes d'adresse, quand c'est le compromis admis.",
            "<b>Score de confiance</b> — les adresses ambiguës sont signalées plutôt que découpées au hasard.",
            "<b>Export</b> — le bloc XML prêt à être repris dans votre référentiel tiers.",
          ],
        },
        {
          h2: 'Les cas où la règle est de ne pas découper',
          p: "C'est là que la plupart des conversions se trompent. Une mention de service, un complément d'adresse, un lieu-dit ou un point de remise ne sont pas des noms de voie : les forcer dans <code>StrtNm</code> produit une adresse conforme au schéma mais fausse pour le facteur, et parfois refusée par la banque. Le convertisseur applique les règles du guide CFONB, y compris celles qui consistent à laisser la ligne telle quelle.",
        },
        {
          h2: 'Pourquoi maintenant',
          p: "Swift a reporté son échéance le 27 août 2026 et l'EPC a levé la sienne le 9 septembre, mais l'obligation n'est pas annulée : elle est décalée. Les banques allemandes maintiennent d'ailleurs le 15 novembre 2026 sur les formats de fichiers. Ce report est la fenêtre idéale pour convertir un stock de tiers sans pression.",
          link: { label: 'Lire le guide complet des adresses structurées', href: 'ARTICLE' },
        },
      ],
      faq: [
        { q: "Quelle différence entre structuré et hybride ?", a: "En structuré, chaque information a sa balise (nom de voie, numéro, code postal, ville, pays). En hybride, seuls la ville, le code postal et le pays sont structurés, le reste reste en lignes d'adresse. Les deux coexistent aujourd'hui selon les canaux et les banques." },
        { q: "Puis-je convertir tout mon référentiel tiers d'un coup ?", a: "Oui, le traitement par lot fait partie de l'offre convertisseur. Les adresses au score de confiance faible sont isolées pour être revues à la main plutôt que converties à l'aveugle." },
        { q: "Les adresses étrangères sont-elles gérées ?", a: "La transposition fine suit le guide CFONB, donc les adresses françaises. Les adresses étrangères sont traitées sur les éléments universels (code postal, ville, pays) et les lignes conservées quand le découpage n'est pas sûr." },
        { q: "Mes adresses sont-elles transmises quelque part ?", a: "Non. Comme pour la validation, la conversion s'exécute dans votre navigateur : aucune donnée de tiers ne sort de votre poste." },
      ],
    },
    {
      slug: 'generateur-fichiers',
      nav: 'Générateur de fichiers',
      navDesc: "D'un CSV à un virement ou un prélèvement",
      kicker: 'Module — génération',
      teaser: "Un export CSV devient un virement ou un prélèvement conforme, contrôlé au moment de la production — ou un jeu de test entièrement fictif pour éprouver vos contrôles.",
      h1: "Produire un fichier de virement ou de prélèvement à partir d'un CSV",
      title: "Générer un fichier SEPA (pain.001, pain.008) à partir d'un CSV — EDI Insight",
      desc: "Un export CSV de votre outil de gestion devient un fichier de virement ou de prélèvement conforme, contrôlé au passage — ou un jeu de test fictif pour éprouver vos propres contrôles.",
      lead: "Toutes les organisations n'ont pas un outil capable de produire un fichier bancaire. Quand la remise se prépare dans un tableur, la question n'est pas théorique : comment transformer ces lignes en un fichier que la banque accepte ?",
      sections: [
        {
          h2: 'Deux usages',
          list: [
            "<b>Un fichier réel</b> — à partir de votre export CSV : bénéficiaires, IBAN, montants, références, date d'exécution. Le fichier produit est un virement ou un prélèvement conforme, prêt à être déposé.",
            "<b>Un jeu de test fictif</b> — des remises crédibles mais entièrement inventées, pour éprouver vos propres contrôles, une recette ou un paramétrage bancaire sans manipuler de données réelles.",
          ],
        },
        {
          h2: 'Contrôlé au moment de la production',
          p: "Le fichier généré passe par les mêmes règles que le module de validation : il ne sort pas de l'outil avec une erreur de forme connue. Les lignes du CSV qui ne peuvent pas être converties sont listées avec leur motif, plutôt que silencieusement ignorées.",
          list: [
            "Format et clé de contrôle des IBAN.",
            "Jeu de caractères et longueurs bancaires sur les libellés et les références.",
            "Cohérence des montants, des devises et des totaux de remise.",
            "Champs obligatoires du message et du rulebook applicable.",
          ],
        },
        {
          h2: 'Ce qui est produit',
          p: "Des remises de virement (pain.001) et de prélèvement (pain.008), dans les versions en vigueur, avec les blocs d'adresse au format structuré quand l'information est disponible.",
        },
      ],
      faq: [
        { q: "Quelles colonnes doit contenir mon CSV ?", a: "Les colonnes attendues sont annoncées dans l'outil et un modèle est fourni : bénéficiaire, IBAN, montant, référence, date d'exécution, et l'adresse si vous la transmettez. L'ordre des colonnes n'a pas d'importance." },
        { q: "Le fichier généré est-il utilisable en production ?", a: "Oui, c'est l'usage prévu. Comme pour toute première remise sur un nouveau canal, un test avec votre banque reste recommandé avant de basculer un flux régulier." },
        { q: "Et pour le prélèvement, la gestion des mandats ?", a: "Les références de mandat et les données de séquence sont reprises depuis votre CSV : l'outil produit le fichier et contrôle la cohérence, il ne tient pas le registre des mandats à votre place." },
      ],
    },
    {
      slug: 'diagnostic-rejets',
      nav: 'Diagnostic de rejet',
      navDesc: 'Du code au message client',
      kicker: 'Module — diagnostic',
      teaser: "Du code renvoyé par la banque à la cause réelle : l'action à mener, qui doit agir, si le rejeu est possible, et le message à transmettre au client.",
      h1: "Comprendre un rejet de paiement, du code au message client",
      title: "Diagnostiquer un rejet SEPA ou EBICS : causes et marche à suivre — EDI Insight",
      desc: "Un pacs.002, un pain.002 ou un retour EBICS en main : le motif est traduit en cause réelle, en correction à appliquer, et en message transmissible au client. 29 motifs ISO et 43 codes EBICS documentés.",
      lead: "Un code de quatre caractères et un libellé en majuscules : c'est tout ce que la banque renvoie. Reste à savoir ce qui s'est passé, qui doit agir, si l'opération peut être rejouée, et quoi répondre au client qui n'a pas été payé.",
      sections: [
        {
          h2: 'Ce que le diagnostic apporte',
          list: [
            "<b>La traduction en clair</b> du motif, au-delà du libellé normalisé.",
            "<b>Les causes probables</b>, classées de la plus fréquente à la plus rare.",
            "<b>L'action à mener</b>, et par qui : le donneur d'ordre, la banque, ou le bénéficiaire.",
            "<b>Le rejeu</b> : possible après correction, ou à proscrire.",
            "<b>L'équivalent CFONB</b> du motif ISO, indispensable quand vos outils internes raisonnent encore en codes CFONB.",
            "<b>Un message transmissible</b> au client, sans jargon bancaire.",
          ],
        },
        {
          h2: 'Deux référentiels complets',
          p: "Les 29 motifs de rejet ISO 20022 et les 43 codes erreurs EBICS sont consultables librement, code par code. Les fiches publiques donnent la signification et le contexte ; les causes détaillées et la marche à suivre complète sont dans l'outil, avec trois résolutions offertes par référentiel dès la création d'un compte, sans mot de passe.",
          links: [
            { label: 'Voir les 29 motifs de rejet ISO 20022', href: 'ISO' },
            { label: 'Voir les 43 codes erreurs EBICS', href: 'EBICS' },
          ],
        },
        {
          h2: 'Le cas des retours EBICS',
          p: "Un rejet n'arrive pas toujours sur le paiement : il arrive souvent sur le transport. Certificat expiré, signature manquante, état de signataire invalide, OrderType non autorisé — le référentiel EBICS couvre les versions 2.5 et 3.0, avec la catégorie et la sévérité de chaque code, parce qu'un code d'information ne se traite pas comme un refus bloquant.",
        },
      ],
      faq: [
        { q: "Quels fichiers de retour sont lus ?", a: "Les comptes rendus de remise (pain.002), les rejets et retours interbancaires (pacs.002), et les retours du protocole EBICS." },
        { q: "Pourquoi certaines résolutions sont-elles réservées ?", a: "La signification d'un code est publique et le restera. Le travail de qualification — causes classées, marche à suivre, cas particuliers rencontrés — est ce qui prend du temps à produire et à tenir à jour : c'est ce qui est inclus dans l'offre. Trois résolutions par référentiel sont offertes pour juger sur pièces." },
        { q: "Un rejet peut-il être rejoué tel quel ?", a: "Cela dépend du motif : certains appellent une simple correction et un renvoi, d'autres interdisent le rejeu, notamment quand le compte est clos ou le mandat révoqué. Chaque fiche l'indique explicitement." },
      ],
    },
  ],
};
