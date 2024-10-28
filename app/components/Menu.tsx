"use client"; // Ensure this is a client-side component

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { items } from "../assets/alldata"; // Import your items list

interface Item {
  id: number;
  model: string;
  category: string;
  modelImage: string;
  brand: string;
  price: number;
  condition: string;
  rating?: number;
}

const ProductCard: React.FC<{ product: Item }> = ({ product }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform duration-300 hover:scale-105 mb-6">
    <img
      className="w-full h-64 object-cover"
      src={product.modelImage}
      alt={product.model}
    />
    <div className="p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{product.model}</h3>
        <p className="mt-2 text-gray-600">{product.category}</p>
        <p className="mt-2 text-gray-800 font-bold">{`Price: $${product.price}`}</p>
        <p className="mt-2 text-gray-600">{`Condition: ${product.condition}`}</p>
      </div>
      <div className="flex items-center mt-2">
        {[...Array(product.rating || 0)].map((_, index) => (
          <svg
            key={index}
            className="w-5 h-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927a1 1 0 011.902 0l1.398 3.732a1 1 0 00.9.664l3.646.308a1 1 0 01.591 1.77l-2.77 2.14a1 1 0 00-.322 1.02l1.017 3.774a1 1 0 01-1.516 1.096l-3.171-2.1a1 1 0 00-1.112 0l-3.171 2.1a1 1 0 01-1.516-1.096l1.017-3.774a1 1 0 00-.322-1.02l-2.77-2.14a1 1 0 01.591-1.77l3.646-.308a1 1 0 00.9-.664l1.398-3.732z" />
          </svg>
        ))}
      </div>
      <button className="mt-4 w-[150px] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
        View Product
      </button>
    </div>
  </div>
);

const Menu: React.FC = () => {
  const searchParams = useSearchParams();
  const brand = searchParams.get("brand");

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);

  const filters = Array.from(new Set(items.map((item) => item.brand)));
  const conditions = ["New", "Used"];

  const toggleFilter = (filter: string, filters: string[], setFilters: React.Dispatch<React.SetStateAction<string[]>>) => {
    setFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  useEffect(() => {
    if (brand) setSelectedFilters([brand]);
  }, [brand]);

  useEffect(() => {
    const filtered = items
      .filter((item) => !selectedFilters.length || selectedFilters.includes(item.brand))
      .filter((item) => !selectedCondition || item.condition === selectedCondition)
      .filter((item) => (minPrice ? item.price >= minPrice : true))
      .filter((item) => (maxPrice ? item.price <= maxPrice : true));

    setFilteredItems(filtered);
  }, [selectedFilters, selectedCondition, minPrice, maxPrice]);

  return (
    <div className="flex flex-wrap p-6 min-h-screen">
      <aside className="p-4 border-r border-gray-300" style={{ width: "250px" }}>
        <h2 className="text-xl font-bold mb-4">Refine your Results</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Min Price</label>
          <input
            type="number"
            value={minPrice || ""}
            onChange={(e) => setMinPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full border px-3 py-2 rounded-lg mb-4"
            placeholder="Min Price"
          />
          <label className="block text-gray-700 font-semibold mb-2">Max Price</label>
          <input
            type="number"
            value={maxPrice || ""}
            onChange={(e) => setMaxPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full border px-3 py-2 rounded-lg"
            placeholder="Max Price"
          />
        </div>

        <div className="mb-4 flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Condition</h3>
          {conditions.map((condition) => (
            <button
              key={condition}
              onClick={() => setSelectedCondition((prev) => (prev === condition ? undefined : condition))}
              className={`border px-4 py-2 rounded-lg transition duration-300 mb-2 text-sm ${
                selectedCondition === condition ? "bg-blue-600 text-white" : "bg-gray-200 text-black hover:bg-blue-500 hover:text-white"
              }`}
            >
              {condition}
            </button>
          ))}
        </div>

        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Brand</h3>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter, selectedFilters, setSelectedFilters)}
              className={`border px-4 py-2 rounded-lg transition duration-300 mb-2 text-sm ${
                selectedFilters.includes(filter) ? "bg-blue-600 text-white" : "bg-gray-200 text-black hover:bg-blue-500 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </aside>

      <main className="w-full md:w-3/4 p-4">
        <h1 className="text-2xl font-bold text-center mb-6">Electric Cars Gallery</h1>
        <div className="space-y-6">
          {filteredItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Menu;
