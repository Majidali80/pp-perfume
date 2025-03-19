// utils/types.tsx
export interface Product {
  _id: string;
  productName: string;
  title: string;
  image: {
    length: number;
    map(arg0: (image: import("@sanity/image-url/lib/types/types").SanityImageSource, index: import("react").Key | null | undefined) => import("react").JSX.Element): import("react").ReactNode | Iterable<import("react").ReactNode>;
    slice(arg0: number, arg1: number): unknown;
    asset: {
      url: string;
    };
  };
  price: number;
  description: string;
  fabricType: string;
  materials: string[];
  dimensions: string;
  sizes: { size: string; price: number }[];
  tags: string[];
  category: string;
  inventory: number;
  colors: string[];
  discountPercentage: number;
  careInstructions: string;
  availability: string;
  customerReviews: string[];
  dateAdded: string;
  shippingInformation: string;
  specialOffers: string;
  slug: {
    _type: "slug";
    current: string;
  };

  productImage?: string;
  // Adding optional fields for the cart context
  selectedSize: string;
  quantity: number;
}

export type cart = {
  _id: string; // Changed from id: number to _id: string to match Product and Sanity
  title: string;
  image: { asset: { url: string } };
  slug: string;
  price: number;
  category: string;
  selectedSize: string;
  quantity: number;
  discountPercentage: number;
  discount?: (price: number, discount: number) => number;
};

export interface Review {
  _id: string;
  productId: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}