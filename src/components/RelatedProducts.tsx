"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";

interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  image: { asset: { url: string } };
  price: number;
}

interface RelatedProductsProps {
  currentProductId: string;
  currentCategory: string;
}

const RelatedProducts = ({ currentProductId, currentCategory }: RelatedProductsProps) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const query = `*[_type == "product" && category == $category && _id != $currentProductId] | order(price asc) [0...4] {
          _id,
          title,
          slug,
          category,
          image,
          price
        }`;
        const params = { category: currentCategory, currentProductId };
        const products = await client.fetch(query, params);
        setRelatedProducts(products);
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, currentCategory]);

  if (isLoading) {
    return <p className="text-white text-center">Loading related products...</p>;
  }

  if (relatedProducts.length === 0) {
    return <p className="text-white text-center">No related products found.</p>;
  }

  return (
    <section className="container mx-auto px-4 py-8 bg-gradient-to-br from-purple-700 to-purple-400 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <div
            key={product._id}
            className="bg-purple-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative w-full h-48 mb-4">
              <Image
                src={product.image.asset.url}
                alt={product.title}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
            <p className="text-purple-200 mb-2">PKR {product.price.toLocaleString()}</p>
            <Link
              href={`/products/${product.slug.current}`}
              className="text-purple-300 hover:text-purple-100 transition-colors inline-block"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;