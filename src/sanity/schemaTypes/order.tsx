import { defineType } from "sanity";

export const order = defineType({
    name: "order",
    title: "Order",
    type: "document",
    fields: [
        {
            name: "orderNumber",
            title: "Order Number",
            type: "string",
            validation: (rule) => rule.required(),
        },
        {
            name: "orderDate",
            title: "Order Date",
            type: "datetime",
            validation: (rule) => rule.required(),
        },
        {
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Pending", value: "pending" },
                    { title: "Dispatch", value: "dispatch" },
                    { title: "Completed", value: "completed" },
                ],
                layout: "radio",
            },
            validation: (rule) => rule.required(),
        },
        {
            name: "customer",
            title: "Customer",
            type: "object",
            fields: [
                {
                    name: "firstName",
                    type: "string",
                    title: "First Name",
                    validation: (rule) => rule.required(),
                },
                {
                    name: "lastName",
                    type: "string",
                    title: "Last Name",
                    validation: (rule) => rule.required(),
                },
                {
                    name: "email",
                    type: "string",
                    title: "Email",
                    validation: (rule) => rule.required().email(),
                },
                {
                    name: "phone",
                    type: "string",
                    title: "Phone",
                    validation: (rule) => rule.required(),
                },
                {
                    name: "address",
                    title: "Address",
                    type: "object",
                    fields: [
                        {
                            name: "street1",
                            type: "string",
                            title: "Street Address 1",
                            validation: (rule) => rule.required(),
                        },
                        {
                            name: "street2",
                            type: "string",
                            title: "Street Address 2",
                        },
                        {
                            name: "city",
                            type: "string",
                            title: "City",
                            validation: (rule) => rule.required(),
                        },
                        {
                            name: "country",
                            type: "string",
                            title: "Country",
                            validation: (rule) => rule.required(),
                        },
                    ],
                },
            ],
        },
        {
            name: "items",
            title: "Items",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "product",
                            title: "Product",
                            type: "reference",
                            to: [{ type: "product" }],
                            validation: (rule) => rule.required(),
                        },
                        {
                            name: "quantity",
                            title: "Quantity",
                            type: "number",
                            validation: (rule) => rule.required().min(1),
                        },
                        {
                            name: "price",
                            title: "Price",
                            type: "number",
                            validation: (rule) => rule.required().min(0),
                        },
                    ],
                },
            ],
        },
        {
            name: "subtotal",
            title: "Subtotal",
            type: "number",
            validation: (rule) => rule.required(),
        },
        {
            name: "shipping",
            title: "Shipping",
            type: "number",
            validation: (rule) => rule.required(),
        },
        {
            name: "discount",
            title: "Discount",
            type: "number",
            validation: (rule) => rule.required(),
        },
        {
            name: "total",
            title: "Total",
            type: "number",
            validation: (rule) => rule.required(),
        },
        {
            name: "paymentMethod",
            title: "Payment Method",
            type: "string",
            options: {
                list: [
                    { title: "Credit Card", value: "credit_card" },
                    { title: "Cash on Delivery", value: "cash_on_delivery" },
                    { title: "EasyPaisa", value: "easypaisa" }, // Added EasyPaisa to match CheckoutPage
                ],
            },
            validation: (rule) => rule.required(),
        },
        {
            name: "notes",
            title: "Notes",
            type: "text",
        },
    ],
});