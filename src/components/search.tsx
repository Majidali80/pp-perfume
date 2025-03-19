"use client";

import { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import Link from 'next/link';
import client from '@/sanity/lib/client';
import { useDebounce } from '@/hooks/useDebounce';

interface Product {
  _id: string;
  title: string;
  productName: string;
  slug: { current: string };
  category: string;
}

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search products when query changes
  useEffect(() => {
    const searchProducts = async () => {
      if (debouncedSearch.trim().length === 0) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const query = `*[_type == "product" && (
          title match $searchQuery ||
          productName match $searchQuery ||
          category match $searchQuery
        )]{
          _id,
          title,
          productName,
          slug,
          category
        }[0...5]`;

        const searchResults = await client.fetch(query, { searchQuery: `*${debouncedSearch}*` });
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    searchProducts();
  }, [debouncedSearch]);

  return (
    <div ref={searchRef} className="relative">
      {/* Search Icon/Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-orange-700 hover:text-orange-500 transition-colors"
        aria-label="Search"
      >
        <FaSearch className="w-5 h-5" />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-screen max-w-md bg-purple-400 rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pr-4 rounded-lg border text-black border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400 hover:text-gray-600"
                >
                  <IoMdClose size={20} />
                </button>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            )}

            {/* Results */}
            {!isLoading && results.length > 0 && (
              <div className="mt-4 divide-y divide-gray-100">
                {results.map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug.current}`}
                    onClick={() => {
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className="block px-4 py-3 hover:bg-orange-50 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {product.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {product.category}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && searchQuery && results.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No products found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 