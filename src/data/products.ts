import heroBoutiqueImg from '../assets/images/hero_boutique_arche_1794568270719.jpg';
import serumImg from '../assets/images/product_visage_serum_1794568272429.jpg';
import levresImg from '../assets/images/product_levres_rouge_1794568273479.jpg';
import corpsImg from '../assets/images/product_corps_huile_1794568272728.jpg';
import parfumImg from '../assets/images/product_parfum_arche_1794568273392.jpg';
import cremeImg from '../assets/images/product_creme_eclat_1794568273849.jpg';
import brumeImg from '../assets/images/product_brume_rose_1794568273764.jpg';

export type ProductType = 'Sérum' | 'Crème' | 'Brume' | 'Lèvres' | 'Corps' | 'Parfum';
export type RayonId = 'visage' | 'levres' | 'corps' | 'parfums';

export interface ProductVariant {
  id: string;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  productType: ProductType;
  rayon: RayonId;
  volume: string;
  price: number;
  image: string;
  alt: string;
  description: string;
  keyIngredients: string[];
  ritualStep: string;
  skinTypes: string[];
  tag?: string;
  variants: ProductVariant[];
}

export interface RayonSection {
  id: RayonId;
  title: string;
  kicker: string;
  img: string;
  types: ProductType[];
}

export const HERO_IMAGE = heroBoutiqueImg;
export const WELCOME_IMAGE = parfumImg;

