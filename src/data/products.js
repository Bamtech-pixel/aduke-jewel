// src/data/products.js

/**
 * IMPORTANT:
 * Image paths MUST match filenames exactly (case-sensitive).
 * Firebase Hosting treats filenames as case-sensitive.
 * Example: "/images/gold-casio-wristwatch.jpg"
 */
const bracelets = [
  // Engraved bracelets (12mm / 15mm) - file names are Capital "Engraved-..."
  {
    id: "b-black-12",
    name: "Engraved Black Bracelet",
    size: "12mm",
    price: 15000,
    image: "/images/Engraved-black-bracelet-12mm.jpg",
  },
  {
    id: "b-black-15",
    name: "Engraved Black Bracelet",
    size: "15mm",
    price: 16000,
    image: "/images/Engraved-black-bracelet-15mm.jpg",
  },

  {
    id: "b-gold-12",
    name: "Engraved Gold Bracelet",
    size: "12mm",
    price: 15000,
    image: "/images/Engraved-gold-bracelet-12mm.jpg",
  },
  {
    id: "b-gold-15",
    name: "Engraved Gold Bracelet",
    size: "15mm",
    price: 16000,
    image: "/images/Engraved-gold-bracelet-15mm.jpg",
  },

  {
    id: "b-silver-12",
    name: "Engraved Silver Bracelet",
    size: "12mm",
    price: 15000,
    image: "/images/Engraved-silver-bracelet-12mm.jpg",
  },
  {
    id: "b-silver-15",
    name: "Engraved Silver Bracelet",
    size: "15mm",
    price: 16000,
    image: "/images/Engraved-silver-bracelet-15mm.jpg",
  },

  // Plain silver bracelet (your filename is "Silver-bracelet.jpg")
  {
    id: "b-plain-silver",
    name: "Silver Bracelet",
    size: "Standard",
    price: 15000,
    image: "/images/Silver-bracelet.jpg",
  },

  // Mini Cuban bracelets (note the actual filenames include spaces, and one has a space before ".jpeg")
  {
    id: "b-mini-black",
    name: "Engraved Black Mini Cuban Bracelet",
    size: "Standard",
    price: 12000,
    // filename: "Engraved Black Mini Cuban Bracelet .jpeg"  (space before .jpeg)
    image: "/images/Engraved%20Black%20Mini%20Cuban%20Bracelet%20.jpeg",
  },
  {
    id: "b-mini-gold",
    name: "Engraved Gold Mini Cuban Bracelet",
    size: "Standard",
    price: 12000,
    // filename: "Engraved Gold Mini Cuban Bracelet.jpeg"
    image: "/images/Engraved%20Gold%20Mini%20Cuban%20Bracelet.jpeg",
  },
  {
    id: "b-mini-silver",
    name: "Engraved Silver Mini Cuban Bracelet",
    size: "Standard",
    price: 12000,
    // filename: "Engraved Silver Mini Cuban Bracelet.jpeg"
    image: "/images/Engraved%20Silver%20Mini%20Cuban%20Bracelet.jpeg",
  },

  // Extra black bracelet photo (your filename: "Engraved Black Bracelet12.jpg")
  {
    id: "b-black-photo",
    name: "Engraved Black Bracelet",
    size: "Standard",
    price: 15000,
    image: "/images/Engraved%20Black%20Bracelet12.jpg",
  },
];

const necklaces = [
  {
    id: "n-female",
    name: "Engraved Female Necklace",
    price: 12000,
    image: "/images/Engraved%20Female%20Necklace.jpg",
  },
  {
    id: "n-sunflower",
    name: "Female Sunflower Necklace",
    price: 12000,
    image: "/images/Female%20Sunflower%20Necklace.jpg",
  },

  // Butterfly gold necklace (your file 1 has a space before ".jpeg")
  {
    id: "n-butterfly-1",
    name: "Engraved Butterfly Gold Necklace",
    price: 11000,
    // filename: "Engraved Butterfly Gold Necklace .jpeg"
    image: "/images/Engraved%20Butterfly%20Gold%20Necklace%20.jpeg",
  },
  {
    id: "n-butterfly-2",
    name: "Engraved Butterfly Gold Necklace",
    price: 11000,
    // filename: "Engraved Butterfly Gold Necklace2.jpeg"
    image: "/images/Engraved%20Butterfly%20Gold%20Necklace2.jpeg",
  },
  {
    id: "n-butterfly-3",
    name: "Engraved Butterfly Gold Necklace",
    price: 11000,
    // filename: "Engraved Butterfly Gold Necklace3.jpeg"
    image: "/images/Engraved%20Butterfly%20Gold%20Necklace3.jpeg",
  },

  {
    id: "n-gold-picture",
    name: "Engraved Gold Picture Necklace",
    price: 15000,
    image: "/images/Engraved%20Gold%20Picture%20Necklace.jpg",
  },

  {
    id: "n-gold-stoned",
    name: "Engraved Gold Stoned Necklace",
    price: 15000,
    image: "/images/Engraved%20Gold%20Stoned%20Necklace.jpg",
  },

  {
    id: "n-stoned-barcode",
    name: "Engraved Stoned Necklace with Barcode",
    price: 19000,
    image: "/images/Engraved%20Stoned%20Necklace%20with%20Barcode.jpg",
  },

  {
    id: "n-rose-gold",
    name: "Engraved Rose Gold Necklace",
    price: 12000,
    image: "/images/Engraved%20Rose%20Gold%20Necklace.jpeg",
  },

  // Love necklaces (file 1 has a space before ".jpeg")
  {
    id: "n-love-1",
    name: "Engraved Love Gold Necklace",
    price: 12000,
    // filename: "Engraved Love Gold Necklace .jpeg"
    image: "/images/Engraved%20Love%20Gold%20Necklace%20.jpeg",
  },
  {
    id: "n-love-2",
    name: "Engraved Love Gold Necklace",
    price: 12000,
    image: "/images/Engraved%20Love%20Gold%20Necklace%202.jpeg",
  },
];

