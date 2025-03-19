"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client, urlFor } from "../sanity/lib/client";
import { allProductsQuery } from "../sanity/lib/queries";
import { Product } from "../app/utils/types";
import { FaRegHeart, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../app/context/cartContext";
import Image from "next/image";
import { BsCartPlusFill, BsCartPlus } from "react-icons/bs";

const BestSelling = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const storedWishlist = localStorage.getItem("wishlist");
      return storedWishlist ? new Set<string>(JSON.parse(storedWishlist)) : new Set<string>();
    }
    return new Set<string>();
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<string>("");

  useEffect(() => {
    async function fetchProduct() {
      const fetchedProduct: Product[] = await client.fetch(allProductsQuery);
      setProducts(fetchedProduct);
    }
    fetchProduct();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify([...wishlist]));
    }
  }, [wishlist]);

  const { cart, addToCart } = useCart();
  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

  const handleWishlistToggle = (productId: string) => {
    setWishlist((prevWishlist) => {
      const updatedWishlist = new Set(prevWishlist);
      if (updatedWishlist.has(productId)) {
        updatedWishlist.delete(productId);
      } else {
        updatedWishlist.add(productId);
      }
      return updatedWishlist;
    });

    setNotification("Item added to Wishlist");
    setNotificationType("wishlist");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setNotification("Item added to Cart");
    setNotificationType("cart");
    setTimeout(() => setNotification(null), 3000);
  };

  const getDiscountedPrice = (price: number, discountPercentage: number) => {
    return price - price * (discountPercentage / 100);
  };

  return (
    <div className="mb-[100px] mt-[100px] overflow-hidden">
      <div className="container px-5 mx-auto">
        <div className="text-center mb-10">
          <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-5xl text-myBlue">
            BEST SELLING PERFUMES
          </h1>
          <div className="flex mt-2 justify-center">
            <div className="w-28 h-1 rounded-full bg-myDgold inline-flex" />
          </div>
        </div>
      </div>

      {/* Background Gradient Section */}
      <div className="bg-gradient-to-br from-gray-900 to-purple-800 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);

            return (
              <div
                key={product._id}
                className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded shadow-lg p-10 cursor-pointer hover:shadow-2xl transition-shadow"
              >
                <Link href={`/products/${product.slug.current}`}>
                  <h2 className="text-lg font-serif text-white mb-4">{product.title}</h2>

                  {/* Product Image */}
                  {product.image ? (
                    <div className="relative">
                      <Image
                        src={typeof product.image === 'string' ? product.image : urlFor(product.image.asset).url()}
                        alt={product.title}
                        width={450}
                        height={350}
                        className="w-full h-64 object-cover mb-2 hover"
                      />
                      {/* Discount Badge */}
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold py-1 px-2 rounded-full">
                        {product.discountPercentage}% OFF
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No image available</p>
                  )}

                  {/* Price Section */}
                  <p className="text-gray-900 font-bold mb-4">
                    <span className="line-through text-gray-500">PKR {product.price}</span>
                    <span className="text-red-500 ml-16">PKR {discountedPrice.toFixed(2)}</span>
                  </p>
                </Link>

                {/* Add to Cart and Wishlist Buttons */}
                <div className="flex justify-between items-center space-x-4 mt-4">
                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleWishlistToggle(product._id)}
                    className="bg-red-500 text-white p-3 rounded-full shadow-md hover:bg-red-600 focus:outline-none hover:scale-110 transition-transform"
                  >
                    {wishlist.has(product._id) ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
                  </button>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 focus:outline-none hover:scale-110 transition-transform"
                  >
                    <FaShoppingCart size={24} />
                  </button>
                </div>

                {/* Availability */}
                <div className="text-sm text-green-500 ml-28">In Stock</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Icon */}
      <Link href="/cart">
          <button className="fixed bottom-6 right-6 bg-yellow-400 text-white rounded-full p-4 shadow-lg hover:bg-gold-600 transition duration-300 z-50">
            {totalItemsInCart > 0 ? <BsCartPlusFill size={24} /> : <BsCartPlus size={24} />}
            {totalItemsInCart > 0 && (
              <span className="absolute top-0 right-0 bg-red-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItemsInCart}
              </span>
            )}
          </button>
        </Link>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md text-white ${notificationType === "cart" ? "bg-blue-500" : "bg-red-500"}`}
        >
          {notification}
        </div>
      )}
    </div>
  );
};

export default BestSelling;
