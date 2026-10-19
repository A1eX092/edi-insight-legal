/**
 * Guides Vigie Micro : une page par question précise (fr uniquement).
 * Chaque chiffre vient d'une page officielle citée dans `sources`, avec sa date.
 * `verified` : date de dernière vérification affichée sur la page.
 * Un seuil ou une date qui change = mettre à jour ce fichier ET `verified`.
 */
const VERIFIED = '19 octobre 2026';
const SP_TVA = 'https://entreprendre.service-public.gouv.fr/vosdroits/F21746';

module.exports = [
  {
    slug: 'declaration-urssaf-31-octobre-2026',
    title: 'Déclaration Urssaf du 31 octobre 2026 : pas de report au lundi',
    desc: "Le 31 octobre 2026 tombe un samedi et l'échéance Urssaf n'est pas reportée au 2 novembre. Qui est concerné, quoi déclarer, comment ne pas l'oublier.",
    crumb: 'Échéance du 31 octobre',
    kicker: 'Micro-entrepreneurs · Urssaf · échéance',
    h1: 'Déclaration Urssaf du 31 octobre 2026 : pas de report au lundi',
    lead: "Le 31 octobre 2026 tombe un samedi. D'habitude, une échéance qui tombe un week-end passe au jour ouvré suivant. Cette fois, non : la déclaration est à faire au plus tard le samedi 31 octobre 2026 à 23 h 59, et non le 2 novembre.",
    verified: VERIFIED,
    sections: [
      {
        h2: 'Qui est concerné ?',
        html: `<p>Les micro-entrepreneurs (auto-entrepreneurs) qui déclarent leur chiffre d'affaires à l'Urssaf :</p>
<ul>
<li><b>chaque mois</b> : vous déclarez le chiffre d'affaires de septembre 2026 ;</li>
<li><b>chaque trimestre</b> : vous déclarez le chiffre d'affaires du 3<sup>e</sup> trimestre 2026, c'est-à-dire juillet, août et septembre.</li>
</ul>`,
      },
      {
        h2: "Les échéances trimestrielles de l'année",
        html: `<p>Les déclarations trimestrielles se font au plus tard le 30 avril, le 31 juillet, le 31 octobre et le 31 janvier de l'année suivante.</p>`,
      },
      {
        h2: "Et s'il n'y a rien à déclarer ?",
        html: `<p>Une déclaration reste obligatoire, avec un chiffre d'affaires à 0. Dans ce cas, il n'y a ni impôt ni cotisations sociales à payer. Attention : une micro-entreprise qui ne déclare aucun chiffre d'affaires pendant 24 mois (ou 8 trimestres) est radiée d'office.</p>`,
      },
    ],
    vigieHtml: `<p>Vigie calcule le montant à reporter pour chaque période, affiche la date limite et vous rappelle avant chaque échéance. L'écran « Déclaration à faire » vous donne la période, la date et le chiffre d'affaires total.</p>
<p>Vigie ne transmet rien à l'Urssaf à votre place : elle prépare le chiffre, et vous le reportez vous-même sur autoentrepreneur.urssaf.fr.</p>`,
    faq: [
      { q: "L'échéance est-elle reportée au lundi 2 novembre ?", a: "Non. Elle reste fixée au samedi 31 octobre 2026." },
      { q: 'Je déclare tous les trimestres, que dois-je déclarer ?', a: "Le chiffre d'affaires de juillet, août et septembre 2026." },
      { q: "Je n'ai eu aucun chiffre d'affaires, dois-je déclarer ?", a: 'Oui, une déclaration à 0 reste obligatoire.' },
    ],
    sources: [
      { label: 'Service-Public (Entreprendre), « Déclarations et cotisations sociales », publié le 10 octobre 2026', href: 'https://entreprendre.service-public.gouv.fr/actualites/A19087' },
      { label: 'Bpifrance Création, « Micro-entrepreneurs : une échéance exceptionnelle au 31 octobre », 15 octobre 2026', href: 'https://bpifrance-creation.fr/entrepreneur/actualites/micro-entrepreneurs-echeance-exceptionnelle-au-31-octobre' },
      { label: 'Service-Public, fiche « Micro-entrepreneur : régime fiscal », vérifiée le 13 mai 2026 (déclaration à zéro, échéances trimestrielles, radiation d\'office)', href: 'https://entreprendre.service-public.gouv.fr/vosdroits/F23267' },
    ],
    note: "Avant de déclarer, vérifiez la date sur autoentrepreneur.urssaf.fr.",
  },

  {
    slug: 'seuils-franchise-tva-2026',
    title: 'Seuils de franchise de TVA 2026 : base et majoré',
    desc: 'Franchise de TVA 2026 : 37 500 € et 41 250 € pour les services, 85 000 € et 93 500 € pour la vente. Seuil de base, seuil majoré, calcul.',
    crumb: 'Seuils de TVA 2026',
    kicker: 'Micro-entrepreneurs · TVA · seuils',
    h1: 'Seuils de franchise de TVA 2026 : seuil de base et seuil majoré',
    lead: "Tant que votre chiffre d'affaires reste sous certains seuils, vous êtes en franchise en base de TVA : vous ne facturez pas la TVA et vous ne la déclarez pas. Il y a deux seuils par activité, un seuil de base et un seuil majoré. En 2026, ils n'ont pas changé.",
    verified: VERIFIED,
    sections: [
      {
        h2: 'Les seuils 2026',
        html: `<table class="art-table">
<thead><tr><th>Activité</th><th>Seuil de base</th><th>Seuil majoré</th></tr></thead>
<tbody>
<tr><td>Vente de biens, activité commerciale et hébergement</td><td>85 000 €</td><td>93 500 €</td></tr>
<tr><td>Prestations de services</td><td>37 500 €</td><td>41 250 €</td></tr>
<tr><td>Professions libérales (hors avocats)</td><td>37 500 €</td><td>41 250 €</td></tr>
<tr><td>Avocats, activités réglementées</td><td>50 000 €</td><td>55 000 €</td></tr>
<tr><td>Avocats, activités non réglementées</td><td>35 000 €</td><td>38 500 €</td></tr>
<tr><td>Auteurs et artistes-interprètes : ventes d'œuvres et cessions de droits</td><td>50 000 €</td><td>55 000 €</td></tr>
<tr><td>Auteurs et artistes-interprètes : autres activités</td><td>35 000 €</td><td>38 500 €</td></tr>
</tbody>
</table>`,
      },
      {
        h2: 'Comment se lisent les deux seuils',
        html: `<ul>
<li>Le <b>seuil de base</b> se compare au chiffre d'affaires de <b>l'année précédente</b>.</li>
<li>Le <b>seuil majoré</b> se compare au chiffre d'affaires de <b>l'année en cours</b>.</li>
</ul>
<p>Pour rester en franchise, il faut respecter les deux conditions. Ce qui se passe quand l'un d'eux est dépassé est expliqué dans la page <a href="/vigie/depassement-seuil-tva/">Dépassement du seuil de TVA</a>.</p>`,
      },
      {
        h2: "La première année d'activité",
        html: `<p>Si vous avez démarré en cours d'année, votre chiffre d'affaires est ramené à une année complète : (chiffre d'affaires × nombre de jours d'une année) ÷ nombre de jours entre le démarrage de l'activité et le 31 décembre. Les seuils s'appliquent à ce chiffre annualisé.</p>`,
      },
      {
        h2: 'Ces seuils ne sont pas les plafonds du régime micro',
        html: `<p>Les seuils de franchise de TVA sont plus bas que les plafonds du régime micro : on peut être encore en micro-entreprise et devoir facturer la TVA.</p>`,
      },
    ],
    vigieHtml: `<p>Vigie affiche deux jauges, une pour le seuil de base et une pour le seuil majoré, avec une projection : à votre rythme actuel, elle estime quand vous franchirez le seuil. Vous êtes prévenu avant, pas après.</p>`,
    faq: [
      { q: "Quel seuil s'applique à mon activité ?", a: 'Celui de la ligne qui correspond à votre activité dans le tableau ci-dessus.' },
      { q: 'Quelle année compte pour le seuil de base ?', a: "L'année précédente. Pour le seuil majoré, c'est l'année en cours." },
      { q: 'Les seuils ont-ils changé en 2026 ?', a: 'Non, Service-Public indique qu\'ils restent inchangés.' },
    ],
    sources: [
      { label: 'Service-Public (Entreprendre), « Franchise en base de TVA », vérifiée le 1er janvier 2026', href: SP_TVA },
    ],
    note: "Les seuils peuvent être revus par une loi de finances : vérifiez-les sur Service-Public ou impots.gouv.fr avant toute décision.",
  },

  {
    slug: 'depassement-seuil-tva',
    title: 'Dépassement du seuil de TVA : quand facturer la TVA ?',
    desc: 'Que se passe-t-il quand on dépasse le seuil de base ou le seuil majoré de la franchise de TVA ? À partir de quand facturer la TVA, et quoi faire ensuite.',
    crumb: 'Dépassement du seuil de TVA',
    kicker: 'Micro-entrepreneurs · TVA · dépassement',
    h1: 'Dépassement du seuil de TVA : à partir de quand facturer la TVA ?',
    lead: "Dépasser un seuil de franchise de TVA ne se passe pas de la même façon selon le seuil. Avec le seuil de base, la TVA s'applique à partir du 1er janvier suivant. Avec le seuil majoré, elle s'applique dès le jour du dépassement.",
    verified: VERIFIED,
    sections: [
      {
        h2: 'Seuil de base dépassé',
        html: `<p>Si votre chiffre d'affaires de l'année dépasse le seuil de base, la franchise continue jusqu'à la fin de cette année. La TVA s'applique à partir du <b>1er janvier de l'année suivante</b>. Exemple de Service-Public : dépasser 85 000 € en 2026 met fin à la franchise à compter du 1er janvier 2027.</p>`,
      },
      {
        h2: 'Entre le seuil de base et le seuil majoré',
        html: `<p>Si votre chiffre d'affaires reste entre les deux seuils, la franchise est maintenue pour l'année en cours. Exemple de Service-Public : 90 500 € en 2026 (au-dessus de 85 000 €, en dessous de 93 500 €), la franchise dure jusqu'au 31 décembre 2026.</p>`,
      },
      {
        h2: 'Seuil majoré dépassé',
        html: `<p>Si vous dépassez le seuil majoré, la TVA s'applique <b>dès le premier jour du dépassement</b>. Cette règle remplace l'ancienne, qui retenait le premier jour du mois.</p>`,
      },
      {
        h2: "Ce qu'il faut faire quand on perd la franchise",
        html: `<p>Selon Service-Public :</p>
<ul>
<li><b>Facturer la TVA</b> à vos clients à partir de la date d'effet, et la faire figurer sur vos factures.</li>
<li><b>Déduire la TVA</b> sur vos achats professionnels : vous pouvez la demander sur la déclaration de TVA du premier mois du dépassement.</li>
<li><b>Demander un numéro de TVA intracommunautaire</b>, le faire figurer sur vos factures et en informer votre service des impôts des entreprises (SIE) depuis votre espace professionnel.</li>
<li><b>Déposer des déclarations de TVA</b> : en franchise, vous n'en déposez pas ; après la sortie, vous suivez le régime normal.</li>
</ul>`,
      },
      {
        h2: "Renoncer à la franchise : l'option pour la TVA",
        html: `<p>Même sous les seuils, vous pouvez choisir d'être soumis à la TVA, par exemple pour déduire la TVA d'un investissement. L'option se fait par écrit auprès du SIE, prend effet le 1er jour du mois où elle est déclarée, dure deux années civiles et se renouvelle tacitement.</p>`,
      },
    ],
    vigieHtml: `<p>Vigie vous prévient avant : une jauge pour chaque seuil et une projection de franchissement, par exemple « à ce rythme, franchissement vers le 24 novembre ». Vous pouvez aussi <b>simuler</b> : ajoutez un devis en attente ou un contrat espéré pour voir quels seuils vous franchiriez, sans que cela entre dans vos livres.</p>`,
    faq: [
      { q: 'Si je dépasse le seuil de base, dois-je facturer la TVA tout de suite ?', a: "Non, pas avec le seuil de base seul : la TVA s'applique à partir du 1er janvier suivant. Avec le seuil majoré, c'est dès le jour du dépassement." },
      { q: 'Puis-je déduire la TVA sur mes achats ?', a: 'Oui, une fois la franchise perdue, selon Service-Public.' },
      { q: "Puis-je choisir la TVA avant d'y être obligé ?", a: "Oui, par une option écrite auprès du SIE, valable deux ans." },
    ],
    sources: [
      { label: 'Service-Public (Entreprendre), « Franchise en base de TVA », vérifiée le 1er janvier 2026', href: SP_TVA },
    ],
    note: "Cette page ne traite pas les cas particuliers (opérations exclues de la franchise, échanges intracommunautaires, activités mixtes). Pour votre situation, vérifiez sur Service-Public ou auprès de votre SIE.",
  },
];
