"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/cartContext";
import Swal from "sweetalert2";
import { urlFor } from "../../sanity/lib/client";
import Image from "next/image";
import { AiOutlineHeart } from "react-icons/ai"; // For "Save for Later"
import { BsCartPlus } from "react-icons/bs"; // For "Continue Shopping"

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Function to get the discounted price for an item
  const getDiscountedPrice = (price: number, discountPercentage: number) => {
    return price - (price * (discountPercentage / 100));
  };

  // Calculate subtotal (before shipping and coupon discount)
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const discountedPrice = getDiscountedPrice(item.price, item.discountPercentage || 0);
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  // Estimate shipping
  const estimateShipping = () => {
    const originalTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    return originalTotal >= 30000 ? 0 : originalTotal >= 7000 ? 600 : 250;
  };

  // Calculate total with shipping and coupon discount
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = estimateShipping();
    const couponDiscount = (subtotal * discount) / 100;
    return subtotal + shipping - couponDiscount;
  };

  // Gift scheme logic
  const GIFT_THRESHOLD = 10000; // Rs. 10,000
  const subtotal = calculateSubtotal();
  const isEligibleForGift = subtotal >= GIFT_THRESHOLD;
  const remainingForGift = GIFT_THRESHOLD - subtotal;

  // Estimated delivery date (example: 3-5 days from today)
  const getEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today.setDate(today.getDate() + 4)); // Approx 3-5 days
    return deliveryDate.toLocaleDateString();
  };

  const handleCheckout = () => {
    Swal.fire({
      title: "Proceed to Checkout?",
      text: "Are you sure you want to proceed to the checkout page?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FFD700", // Matches gold-500
      cancelButtonColor: "#DC2626", // Matches red-700
      confirmButtonText: "Yes, Proceed!",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/Checkout");
      }
    });
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "dis10") {
      setDiscount(10); // 10% discount
      Swal.fire({
        icon: "success",
        title: "Coupon Applied!",
        text: "You've received a 10% discount!",
        confirmButtonColor: "#FFD700",
        timer: 2000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Coupon",
        text: "Please enter a valid coupon code.",
        confirmButtonColor: "#FFD700",
      });
    }
  };

  const saveForLater = (itemId: string) => {
    removeFromCart(itemId);
    Swal.fire({
      icon: "info",
      title: "Saved for Later",
      text: "Item has been moved to Save for Later.",
      confirmButtonColor: "#FFD700",
      timer: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="container mx-auto p-4 sm:p-6 py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-500 mb-6 sm:mb-8">Your Cart</h1>

        {/* Cart Items and Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 bg-gray-900 rounded-lg shadow-lg p-4 sm:p-6">
            {cart.length === 0 ? (
              <p className="text-center text-gray-400">Your cart is empty.</p>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {cart.map((item) => {
                  const discountedPrice = getDiscountedPrice(item.price, item.discountPercentage || 0);
                  return (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-800 p-3 sm:p-4 rounded-lg"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full">
                        {item.image ? (
                          <Image
                            src={urlFor(item.image).url()}
                            alt={item.title}
                            width={80}
                            height={80}
                            className="object-cover rounded-md w-16 h-16 sm:w-20 sm:h-20"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-700 flex justify-center items-center rounded-md">
                            <span className="text-gray-400 text-xs sm:text-sm">No Image</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-medium text-white">{item.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-400">Qty: {item.quantity}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item._id, "decrease")}
                              className="px-2 py-1 sm:px-3 sm:py-1 bg-gold-500 rounded-md hover:bg-gold-600 transition text-xs sm:text-sm"
                            >
                              -
                            </button>
                            <span className="text-xs sm:text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, "increase")}
                              className="px-2 py-1 sm:px-3 sm:py-1 bg-gold-500 rounded-md hover:bg-gold-600 transition text-xs sm:text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-3 sm:mt-0 w-full sm:w-auto">
                        <div className="text-left sm:text-right">
                          <p className="text-xs sm:text-sm text-gray-500 line-through">
                            Rs. {(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-base sm:text-lg font-semibold text-gold-500">
                            Rs. {(discountedPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="px-2 py-1 sm:px-3 sm:py-1 bg-red-700 text-white rounded-md hover:bg-red-800 transition text-xs sm:text-sm"
                          >
                            Remove
                          </button>
                          <button
                            onClick={() => saveForLater(item._id)}
                            className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition flex items-center gap-1 text-xs sm:text-sm"
                          >
                            <AiOutlineHeart size={14} /> Save
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-900 rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gold-500 mb-4">Order Summary</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Subtotal</span>
                <span className="text-white text-sm sm:text-base">Rs. {calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Shipping</span>
                <span className="text-white text-sm sm:text-base">
                  {estimateShipping() === 0 ? "Free" : `Rs. ${estimateShipping()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Discount ({discount}%)</span>
                <span className="text-green-400 text-sm sm:text-base">
                  -Rs. {((calculateSubtotal() * discount) / 100).toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-3 sm:pt-4">
                <div className="flex justify-between font-bold">
                  <span className="text-base sm:text-lg">Total</span>
                  <span className="text-gold-500 text-base sm:text-lg">Rs. {calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Gift Scheme */}
            <div className="mt-4 p-3 sm:p-4 bg-gray-800 rounded-md">
              <h3 className="text-sm sm:text-base font-semibold text-gold-500 mb-2">Gift Scheme</h3>
              {isEligibleForGift ? (
                <p className="text-green-400 text-xs sm:text-sm">
                  🎉 Congratulations! You’re eligible for a <span className="font-semibold">free 30ml perfume</span>.
                </p>
              ) : (
                <p className="text-yellow-400 text-xs sm:text-sm">
                  Shop for Rs. {remainingForGift.toFixed(2)} more to claim a{" "}
                  <span className="font-semibold">free 30ml perfume</span>.
                </p>
              )}
            </div>

            {/* Coupon Section */}
            <div className="mt-4 sm:mt-6">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="w-full p-2 rounded-md text-gray-800 focus:outline-none text-sm sm:text-base"
              />
              <button
                onClick={applyCoupon}
                className="w-full mt-2 py-2 bg-gold-500 text-white rounded-md hover:bg-gold-600 transition text-sm sm:text-base"
              >
                Apply Coupon
              </button>
            </div>

            {/* Estimated Delivery */}
            <div className="mt-4 sm:mt-6 text-gray-400 text-xs sm:text-sm">
              <p>Estimated Delivery: {getEstimatedDelivery()}</p>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full mt-4 sm:mt-6 py-2 sm:py-3 bg-gold-500 text-white rounded-md hover:bg-gold-600 transition text-sm sm:text-base"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition text-sm sm:text-base w-full sm:w-auto"
          >
            <BsCartPlus size={16} /> Continue Shopping
          </button>
          <button
            onClick={() => {
              const cartUrl = window.location.href;
              const text = `Check out my cart: ${cartUrl}`;
              const shareUrl = `https://twitter.com/share?text=${encodeURIComponent(text)}`;
              window.open(shareUrl, "_blank");
            }}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition text-sm sm:text-base w-full sm:w-auto"
          >
            Share Cart
          </button>
        </div>
      </div>
    </div>
  );
}