const watches = [
  {
    id: "w-casio-black-engraved",
    name: "Engraved Black Casio Wristwatch",
    price: 18000,
    image: "/images/Engraved%20Black%20Casio%20Wristwatch.jpg",
  },
  {
    id: "w-casio-silver-engraved",
    name: "Engraved Silver Casio Wristwatch",
    price: 18000,
    image: "/images/Engraved%20Silver%20Casio%20Wristwatch.jpg",
  },
  {
    id: "w-casio-gold-engraved",
    name: "Engraved Gold Casio Wristwatch",
    price: 18000,
    // Your actual file is "Engraved Gold Casio Wristwatch2.jpg"
    image: "/images/Engraved%20Gold%20Casio%20Wristwatch2.jpg",
  },
{
  id: "w-casio-gold",
  name: "Gold Casio Wristwatch",
  price: 22000,
  image: "/images/gold-casio-wristwatch.jpg",
},
  {
    id: "w-rolex-gold-engraved",
    name: "Engraved Gold Rolex Wristwatch",
    price: 32000,
    image: "/images/Engraved%20Gold%20Rolex%20Wristwatch.jpg",
  },

  {
    id: "w-rolex-black-engraved",
    name: "Engraved Black Rolex Wristwatch",
    price: 22000,
    image: "/images/Engraved%20Black%20Rolex%20Wristwatch.jpg",
  },
];

const sets = [
  {
    id: "s-black-casio-bracelet",
    name: "Black Casio Wristwatch + Bracelet",
    price: 22000,
    // Your actual file is "Black-casio-watch-bracelet.jpg" (Capital B)
    image: "/images/Black-casio-watch-bracelet.jpg",
  },

  {
    id: "s-engraved-gold-rolex-bracelet",
    name: "Engraved Gold Rolex Wristwatch + Bracelet",
    price: 32000,
    // Your actual file is "Engraved-gold-rolex-watch-bracelet.jpg" (Capital E)
    image: "/images/Engraved-gold-rolex-watch-bracelet.jpg",
  },

  {
    id: "s-gold-female-set",
    name: "Engraved Gold Female Set",
    price: 21000,
    image: "/images/Engraved%20Gold%20Female%20Set.jpeg",
  },

  // Cufflinks
  {
    id: "cuff-black-fashion",
    name: "Black Fashion Cufflinks",
    price: 15000,
    image: "/images/Black%20Fashion%20cufflinks.jpg",
  },
  {
    id: "cuff-gold-oval",
    name: "Gold Oval Cufflinks",
    price: 15000,
    image: "/images/Gold%20Oval%20Cufflinks.jpg",
  },
  {
    id: "cuff-gold-square",
    name: "Gold Square Cufflinks",
    price: 15000,
    image: "/images/Gold%20Square%20Cufflinks.jpg",
  },
  {
    id: "cuff-silver-hex",
    name: "Silver Hexagon Cufflinks",
    price: 15000,
    image: "/images/Silver%20Hexagon%20Cufflinks.jpg",
  },
  {
    id: "cuff-gold-fashion",
    name: "Gold Fashion Cufflinks",
    price: 15000,
    image: "/images/Gold%20fashion%20cufflinks.jpg",
  },

  // Journal + Pen
  {
    id: "journal-pen",
    name: "Wooden Journal and Pen",
    price: 27000,
    image: "/images/Wooden%20Journal%20and%20Pen.jpg",
  },
];

export const byCategory = {
  bracelets,
  necklaces,
  watches,
  sets,
};