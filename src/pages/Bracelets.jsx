import ProductCard from "../components/ProductCard";
import { byCategory } from "../data/products";

export default function Bracelets({ addToCart }) {
  const PRODUCTS = byCategory("bracelets");

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bracelets</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Engraved bracelets, barcode bracelets, and custom pieces.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={addToCart} />
        ))}
      </div>
    </div>
  );
}