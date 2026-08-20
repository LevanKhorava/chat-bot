// Demo clothing catalog. Images are served from Unsplash's CDN (photo IDs
// verified to resolve); StoreImage falls back to a branded tile if any fail.

const unsplash = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export type Category = { key: string; name: string; image: string };

export type Product = {
  name: string;
  price: string;
  wasPrice?: string;
  badge?: string;
  image: string;
};

export const heroImage = unsplash("1441984904996-e0b6ba687e04", 1600);
export const searchImage = unsplash("1479064555552-3ef4979f8908", 1000);

export const categories: Category[] = [
  { key: "women", name: "Women", image: unsplash("1445205170230-053b83016050") },
  { key: "men", name: "Men", image: unsplash("1515886657613-9f3515b0c78f") },
  { key: "shoes", name: "Shoes", image: unsplash("1525507119028-ed4c629a60a3") },
  {
    key: "bags",
    name: "Bags & Accessories",
    image: unsplash("1584917865442-de89df76afd3"),
  },
];

export const products: Product[] = [
  {
    name: "Wool Overcoat",
    price: "€189",
    wasPrice: "€240",
    badge: "-21%",
    image: unsplash("1576995853123-5a10305d93c0"),
  },
  {
    name: "Silk Slip Dress",
    price: "€95",
    image: unsplash("1539109136881-3be0616acf4b"),
  },
  {
    name: "Leather Tote",
    price: "€149",
    image: unsplash("1553062407-98eeb64c6a62"),
  },
  {
    name: "Merino Knit Sweater",
    price: "€65",
    wasPrice: "€80",
    badge: "-19%",
    image: unsplash("1487222477894-8943e31ef7b2"),
  },
  {
    name: "Minimal White Sneakers",
    price: "€110",
    image: unsplash("1490114538077-0a7f8cb49891"),
  },
  {
    name: "Tailored Blazer",
    price: "€175",
    image: unsplash("1434389677669-e08b4cac3105"),
  },
  {
    name: "Cotton Tee — 3 Pack",
    price: "€39",
    image: unsplash("1521572163474-6864f9cf17ab"),
  },
  {
    name: "Statement Earrings",
    price: "€29",
    image: unsplash("1594633312681-425c7b97ccd1"),
  },
];
