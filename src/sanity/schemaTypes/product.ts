import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Sub Title',
      type: 'text',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'fabricType',
      title: 'Fabric Type',
      type: 'string',
    }),
    defineField({
      name: 'materials',
      title: 'Materials',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'sizeOption',
          title: 'Size Option',
          fields: [
            defineField({
              name: 'size',
              title: 'Size',
              type: 'string',
            }),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'number',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image' }],
    }),
    defineField({
      name: 'productImage',
      title: 'Product Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: "Men's", value: 'mens' },
          { title: "Women's", value: 'womens' },
          { title: 'Unisex', value: 'unisex' },
        ],
      },
    }),
    defineField({
      name: 'subCategory',
      title: 'Sub-Category',
      type: 'string',
      options: {
        list: [
          { title: 'Floral', value: 'floral' },
          { title: 'Woody', value: 'woody' },
          { title: 'Oriental', value: 'oriental' },
          { title: 'Citrus', value: 'citrus' },
          { title: 'Fruity', value: 'fruity' },
          { title: 'Aromatic', value: 'aromatic' },
          { title: 'Aquatic', value: 'aquatic' },
          { title: 'Gourmand', value: 'gourmand' },
        ],
      },
    }),
    defineField({
      name: 'occasion',
      title: 'Occasion',
      type: 'string',
      options: {
        list: [
          { title: 'Casual', value: 'casual' },
          { title: 'Evening', value: 'evening' },
          { title: 'Formal', value: 'formal' },
          { title: 'Special Occasion', value: 'special_occasion' },
          { title: 'Seasonal', value: 'seasonal' },
        ],
      },
    }),
    defineField({
      name: 'usage_type',
      title: 'Usage Type',
      type: 'string',
      options: {
        list: [
          { title: 'Perfume Oils', value: 'perfume_oils' },
          { title: 'Sprays', value: 'sprays' },
          { title: 'Deodorants', value: 'deodorants' },
        ],
      },
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
      options: {
        list: [
          { title: 'Luxury', value: 'luxury' },
          { title: 'Designer', value: 'designer' },
          { title: 'Niche', value: 'niche' },
          { title: 'Celebrity', value: 'celebrity' },
        ],
      },
    }),
    defineField({
      name: 'inventory',
      title: 'Inventory',
      type: 'number',
    }),
    defineField({
      name: 'colors',
      title: 'Colors',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'discountPercentage',
      title: 'Discount Percentage',
      type: 'number',
    }),
    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'string',
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
    }),
    defineField({
      name: 'dateAdded',
      title: 'Date Added',
      type: 'string',
    }),
    defineField({
      name: 'shippingInformation',
      title: 'Shipping Information',
      type: 'string',
    }),
    defineField({
      name: 'specialOffers',
      title: 'Special Offers',
      type: 'text',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    
    defineField({
      name: 'stockQuantity',
      title: 'Stock Quantity',
      type: 'number',
    }),
    defineField({
      name: 'isNewArrival',
      title: 'Is New Arrival',
      type: 'boolean',
    }),
    defineField({
      name: 'isBestSeller',
      title: 'Is Best Seller',
      type: 'boolean',
    }),
    defineField({
      name: 'productName',
      title: 'Product Name',
      type: 'string',
    }),
    {
      name: "review",
      type: "document",
      fields: [
        { name: "productId", type: "string" },
        { name: "rating", type: "number", validation: (Rule) => Rule.required().min(1).max(5) },
        { name: "comment", type: "text", validation: (Rule) => Rule.required() },
        { name: "userName", type: "string", validation: (Rule) => Rule.required() },
        { name: "createdAt", type: "datetime", initialValue: () => new Date().toISOString() },
      ],
    }
  ],
});
