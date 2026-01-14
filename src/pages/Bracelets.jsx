import { useState } from "react";
import { bracelets } from "../data/products";

export default function Bracelets({ addToCart }) {
  const [openImage, setOpenImage] = useState(null);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Bracelets</h1>
        <p className="text-gray-600 max-w-2xl mb-10">
          Discover finely crafted bracelets designed to elevate every moment —
          from everyday elegance to timeless luxury.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {bracelets.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-white"
            >
              <button
                type="button"
                onClick={() => setOpenImage(item)}
                className="block w-full"
                aria-label={`View ${item.name}`}
              >
                <div className="h-72 bg-gray-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-[1.02] transition"
                    loading="lazy"
                  />
                </div>
              </button>

              <div className="p-5">
                <h2 className="font-semibold text-lg">{item.name}</h2>
                {item.size ? (
                  <p className="text-sm text-gray-500 mt-1">{item.size}</p>
                ) : null}

                <p className="mt-3 font-bold">
                  ₦{Number(item.price).toLocaleString()}
                </p>

                <button
                  onClick={() => addToCart(item)}
                  className="mt-5 w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IMAGE MODAL */}
      {openImage ? (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setOpenImage(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div>
                <p className="font-semibold">{openImage.name}</p>
                {openImage.size ? (
                  <p className="text-sm text-gray-500">{openImage.size}</p>
                ) : null}
              </div>
              <button
                onClick={() => setOpenImage(null)}
                className="px-3 py-1 rounded-lg border hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="bg-black">
              <img
                src={openImage.image}
                alt={openImage.name}
                className="w-full max-h-[75vh] object-contain"
              />
            </div>

            <div className="p-5">
              <p className="font-bold text-lg">
                ₦{Number(openImage.price).toLocaleString()}
              </p>
              <button
                onClick={() => {
                  addToCart(openImage);
                  setOpenImage(null);
                }}
                className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
