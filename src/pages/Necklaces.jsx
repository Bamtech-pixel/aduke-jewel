import ProductCard from "../components/ProductCard";

const PRODUCTS = [
  // ✅ Paste your existing necklaces list here (same structure you used before):
  // { id, name, price, image }
];

export default function Necklaces({ addToCart }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Necklaces</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Engraved necklaces, picture necklaces, stoned styles, and barcode options.
        </p>
      </div>

      {PRODUCTS.length === 0 ? (
        <div className="border border-black/10 dark:border-white/10 rounded-2xl p-8 bg-white/60 dark:bg-white/5">
          <p className="text-gray-600 dark:text-gray-400">
            Add your necklace products into the PRODUCTS array in{" "}
            <span className="font-semibold">src/pages/Necklaces.jsx</span>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}