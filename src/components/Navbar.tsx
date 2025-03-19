"use client";

import Link from "next/link";
import Image from "next/image"; // Import Image for the logo
import { useState } from "react";

import { FaRegHeart, FaHeart } from "react-icons/fa"; // Wishlist icons
import { AiOutlineShoppingCart, AiFillShopping } from "react-icons/ai"; // Cart icons
import SearchBar from "./search"; // Import the new SearchBar component
import { useCart } from "../app/context/cartContext";

const Navbar = () => {
  const { cart } = useCart(); // Using Cart context
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle
  const [isWishlistActive, setIsWishlistActive] = useState(false); // Simulated wishlist state
  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0); // Calculate total items in the cart

  // Toggle wishlist state (for demo purposes)
  const toggleWishlist = () => setIsWishlistActive(!isWishlistActive);

  return (
    <nav className="bg-gradient-to-br from-purple-700 to-purple-400 text-white p-4 shadow-lg relative z-50">
      {/* Mobile View: Hamburger on left, Logo in center, Search/Wishlist/Cart on right */}
      <div className="lg:hidden flex items-center justify-between px-4">
        {/* Hamburger Menu */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Logo (Centered in Mobile) */}
        <Link href="/" className="flex items-center mx-auto">
          <Image
            src="/logo.jpeg"
            alt="Mystic Essence Logo"
            width={50}
            height={40}
            className="object-contain"
          />
        </Link>

        {/* Right Side: SearchBar, Wishlist, Cart */}
        <div className="flex items-center space-x-4">
          <SearchBar />
          {/* Wishlist Icon */}
          <Link href="/wishlist">
            <button
              onClick={toggleWishlist}
              className="relative text-purple-200 hover:text-purple-300 transition-colors"
              aria-label="Wishlist"
            >
              {isWishlistActive ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
            </button>
          </Link>

          {/* Cart Icon */}
          <Link href="/cart">
            <button className="relative text-purple-200 hover:text-purple-300 transition-colors" aria-label="Cart">
              {totalItemsInCart > 0 ? <AiFillShopping size={24} /> : <AiOutlineShoppingCart size={24} />}
              {totalItemsInCart > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItemsInCart}
                </span>
              )}
            </button>
          </Link>
        </div>
      </div>

      {/* Desktop View: Logo on left, Menu in center, Search/Wishlist/Cart on right */}
      <div className="hidden lg:flex container mx-auto px-4 items-center justify-between">
        {/* Logo (Left) */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.jpeg"
            alt="Mystic Essence Logo"
            width={50}
            height={50}
            className="object-contain"
          />
        </Link>

        {/* Navigation Menu (Center) */}
        <div className="flex space-x-6 items-center">
          <Link href="/" className="hover:text-purple-200 transition-colors">
            Home
          </Link>
          <Link href="/shop" className="hover:text-purple-200 transition-colors">
            Shop
          </Link>
          <Link href="/about" className="hover:text-purple-200 transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-purple-200 transition-colors">
            Contact
          </Link>
          <Link href="/help" className="hover:text-purple-200 transition-colors">
            Help Center
          </Link>
        </div>

        {/* Right Side: SearchBar, Wishlist, Cart */}
        <div className="flex items-center space-x-4">
          <SearchBar />
          {/* Wishlist Icon */}
          <Link href="/wishlist">
            <button
              onClick={toggleWishlist}
              className="relative text-purple-200 hover:text-purple-300 transition-colors"
              aria-label="Wishlist"
            >
              {isWishlistActive ? <FaHeart size={28} /> : <FaRegHeart size={28} />}
            </button>
          </Link>

          {/* Cart Icon */}
          <Link href="/cart">
            <button className="relative text-purple-200 hover:text-purple-300 transition-colors" aria-label="Cart">
              {totalItemsInCart > 0 ? <AiFillShopping size={28} /> : <AiOutlineShoppingCart size={28} />}
              {totalItemsInCart > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItemsInCart}
                </span>
              )}
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-purple-800 z-40 p-4 shadow-md animate-slide-down">
          <Link href="/" className="block py-2 text-white hover:text-purple-200 transition-colors">
            Home
          </Link>
          <Link href="/shop" className="block py-2 text-white hover:text-purple-200 transition-colors">
            Shop
          </Link>
          <Link href="/about" className="block py-2 text-white hover:text-purple-200 transition-colors">
            About
          </Link>
          <Link href="/contact" className="block py-2 text-white hover:text-purple-200 transition-colors">
            Contact
          </Link>
          <Link href="/help" className="block py-2 text-white hover:text-purple-200 transition-colors">
            Help Center
          </Link>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        @media (max-width: 1024px) {
          .container {
            flex-direction: column;
            gap: 1rem;
          }
          .hidden {
            display: none;
          }
          .lg\\:flex {
            display: flex;
            flex-direction: column;
            width: 100%;
            text-align: center;
          }
          .space-x-6 {
            space-x-0;
          }
          .w-full {
            width: 100%;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;