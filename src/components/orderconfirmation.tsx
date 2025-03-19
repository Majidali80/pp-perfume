"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { urlFor } from "../sanity/lib/client";
import Image from "next/image";
import { FaDownload, FaPhone, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { jsPDF } from "jspdf";

interface OrderDetails {
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
    notes: string;
  };
  paymentMethod: string;
  cartItems: Array<{
    _id: string;
    title: string;
    price: number;
    discountPercentage?: number;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  shipping: number;
  couponDiscount: number;
  donation: number;
  total: number;
  orderDate: string;
}

const OrderConfirmation: React.FC<{ orderDetails: OrderDetails }> = ({ orderDetails }) => {
  const router = useRouter();

  // Function to get discounted price for cart items
  const getDiscountedPrice = (price: number, discountPercentage?: number) => {
    return discountPercentage ? price - price * (discountPercentage / 100) : price;
  };

  // Calculate estimated delivery date (7 days from order date)
  const orderDate = new Date(orderDetails.orderDate);
  const estimatedDeliveryDate = new Date(orderDate);
  estimatedDeliveryDate.setDate(orderDate.getDate() + 7);

  // Generate and download PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let y = margin;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(128, 34, 206); // Purple color for title
    doc.text("Order Confirmation", pageWidth / 2, y, { align: "center" });
    y += 10;

    // Order Number
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black for content
    doc.text(`Order Number: ${orderDetails.orderNumber}`, margin, y);
    y += 10;

    // Customer Details
    doc.setFontSize(14);
    doc.text("Customer Details", margin, y);
    y += 5;
    doc.setFontSize(10);
    doc.text(`Name: ${orderDetails.customer.firstName} ${orderDetails.customer.lastName}`, margin, y);
    y += 5;
    doc.text(`Email: ${orderDetails.customer.email}`, margin, y);
    y += 5;
    doc.text(`Phone: ${orderDetails.customer.phone}`, margin, y);
    y += 5;
    doc.text(
      `Shipping Address: ${orderDetails.customer.address1}${
        orderDetails.customer.address2 ? `, ${orderDetails.customer.address2}` : ""
      }, ${orderDetails.customer.city}, ${orderDetails.customer.country}`,
      margin,
      y
    );
    y += 10;

    // Order Details
    doc.setFontSize(14);
    doc.text("Order Details", margin, y);
    y += 5;
    doc.setFontSize(10);
    doc.text(`Order Date: ${orderDate.toLocaleDateString()}`, margin, y);
    y += 5;
    doc.text(`Estimated Delivery: ${estimatedDeliveryDate.toLocaleDateString()}`, margin, y);
    y += 5;
    doc.text(
      `Payment Method: ${
        orderDetails.paymentMethod === "credit_card"
          ? "Credit/Debit Card"
          : orderDetails.paymentMethod === "cod"
          ? "Cash on Delivery"
          : "EasyPaisa"
      }`,
      margin,
      y
    );
    y += 10;

    // Purchased Items
    doc.setFontSize(14);
    doc.text("Purchased Items", margin, y);
    y += 5;
    doc.setFontSize(10);
    orderDetails.cartItems.forEach((item) => {
      const discountedPrice = getDiscountedPrice(item.price, item.discountPercentage || 0);
      doc.text(
        `${item.title} (Qty: ${item.quantity}) - Rs. ${(discountedPrice * item.quantity).toFixed(2)}`,
        margin,
        y
      );
      y += 5;
    });
    y += 10;

    // Order Summary
    doc.setFontSize(14);
    doc.text("Order Summary", margin, y);
    y += 5;
    doc.setFontSize(10);
    doc.text(`Subtotal: Rs. ${orderDetails.subtotal.toFixed(2)}`, margin, y);
    y += 5;
    doc.text(
      `Shipping: ${orderDetails.shipping === 0 ? "Free" : `Rs. ${orderDetails.shipping.toFixed(2)}`}`,
      margin,
      y
    );
    y += 5;
    if (orderDetails.couponDiscount > 0) {
      doc.text(`Coupon Discount: - Rs. ${orderDetails.couponDiscount.toFixed(2)}`, margin, y);
      y += 5;
    }
    if (orderDetails.donation > 0) {
      doc.text(`Support Us (Buy Us a Tea): + Rs. ${orderDetails.donation.toFixed(2)}`, margin, y);
      y += 5;
    }
    doc.setFontSize(12);
    doc.text(`Total: Rs. ${orderDetails.total.toFixed(2)}`, margin, y);

    // Download the PDF
    doc.save(`Order_Confirmation_${orderDetails.orderNumber}.pdf`);
  };

  return (
    <div className="container mx-auto p-6 mt-16 bg-gradient-to-br from-purple-700 to-purple-400 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-purple-200 mb-6 text-center">Order Confirmation</h1>
      <div className="bg-purple-800 p-6 rounded-lg shadow-lg">
        {/* Order Confirmation Message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-purple-200">Thank You for Your Order!</h2>
          <p className="text-gray-200 mt-2">
            Your order has been successfully placed. We’ve sent a confirmation email to{" "}
            <span className="text-purple-200">{orderDetails.customer.email}</span>.
            If you don’t see it in your inbox, please check your spam/junk folder or contact support.
          </p>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Details */}
          <div>
            <h3 className="text-xl font-semibold text-purple-200 mb-4">Customer Details</h3>
            <p className="text-gray-200">
              <strong>Name:</strong> {orderDetails.customer.firstName} {orderDetails.customer.lastName}
            </p>
            <p className="text-gray-200">
              <strong>Email:</strong> {orderDetails.customer.email}
            </p>
            <p className="text-gray-200">
              <strong>Phone:</strong> {orderDetails.customer.phone}
            </p>
            <p className="text-gray-200">
              <strong>Shipping Address:</strong> {orderDetails.customer.address1}
              {orderDetails.customer.address2 && `, ${orderDetails.customer.address2}`}, {orderDetails.customer.city}, {orderDetails.customer.country}
            </p>
            {orderDetails.customer.notes && (
              <p className="text-gray-200">
                <strong>Additional Notes:</strong> {orderDetails.customer.notes}
              </p>
            )}
          </div>

          {/* Order Details */}
          <div>
            <h3 className="text-xl font-semibold text-purple-200 mb-4">Order Details</h3>
            <p className="text-gray-200">
              <strong>Order Number:</strong> {orderDetails.orderNumber}
            </p>
            <p className="text-gray-200">
              <strong>Order Date:</strong> {orderDate.toLocaleDateString()}
            </p>
            <p className="text-gray-200">
              <strong>Estimated Delivery:</strong> {estimatedDeliveryDate.toLocaleDateString()}
            </p>
            <p className="text-gray-200">
              <strong>Payment Method:</strong>{" "}
              {orderDetails.paymentMethod === "credit_card"
                ? "Credit/Debit Card"
                : orderDetails.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "EasyPaisa"}
            </p>
            <p className="text-gray-200 mt-4">
              <strong>Download Invoice:</strong>{" "}
              <button
                onClick={generatePDF}
                className="text-purple-200 hover:underline flex items-center gap-1"
              >
                <FaDownload /> Download PDF
              </button>
            </p>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-purple-200 mb-4">Purchased Items</h3>
          <div className="space-y-4">
            {orderDetails.cartItems.map((item) => {
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
                      <h4 className="text-lg font-medium text-purple-200">{item.title}</h4>
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
        </div>

        {/* Order Summary */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-purple-200 mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-200">Subtotal:</span>
              <span className="text-gray-200">Rs. {orderDetails.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-200">Shipping:</span>
              <span className="text-gray-200">{orderDetails.shipping === 0 ? "Free" : `Rs. ${orderDetails.shipping.toFixed(2)}`}</span>
            </div>
            {orderDetails.couponDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-200">Coupon Discount:</span>
                <span className="text-green-400">- Rs. {orderDetails.couponDiscount.toFixed(2)}</span>
              </div>
            )}
            {orderDetails.donation > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-200">Support Us (Buy Us a Tea):</span>
                <span className="text-green-400">+ Rs. {orderDetails.donation.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-purple-400 pt-2">
              <span className="text-lg font-semibold text-purple-200">Total:</span>
              <span className="text-lg font-semibold text-purple-200">Rs. {orderDetails.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer Support */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-purple-200 mb-4">Need Help?</h3>
          <p className="text-gray-200">If you have any questions or need assistance, feel free to contact us:</p>
          <p className="text-gray-200 flex items-center gap-2 mt-2">
            <FaPhone /> <span>+92-123-456-7890</span>
          </p>
          <p className="text-gray-200 flex items-center gap-2 mt-1">
            <FaEnvelope /> <span>support@yourstore.com</span>
          </p>
          <p className="text-gray-200 flex items-center gap-2 mt-1">
            <FaWhatsapp />
            <a
              href="https://wa.me/+921234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-purple-200"
            >
              +92-123-456-7890
            </a>
          </p>
        </div>

        {/* Back to Home Button */}
        <button
          onClick={() => router.push("/")}
          className="w-full mt-8 py-3 bg-purple-400 text-white rounded-lg hover:bg-purple-500 transition duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;