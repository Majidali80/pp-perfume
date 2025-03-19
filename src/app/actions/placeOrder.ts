"use server";

import { client } from "@/sanity/lib/client";

interface OrderData {
  orderDate: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    address2?: string;
    city: string;
    country: string;
    notes?: string;
  };
  cartItems: {
    _id: string; // Assuming this is the product ID
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  couponDiscount: number;
  total: number;
  paymentMethod: string;
}

export async function placeOrder(orderData: OrderData) {
  const sanityOrder = {
    _type: "order",
    orderDate: orderData.orderDate,
    status: "pending",
    customer: {
      firstName: orderData.customer.firstName,
      lastName: orderData.customer.lastName,
      email: orderData.customer.email,
      phone: orderData.customer.phone,
      address: {
        street1: orderData.customer.address1,
        street2: orderData.customer.address2 || "",
        city: orderData.customer.city,
        country: orderData.customer.country,
      },
    },
    items: orderData.cartItems.map((item) => ({
      product: { _type: "reference", _ref: item._id },
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal: orderData.subtotal,
    shipping: orderData.shipping,
    discount: orderData.couponDiscount,
    total: orderData.total,
    paymentMethod: orderData.paymentMethod,
    notes: orderData.customer.notes || "",
  };

  try {
    const result = await client.create(sanityOrder);
    return { success: true, order: result };
  } catch (error: unknown) {
    console.error("Error placing order in server action:", error);
    
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to place order");
    }
  }
}