"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";

// Dynamically import react-slick with SSR disabled
const Slider = dynamic(() => import("react-slick"), {
  ssr: false, // Disable server-side rendering for react-slick
});

// Import slick-carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Carousel settings
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
  customPaging: () => (
    <div className="w-3 h-3 bg-gold-500 rounded-full opacity-50 hover:opacity-100 transition-opacity"></div>
  ),
  dotsClass: "slick-dots custom-dots",
};

// Slide data with titles and buttons
const slides = [
  {
    src: "/cr1.jpg",
    title: "Discover the Night's Fragrance",
    buttonText: "Explore Night Scents",
    buttonLink: "/shop?category=night",
  },
  {
    src: "/cr2.jpg",
    title: "Celestial Essence",
    buttonText: "View Celestial Collection",
    buttonLink: "/shop?category=celestial",
  },
  {
    src: "/cr3.jpg",
    title: "Mystical Mornings",
    buttonText: "Shop Morning Scents",
    buttonLink: "/shop?category=morning",
  },
  {
    src: "/cr4.jpg",
    title: "Ethereal Elegance",
    buttonText: "Experience Elegance",
    buttonLink: "/shop?category=elegance",
  },
  {
    src: "/cr5.jpg",
    title: "Luxury Unleashed",
    buttonText: "Discover Luxury",
    buttonLink: "/shop?category=luxury",
  },
];

const Carousel = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 to-purple-800 text-white overflow-hidden py-12 md:py-20">
      <div className="container mx-auto px-4">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="relative h-96 md:h-[500px] overflow-hidden rounded-lg shadow-2xl">
              <Image
                src={slide.src}
                alt={`${slide.title} - Aetherical Aura by Ali Abbas`}
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
                quality={100}
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay for readability */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-4">
                <h2 className="text-3xl md:text-5xl font-extrabold text-gold-500 mb-4 drop-shadow-lg">
                  {slide.title}
                </h2>
                <Link href={slide.buttonLink}>
                  <button className="bg-gold-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-gold-600 transition-colors shadow-md hover:shadow-lg">
                    {slide.buttonText}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Carousel;