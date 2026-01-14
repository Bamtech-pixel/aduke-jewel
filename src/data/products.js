// src/data/products.js

/* =========================
   BRACELETS (12mm & 15mm handled properly)
   ========================= */

export const bracelets = [
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

  // Barcode Bracelets
  {
    id: "bb-gold-12",
    name: "Engraved Gold Bracelet w/ Barcode",
    size: "12mm",
    price: 17000,
    image: "/images/engraved-gold-bracelet-12mm.jpg",
  },
  {
    id: "bb-gold-15",
    name: "Engraved Gold Bracelet w/ Barcode",
    size: "15mm",
    price: 18000,
    image: "/images/engraved-gold-bracelet-15mm.jpg",
  },
  {
    id: "bb-silver-12",
    name: "Engraved Silver Bracelet w/ Barcode",
    size: "12mm",
    price: 17000,
    image: "/images/engraved-silver-bracelet-12mm.jpg",
  },
  {
    id: "bb-silver-15",
    name: "Engraved Silver Bracelet w/ Barcode",
    size: "15mm",
    price: 18000,
    image: "/images/engraved-silver-bracelet-15mm.jpg",
  },
  {
    id: "bb-black-12",
    name: "Engraved Black Bracelet w/ Barcode",
    size: "12mm",
    price: 17000,
    image: "/images/engraved-black-bracelet-12mm.jpg",
  },
  {
    id: "bb-black-15",
    name: "Engraved Black Bracelet w/ Barcode",
    size: "15mm",
    price: 18000,
    image: "/images/engraved-black-bracelet-15mm.jpg",
  },
];

/* =========================
   NECKLACES
   ========================= */

export const necklaces = [
  {
    id: "n-female",
    name: "Engraved Female Necklace",
    price: 12000,
    image: "/images/Engraved Female Necklace.jpg",
  },
  {
    id: "n-sunflower",
    name: "Engraved Female Sunflower Necklace",
    price: 12000,
    image: "/images/Female Sunflower Necklace.jpg",
  },

  // Using a clean, existing file you have:
  // (This represents your "Engraved Flat Necklace" product)
  {
    id: "n-flat",
    name: "Engraved Flat Necklace",
    price: 13000,
    image: "/images/Gold Necklace.jpg",
  },

  {
    id: "n-stoned-barcode",
    name: "Engraved Stoned Necklace with Barcode",
    price: 19000,
    image: "/images/Engraved Stoned Necklace with Barcode.jpg",
  },

  // ✅ IMPORTANT:
  // If you already renamed "Engraved Gold Stoned Necklace .jpg" -> "Engraved Gold Stoned Necklace.jpg",
  // this path is correct. If not, rename the file (I can give the command again).
  {
    id: "n-gold-stoned",
    name: "Engraved Gold Stoned Necklace",
    price: 16000,
    image: "/images/Engraved Gold Stoned Necklace.jpg",
  },

  {
    id: "n-gold",
    name: "Engraved Gold Necklace",
    price: 11000,
    image: "/images/Engraved Gold Necklace.jpg",
  },
];

/* =========================
   WRISTWATCHES
   ========================= */

export const watches = [
  {
    id: "w-silver-casio",
    name: "Engraved Silver Casio Wristwatch",
    price: 18000,
    image: "/images/Engraved Silver Casio Wristwatch.jpg",
  },

  // ✅ You renamed from "Gold Casio Wristwatch &.jpg" -> "gold-casio-wristwatch.jpg"
  {
    id: "w-gold-casio",
    name: "Engraved Gold Casio Wristwatch",
    price: 18000,
    image: "/images/gold-casio-wristwatch.jpg",
  },

  {
    id: "w-black-casio",
    name: "Engraved Black Casio Wristwatch",
    price: 18000,
    image: "/images/Engraved Black Casio Wristwatch.jpg",
  },

  {
    id: "w-gold-rolex",
    name: "Engraved Gold Rolex Wristwatch",
    price: 22000,
    image: "/images/Gold Rolex Wristwatch.jpg",
  },

  // ✅ IMPORTANT:
  // Your folder showed: "Engraved Black Rolex Wristwatch .jpg" (space before .jpg)
  // If you renamed it to remove the trailing space, this is correct:
  {
    id: "w-black-rolex",
    name: "Engraved Black Rolex Wristwatch",
    price: 22000,
    image: "/images/Engraved Black Rolex Wristwatch.jpg",
  },
];

/* =========================
   SETS & COMBOS
   ========================= */

export const sets = [
  // ✅ You renamed from "Black Casio Wristwatch + Bracelet &.jpg"
  {
    id: "s-black",
    name: "Engraved Black Set",
    price: 32000,
    image: "/images/black-casio-watch-bracelet.jpg",
  },

  // ✅ You renamed from "Gold Rolex Wristwatch + Bracelet &.jpg"
  {
    id: "s-gold-wrist",
    name: "Engraved Gold Wrist Set",
    price: 32000,
    image: "/images/gold-rolex-watch-bracelet.jpg",
  },

  {
    id: "s-gold-female",
    name: "Engraved Gold Female Set",
    price: 21000,
    image: "/images/Engraved Gold Picture Necklace.jpg",
  },

  // Optional (only if you want it shown as another set product)
  // ✅ If you renamed "Engraved Gold Rolex Wristwatch + Bracelet &.jpg"
  // to "engraved-gold-rolex-watch-bracelet.jpg"
  // {
  //   id: "s-engraved-gold-rolex",
  //   name: "Engraved Gold Rolex Watch + Bracelet",
  //   price: 32000,
  //   image: "/images/engraved-gold-rolex-watch-bracelet.jpg",
  // },
];

/* =========================
   HELPERS
   ========================= */

export const allProducts = [...bracelets, ...necklaces, ...watches, ...sets];