'use strict';
/**
 * Article de référence « adresses structurées ISO 20022 » — version française.
 * Séparé de generate.js : le texte se relit et se met à jour sans toucher au
 * moteur de génération. La date `updated` est affichée ET utilisée comme
 * dateModified dans les données structurées.
 */
module.exports = {
  updated: '2026-09-17',
  updatedLabel: '17 septembre 2026',
  metaTitle: 'Adresses structurées ISO 20022 : le guide complet 2026 | EDI Insight',
  metaDesc: "Adresses structurées ISO 20022 : ce qui change, les deux calendriers Swift et SEPA après les reports, les champs XML exacts, les règles de transposition CFONB et les pièges. Mis à jour le 17 septembre 2026.",
  kicker: 'Guide de référence',
  h1: 'Adresses structurées ISO 20022',
  sub: 'Ce qui change, pour qui, quand, et comment transposer une adresse française sans se tromper.',
  lead: "Les adresses en texte libre disparaissent des messages de paiement. Le principe est acté depuis longtemps, mais 2026 a vu deux reports d'échéance en trois semaines, et la confusion règne : Swift et SEPA ne suivent pas le même calendrier, l'Allemagne maintient une date que la France n'a plus, et personne ne dit clairement quels champs remplir. Ce guide fait le point, à jour au 17 septembre 2026.",

  sections: [
    { id: 'essentiel', h2: "L'essentiel en trente secondes", html: `
<ul>
  <li>Une adresse de paiement doit passer du <strong>texte libre</strong> (les balises <code>AdrLine</code>) à des <strong>champs séparés</strong> : rue, numéro, code postal, ville, pays.</li>
  <li><strong>Deux calendriers distincts</strong> : Swift pour les paiements internationaux, l'EPC pour les paiements SEPA. Les deux ont été repoussés à l'été 2026, à des dates différentes et pour des raisons différentes.</li>
  <li><strong>Aucune nouvelle date ferme n'est connue</strong> à ce jour. Swift consultera le marché d'ici décembre 2026, l'EPC devait trancher à sa réunion d'octobre.</li>
  <li><strong>Certaines places n'ont rien reporté</strong> : les banques allemandes et luxembourgeoises maintiennent, elles, le 15 novembre 2026 pour la fin des anciens formats de fichiers.</li>
  <li>Le report ne change rien au vrai chantier : <strong>la qualité de vos référentiels tiers</strong>. Une adresse incomplète dans l'ERP le reste, quelle que soit la date.</li>
</ul>` },

    { id: 'definitions', h2: 'Structuré, hybride, non structuré : les trois formats', html: `
<p>ISO 20022 décrit une adresse postale dans un bloc <code>PstlAdr</code>. Trois façons de le remplir coexistent, et la confusion entre elles est la première source d'erreur.</p>
<p><strong>Non structuré.</strong> Tout est en texte libre, dans des balises <code>AdrLine</code> qui se suivent. C'est ce format qui disparaît.</p>
<pre class="art-code">&lt;PstlAdr&gt;
  &lt;AdrLine&gt;12 RUE DU FAUBOURG SAINT-HONORE&lt;/AdrLine&gt;
  &lt;AdrLine&gt;75008 PARIS&lt;/AdrLine&gt;
&lt;/PstlAdr&gt;</pre>
<p><strong>Hybride.</strong> La ville et le pays passent dans leurs balises dédiées, le reste demeure en texte libre. C'est le compromis accepté par Swift et par les rulebooks SEPA, et celui que retiennent beaucoup de banques comme minimum acceptable.</p>
<pre class="art-code">&lt;PstlAdr&gt;
  &lt;TwnNm&gt;PARIS&lt;/TwnNm&gt;
  &lt;Ctry&gt;FR&lt;/Ctry&gt;
  &lt;AdrLine&gt;12 RUE DU FAUBOURG SAINT-HONORE&lt;/AdrLine&gt;
&lt;/PstlAdr&gt;</pre>
<p><strong>Totalement structuré.</strong> Chaque information a sa balise. C'est la cible, et c'est ce que l'EPC recommande d'atteindre directement, sans passer par l'étape hybride.</p>
<pre class="art-code">&lt;PstlAdr&gt;
  &lt;StrtNm&gt;12 RUE DU FAUBOURG SAINT-HONORE&lt;/StrtNm&gt;
  &lt;PstCd&gt;75008&lt;/PstCd&gt;
  &lt;TwnNm&gt;PARIS&lt;/TwnNm&gt;
  &lt;Ctry&gt;FR&lt;/Ctry&gt;
&lt;/PstlAdr&gt;</pre>
<p>Un point mérite d'être souligné tout de suite, car il surprend souvent : dans l'exemple ci-dessus, le numéro reste collé à la voie. Ce n'est pas une approximation, c'est la règle du guide CFONB. Nous y revenons plus bas.</p>` },

    { id: 'champs', h2: 'Les champs et leurs longueurs', html: `
<p>Voici les balises que vous rencontrerez dans un <code>PstlAdr</code>, avec leur longueur maximale. Dépasser la longueur, c'est un fichier rejeté à l'entrée, avant même d'atteindre la banque du bénéficiaire.</p>
<table class="art-table">
  <thead><tr><th>Balise</th><th>Contenu</th><th>Longueur</th></tr></thead>
  <tbody>
    <tr><td><code>StrtNm</code></td><td>Nom de la voie (numéro compris, voir plus bas)</td><td>70</td></tr>
    <tr><td><code>BldgNb</code></td><td>Numéro dans la voie, uniquement s'il est fourni séparément</td><td>16</td></tr>
    <tr><td><code>BldgNm</code></td><td>Nom du bâtiment : à ne pas utiliser selon le guide CFONB</td><td>35</td></tr>
    <tr><td><code>Flr</code></td><td>Étage, résidence, bâtiment, zone industrielle</td><td>70</td></tr>
    <tr><td><code>Room</code></td><td>Appartement, porte, bureau</td><td>70</td></tr>
    <tr><td><code>PstBx</code></td><td>Boîte postale</td><td>16</td></tr>
    <tr><td><code>PstCd</code></td><td>Code postal</td><td>16</td></tr>
    <tr><td><code>TwnNm</code></td><td>Ville</td><td>35</td></tr>
    <tr><td><code>TwnLctnNm</code></td><td>Lieu-dit, quartier</td><td>35</td></tr>
    <tr><td><code>CtrySubDvsn</code></td><td>Région, état, province</td><td>35</td></tr>
    <tr><td><code>Ctry</code></td><td>Code pays ISO 3166-1 alpha-2, deux lettres</td><td>2</td></tr>
    <tr><td><code>AdrLine</code></td><td>Ligne libre, en voie de disparition</td><td>70</td></tr>
  </tbody>
</table>
<p>Le minimum réclamé partout, y compris dans la version hybride, ce sont <code>TwnNm</code> et <code>Ctry</code>. Une adresse sans ville ou sans pays est le cas de rejet le plus fréquent, et le plus simple à détecter avant envoi.</p>` },

    { id: 'calendriers', h2: 'Deux calendriers à ne pas confondre', html: `
<p>C'est ici que la plupart des équipes se trompent. Le report annoncé par Swift ne concerne pas les virements SEPA, et inversement. Les deux univers ont leurs règles, leurs instances et leurs dates.</p>
<table class="art-table">
  <thead><tr><th>Périmètre</th><th>Qui décide</th><th>Où en est-on</th></tr></thead>
  <tbody>
    <tr>
      <td>Paiements internationaux (CBPR+)</td>
      <td>Swift</td>
      <td>Le 27 août 2026, Swift a reporté l'exigence prévue le 14 novembre 2026 pour les paiements. Une nouvelle date sera arrêtée après consultation, d'ici décembre 2026. Les changements hors paiements (titres, trade) passent au premier trimestre 2027.</td>
    </tr>
    <tr>
      <td>Virements et prélèvements SEPA</td>
      <td>European Payments Council</td>
      <td>Le 9 septembre 2026, l'EPC a levé l'échéance du 15 novembre 2026 dans les cinq rulebooks (SCT, SCT Inst, SDD Core, SDD B2B, OCT Inst). La nouvelle date devait être fixée à la réunion d'octobre, les rulebooks et guidelines révisés suivant.</td>
    </tr>
    <tr>
      <td>Paiements de gros montant en euro</td>
      <td>Eurosystème (T2, TIPS, T2S, ECMS)</td>
      <td>Les releases de novembre ont été décalées du 14 au 28 novembre 2026, avec des tests utilisateurs à partir du 9 octobre. T2 tolère temporairement les adresses entièrement non structurées.</td>
    </tr>
    <tr>
      <td>Allemagne et Luxembourg</td>
      <td>Communautés bancaires nationales</td>
      <td>Rien n'a été reporté sur les formats : la fin des anciennes versions de fichiers (pain en version 2009, DTAZV, MT101 au Luxembourg) reste annoncée au 15 novembre 2026, avec adresse structurée exigée au minimum sur la ville et le pays. À confirmer auprès de chaque banque.</td>
    </tr>
  </tbody>
</table>
<p>Autrement dit : si vous n'émettez que du SEPA, la date Swift ne vous concerne pas. Si vous payez des fournisseurs via une banque allemande ou luxembourgeoise, le report européen ne vous met pas à l'abri d'un changement de format en novembre. Et si vous faites les deux, vous menez deux chantiers, pas un.</p>` },

    { id: 'report', h2: 'Ce que le report change, et ce qu\'il ne change pas', html: `
<p>Deux reports en trois semaines ont produit un effet prévisible : des projets mis en attente, des budgets réaffectés, des équipes dispersées sur d'autres priorités. C'est le principal risque de la période.</p>
<p><strong>Ce que le report change vraiment :</strong> la pression du calendrier, donc la possibilité de travailler proprement. Nettoyer un référentiel tiers pendant une fenêtre calme, avec des tests, n'a rien à voir avec le même travail mené trois semaines avant une date couperet.</p>
<p><strong>Ce qu'il ne change pas :</strong> la direction. L'obligation n'est pas annulée, elle est décalée. Et surtout, il ne change rien à l'état de vos données. Une adresse sans ville reste une adresse sans ville en juin comme en novembre.</p>
<p>Il y a même un effet moins visible : adapter une passerelle de paiement prend des mois, adapter le modèle de données qui tient les comptes prend des années. Le second travail est le seul qui compte à long terme, et c'est celui qu'on repousse le plus facilement quand la date disparaît.</p>
<p>Le bon usage de cette fenêtre tient en une phrase : garder le créneau prévu, non pour la conformité qui peut attendre, mais pour la qualité des données qui, elle, ne s'améliore pas toute seule.</p>` },

    { id: 'qui', h2: "Qui est vraiment concerné, et quand l'adresse est-elle obligatoire", html: `
<p>Une nuance qui évite des mois de travail inutile : <strong>l'adresse du bénéficiaire n'est pas une donnée obligatoire du virement SEPA</strong>. Beaucoup d'entreprises n'en transmettent aucune, et leurs fichiers passent sans problème. La question ne se pose que dans trois cas.</p>
<ul>
  <li><strong>Vous transmettez déjà une adresse.</strong> Dès qu'elle est présente dans le message, elle doit respecter le format en vigueur. Une adresse partielle vaut parfois moins qu'une absence d'adresse.</li>
  <li><strong>Votre banque l'exige</strong> pour certains types d'opérations, ou son portail refuse les fichiers qui n'en contiennent pas.</li>
  <li><strong>Vous sortez de l'espace européen</strong> : paiements internationaux, opérations one-leg, contrôles de sanctions. Là, l'adresse est la règle, et c'est le terrain du calendrier Swift.</li>
</ul>
<p>Avant de lancer une reprise complète de votre base tiers, vérifiez donc ce que vous envoyez réellement aujourd'hui. Un export de vos derniers fichiers de paiement répond à la question en quelques minutes.</p>` },

    { id: 'cfonb', h2: 'Transposer une adresse française : les règles du guide CFONB', html: `
<p>Le CFONB a publié un guide de transposition de la norme postale française NF Z10-011 vers ISO 20022. C'est le document de référence en France, et il contient plusieurs règles contre-intuitives que les projets découvrent trop tard.</p>
<h3>Le numéro ne se sépare pas de la voie</h3>
<p>C'est la règle la plus mal connue. Le numéro n'alimente <code>BldgNb</code> <strong>que s'il arrive dans un champ dédié</strong> de votre fichier source. S'il est fondu dans la ligne d'adresse, le guide demande expressément de ne pas découper : l'ensemble part dans <code>StrtNm</code> et <code>BldgNb</code> reste vide. Les exemples du guide sont sans ambiguïté, « 22BIS RUE DES FLEURS » comme « 25D RUE DES FLEURS » partent entiers.</p>
<p>La raison pratique saute aux yeux dès qu'on tente l'inverse : « Rue du 8 Mai 1945 » et « Avenue du 11 Novembre » se prêtent mal à une détection automatique du numéro. Découper à tout prix, c'est fabriquer des adresses fausses.</p>
<h3>Le nom du bâtiment ne s'utilise pas</h3>
<p>Le guide proscrit <code>BldgNm</code> dans les deux cas de figure, entreprise et particulier. Une résidence, un bâtiment, une entrée, une zone industrielle vont dans <code>Flr</code>. Le motif est arithmétique : <code>BldgNm</code> est plafonné à 35 caractères alors qu'une ligne NF Z10-011 en compte 38. <code>Flr</code> en accepte 70.</p>
<h3>Boîtes postales et CEDEX</h3>
<p>« BP 40122 » va dans <code>PstBx</code>. La mention CEDEX, elle, reste accolée à la ville : « 75008 PARIS CEDEX 08 » donne <code>PstCd</code> 75008 et <code>TwnNm</code> PARIS CEDEX 08. C'est une information de distribution, pas une ligne d'adresse à part.</p>
<h3>Étage et appartement chez un particulier</h3>
<p>La deuxième ligne d'une adresse de particulier (étage, appartement, escalier) alimente <code>Flr</code> et <code>Room</code>. Chez une entreprise, la même position porte le service ou le destinataire, et va dans <code>Dept</code>.</p>
<h3>Le jeu de caractères</h3>
<p>Le guide CFONB décrit trois niveaux, et c'est une source de rejets discrets :</p>
<ul>
  <li>le jeu latin de base est toujours accepté ;</li>
  <li>les accents et le caractère @ sont admis sous accord bilatéral entre votre banque et vous : autrement dit, ça passe souvent, mais ce n'est pas garanti ;</li>
  <li>tout le reste est interdit, y compris deux caractères que les traitements de texte insèrent tout seuls : l'apostrophe typographique et le tiret cadratin.</li>
</ul>
<p>Un « L'Haÿ-les-Roses » copié depuis un document Word peut donc contenir un caractère invisible à l'œil et bloquant pour la banque.</p>` },

    { id: 'pieges', h2: 'Les pièges qui font perdre du temps', html: `
<ul>
  <li><strong>Le pays déduit du code postal.</strong> Quatre chiffres, c'est peut-être la Belgique, le Luxembourg ou la Suisse. Cinq chiffres, la France ou l'Allemagne. Une déduction automatique sans code pays déclaré produit des erreurs silencieuses : le fichier passe, le paiement part au mauvais endroit des contrôles.</li>
  <li><strong>L'adresse cohérente mais fausse.</strong> Un audit cité par la presse spécialisée relevait 92 % de villes renseignées, mais seulement 64 % d'adresses cohérentes entre champs. Le format ne dit rien de l'exactitude.</li>
  <li><strong>Les longueurs.</strong> Une ville de plus de 35 caractères, un code postal étranger long, et le message est refusé.</li>
  <li><strong>L'hybride pris pour une cible.</strong> Il est accepté, mais l'EPC recommande de viser directement le totalement structuré. Faire deux fois le chantier coûte plus cher que de le faire une fois bien.</li>
  <li><strong>Les adresses étrangères traitées comme des adresses françaises.</strong> Les règles NF Z10-011 ne s'appliquent qu'aux adresses françaises. Une adresse néerlandaise ou allemande a sa propre logique de code postal.</li>
  <li><strong>Le champ vide plutôt que le champ faux.</strong> Si vous n'avez pas l'information, ne la fabriquez pas. Une adresse absente est plus facile à rattraper qu'une adresse inventée.</li>
</ul>` },

    { id: 'chantier', h2: 'Comment chiffrer et mener le chantier', html: `
<p>Le coût d'une migration d'adresses ne dépend pas des règles, qui tiennent en quelques pages. Il dépend de la proportion de vos adresses que ces règles ne couvrent pas. Ce chiffre, personne ne peut vous le donner : il est dans votre base.</p>
<p>Exportez votre colonne adresse et posez-lui quatre questions.</p>
<ol>
  <li><strong>Combien de lignes commencent par un nombre suivi d'un espace ?</strong> Ce sont vos cas simples.</li>
  <li><strong>Combien n'ont pas de numéro de voie ?</strong> Elles ne sont pas fautives, elles demandent une règle à part.</li>
  <li><strong>Combien contiennent « bâtiment », « appartement », « résidence », « étage », « BP », « CS » ou « CEDEX » ?</strong> Ce sont vos compléments, et ils ne vont pas tous dans le même champ.</li>
  <li><strong>Combien n'ont ni ville ni pays exploitables ?</strong> Ce sont les seules qui bloqueront vraiment.</li>
</ol>
<p>Le total des deux dernières catégories, rapporté à votre volume, c'est votre reprise manuelle. C'est ce chiffre qui fait le budget, et il vous appartient avant toute consultation de prestataire.</p>
<p>Ensuite, la marche à suivre tient en trois temps : corriger à la source dans l'ERP plutôt qu'en sortie, tester un fichier réel sur le portail de votre banque avant de généraliser, et mettre un contrôle de saisie pour que la base ne se redégrade pas.</p>` },

    { id: 'banque', h2: 'Les six questions à poser à votre banque', html: `
<p>Les règles de place fixent un cadre, mais chaque établissement l'applique à sa façon, et les dates diffèrent d'une banque à l'autre. Voici ce qu'il faut faire préciser, par écrit si possible.</p>
<ol>
  <li><strong>Quelle date retenez-vous</strong> pour la fin des adresses non structurées, en SEPA et à l'international, après les reports de l'été 2026 ?</li>
  <li><strong>Acceptez-vous le format hybride</strong> (ville et pays structurés, reste en ligne libre), et jusqu'à quand ?</li>
  <li><strong>Quelles versions de messages</strong> acceptez-vous et jusqu'à quand : pain.001.001.03 ou .09, pain.008.001.02 ou .08, MT101 ?</li>
  <li><strong>Que faites-vous d'une adresse incomplète</strong> : rejet du fichier entier, rejet de l'opération, ou acceptation avec avertissement ?</li>
  <li><strong>Disposez-vous d'un environnement de test</strong> où je peux déposer un fichier réel sans le signer ?</li>
  <li><strong>Vos filiales étrangères appliquent-elles les mêmes règles ?</strong> C'est souvent là que se cachent les surprises, notamment en Allemagne et au Luxembourg.</li>
</ol>
<p>La quatrième question est la plus utile : elle détermine si une adresse imparfaite coûte un paiement ou un fichier entier.</p>` },
  ],

  faq: [
    { q: "Le 15 novembre 2026 est-il toujours l'échéance pour les virements SEPA ?", a: "Non. Le 9 septembre 2026, l'EPC a levé cette date dans les cinq rulebooks. Une nouvelle date devait être arrêtée à la réunion d'octobre 2026. En revanche, les communautés bancaires allemande et luxembourgeoise maintiennent le 15 novembre 2026 pour la fin des anciens formats de fichiers." },
    { q: "Faut-il passer par le format hybride ou aller directement au totalement structuré ?", a: "Les deux sont acceptés. L'EPC recommande le passage direct au format totalement structuré, sans étape hybride, afin de ne pas mener le chantier deux fois. L'hybride reste utile quand vos données ne permettent pas encore mieux : ville et pays dans leurs balises, le reste en ligne libre." },
    { q: "Dois-je renseigner l'adresse de mes bénéficiaires SEPA ?", a: "Ce n'est pas une donnée obligatoire du virement SEPA. Si vous n'en transmettez pas, la question ne se pose pas. Dès que vous en transmettez une, elle doit respecter le format en vigueur. Pour les paiements hors espace européen, l'adresse est en revanche la règle." },
    { q: "Faut-il séparer le numéro du nom de la rue ?", a: "Seulement si le numéro arrive dans un champ dédié de votre fichier source. S'il est dans la ligne d'adresse, le guide CFONB demande de ne pas découper : l'ensemble « numéro + voie » va dans StrtNm et BldgNb reste vide." },
    { q: "Que faire des CEDEX et des boîtes postales ?", a: "La boîte postale va dans PstBx. La mention CEDEX reste accolée à la ville : « 75008 PARIS CEDEX 08 » donne PstCd 75008 et TwnNm PARIS CEDEX 08." },
    { q: "Puis-je garder les accents dans les adresses ?", a: "Les accents et le caractère @ sont admis sous accord bilatéral avec votre banque : c'est toléré dans la plupart des cas, sans être garanti. En revanche, l'apostrophe typographique et le tiret cadratin, souvent insérés automatiquement par les traitements de texte, sont interdits." },
    { q: "Je n'ai que la ville et le pays. Est-ce suffisant ?", a: "Oui pour le format hybride, qui exige exactement ces deux informations dans leurs balises dédiées. Ce n'est pas la cible recommandée, mais c'est accepté et c'est très au-dessus d'une adresse entièrement libre." },
    { q: "Mes fichiers pain.001.001.03 sont-ils encore acceptés ?", a: "Cela dépend de votre banque et de votre pays. En France, rien n'impose une bascule à date fixe pour l'instant. En Allemagne et au Luxembourg, la fin des versions 2009 est annoncée au 15 novembre 2026, au profit de pain.001.001.09 et pain.008.001.08. Vérifiez auprès de chaque banque, les dates diffèrent d'un établissement à l'autre." },
    { q: "Qui doit corriger les adresses : mon ERP ou ma banque ?", a: "Votre ERP. La banque peut contrôler et rejeter, elle ne peut pas inventer une donnée absente. Les adresses vivent dans votre référentiel tiers, la correction y est durable ; une correction en sortie de fichier se répète à chaque envoi." },
    { q: "Comment savoir combien d'adresses poseront problème ?", a: "En comptant sur votre propre base : la part d'adresses sans ville ni pays exploitables, et celle des compléments (bâtiment, appartement, BP, CEDEX). C'est ce volume, et non les règles, qui détermine le coût du chantier." },
  ],

  ctaMid: {
    text: "Vous pouvez tester ces règles sur vos propres données : le convertisseur d'EDI Insight applique le guide CFONB à un fichier pain.001 ou à un export CSV, y compris les cas où la règle est de ne pas découper, et vous rend les adresses converties, les adresses à revoir et celles qui bloquent.",
    btn: "Tester le convertisseur d'adresses →",
  },
  ctaEnd: {
    title: 'Convertir vos adresses',
    text: "Déposez un fichier pain.001 ou un export CSV, récupérez vos adresses au format structuré ou hybride, avec la liste de celles qui demandent une reprise manuelle. Analyse dans votre navigateur, vos fichiers ne sont pas transmis.",
    btn: 'Ouvrir le convertisseur →',
  },
  faqTitle: 'Questions fréquentes',
  tocTitle: 'Au sommaire',
  updatedPrefix: 'Mis à jour le',
  note: "Ce guide suit l'actualité des échéances : les dates sont vérifiées à chaque mise à jour. Si une nouvelle date est annoncée par Swift ou par l'EPC, cette page est corrigée.",
};
