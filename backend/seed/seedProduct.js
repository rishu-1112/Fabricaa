import "dotenv/config";
import Product from "../models/productModel.js";
import seedCatalog from "./seedCatalog.js";

const products = [
  {
    name: "Pure Cotton Handloom Fabric",
    description:
      "A soft, breathable cotton fabric woven on traditional handlooms. Perfect for daily wear and summer outfits.",
    category: "Cotton",
    material: "100% Handwoven Cotton",
    imageUrl: "https://www.fabvoguestudio.com/cdn/shop/files/pr-pco-0-ta08505-108-black-floral-flower-digital-printed-fabric-pure-cotton-1.jpg?v=1756765771&width=1050",
    gallery: [
      "https://www.fabvoguestudio.com/cdn/shop/files/pr-pco-0-ta08505-108-black-floral-flower-digital-printed-fabric-pure-cotton-2.jpg?v=1756765780&width=3840",
      "https://www.fabvoguestudio.com/cdn/shop/files/pr-pco-0-ta08505-108-black-floral-flower-digital-printed-fabric-pure-cotton-3.jpg?v=1756765787&width=3840",
    ],
    price: 899,
    discountPrice: 749,
    stockCount: 50,
    isFeatured: true,
    rating: 4.7,
    numReviews: 28,
  },
  {
    name: "Mulberry Silk Luxe Fabric",
    description:
      "Premium-grade Mulberry silk with a natural sheen and elegant drape. Ideal for sarees, gowns, and premium dresses.",
    category: "Silk",
    material: "100% Mulberry Silk",
    imageUrl: "https://www.fabvoguestudio.com/cdn/shop/files/pr-ks-0-ta07709a-110-attractive-multicolor-abstract-pattern-digital-printed-fabric-kora-silk-1.png?v=1756951719&width=1050",
    gallery: [
      "https://www.fabvoguestudio.com/cdn/shop/files/pr-ks-0-ta07709a-110-attractive-multicolor-abstract-pattern-digital-printed-fabric-kora-silk-2.png?v=1756951725&width=3840",
      "https://www.fabvoguestudio.com/cdn/shop/files/pr-ks-0-ta07709a-110-attractive-multicolor-abstract-pattern-digital-printed-fabric-kora-silk-4.png?v=1756951740&width=3840",
    ],
    price: 2499,
    discountPrice: 1999,
    stockCount: 35,
    isFeatured: true,
    rating: 4.9,
    numReviews: 51,
  },
  {
    name: "Organic Linen Textured Fabric",
    description:
      "Natural linen with a soft textured finish and earthy tone. Great for both casual and semi-formal wear.",
    category: "Linen",
    material: "Organic Linen",
    imageUrl: "https://www.fabvoguestudio.com/cdn/shop/files/pr-poli-0-fvs2030-110-multicolour-ikat-and-abstract-pattern-digital-printed-fabric-linen-1.png?v=1756905809&width=600",
    gallery: [
      "https://www.fabvoguestudio.com/cdn/shop/files/pr-poli-0-fvs2030-110-multicolour-ikat-and-abstract-pattern-digital-printed-fabric-linen-2.png?v=1756905817&width=3840",
      "https://www.fabvoguestudio.com/cdn/shop/files/pr-poli-0-fvs2030-110-multicolour-ikat-and-abstract-pattern-digital-printed-fabric-linen-4.png?v=1756905829&width=3840",
    ],
    price: 1399,
    discountPrice: 1199,
    stockCount: 75,
    rating: 4.5,
    numReviews: 20,
  },
  {
    name: "Wool Cashmere Blend Fabric",
    description:
      "A luxurious blend of wool and cashmere, providing warmth and softness. Ideal for coats and winter wear.",
    category: "Wool",
    material: "Wool-Cashmere Blend",
    imageUrl: "https://5.imimg.com/data5/QB/RG/BJ/SELLER-992780/plain-weave-fabrics-1000x1000.jpg",
    gallery: [
      "https://5.imimg.com/data5/QB/RG/BJ/SELLER-992780/plain-weave-fabrics-1000x1000.jpg",
      "https://5.imimg.com/data5/QB/RG/BJ/SELLER-992780/plain-weave-fabrics-1000x1000.jpg",
    ],
    price: 3299,
    discountPrice: 2899,
    stockCount: 22,
    rating: 4.8,
    numReviews: 40,
  },
  {
    name: "Premium Velvet Draping Fabric",
    description:
      "Rich, soft-touch velvet fabric ideal for evening wear, upholstery, and ethnic outfits.",
    category: "Synthetic",
    material: "Velvet Polyester",
    imageUrl: "https://www.fabvoguestudio.com/cdn/shop/files/pr-js-0-ta08628p1-110-beautiful-three-colour-gradients-digital-printed-fabric-japan-satin-1.jpg?v=1687256390&width=1050",
    gallery: [
      "https://www.fabvoguestudio.com/cdn/shop/files/pr-js-0-ta08628p1-110-beautiful-three-colour-gradients-digital-printed-fabric-japan-satin-2.jpg?v=1756969724&width=1050",
    ],
    price: 1799,
    discountPrice: 1499,
    stockCount: 40,
    rating: 4.3,
    numReviews: 18,
  },
  {
    name: "Chiffon Sheer Elegance Fabric",
    description:
      "Lightweight chiffon with soft drape and transparency. Perfect for layered dresses, scarves, and dupattas.",
    category: "Synthetic",
    material: "Chiffon",
    imageUrl: "https://www.fabvoguestudio.com/cdn/shop/files/pr-pch-0-ta010882-96-medium-turquoise-abstract-printed-pure-chiffon-fabric-3.jpg?v=1756981136&width=3840",
    gallery: [
      "https://www.fabvoguestudio.com/cdn/shop/files/pr-pch-0-ta010882-96-medium-turquoise-abstract-printed-pure-chiffon-fabric-1.jpg?v=1756981118&width=3840",
    ],
    price: 899,
    discountPrice: 799,
    stockCount: 60,
    rating: 4.2,
    numReviews: 13,
  },
  {
    name: "Designer Satin Shine Fabric",
    description:
      "Smooth satin fabric with lustrous surface and soft back. Widely used in gowns and premium furnishings.",
    category: "Silk",
    material: "Satin Silk",
    imageUrl: "https://www.fabvoguestudio.com/cdn/shop/files/KS-0-TA09262P6-110-C.jpg?v=1694494714&width=3840",
    gallery: [
      "https://www.fabvoguestudio.com/cdn/shop/files/KS-0-TA09262P6-110-A.jpg?v=1694494714&width=3840",
    ],
    price: 1599,
    discountPrice: 1399,
    stockCount: 58,
    rating: 4.6,
    numReviews: 30,
  },
];

try {
  await seedCatalog(Product, products);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
