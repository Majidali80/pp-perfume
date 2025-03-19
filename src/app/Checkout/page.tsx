"use client";

import React, { useState } from "react";
import { useCart } from "../context/cartContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { urlFor } from "../../sanity/lib/client";
import Image from "next/image";
import { FaTruck, FaCreditCard, FaMoneyBillWave, FaWallet, FaHeart } from "react-icons/fa";
import OrderConfirmation from "@/components/orderconfirmation";
import { client } from "../../sanity/lib/client"; // Updated client import

interface OrderData {
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    address1: string;
    address2: string;
    city: string;
    country: string;
    phone: string;
    notes?: string;
    subscribe: boolean;
  };
  paymentMethod: string;
  cartItems: any[];
  subtotal: number;
  shipping: number;
  couponDiscount: number;
  donation: number;
  total: number;
  orderDate: string;
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    country: "Pakistan",
    phone: "",
    notes: "",
    subscribe: false,
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [addDonation, setAddDonation] = useState(false);
  const [donationPercentage, setDonationPercentage] = useState(2);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderData | null>(null);

  const getDiscountedPrice = (price: number, discountPercentage?: number) => {
    return discountPercentage ? price - price * (discountPercentage / 100) : price;
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const discountedPrice = getDiscountedPrice(item.price, item.discountPercentage || 0);
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  const estimateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 30000 ? 0 : subtotal >= 6000 ? 600 : 250;
  };

  const applyCoupon = () => {
    if (couponApplied) {
      Swal.fire("Error", "Coupon already applied!", "error");
      return;
    }
    if (couponCode.toUpperCase() === "SAVE10") {
      const subtotal = calculateSubtotal();
      const discount = subtotal * 0.10;
      setCouponDiscount(discount);
      setCouponApplied(true);
      Swal.fire("Success", `Coupon applied! Rs. ${discount.toFixed(2)} discount added.`, "success");
    } else {
      Swal.fire("Error", "Invalid coupon code. Try 'SAVE10' for 10% off.", "error");
    }
  };

  const removeCoupon = () => {
    setCouponDiscount(0);
    setCouponApplied(false);
    setCouponCode("");
    Swal.fire("Success", "Coupon removed!", "info");
  };

  const calculateDonation = () => {
    if (!addDonation) return 0;
    const subtotal = calculateSubtotal();
    return (subtotal * donationPercentage) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = estimateShipping();
    const donation = calculateDonation();
    return subtotal + shipping - couponDiscount + donation;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const generateOrderNumber = () => {
    const randomNum = Math.floor(Math.random() * 1000000);
    return `ORD-${randomNum}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address1 || !formData.city || !formData.phone) {
      Swal.fire("Error", "Please fill out all required fields", "error");
      return;
    }

    if (!paymentMethod) {
      Swal.fire("Error", "Please select a payment method", "error");
      return;
    }

    const orderData: OrderData = {
      orderNumber: generateOrderNumber(),
      customer: formData,
      paymentMethod: paymentMethod === "cod" ? "cash_on_delivery" : paymentMethod,
      cartItems: cart,
      subtotal: calculateSubtotal(),
      shipping: estimateShipping(),
      couponDiscount,
      donation: calculateDonation(),
      total: calculateTotal(),
      orderDate: new Date().toISOString(),
    };

    setOrderDetails(orderData);
    setShowOrderConfirmation(true);
    clearCart();
    placeOrder(orderData);
  };

  const placeOrder = async (orderData: OrderData) => {
    try {
      // Validate product references
      const validCartItems = await Promise.all(
        orderData.cartItems.map(async (item) => {
          const product = await client.fetch(`*[_type == "product" && _id == $id][0]`, { id: item._id });
          if (!product) {
            throw new Error(`Invalid product ID: ${item._id}`);
          }
          return {
            _key: item._id,
            product: { _type: "reference", _ref: item._id },
            quantity: item.quantity,
            price: item.price,
          };
        })
      );

      const sanityOrder = {
        _type: "order",
        orderNumber: orderData.orderNumber,
        orderDate: orderData.orderDate,
        status: "pending",
        customer: {
          firstName: orderData.customer.firstName,
          lastName: orderData.customer.lastName,
          email: orderData.customer.email,
          phone: orderData.customer.phone,
          address: {
            street1: orderData.customer.address1,
            street2: orderData.customer.address2 || undefined,
            city: orderData.customer.city,
            country: orderData.customer.country,
          },
          subscribe: orderData.customer.subscribe,
        },
        items: validCartItems,
        paymentMethod: orderData.paymentMethod,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        discount: orderData.couponDiscount,
        total: orderData.total,
        notes: orderData.customer.notes || undefined,
      };

      // Log the order data before sending it to Sanity
      console.log("Order Data to be sent to Sanity:", JSON.stringify(sanityOrder, null, 2));

      const result = await client.create(sanityOrder);

      Swal.fire({
        title: "Order Placed!",
        html: `
          <div>
            <p>Order ID: <strong>${result._id.substring(0, 8)}</strong></p>
            <p>Total Amount: Rs. ${orderData.total.toFixed(2)}</p>
            <p>Payment Method: ${orderData.paymentMethod}</p>
          </div>
        `,
        icon: "success",
      });

      // Reset form data
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        address1: "",
        address2: "",
        city: "",
        country: "Pakistan",
        phone: "",
        notes: "",
        subscribe: false,
      });
    } catch (error: any) {
      console.error("Error placing order:", error);
      console.error("Error details:", error.message, error.status, error.response);

      let errorMessage = "Failed to place order. Please try again.";
      if (error.message.includes("Invalid reference") || error.message.includes("Invalid product ID")) {
        errorMessage = "Invalid product in cart. Please remove invalid items and try again.";
      } else if (error.message.includes("Cart is empty")) {
        errorMessage = "Your cart is empty. Please add items to proceed.";
      } else if (error.message.includes("network")) {
        errorMessage = "Network error. Please check your internet connection.";
      }

      Swal.fire("Error", errorMessage, "error");
    }
  };

  if (showOrderConfirmation && orderDetails) {
    return <OrderConfirmation orderDetails={orderDetails} />;
  }

  return (
    // [Rest of the JSX remains unchanged]
    <div className="container mx-auto p-6 mt-16 bg-gradient-to-br from-purple-700 to-purple-400 text-white">
      <h1 className="text-3xl font-bold text-purple-200 mb-6">Checkout</h1>
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-purple-200">1. Delivery Details</span>
          <span className="text-gray-200">2. Order Summary</span>
          <span className="text-gray-200">3. Payment</span>
        </div>
        <div className="w-full bg-purple-800 h-2 rounded-full mt-2">
          <div className="bg-purple-400 h-2 rounded-full transition-all duration-300" style={{ width: "33.33%" }}></div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-purple-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-purple-200 mb-6">Delivery Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="p-2 border border-purple-400 rounded-lg bg-purple-900 text-white"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="p-2 border border-purple-400 rounded-lg bg-purple-900 text-white"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 border border-purple-400 rounded-lg bg-purple-900 text-white"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="address1"
              placeholder="Address Line 1"
              className="w-full p-2 border border-purple-400 rounded-lg bg-purple-900 text-white"
              value={formData.address1}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="address2"
              placeholder="Address Line 2 (Optional)"
              className="w-full p-2 border border-purple-400 rounded-lg bg-purple-900 text-white"
              value={formData.address2}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              className="w-full p-2 border border-purple-400 rounded-lg bg-purple-900 text-white"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
            <select
              name="country"
              className="w-full p-2 border border-purple-400 rounded-lg bg-purple-900 text-white"
              value={formData.country}
              onChange={handleInputChange}
              required
            >
              <option value="Pakistan">Pakistan</option>
              <option value="USA">United States</option>
              <option value="UK">United Kingdom</option>
            </select>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="w-full p-2 border border-purple-400 rounded-lg bg-purple-900 text-white"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="notes"
              placeholder="Additional Notes (Optional)"
              className="w-full p-2 border border-purple-400 rounded-lg bg-purple-900 text-white h-24"
              value={formData.notes}
              onChange={handleInputChange}
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                name="subscribe"
                checked={formData.subscribe}
                onChange={handleInputChange}
                className="mr-2 accent-purple-400"
              />
              <label htmlFor="subscribe" className="text-sm text-gray-200">
                Subscribe to our newsletter
              </label>
            </div>
          </form>
        </div>
        <div className="bg-purple-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-purple-200 mb-6">Order Summary</h2>
          <div className="space-y-4">
            {cart.map((item) => {
              const discountedPrice = getDiscountedPrice(item.price, item.discountPercentage || 0);
              return (
                <div key={item._id} className="flex items-center justify-between border-b border-purple-400 pb-4">
                  <div className="flex items-center space-x-4">
                    {item.image ? (
                      <Image
                        src={urlFor(item.image).url()}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="object-cover rounded-md border border-purple-400"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-purple-900 flex justify-center items-center rounded-md border border-purple-400">
                        <span className="text-gray-200">No Image</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-purple-200">{item.title}</h3>
                      <p className="text-sm text-gray-200">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400 line-through">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-lg font-semibold text-purple-200">Rs. {(discountedPrice * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 p-4 border border-purple-400 rounded-lg bg-purple-900">
            <h3 className="text-xl font-semibold text-purple-200 mb-2 flex items-center gap-2">Coupon Code</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code (e.g., SAVE10)"
                className="p-2 rounded-lg border border-purple-400 bg-purple-900 text-white w-full"
                disabled={couponApplied}
              />
              {couponApplied ? (
                <button
                  onClick={removeCoupon}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={applyCoupon}
                  className="bg-purple-400 text-white py-2 px-4 rounded-lg hover:bg-purple-500 transition"
                >
                  Apply
                </button>
              )}
            </div>
            {couponApplied && <p className="text-green-400 mt-2">Discount applied: Rs. {couponDiscount.toFixed(2)}</p>}
          </div>
          <div className="mt-6 p-4 border border-purple-400 rounded-lg bg-purple-900">
            <h3 className="text-xl font-semibold text-purple-200 mb-2 flex items-center gap-2">
              <FaHeart /> Support Us - Buy Us a Tea
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={addDonation}
                onChange={(e) => setAddDonation(e.target.checked)}
                className="accent-purple-400"
              />
              <label className="text-gray-200">Add a small gesture to your order</label>
            </div>
            {addDonation && (
              <div className="mt-2">
                <label className="text-gray-200 mr-2">Select Percentage:</label>
                <select
                  value={donationPercentage}
                  onChange={(e) => setDonationPercentage(Number(e.target.value))}
                  className="p-2 border border-purple-400 rounded-lg bg-purple-900 text-white"
                >
                  <option value={2}>2% (Rs. {(calculateSubtotal() * 0.02).toFixed(2)})</option>
                  <option value={3}>3% (Rs. {(calculateSubtotal() * 0.03).toFixed(2)})</option>
                  <option value={4}>4% (Rs. {(calculateSubtotal() * 0.04).toFixed(2)})</option>
                  <option value={5}>5% (Rs. {(calculateSubtotal() * 0.05).toFixed(2)})</option>
                  <option value={6}>6% (Rs. {(calculateSubtotal() * 0.06).toFixed(2)})</option>
                </select>
              </div>
            )}
            {addDonation && <p className="text-green-400 mt-2">Added: Rs. {calculateDonation().toFixed(2)}</p>}
          </div>
          <div className="mt-6 p-4 border border-purple-400 rounded-lg bg-purple-900">
            <h3 className="text-xl font-semibold text-purple-200 mb-4 flex items-center gap-2">
              <FaTruck /> Shipping
            </h3>
            <p className="text-gray-200">{estimateShipping() === 0 ? "Free Shipping" : `Rs. ${estimateShipping()}`}</p>
          </div>
          <div className="flex justify-between items-center border-t border-purple-400 pt-6">
            <span className="text-lg font-semibold text-purple-200">Total:</span>
            <span className="text-xl font-bold text-purple-200">Rs. {calculateTotal().toFixed(2)}</span>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-purple-200 mb-4">Payment Method</h3>
            <div className="space-y-4">
              <button
                onClick={() => setPaymentMethod("credit_card")}
                className={`w-full p-4 border border-purple-400 rounded-lg flex items-center gap-2 ${
                  paymentMethod === "credit_card" ? "bg-purple-600" : "bg-purple-900"
                } hover:bg-purple-700 transition`}
              >
                <FaCreditCard /> Credit/Debit Card
              </button>
              <button
                onClick={() => setPaymentMethod("cod")}
                className={`w-full p-4 border border-purple-400 rounded-lg flex items-center gap-2 ${
                  paymentMethod === "cod" ? "bg-purple-600" : "bg-purple-900"
                } hover:bg-purple-700 transition`}
              >
                <FaMoneyBillWave /> Cash on Delivery
              </button>
              <button
                onClick={() => setPaymentMethod("easypaisa")}
                className={`w-full p-4 border border-purple-400 rounded-lg flex items-center gap-2 ${
                  paymentMethod === "easypaisa" ? "bg-purple-600" : "bg-purple-900"
                } hover:bg-purple-700 transition`}
              >
                <FaWallet /> EasyPaisa
              </button>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full mt-6 py-3 bg-purple-400 text-white rounded-lg hover:bg-purple-500 transition duration-300"
          >
            Place Order
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full mt-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}