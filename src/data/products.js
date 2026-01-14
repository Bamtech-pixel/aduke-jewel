// src/data/products.js
// Single source of truth for products (bracelets include size: 12mm / 15mm / Standard)

export const bracelets = [
  {
    id: "b-gold-12",
    category: "bracelets",
    name: "Engraved Gold Bracelet",
    size: "12mm",
    price: 15000,
    image: "/images/engraved-gold-bracelet-12mm.jpg",
  },
  {
    id: "b-gold-15",
    category: "bracelets",
    name: "Engraved Gold Bracelet",
    size: "15mm",
    price: 16000,
    image: "/images/engraved-gold-bracelet-15mm.jpg",
  },
  {
    id: "b-gold-standard",
    category: "bracelets",
    name: "Engraved Gold Bracelet",
    size: "Standard",
    price: 13000,
    image: "/images/Engraved Gold Bracelet-Engraved Gold Bracelet.jpg",
  },
  {
    id: "b-silver-12",
    category: "bracelets",
    name: "Engraved Silver Bracelet",
    size: "12mm",
    price: 15000,
    image: "/images/engraved-silver-bracelet-12mm.jpg",
  },
  {
    id: "b-silver-15",
    category: "bracelets",
    name: "Engraved Silver Bracelet",
    size: "15mm",
    price: 16000,
    image: "/images/engraved-silver-bracelet-15mm.jpg",
  },
  {
    id: "b-black-12",
    category: "bracelets",
    name: "Engraved Black Bracelet",
    size: "12mm",
    price: 15000,
    image: "/images/engraved-black-bracelet-12mm.jpg",
  },
  {
    id: "b-black-15",
    category: "bracelets",
    name: "Engraved Black Bracelet",
    size: "15mm",
    price: 16000,
    image: "/images/engraved-black-bracelet-15mm.jpg",
  },

  // Barcode Bracelets
  {
    id: "bb-gold-12",
    category: "bracelets",
    name: "Engraved Gold Bracelet with Barcode",
    size: "12mm",
    price: 17000,
    image: "/images/engraved-gold-bracelet-12mm.jpg",
    note: "Barcode option available",
  },
  {
    id: "bb-gold-15",
    category: "bracelets",
    name: "Engraved Gold Bracelet with Barcode",
    size: "15mm",
    price: 18000,
    image: "/images/engraved-gold-bracelet-15mm.jpg",
    note: "Barcode option available",
  },
  {
    id: "bb-silver-12",
    category: "bracelets",
    name: "Engraved Silver Bracelet with Barcode",
    size: "12mm",
    price: 17000,
    image: "/images/engraved-silver-bracelet-12mm.jpg",
    note: "Barcode option available",
  },
  {
    id: "bb-silver-15",
    category: "bracelets",
    name: "Engraved Silver Bracelet with Barcode",
    size: "15mm",
    price: 18000,
    image: "/images/engraved-silver-bracelet-15mm.jpg",
    note: "Barcode option available",
  },
  {
    id: "bb-black-12",
    category: "bracelets",
    name: "Engraved Black Bracelet with Barcode",
    size: "12mm",
    price: 17000,
    image: "/images/engraved-black-bracelet-12mm.jpg",
    note: "Barcode option available",
  },
  {
    id: "bb-black-15",
    category: "bracelets",
    name: "Engraved Black Bracelet with Barcode",
    size: "15mm",
    price: 18000,
    image: "/images/engraved-black-bracelet-15mm.jpg",
    note: "Barcode option available",
  },
];

export const necklaces = [
  {
    id: "n-female",
    category: "necklaces",
    name: "Engraved Female Necklace",
    price: 12000,
    image: "/images/Engraved Female Necklace.jpg",
  },
  {
    id: "n-sunflower",
    category: "necklaces",
    name: "Engraved Female Sunflower Necklace",
    price: 12000,
    image: "/images/Female Sunflower Necklace.jpg",
  },
  {
    id: "n-flat",
    category: "necklaces",
    name: "Engraved Flat Necklace",
    price: 13000,
    image: "/images/Gold Necklace.jpg",
  },
  {
    id: "n-stoned-barcode",
    category: "necklaces",
    name: "Engraved Stoned Necklace with Barcode",
    price: 19000,
    image: "/images/Engraved Stoned Necklace with Barcode.jpg",
  },
  {
    id: "n-gold-stoned",
    category: "necklaces",
    name: "Engraved Gold Stoned Necklace",
    price: 16000,
    image: "/images/Engraved Gold Stoned Necklace .jpg",
  },
  {
    id: "n-gold",
    category: "necklaces",
    name: "Engraved Gold Necklace",
    price: 11000,
    image: "/images/Engraved Gold Necklace.jpg",
  },
];

export const watches = [
  {
    id: "w-silver-casio",
    category: "watches",
    name: "Engraved Silver Casio Wristwatch",
    price: 18000,
    image: "/images/Engraved Silver Casio Wristwatch.jpg",
  },
  {
    id: "w-gold-casio",
    category: "watches",
    name: "Engraved Gold Casio Wristwatch",
    price: 18000,
    image: "/images/Gold Casio Wristwatch &.jpg",
  },
  {
    id: "w-black-casio",
    category: "watches",
    name: "Engraved Black Casio Wristwatch",
    price: 18000,
    image: "/images/Engraved Black Casio Wristwatch.jpg",
  },
  {
    id: "w-gold-rolex",
    category: "watches",
    name: "Engraved Gold Rolex Wristwatch",
    price: 22000,
    image: "/images/Gold Rolex Wristwatch.jpg",
  },
  {
    id: "w-black-rolex",
    category: "watches",
    name: "Engraved Black Rolex Wristwatch",
    price: 22000,
    image: "/images/Engraved Black Rolex Wristwatch .jpg",
  },
];

export const sets = [
  {
    id: "s-black",
    category: "sets",
    name: "Engraved Black Set",
    price: 32000,
    image: "/images/Black Casio Wristwatch + Bracelet &.jpg",
  },
  {
    id: "s-gold-wrist",
    category: "sets",
    name: "Engraved Gold Wrist Set",
    price: 32000,
    image: "/images/Gold Rolex Wristwatch + Bracelet &.jpg",
  },
  {
    id: "s-gold-female",
    category: "sets",
    name: "Engraved Gold Female Set",
    price: 21000,
    image: "/images/Engraved Gold Picture Necklace.jpg",
  },
];

// ✅ Combined list (useful for search/admin/cart later)
export const allProducts = [...bracelets, ...necklaces, ...watches, ...sets];

// ✅ Filter helper
export const byCategory = (category) =>
  allProducts.filter((p) => p.category === category);