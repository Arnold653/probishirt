/* =========================================================
   CONFIGURATION PROBISHIRT
   Fichier partagé par toutes les pages du site.
   Modifie uniquement les valeurs ci-dessous — pas besoin de
   toucher au reste du code.
   ========================================================= */

// Numéro WhatsApp au format international, sans "+", sans espaces.
const WHATSAPP_NUMBER = "2290199261741";

// Les prix ci-dessous sont des exemples à ajuster si besoin.
const PRODUCTS = [
  {
    id: "sagesse-divine",
    name: "Sagesse Divine Illimitée",
    quote: "« Savoir des hommes limité, mais sagesse divine illimitée. »",
    description:
      "Un rappel porté au quotidien : la connaissance humaine a des limites, la sagesse qui vient d'en haut n'en a pas. Coupe unisexe, coton épais, impression qui résiste au lavage.",
    price: "15 000",
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
      { color: "Blanc", hex: "#f4f5f7", img: "assets/products/kd-kingdom-white.jpg" }
    ]
  },
  {
    id: "guard-your-heart",
    name: "Guard Your Heart",
    quote: "Un rappel porté près du cœur, chaque jour.",
    description:
      "Une déclaration simple et directe, à porter comme une garde quotidienne. Disponible en noir profond ou bleu intense, pour un usage aussi bien casual qu'habillé.",
    price: "15 000",
    variants: [
      { color: "Noir", hex: "#0b0b0d", img: "assets/products/guard-heart-black.jpg" },
      { color: "Bleu profond", hex: "#3a3fb0", img: "assets/products/guard-heart-blue.jpg" }
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
      { color: "Blanc", hex: "#f4f5f7", img: "assets/products/intelligence-siecles-white.jpg" }
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
