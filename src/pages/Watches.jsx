import ProductCard from "../components/ProductCard";

const PRODUCTS = [
  // ✅ Paste your existing watches list here:
  // { id, name, price, image }
];

export default function Watches({ addToCart }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Watches</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Engraved wristwatches and premium styles (Casio & Rolex).
        </p>
      </div>

      {PRODUCTS.length === 0 ? (
        <div className="border border-black/10 dark:border-white/10 rounded-2xl p-8 bg-white/60 dark:bg-white/5">
          <p className="text-gray-600 dark:text-gray-400">
            Add your watch products into the PRODUCTS array in{" "}
            <span className="font-semibold">src/pages/Watches.jsx</span>.
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