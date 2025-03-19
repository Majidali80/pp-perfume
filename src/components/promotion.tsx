"use client";

import Link from "next/link";
import Image from "next/image";

const PromotionBanner = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 to-purple-800 text-white py-8 md:py-12 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/ban.png" // Replace with the path to the generated image
          alt="Aetherical Aura Promotion Banner"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay for readability */}
      </div>

      {/* Banner Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-4xl font-extrabold text-gold-500 mb-4 drop-shadow-lg">
          Limited Time Offer: 20% Off
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
          Elevate your essence with our celestial fragrances. Shop now and save on your favorite scents!
        </p>
        <Link href="/shop">
          <button className="bg-gold-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-gold-600 transition-colors shadow-md hover:shadow-lg">
            Shop Now and Save
          </button>
        </Link>
      </div>
    </section>
  );
};

export default PromotionBanner;