"use client";

import Link from "next/link";
import Image from "next/image";

// Static data for best-selling perfumes (replace with Sanity fetch later)
const bestSellingPerfumes = [
  {
    id: "1",
    name: "Aetherical Dusk by Ali Abbas",
    description: "A bold, woody fragrance with notes of sandalwood, oud, and amber, evoking the mysterious allure of twilight.",
    price: 120,
    image: "/sl1.jpg",
    category: "mens",
  },
  {
    id: "2",
    name: "Aetherical Bloom by Ali Abbas",
    description: "A floral, delicate scent with rose, jasmine, and lily, capturing the essence of blooming celestial flowers.",
    price: 110,
    image: "/sl2.jpg",
    category: "womens",
  },
  {
    id: "3",
    name: "Aetherical Eclipse by Ali Abbas",
    description: "A dark, smoky fragrance with notes of black pepper, leather, and patchouli, capturing the enigma of a lunar eclipse.",
    price: 130,
    image: "/sl3.jpg",
    category: "mens",
  },
  {
    id: "4",
    name: "Aetherical Whisper by Ali Abbas",
    description: "A soft, powdery fragrance with iris, vanilla, and musk, whispering ethereal elegance.",
    price: 100,
    image: "/sl4.jpg",
    category: "womens",
  },
  {
    id: "5",
    name: "Aetherical Nebula by Ali Abbas",
    description: "A spicy, oriental fragrance with cardamom, saffron, and musk, embodying the cosmic mystery of a nebula.",
    price: 125,
    image: "/sl5.jpg",
    category: "mens",
  },
  {
    id: "6",
    name: "Aetherical Starlight by Ali Abbas",
    description: "A sparkling, floral scent with violet, peony, and white musk, glowing like starlight.",
    price: 115,
    image: "/sl6.jpg",
    category: "womens",
  },
];

const Selling = () => {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-purple-800 text-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-gold-500 text-center mb-12">
          Our Best-Selling Fragrances
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestSellingPerfumes.map((perfume) => (
            <div
              key={perfume.id}
              className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Product Image */}
              <div className="relative h-64">
                <Image
                  src={perfume.image}
                  alt={`${perfume.name} - Aetherical Aura by Ali Abbas`}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  quality={100}
                />
              </div>

              {/* Product Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gold-500 mb-2">{perfume.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{perfume.description}</p>
                <p className="text-lg font-semibold text-white mb-4">PKR{perfume.price}</p>
                <Link href={`/shop/${perfume.id}`}>
                  <button className="bg-gold-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-gold-600 transition-colors w-full">
                    Shop Now
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Selling;