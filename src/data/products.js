// src/data/products.js

/* =========================
   BRACELETS (12mm & 15mm)
   ========================= */

const bracelets = [
  {
    id: "b-gold-12",
    name: "Engraved Gold Bracelet",
    size: "12mm",
    price: 15000,
    image: "/images/engraved-gold-bracelet-12mm.jpg",
  },
  {
    id: "b-gold-15",
    name: "Engraved Gold Bracelet",
    size: "15mm",
    price: 16000,
    image: "/images/engraved-gold-bracelet-15mm.jpg",
  },
  {
    id: "b-gold-standard",
    name: "Engraved Gold Bracelet",
    size: "Standard",
    price: 13000,
    image: "/images/Engraved Gold Bracelet-Engraved Gold Bracelet.jpg",
  },
  {
    id: "b-silver-12",
    name: "Engraved Silver Bracelet",
    size: "12mm",
    price: 15000,
    image: "/images/engraved-silver-bracelet-12mm.jpg",
  },
  {
    id: "b-silver-15",
    name: "Engraved Silver Bracelet",
    size: "15mm",
    price: 16000,
    image: "/images/engraved-silver-bracelet-15mm.jpg",
  },
  {
    id: "b-black-12",
    name: "Engraved Black Bracelet",
    size: "12mm",
    price: 15000,
    image: "/images/engraved-black-bracelet-12mm.jpg",
  },
  {
    id: "b-black-15",
    name: "Engraved Black Bracelet",
    size: "15mm",
    price: 16000,
    image: "/images/engraved-black-bracelet-15mm.jpg",
  },

  // Simple “plain” bracelet photos you renamed
  {
    id: "b-gold-plain",
    name: "Gold Bracelet",
    size: "Standard",
    price: 12000,
    image: "/images/gold-bracelet.jpg",
  },
  {
    id: "b-silver-plain",
    name: "Silver Bracelet",
    size: "Standard",
    price: 12000,
    image: "/images/silver-bracelet.jpg",
  },
];

/* =========================
   NECKLACES
   ========================= */

const necklaces = [
  {
    id: "n-female",
    name: "Engraved Female Necklace",
    price: 12000,
    image: "/images/Engraved Female Necklace.jpg",
  },
  {
    id: "n-silver-female",
    name: "Engraved Silver Female Necklace",
    price: 12000,
    image: "/images/Engraved Silver Female Necklace.jpg",
  },
  {
    id: "n-sunflower",
    name: "Female Sunflower Necklace",
    price: 12000,
    image: "/images/Female Sunflower Necklace.jpg",
  },
  {
    id: "n-gold",
    name: "Engraved Gold Necklace",
    price: 11000,
    image: "/images/Engraved Gold Necklace.jpg",
  },
  {
    id: "n-gold-stoned",
    name: "Engraved Gold Stoned Necklace",
    price: 16000,
    image: "/images/Engraved Gold Stoned Necklace.jpg",
  },
  {
    id: "n-stoned-barcode",
    name: "Engraved Stoned Necklace with Barcode",
    price: 19000,
    image: "/images/Engraved Stoned Necklace with Barcode.jpg",
  },
  {
    id: "n-picture",
    name: "Engraved Picture Necklace",
    price: 21000,
    image: "/images/Engraved Gold Picture Necklace.jpg",
  },
];

/* =========================
   WATCHES
   ========================= */

const watches = [
  {
    id: "w-gold-casio",
    name: "Gold Casio Wristwatch",
    price: 18000,
    image: "/images/gold-casio-wristwatch.jpg",
  },
  {
    id: "w-silver-casio",
    name: "Engraved Silver Casio Wristwatch",
    price: 18000,
    image: "/images/Engraved Silver Casio Wristwatch.jpg",
  },
  {
    id: "w-black-casio",
    name: "Engraved Black Casio Wristwatch",
    price: 18000,
    image: "/images/Engraved Black Casio Wristwatch.jpg",
  },
  {
    id: "w-gold-rolex",
    name: "Gold Rolex Wristwatch",
    price: 22000,
    image: "/images/Gold Rolex Wristwatch.jpg",
  },
  {
    id: "w-black-rolex",
    name: "Engraved Black Rolex Wristwatch",
    price: 22000,
    image: "/images/Engraved Black Rolex Wristwatch.jpg",
  },
];

/* =========================
   SETS / COMBOS
   ========================= */

const sets = [
  {
    id: "s-black-casio-bracelet",
    name: "Black Casio Wristwatch + Bracelet",
    price: 32000,
    image: "/images/black-casio-watch-bracelet.jpg",
  },
  {
    id: "s-gold-rolex-bracelet",
    name: "Gold Rolex Wristwatch + Bracelet",
    price: 32000,
    image: "/images/gold-rolex-watch-bracelet.jpg",
  },
  {
    id: "s-engraved-gold-rolex-bracelet",
    name: "Engraved Gold Rolex Wristwatch + Bracelet",
    price: 35000,
    image: "/images/engraved-gold-rolex-watch-bracelet.jpg",
  },
];

export const byCategory = {
  bracelets,
  necklaces,
  watches,
  sets,
};
