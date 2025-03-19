import { defineType, defineField } from 'sanity';

export default defineType ({
    name: "review",
    title: "Review",
    type: "document",
    fields: [
      {
        name: "productId",
        title: "Product ID",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "rating",
        title: "Rating",
        type: "number",
        validation: (Rule) => Rule.required().min(1).max(5),
      },
      {
        name: "comment",
        title: "Comment",
        type: "text",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "userName",
        title: "User Name",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "createdAt",
        title: "Created At",
        type: "datetime",
        options: {
          dateFormat: "YYYY-MM-DD",
          timeFormat: "HH:mm",
        },
        validation: (Rule) => Rule.required(),
      },
    ],

}
)