export const SECTIONS: RayonSection[] = [
  {
    id: 'visage',
    title: 'Soins visage',
    kicker: 'Glow every day',
    img: serumImg,
    types: ['Sérum', 'Crème', 'Brume'],
  },
  {
    id: 'levres',
    title: 'Lèvres',
    kicker: 'Good skin, good mood',
    img: levresImg,
    types: ['Lèvres'],
  },
  {
    id: 'corps',
    title: 'Corps & bain',
    kicker: 'Selfcare ritual',
    img: corpsImg,
    types: ['Corps'],
  },
  {
    id: 'parfums',
    title: 'Parfums',
    kicker: 'Une signature rose',
    img: parfumImg,
    types: ['Parfum'],
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'serum-eclat-rose',
    slug: 'serum-eclat-rose',
    title: "Sérum L'Éclat Rose",
    subtitle: 'Vitamine C stabilisée & pétales de rose',
    productType: 'Sérum',
    rayon: 'visage',
    volume: '30 ml',
    price: 64,
    image: serumImg,
    alt: "Flacon en verre dépoli du Sérum L'Éclat Rose sur pierre de travertin",
    description:
      "Un élixir soyeux formulé à Paris pour raviver la transparence du teint dès le matin. Sa texture aqueuse pénètre sans film gras et lisse le grain de peau.",
    keyIngredients: ['Vitamine C 10 %', 'Extrait de Rose Damascena', 'Acide hyaluronique'],
    ritualStep: 'Matin et soir, 3 gouttes sur peau humide avant votre crème.',
    skinTypes: ['terne', 'mixte', 'seche', 'sensible'],
    tag: 'Icône Saint-Honoré',
    variants: [
      { id: '30ml', label: '30 ml', price: 64 },
      { id: '50ml', label: '50 ml (Format atelier)', price: 88 },
    ],
  },
  {
    id: 'creme-nutritive-matin',
    slug: 'creme-nutritive-matin',
    title: 'Crème Éclat de Matin',
    subtitle: 'Céramides végétaux & beurre de camélia',
    productType: 'Crème',
    rayon: 'visage',
    volume: '50 ml',
    price: 58,
    image: cremeImg,
    alt: 'Pot en verre givré de Crème Éclat de Matin avec spatule dorée',
    description:
      'Une crème fouettée à la douceur cachemire qui renforce la barrière cutanée et laisse un fini velouté lumineux, idéale comme base de maquillage.',
    keyIngredients: ['Céramides bio-identiques', 'Huile de camélia blanc', 'Niacinamide'],
    ritualStep: 'Appliquer une noisette par mouvements ascendants sur le visage et le cou.',
    skinTypes: ['seche', 'sensible', 'normale'],
    variants: [
      { id: '50ml', label: '50 ml', price: 58 },
      { id: 'recharge-50ml', label: 'Recharge 50 ml', price: 46 },
    ],
  },
  {
    id: 'brume-aura-rose',
    slug: 'brume-aura-rose',
    title: 'Brume Botanique Aura',
    subtitle: 'Hydrolat de rose de Mai & fleur d’oranger',
    productType: 'Brume',
    rayon: 'visage',
    volume: '100 ml',
    price: 38,
    image: brumeImg,
    alt: 'Vaporisateur en verre rose poudré de la Brume Botanique Aura',
    description:
      'Un nuage micro-diffusé qui désaltère immédiatement l’épiderme, apaise les rougeurs et fixe le maquillage d’un voile de fraîcheur parisienne.',
    keyIngredients: ['Eau florale de Rose de Mai', 'Néroli doux', 'Glycérine végétale'],
    ritualStep: 'Vaporiser à 20 cm du visage après le nettoyage ou en cours de journée.',
    skinTypes: ['sensible', 'mixte', 'grasse', 'normale'],
    variants: [
      { id: '100ml', label: '100 ml', price: 38 },
      { id: '50ml', label: '50 ml (Format voyage)', price: 24 },
    ],
  },
  {
    id: 'serum-nuit-velours',
    slug: 'serum-nuit-velours',
    title: 'Sérum Nuit Réparateur',
    subtitle: 'Bakuchiol pur & squalane d’olive',
    productType: 'Sérum',
    rayon: 'visage',
    volume: '30 ml',
    price: 72,
    image: serumImg,
    alt: 'Flacon pipette du Sérum Nuit Réparateur',
    description:
      'L’alternative botanique douce au rétinol. Lisse visiblement les ridules de déshydratation pendant le sommeil tout en respectant les peaux délicates.',
    keyIngredients: ['Bakuchiol 1,5 %', 'Squalane végétal', 'Bisabolol apaisant'],
    ritualStep: 'Le soir uniquement, chauffer 4 gouttes entre les paumes puis presser sur le visage.',
    skinTypes: ['terne', 'seche', 'normale'],
    variants: [{ id: '30ml', label: '30 ml', price: 72 }],
  },
  {
    id: 'rouge-velours-rosewood',
    slug: 'rouge-velours-rosewood',
    title: 'Rouge Velours Saint-Honoré',
    subtitle: 'Fini mat poudré longue tenue',
    productType: 'Lèvres',
    rayon: 'levres',
    volume: '3,8 g',
    price: 34,
    image: levresImg,
    alt: 'Rouge à lèvres Luxe Velours teinte Bois de Rose et son raisin',
    description:
      'Un rouge mat velouté enrichi en huile de framboise qui habille les lèvres d’une teinte bois de rose intemporelle sans jamais tirailler.',
    keyIngredients: ['Cire de candélilla', 'Huile de pépins de framboise', 'Vitamine E'],
    ritualStep: 'Appliquer au cœur des lèvres et estomper au doigt pour un effet lèvres mordues.',
    skinTypes: ['all'],
    tag: 'Teinte signature',
    variants: [
      { id: 'bois-de-rose', label: 'N°01 Bois de Rose', price: 34 },
      { id: 'petale-sec', label: 'N°02 Pétale Ancien', price: 34 },
    ],
  },
  {
    id: 'baume-teinte-n03',
    slug: 'baume-teinte-n03',
    title: 'Baume Teinté N°03 Pétale',
    subtitle: 'Soin repulpant & éclat translucide',
    productType: 'Lèvres',
    rayon: 'levres',
    volume: '3,5 g',
    price: 29,
    image: levresImg,
    alt: 'Baume teinté N°03 Pétale en étui ivoire et laiton brossé',
    description:
      'À mi-chemin entre soin réparateur et couleur transparente, il dépose un voile rose nacré subtil et nourrit les lèvres durant 8 heures.',
    keyIngredients: ['Beurre de karité brut', 'Peptides repulpants', 'Cire de rose'],
    ritualStep: 'À appliquer généreusement seul ou par-dessus votre crayon à lèvres.',
    skinTypes: ['all'],
    variants: [
      { id: 'n03-petale', label: 'N°03 Pétale', price: 29 },
      { id: 'n04-framboise', label: 'N°04 Voile Framboise', price: 29 },
    ],
  },
  {
    id: 'huile-seche-eau-rosee',
    slug: 'huile-seche-eau-rosee',
    title: "Huile Sèche L'Eau Rosée",
    subtitle: 'Rose, géranium bourbon & bois de oud',
    productType: 'Corps',
    rayon: 'corps',
    volume: '100 ml',
    price: 54,
    image: corpsImg,
    alt: "Flacon d'huile corporelle sèche L'Eau Rosée sur travertin",
    description:
      'Une huile fine au toucher sec qui satine la peau après le bain sans tacher les vêtements, laissant un sillage floral boisé délicat.',
    keyIngredients: ['Huile de rosier muscat', 'Amande douce bio', 'Géranium bourbon'],
    ritualStep: 'Masser sur peau encore tiède après la douche ou ajouter aux pointes des cheveux.',
    skinTypes: ['all'],
    variants: [{ id: '100ml', label: '100 ml', price: 54 }],
  },
  {
    id: 'baume-corps-karite',
    slug: 'baume-corps-karite',
    title: 'Baume Corporel Fondant',
    subtitle: 'Karité fouetté & lavande fine',
    productType: 'Corps',
    rayon: 'corps',
    volume: '200 ml',
    price: 48,
    image: corpsImg,
    alt: 'Pot en céramique et couvercle en chêne du Baume Corporel Fondant',
    description:
      'Riche et réconfortant, ce baume répare les zones sèches et enveloppe le corps d’un parfum apaisant de lavande de Provence et de musc blanc.',
    keyIngredients: ['Karité non raffiné 25 %', 'Huile essentielle de lavande', 'Avocat bio'],
    ritualStep: 'Chauffer une noix de baume au creux de la main puis lisser sur le corps.',
    skinTypes: ['all'],
    variants: [{ id: '200ml', label: '200 ml', price: 48 }],
  },
  {
    id: 'parfum-rose-champagne',
    slug: 'parfum-rose-champagne',
    title: 'Eau de Parfum Rose Champagne',
    subtitle: 'Pétales glacés, poire blanche & cèdre',
    productType: 'Parfum',
    rayon: 'parfums',
    volume: '50 ml',
    price: 115,
    image: parfumImg,
    alt: 'Flacon arche en cristal de Rose Champagne Eau de Parfum',
    description:
      'Notre parfum signature inspiré par la lumière dorée filtrant sous les arcades de la rue Saint-Honoré. Pétillant, floral et sensuel sur peau.',
    keyIngredients: ['Rose Centifolia de Grasse', 'Poire Williams', 'Cèdre blanc & ambrette'],
    ritualStep: 'Vaporiser sur les points de pulsation : poignets, creux du cou et nuque.',
    skinTypes: ['all'],
    tag: 'Création Maison',
    variants: [
      { id: '50ml', label: '50 ml', price: 115 },
      { id: '100ml', label: '100 ml', price: 165 },
    ],
  },
  {
    id: 'parfum-arche-iris',
    slug: 'parfum-arche-iris',
    title: "Eau de Parfum Arche d'Iris",
    subtitle: 'Iris poudré, violette & vanille sèche',
    productType: 'Parfum',
    rayon: 'parfums',
    volume: '50 ml',
    price: 122,
    image: parfumImg,
    alt: "Flacon en cristal Arche d'Iris sous une ombre d'arche",
    description:
      'Un hommage à la haute parfumerie poudrée : la racine d’iris pallida s’adoucit au contact de la fleur de coton et d’une vanille non sucrée.',
    keyIngredients: ['Beurre d’Iris Pallida', 'Feuille de violette', 'Musc poudré'],
    ritualStep: 'Porter en voile sur la peau ou vaporiser délicatement sur un foulard de soie.',
    skinTypes: ['all'],
    variants: [{ id: '50ml', label: '50 ml', price: 122 }],
  },
];

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}
