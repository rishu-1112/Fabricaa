import cotton from "../assets/cotton.jpg";
import silk from "../assets/silk.jpg";
import denim from "../assets/denim.jpg";
import linen from "../assets/gallery1.jpg";
import wool from "../assets/gallery2.jpg";
import technical from "../assets/gallery3.jpg";
import blends from "../assets/gallery4.jpg";

export const fabricCategories = [
  { name: "Cotton", image: cotton, use: "Shirting, dresses and everyday layers" },
  { name: "Silk", image: silk, use: "Occasionwear, scarves and fluid separates" },
  { name: "Linen", image: linen, use: "Warm-weather tailoring and home textiles" },
  { name: "Denim", image: denim, use: "Workwear, structured layers and accessories" },
  { name: "Wool", image: wool, use: "Coats, knitwear and cold-weather layers" },
  { name: "Synthetic", image: technical, use: "Activewear, linings and technical projects" },
  { name: "Other", image: blends, use: "Blends and specialty weaves" },
];

const swatches = [
  ["cotton-poplin", "Cloud Cotton Poplin", "Cotton", "100% combed cotton", 540, 115, 145, 24, "A crisp, smooth plain weave for shirts, summer uniforms and clean silhouettes.", 490],
  ["cotton-twill", "Sandstone Cotton Twill", "Cotton", "100% cotton", 690, 230, 150, 12, "A compact diagonal weave with enough body for trousers and utility jackets."],
  ["mulberry-silk", "Mulberry Silk Satin", "Silk", "100% mulberry silk", 2140, 82, 112, 7, "A luminous face and fluid drape for slip dresses, scarves and occasionwear."],
  ["silk-organza", "Pearl Silk Organza", "Silk", "100% silk", 1450, 38, 110, 8, "A sheer, springy layer for overlays, sleeves and sculptural details."],
  ["linen-herringbone", "Coastal Linen Herringbone", "Linen", "100% flax linen", 980, 185, 142, 18, "A breathable midweight weave with a subtle chevron texture for relaxed tailoring.", 880],
  ["washed-linen", "Washed Linen Canvas", "Linen", "100% flax linen", 1190, 255, 150, 10, "A softly washed canvas for bags, cushions and unstructured jackets."],
  ["selvedge-denim", "Indigo Selvedge Denim", "Denim", "100% cotton denim", 1290, 340, 82, 16, "A firm indigo denim with a narrow woven edge for jeans and chore coats."],
  ["lightweight-denim", "Bluebell Lightweight Denim", "Denim", "98% cotton, 2% elastane", 790, 185, 150, 22, "A lighter denim with gentle stretch for skirts, overshirts and dresses."],
  ["wool-flannel", "Alpine Wool Flannel", "Wool", "100% wool", 1790, 270, 148, 9, "A brushed medium-weight flannel with a soft hand for trousers and blazers."],
  ["wool-coating", "Heather Wool Coating", "Wool", "80% wool, 20% polyester", 2260, 470, 150, 0, "A dense coating with a soft surface and enough structure for winter outerwear."],
  ["performance-ripstop", "Slate Performance Ripstop", "Synthetic", "100% recycled nylon", 760, 92, 148, 20, "A lightweight grid weave for packable layers, linings and lightweight bags."],
  ["modal-jersey", "Willow Modal Jersey", "Other", "94% modal, 6% elastane", 680, 190, 150, 14, "A silky knit with comfortable recovery for soft tees and draped separates."],
];

const sampleSpecifications = {
  "cotton-poplin": [2, ["Shirting", "Dresses"], "Machine wash cold with similar colours. Line dry and iron while slightly damp."],
  "cotton-twill": [3, ["Trousers", "Outerwear"], "Machine wash cold and line dry. Iron on medium heat."],
  "mulberry-silk": [1, ["Occasionwear", "Accessories"], "Professional dry cleaning recommended. Press on low heat through a cloth."],
  "silk-organza": [1, ["Occasionwear", "Dresses"], "Professional dry cleaning recommended. Press on low heat without steam."],
  "linen-herringbone": [2, ["Tailoring", "Home textiles"], "Machine wash gently at 30°C. Line dry and iron while damp."],
  "washed-linen": [3, ["Accessories", "Home textiles", "Outerwear"], "Machine wash gently at 30°C. Line dry."],
  "selvedge-denim": [3, ["Trousers", "Outerwear"], "Wash inside out in cold water with dark colours. Line dry."],
  "lightweight-denim": [2, ["Shirting", "Dresses"], "Machine wash cold, inside out. Avoid high dryer heat."],
  "wool-flannel": [2, ["Trousers", "Tailoring"], "Professional dry cleaning recommended. Air between wears."],
  "wool-coating": [2, ["Outerwear"], "Professional dry cleaning recommended. Do not tumble dry."],
  "performance-ripstop": [2, ["Activewear", "Accessories", "Linings"], "Machine wash cold on a gentle cycle. Line dry."],
  "modal-jersey": [2, ["Shirting", "Dresses"], "Machine wash cold on a gentle cycle. Dry flat."],
};

export const sampleProducts = swatches.map(([
  slug, name, category, material, price, gsm, width, stockCount, description, discountPrice,
], index) => {
  const [minimumOrderQuantity, intendedUses, careInstructions] = sampleSpecifications[slug];
  const imageUrl = fabricCategories.find((fabric) => fabric.name === category).image;
  return {
    _id: `sample-${slug}`, name, category, material, price, discountPrice, gsm, width,
    priceUnit: "metre", minimumOrderQuantity, intendedUses, careInstructions,
    stockCount, inStock: stockCount > 0, imageUrl, description, sample: true,
    isFeatured: [0, 2, 4, 6].includes(index),
    createdAt: new Date(Date.UTC(2026, 0, swatches.length - index)).toISOString(),
  };
});

export const fabricFaq = [
  { question: "How do I get a quote?", answer: "Add fabrics to your cart, choose the quantities, and submit your email with any project notes. Include your timeline or destination when it affects your request." },
  { question: "Can I ask for fabric swatches?", answer: "Select the swatch inquiry topic and include the fabric names and colors you are evaluating." },
  { question: "What does GSM mean?", answer: "Grams per square metre describes fabric weight. Compare GSM alongside the weave and fibre to judge how a textile might drape or feel." },
  { question: "Can I browse without a backend?", answer: "Run the local demo or choose Browse sample fabrics in the catalog. You can build and download a quote request using sample fabrics." },
];
