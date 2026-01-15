import ProductCard from "../components/ProductCard";
import { byCategory } from "../data/products";

export default function Watches({ addToCart }) {
  const products = byCategory("watches");

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-semibold mb-2">Watches</h2>
      <p className="text-gray-600 mb-8">
        Engraved wristwatches — premium feel, timeless look.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} />
        ))}
      </div>
    </div>
  );
}