/* =========================================================
   CONFIGURATION PROBISHIRT
   Fichier partagé par toutes les pages du site.
   Sert de PRODUITS PAR DÉFAUT : si un Google Sheet est configuré
   (voir sheet-config.json), ses données remplacent celles-ci
   automatiquement au chargement. Si le Sheet est vide ou
   inaccessible, cette liste reste utilisée — le site ne casse
   jamais.
   ========================================================= */

// Numéro WhatsApp au format international, sans "+", sans espaces.
const WHATSAPP_NUMBER = "2290199261741";

// Réseaux sociaux — laisse la valeur vide ("") pour qu'une icône
// n'apparaisse pas dans le footer si tu n'as pas encore ce compte.
var SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/probishirt/",
  facebook: "https://www.facebook.com/profile.php?id=61566377935391",
  tiktok: "https://www.tiktok.com/@probishirt"
};

// Widget Instagram sur l'accueil (via SnapWidget ou service équivalent).
// Colle ici l'URL "src" de l'iframe fournie par le service — laisse
// vide pour afficher un simple bouton "Suivez-nous" à la place.
var INSTAGRAM_WIDGET_URL = "";

// Tailles proposées par défaut pour tous les produits (modifiable
// produit par produit avec le champ "sizes").
var DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"];

// Les prix ci-dessous sont des exemples à ajuster si besoin.
// "badge" est facultatif : "nouveau", "bestseller", ou omis.
// Pour un coloris en rupture de stock, ajoute "inStock: false" dans
// son objet variant (par défaut, tout est considéré en stock).
// Pour plusieurs photos par coloris (face, dos, zoom...), ajoute un
// tableau "gallery": ["chemin1.jpg", "chemin2.jpg"] dans le variant.
// Codes promo — "percent" est la réduction en pourcentage.
// Modifiable ici, ou via un second Google Sheet (voir README).
var PROMO_CODES = [{ code: "BIENVENUE10", percent: 10 }];

// Avis clients affichés sur chaque fiche produit.
var REVIEWS = [
  {
    author: "Jonathan S.",
    rating: 5,
    text: "« Le design est vraiment propre » — J'avais surtout choisi ce modèle pour le design, mais finalement la qualité du t-shirt m'a aussi agréablement surpris. Il tombe bien et le rendu est très beau porté."
  },
  {
    author: "Mireille K.",
    rating: 5,
    text: "« Ma deuxième commande déjà 😂 » — J'avais commandé un premier modèle pour tester. Finalement, j'en ai repris deux autres. Les t-shirts sont confortables et les designs sont vraiment propres."
  },
  {
    author: "David A.",
    rating: 5,
    text: "« Franchement, je ne m'attendais pas à ça » — J'avais un peu hésité avant de commander, mais dès que j'ai reçu le t-shirt j'ai été agréablement surpris. La matière est agréable et il taille bien. Je suis vraiment satisfait de mon achat."
  }
];

// Zones de livraison et délais estimés — affichés sur la page
// Contact et sur chaque fiche produit. Ajoute/modifie librement.
var DELIVERY_INFO = [
  { zone: "Cotonou", delay: "24 à 48h" },
  { zone: "Reste du Bénin", delay: "3 à 5 jours" }
];

