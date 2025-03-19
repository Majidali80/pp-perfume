import { client } from './client'; // Adjust the path if needed

// This function fetches the discount percentage for a product from Sanity
export const fetchProductDiscount = async (productId: string) => {
  const query = `*[_id == $productId]{
    discount
  }`;

  const params = { productId };
  
  const result = await client.fetch(query, params);

  // Assuming your product has a 'discount' field (a percentage)
  return result?.[0]?.discount || 0; // If no discount is found, return 0
};
