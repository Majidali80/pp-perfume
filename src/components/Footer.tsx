"use client";

import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-purple-800 text-white py-10 md:py-12">
      <div className="container mx-auto px-4">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-gold-500 mb-4">About Us</h3>
            <p className="text-gray-300 text-sm">
              Aetherical Aura by Ali Abbas crafts luxurious fragrances inspired by the cosmos. Elevate your essence with our ethereal scents.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-gold-500 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-gold-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-gold-500 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-gold-500 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-gold-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold text-gold-500 mb-4">Contact Us</h3>
            <p className="text-gray-300 text-sm">
              Email: info@aethericalaura.com<br />
              Phone: +1-800-AETHERIC<br />
              Address: 123 Celestial Lane, Mystical City, MC 12345
            </p>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold text-gold-500 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" aria-label="Facebook">
                <FaFacebookF className="text-gray-300 hover:text-gold-500 transition-colors text-xl" />
              </Link>
              <Link href="https://twitter.com" aria-label="Twitter">
                <FaTwitter className="text-gray-300 hover:text-gold-500 transition-colors text-xl" />
              </Link>
              <Link href="https://instagram.com" aria-label="Instagram">
                <FaInstagram className="text-gray-300 hover:text-gold-500 transition-colors text-xl" />
              </Link>
              <Link href="https://pinterest.com" aria-label="Pinterest">
                <FaPinterest className="text-gray-300 hover:text-gold-500 transition-colors text-xl" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm mt-8 border-t border-gray-700 pt-4">
          <p>
            &copy; {new Date().getFullYear()} Aetherical Aura by Ali Abbas. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;