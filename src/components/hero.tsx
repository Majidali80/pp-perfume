"use client";

import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 to-purple-800 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero1.jpg" // Replace with the path to the generated image
          alt="Aetherical Aura Hero Background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay for text readability */}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-yellow-400 mb-4">
          Welcome to Aetherical Aura by Ali Abbas
        </h1>
        <p className="text-lg md:text-xl text-yellow-300 mb-8 max-w-2xl mx-auto">
          Discover a world of ethereal scents, crafted with celestial inspiration and luxurious notes. Elevate your essence beyond the ordinary.
        </p>
        <Link href="/shop">
          <button className="bg-yellow-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-yellow-400 transition-colors shadow-lg">
            Explore Our Fragrances
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;