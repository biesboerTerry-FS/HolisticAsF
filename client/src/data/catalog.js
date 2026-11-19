export const categories = [
  {
    name: "Herbs & Botanicals",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Teas & Tonics",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Superfoods",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Supplements",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pantry & Whole Foods",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Body & Wellness",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
  },
];

const img = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;

export const products = [
  // Herbs & Botanicals
  { id: "1", name: "Ashwagandha Root Powder", category: "Herbs & Botanicals", price: "$18.00", image: img("1608571423902-eed4a5ad8108") },
  { id: "2", name: "Organic Turmeric Blend", category: "Herbs & Botanicals", price: "$22.00", image: img("1615485500704-8e990f9900f7") },
  { id: "3", name: "Dried Lemongrass Leaves", category: "Herbs & Botanicals", price: "$11.50", image: img("1501004318641-b39e6451bec6") },
  { id: "4", name: "Wildcrafted Sage Bundle", category: "Herbs & Botanicals", price: "$9.00", image: img("1466692476868-aef1dfb1e735") },
  // Teas & Tonics
  { id: "5", name: "Peppermint Herbal Tea", category: "Teas & Tonics", price: "$12.50", image: img("1597318181409-cf64d0b5d8a2") },
  { id: "6", name: "Chamomile Calm Tea", category: "Teas & Tonics", price: "$13.00", image: img("1544787219-7f47ccb76574") },
  { id: "7", name: "Green Tea Matcha", category: "Teas & Tonics", price: "$19.50", image: img("1515823064-d6e0c04616a7") },
  { id: "8", name: "Ginger Tonic Elixir", category: "Teas & Tonics", price: "$15.00", image: img("1587049352851-8d4e89133924") },
  // Superfoods
  { id: "9", name: "Organic Chia Seeds", category: "Superfoods", price: "$14.00", image: img("1490645935967-10de6ba17061") },
  { id: "10", name: "Acai Berry Powder", category: "Superfoods", price: "$24.00", image: img("1512621776951-a57141f2eefd") },
  { id: "11", name: "Raw Cacao Nibs", category: "Superfoods", price: "$17.50", image: img("1546069901-ba9599a7e63c") },
  { id: "12", name: "Spirulina Powder", category: "Superfoods", price: "$21.00", image: img("1498837167922-ddd27525d352") },
  // Supplements
  { id: "13", name: "Daily Multivitamin", category: "Supplements", price: "$29.99", image: img("1556228720-195a672e8a03") },
  { id: "14", name: "Magnesium Glycinate", category: "Supplements", price: "$26.00", image: img("1584308666744-24d5c474f2ae") },
  { id: "15", name: "Vitamin D3 Drops", category: "Supplements", price: "$18.50", image: img("1476224203421-9ac39bcb3327") },
  { id: "16", name: "Probiotic Complex", category: "Supplements", price: "$32.00", image: img("1608248543803-ba4f8c70ae0b") },
  // Pantry & Whole Foods
  { id: "17", name: "Raw Wildflower Honey", category: "Pantry & Whole Foods", price: "$16.00", image: img("1587049352851-8d4e89133924") },
  { id: "18", name: "Cold-Pressed Olive Oil", category: "Pantry & Whole Foods", price: "$27.00", image: img("1542838132-92c53300491e") },
  { id: "19", name: "Organic Brown Rice", category: "Pantry & Whole Foods", price: "$12.00", image: img("1586201375761-83865001e31c") },
  { id: "20", name: "Almond Butter", category: "Pantry & Whole Foods", price: "$19.00", image: img("1512621776951-a57141f2eefd") },
  // Body & Wellness
  { id: "21", name: "Lavender Body Oil", category: "Body & Wellness", price: "$24.00", image: img("1608248543803-ba4f8c70ae0b") },
  { id: "22", name: "Eucalyptus Shower Steamers", category: "Body & Wellness", price: "$15.50", image: img("1540555700478-4be289fbecef") },
  { id: "23", name: "Rosehip Face Serum", category: "Body & Wellness", price: "$28.00", image: img("1556228720-195a672e8a03") },
  { id: "24", name: "Mineral Bath Soak", category: "Body & Wellness", price: "$20.00", image: img("1608571423902-eed4a5ad8108") },
];

// Web storefront products, derived from the same catalog the mobile app uses.
export const catalogProducts = products.map((product) => {
  const regular = Number(String(product.price).replace(/[^0-9.]/g, "")) || 0;
  return {
    ...product,
    _id: `catalog-${product.id}`,
    productId: `catalog-${product.id}`,
    externalId: `catalog-${product.id}`,
    upc: `catalog-${product.id}`,
    brand: "holisticAF",
    regularPrice: regular,
    offerPrice: regular,
    price: { regular, sale: regular },
    image: [product.image],
    stock: 100,
    source: "catalog",
  };
});

const categoryPaths = {
  "Herbs & Botanicals": "herbs-botanicals",
  "Teas & Tonics": "teas-tonics",
  Superfoods: "superfoods",
  Supplements: "supplements",
  "Pantry & Whole Foods": "pantry-whole-foods",
  "Body & Wellness": "body-and-wellness",
};

const subcategories = {
  "Herbs & Botanicals": ["Adaptogens", "Roots", "Leaves"],
  "Teas & Tonics": ["Green Tea", "Calming", "Herbal"],
  Superfoods: ["Seeds", "Powders", "Berries"],
  Supplements: ["Minerals", "Vitamins", "Gut Health"],
  "Pantry & Whole Foods": ["Grains", "Sweeteners", "Oils"],
  "Body & Wellness": ["Aromatherapy", "Bath", "Skin"],
};

export const catalogCategories = categories.map((category) => ({
  text: category.name,
  path: categoryPaths[category.name] || category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  image: category.image,
  subcategories: (subcategories[category.name] || []).map((text) => ({
    text,
    path: text.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  })),
}));
