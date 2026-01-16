import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import EngravingPreview from "../components/EngravingPreview";
import { byCategory } from "../data/products.js";

export default function Bracelets({ addToCart }) {
  const [engraving, setEngraving] = useState("");
  const [memory, setMemory] = useState("");

  const products = useMemo(() => byCategory.bracelets || [], []);

  const handleAdd = (p) => {
    addToCart?.({
      ...p,
      customization: {
        engraving: engraving.trim(),
        memory: memory.trim(),
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold">Bracelets</h2>
          <p className="text-gray-500 mt-2">
            Choose your bracelet and add engraving details (optional).
          </p>
        </div>
      </div>

      <EngravingPreview
        value={engraving}
        onChange={setEngraving}
        memoryValue={memory}
        onMemoryChange={setMemory}
        showMemory={true}
      />

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={() => handleAdd(p)} />
        ))}
      </div>
    </div>
  );
}
