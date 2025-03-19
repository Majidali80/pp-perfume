"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { client, urlFor } from "@/sanity/lib/client";
import Image from "next/image";
import Swal from "sweetalert2";
import { useCart } from "@/app/context/cartContext";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaTwitter, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import ReviewComponent from "../../../components/review";
import RelatedProducts from "@/components/RelatedProducts";

interface Product {
  _id: string;
  title: string;
  subtitle: string;
  price: number;
  image?: string;
  discountPercentage?: number;
  availability?: string;
  occasion: string;
  brand: string;
  usage_type: string;
  slug: { current: string };
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  description?: string;
  sizes?: { size: string; price: number }[];
  fabricType?: string;
  dimensions?: string;
  category?: string;
  colors?: string[];
  materials?: string[];
  careInstructions?: string;
  shippingInformation?: string;
}

interface Review {
  _id: string;
  productId: string;
  rating: number;
  comment: string;
}

const ProductDetailsPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const storedWishlist = localStorage.getItem("wishlist");
      return storedWishlist ? new Set<string>(JSON.parse(storedWishlist)) : new Set<string>();
    }
    return new Set<string>();
  });
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [reviews, setReviews] = useState<Review[]>([]);

  const { slug } = useParams();
  const { addToCart } = useCart();

  useEffect(() => {
    if (slug) {
      const fetchProductDetails = async () => {
        const query = `*[_type == "product" && slug.current == $slug][0] {
          _id,
          title,
          subtitle,
          price,
          image,
          discountPercentage,
          availability,
          slug,
          isBestSeller,
          description,
          sizes[] { size, price },
          fabricType,
          dimensions,
          category,
          colors,
          occasion,
          usage_type,
          brand,
          isNewArrival,
          materials,
          careInstructions,
          shippingInformation
        }`;
        try {
          const productDetails = await client.fetch(query, { slug });
          if (!productDetails) {
            throw new Error("Product not found");
          }
          setProduct(productDetails);
        } catch (err) {
          console.error("Error fetching product details:", err);
          setError("Failed to load product. Please try again later.");
        }
      };
      fetchProductDetails();
    }
  }, [slug]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify([...wishlist]));
    }
  }, [wishlist]);

  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsQuery = `*[_type == "review" && product._ref == $productId]`;
      try {
        const fetchedReviews = await client.fetch(reviewsQuery, { productId: product?._id });
        setReviews(fetchedReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    if (product) {
      fetchReviews();
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize && product?.sizes && product.sizes.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please select a size before adding to the cart!",
        confirmButtonColor: "#C084FC",
      });
      return;
    }

    const originalPrice = selectedSizeData ? selectedSizeData.price : product!.price;

    addToCart({
      ...product!,
      selectedSize: selectedSize || undefined,
      price: originalPrice,
      quantity,
      image: product!.image ? urlFor(product!.image).url() : "",
    });

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Product added to cart!",
      confirmButtonColor: "#C084FC",
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    setWishlist((prevWishlist) => {
      const updatedWishlist = new Set(prevWishlist);
      if (updatedWishlist.has(product._id)) {
        updatedWishlist.delete(product._id);
        Swal.fire({
          icon: "info",
          title: "Removed from Wishlist",
          text: `${product.title} has been removed from your wishlist.`,
          confirmButtonColor: "#C084FC",
          timer: 2000,
        });
      } else {
        updatedWishlist.add(product._id);
        Swal.fire({
          icon: "success",
          title: "Added to Wishlist",
          text: `${product.title} has been added to your wishlist!`,
          confirmButtonColor: "#C084FC",
          timer: 2000,
        });
      }
      return updatedWishlist;
    });
  };

  const getDiscountedPrice = (price: number, discountPercentage?: number) => {
    return discountPercentage ? price - (price * (discountPercentage / 100)) : price;
  };

  const shareOnTwitter = () => {
    const url = window.location.href;
    const text = `Check out this product: ${product?.title} on sale for PKR ${discountedPrice}!`;
    const shareUrl = `https://twitter.com/share?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank");
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank");
  };

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = `Check out this product: ${product?.title} on sale for PKR ${discountedPrice}! ${url}`;
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, "_blank");
  };

  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!product) return <div className="text-center text-gray-300">Loading product details...</div>;

  const selectedSizeData = product.sizes?.find((size) => size.size === selectedSize);
  const discountedPrice = getDiscountedPrice(
    selectedSizeData ? selectedSizeData.price : product.price,
    product.discountPercentage
  );
  const originalPrice = selectedSizeData ? selectedSizeData.price : product.price;

  return (
    <div className="container px-5 mx-auto my-10">
      <div className="bg-gradient-to-br from-purple-700 to-purple-400 rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Section */}
          <div className="relative">
            {product.discountPercentage && (
              <span className="absolute top-2 left-2 bg-purple-600 text-white px-3 py-1 text-sm font-semibold rounded-full">
                {product.discountPercentage}% OFF
              </span>
            )}
            {product.isNewArrival && (
              <span className="absolute top-2 right-2 bg-purple-900 text-white px-3 py-1 text-sm font-semibold rounded-full">
                New Arrival
              </span>
            )}
            {product.isBestSeller && (
              <span className="absolute top-12 right-2 bg-purple-900 text-white px-3 py-1 text-sm font-semibold rounded-full">
                Best Seller
              </span>
            )}
            {product.image ? (
              <Image
                src={urlFor(product.image).url()}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-[500px] object-cover rounded-md border border-purple-400"
              />
            ) : (
              <div className="w-full h-[500px] bg-purple-900 flex justify-center items-center rounded-md border border-purple-400">
                <span className="text-gray-200">No image available</span>
              </div>
            )}

            {/* Add to Cart and Wishlist Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                className="bg-purple-400 text-white py-3 px-6 rounded-lg hover:bg-purple-500 transition flex items-center gap-2"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button
                className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                onClick={handleWishlistToggle}
              >
                {wishlist.has(product._id) ? (
                  <>
                    <AiFillHeart size={20} /> Remove from Wishlist
                  </>
                ) : (
                  <>
                    <AiOutlineHeart size={20} /> Add to Wishlist
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Product Details Section */}
          <div>
            <h1 className="text-3xl font-bold text-purple-200">{product.title}</h1>
            <h4 className="text-xl font-semibold text-purple-300 mt-2">{product.subtitle}</h4>

            {/* Social Sharing Buttons */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={shareOnTwitter}
                className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition"
                aria-label="Share on Twitter"
              >
                <FaTwitter size={20} />
              </button>
              <button
                onClick={shareOnFacebook}
                className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition"
                aria-label="Share on Facebook"
              >
                <FaFacebookF size={20} />
              </button>
              <button
                onClick={shareOnWhatsApp}
                className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition"
                aria-label="Share on WhatsApp"
              >
                <FaWhatsapp size={20} />
              </button>
            </div>

            <p className="text-lg font-semibold mt-4 text-white">
              Original Price: <span className="line-through text-gray-400">PKR {originalPrice.toFixed(2)}</span>
            </p>
            <p className="text-2xl font-bold mt-2 text-purple-200">
              Discounted Price: PKR {(discountedPrice * quantity).toFixed(2)}
            </p>
            <p
              className={`text-sm mt-2 ${
                product.availability === "In Stock" ? "text-green-400" : "text-red-500"
              }`}
            >
              {product.availability || "In Stock"}
            </p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6">
                <p className="text-lg font-semibold text-white">Available Sizes:</p>
                <select
                  className="mt-2 p-2 border border-gray-300 rounded text-gray-800 bg-white"
                  onChange={(e) => setSelectedSize(e.target.value)}
                  value={selectedSize || ""}
                >
                  <option value="" disabled>
                    Select a Size
                  </option>
                  {product.sizes.map((sizeOption, index) => (
                    <option key={index} value={sizeOption.size}>
                      {sizeOption.size} - PKR {sizeOption.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-6 flex items-center">
              <button
                className="bg-purple-400 text-white px-4 py-2 rounded-full hover:bg-purple-500 transition"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span className="mx-4 text-xl text-white">{quantity}</span>
              <button
                className="bg-purple-400 text-white px-4 py-2 rounded-full hover:bg-purple-500 transition"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>

            {/* Product Details Table */}
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-purple-200 mb-4">Product Details</h2>
              <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                <tbody>
                  {product.category && (
                    <tr>
                      <th className="border border-gray-300 p-2 bg-purple-800 text-white">Category:</th>
                      <td className="border border-gray-300 p-2 text-gray-200">{product.category}</td>
                    </tr>
                  )}
                  {product.occasion && (
                    <tr>
                      <th className="border border-gray-300 p-2 bg-purple-800 text-white">Occasion:</th>
                      <td className="border border-gray-300 p-2 text-gray-200">{product.occasion}</td>
                    </tr>
                  )}
                  {product.brand && (
                    <tr>
                      <th className="border border-gray-300 p-2 bg-purple-800 text-white">Brand:</th>
                      <td className="border border-gray-300 p-2 text-gray-200">{product.brand}</td>
                    </tr>
                  )}
                  {product.usage_type && (
                    <tr>
                      <th className="border border-gray-300 p-2 bg-purple-800 text-white">Usage Type:</th>
                      <td className="border border-gray-300 p-2 text-gray-200">{product.usage_type}</td>
                    </tr>
                  )}
                  {product.fabricType && (
                    <tr>
                      <th className="border border-gray-300 p-2 bg-purple-800 text-white">Fabric Type:</th>
                      <td className="border border-gray-300 p-2 text-gray-200">{product.fabricType}</td>
                    </tr>
                  )}
                  {product.dimensions && (
                    <tr>
                      <th className="border border-gray-300 p-2 bg-purple-800 text-white">Dimensions:</th>
                      <td className="border border-gray-300 p-2 text-gray-200">{product.dimensions}</td>
                    </tr>
                  )}
                  {product.colors && product.colors.length > 0 && (
                    <tr>
                      <th className="border border-gray-300 p-2 bg-purple-800 text-white">Colors:</th>
                      <td className="border border-gray-300 p-2 text-gray-200">{product.colors.join(", ")}</td>
                    </tr>
                  )}
                  {product.materials && product.materials.length > 0 && (
                    <tr>
                      <th className="border border-gray-300 p-2 bg-purple-800 text-white">Materials:</th>
                      <td className="border border-gray-300 p-2 text-gray-200">{product.materials.join(", ")}</td>
                    </tr>
                  )}
                  {product.careInstructions && (
                    <tr>
                      <th className="border border-gray-300 p-2 bg-purple-800 text-white">Care Instructions:</th>
                      <td className="border border-gray-300 p-2 text-gray-200">{product.careInstructions}</td>
                    </tr>
                  )}
                  {product.shippingInformation && (
                    <tr>
                      <th className="border border-gray-300 p-2 bg-purple-800 text-white">Shipping Info:</th>
                      <td className="border border-gray-300 p-2 text-gray-200">{product.shippingInformation}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Tabbed Interface */}
            
          </div>
            <div className="mt-6">
              <div className="flex space-x-4 mb-4">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    activeTab === "description"
                      ? "bg-white text-purple-700"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-purple-100 transition`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    activeTab === "reviews"
                      ? "bg-white text-purple-700"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-purple-100 transition`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews ({reviews.length})
                </button>
              </div>
              {activeTab === "description" && product.description && (
                <div className="bg-purple-800 p-4 rounded-lg">
                  <p className="text-gray-200">{product.description}</p>
                </div>
              )}
              {activeTab === "reviews" && (
                <ReviewComponent productId={product._id} />
              )}
            </div>
            <RelatedProducts 
              currentProductId={product._id} 
              currentCategory={product.category || ""}
            />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;