var PRODUCTS = [
  {
    id: "sagesse-divine",
    name: "Sagesse Divine Illimitée",
    quote: "« Savoir des hommes limité, mais sagesse divine illimitée. »",
    description:
      "Un rappel porté au quotidien : la connaissance humaine a des limites, la sagesse qui vient d'en haut n'en a pas. Coupe unisexe, coton épais, impression qui résiste au lavage.",
    price: "15 000",
    badge: "bestseller",
    variants: [
      { color: "Noir", hex: "#0b0b0d", img: "assets/products/sagesse-divine-black.jpg" }
    ]
  },
  {
    id: "kd-kingdom",
    name: "KD Kingdom",
    quote: "L'emblème couronné de ceux qui règnent en esprit.",
    description:
      "Le blason Probishirt dans sa version la plus directe : identité, autorité, appartenance. Une pièce signature pensée pour marquer, coloris bleu roi ou blanc.",
    price: "15 000",
    variants: [
      { color: "Bleu roi", hex: "#1447c4", img: "assets/products/kd-kingdom-blue.jpg" },
      { color: "Blanc", hex: "#f4f5f7", img: "assets/products/kd-kingdom-white.jpg" },
      { color: "Noir", hex: "#0b0b0d", img: "assets/products/kd-kingdom-black.jpg" },
      { color: "Bleu marine chiné", hex: "#2b3252", img: "assets/products/kd-kingdom-navy.jpg" },
      { color: "Bleu ciel chiné", hex: "#7c93e0", img: "assets/products/kd-kingdom-lightblue.jpg" }
    ]
  },
  {
    id: "guard-your-heart",
    name: "Garde Ton Cœur",
    quote: "Un rappel porté près du cœur, chaque jour.",
    description:
      "Une déclaration simple et directe, à porter comme une garde quotidienne. Disponible en noir profond ou bleu royal, pour un usage aussi bien casual qu'habillé.",
    price: "15 000",
    variants: [
      { color: "Noir", hex: "#0b0b0d", img: "assets/products/garde-coeur-black.jpg" },
      { color: "Bleu royal", hex: "#2b4fd6", img: "assets/products/garde-coeur-blue.jpg" }
    ]
  },
  {
    id: "esprit-songes",
    name: "L'Esprit des Songes",
    quote: "« L'esprit qui interprète les songes vit en moi. »",
    description:
      "Inspirée par le discernement et la clairvoyance, cette pièce se porte comme une affirmation d'identité spirituelle. Coloris blanc ou jaune, coupe unisexe.",
    price: "15 000",
    variants: [
      { color: "Blanc", hex: "#f4f5f7", img: "assets/products/esprit-songes-white.jpg" },
      { color: "Jaune", hex: "#eecf3d", img: "assets/products/esprit-songes-yellow.jpg" }
    ]
  },
  {
    id: "intelligence-siecles",
    name: "Intelligence des Siècles",
    quote: "« Habité par une intelligence qui dépasse les siècles. »",
    description:
      "Une pièce sobre au message profond, pour ceux qui savent que la vraie intelligence traverse le temps. Blanc, coupe unisexe, tissu premium.",
    price: "15 000",
    variants: [
      { color: "Blanc", hex: "#f4f5f7", img: "assets/products/intelligence-siecles-white.jpg" },
      { color: "Jaune", hex: "#eecf3d", img: "assets/products/intelligence-siecles-yellow.jpg" }
    ]
  },
  {
    id: "diligence-wins",
    name: "Diligence Wins",
    quote: "« La diligence gagne. »",
    description:
      "Un design graffiti énergique pour rappeler que le travail assidu paie toujours. Impression éclaboussée, coupe unisexe, coton épais.",
    price: "15 000",
    badge: "nouveau",
    variants: [
      { color: "Blanc", hex: "#f4f5f7", img: "assets/products/diligence-wins-white.jpg" },
      { color: "Jaune", hex: "#eecf3d", img: "assets/products/diligence-wins-yellow.jpg" }
    ]
  },
  {
    id: "lumiere-eternelle",
    name: "Lumière Éternelle",
    quote: "« Ce n'est pas une pensée humaine, c'est une lumière éternelle. »",
    description:
      "Une pièce élégante à la coupe féminine, pour rappeler que certaines pensées dépassent l'entendement humain. Noir profond, finitions soignées.",
    price: "15 000",
    badge: "nouveau",
    variants: [
      { color: "Noir", hex: "#0b0b0d", img: "assets/products/lumiere-eternelle-black.jpg" }
    ]
  },
  {
    id: "esprit-tres-haut",
    name: "L'Esprit du Très-Haut",
    quote: "« En moi respire l'esprit du Très-Haut, intelligence au-delà des royaumes. »",
    description:
      "Une déclaration d'identité spirituelle sobre et directe, pour ceux qui savent d'où vient leur discernement. Noir profond, coupe unisexe.",
    price: "15 000",
    badge: "nouveau",
    variants: [
      { color: "Noir", hex: "#0b0b0d", img: "assets/products/esprit-tres-haut-black.jpg" }
    ]
  },
  {
    id: "sagesse-haut",
    name: "Sagesse d'en Haut",
    quote: "« Une sagesse qui ne vient pas d'ici, mais d'en haut. »",
    description:
      "La pièce la plus dépouillée de la collection, pour un message qui n'a besoin d'aucun artifice. Noir profond, finitions soignées, tirage limité.",
    price: "18 000",
    variants: [
      { color: "Noir", hex: "#0b0b0d", img: "assets/products/sagesse-haut-black.jpg" }
    ]
  }
];
