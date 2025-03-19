import type { NextApiRequest, NextApiResponse } from "next";
import emailjs from "@emailjs/browser";

interface CartItem {
  title: string;
  quantity: number;
  price: number;
  discountPercentage?: number; // Optional if not all items have a discount
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { orderDetails } = req.body;
    const orderDate = new Date(orderDetails.orderDate);
    const estimatedDeliveryDate = new Date(orderDate);
    estimatedDeliveryDate.setDate(orderDate.getDate() + 7);

    try {
      await emailjs.send(
        "service_kqtecnn",
        "template_4tryg19",
        {
          order_number: orderDetails.orderNumber,
          customer_name: `${orderDetails.customer.firstName} ${orderDetails.customer.lastName}`,
          customer_email: orderDetails.customer.email,
          order_date: orderDate.toLocaleDateString(),
          estimated_delivery: estimatedDeliveryDate.toLocaleDateString(),
          payment_method:
            orderDetails.paymentMethod === "credit_card"
              ? "Credit/Debit Card"
              : orderDetails.paymentMethod === "cod"
              ? "Cash on Delivery"
              : "EasyPaisa",
          subtotal: orderDetails.subtotal.toFixed(2),
          shipping: orderDetails.shipping === 0 ? "Free" : `Rs. ${orderDetails.shipping.toFixed(2)}`,
          coupon_discount: orderDetails.couponDiscount.toFixed(2),
          donation: orderDetails.donation.toFixed(2),
          total: orderDetails.total.toFixed(2),
          products: orderDetails.cartItems
            .map((item: CartItem) =>
              `${item.title} (Qty: ${item.quantity}) - Rs. ${(
                (item.price - (item.price * (item.discountPercentage || 0)) / 100) *
                item.quantity
              ).toFixed(2)}`
            )
            .join("\n"),
        },
        "H357zAP8V__yP5H8e"
      );
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Failed to send email via API:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}