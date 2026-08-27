export const MOCK_PRODUCTS = [
  {
    _id: "p_001",
    name: "Sunny Day Potted",
    description: "Brighten any room with this cheerful little friend.",
    images: ["https://placehold.co/160x160/png"],
    base_price: 32,
    product_type: "single_item",
    is_active: true,
  },
  {
    _id: "p_002",
    name: "Blush Peony Bouquet",
    description: "Soft pink peonies wrapped in kraft paper",
    images: ["https://placehold.co/160x160/png"],
    base_price: 48,
    product_type: "single_item",
    is_active: true,
  },
  {
    _id: "p_003",
    name: "Evergreen Table Vase",
    description: "A quiet green centrepiece for everyday tables.",
    images: ["https://placehold.co/160x160/png"],
    base_price: 26,
    product_type: "single_item",
    is_active: true,
  },
];

export function addToCart(items, product) {
  const existing = items.find((i) => i.product_id === product._id);
 
  if (existing) {
    return items.map((i) =>
      i.product_id === product._id ? { ...i, quantity: i.quantity + 1 } : i
    );
  }
 
  return [
    ...items,
    {
      product_id: product._id,
      item_type: "standard_product",
      name: product.name,
      description: product.description,
      images: product.images,
      unit_price: product.base_price,
      quantity: 1,
    },
  ];
}



