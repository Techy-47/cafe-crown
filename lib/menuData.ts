// Cafe Crown — Complete Menu Data (extracted from menu images)
// All items are 100% vegetarian

export const menuCategories = [
  "Tea & Coffee",
  "Snacks",
  "Maggi",
  "Sandwiches",
  "Burgers",
  "Wraps",
  "Pasta",
  "Beverages",
] as const;

export type MenuCategory = (typeof menuCategories)[number];

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  isVeg: true;
  isAvailable: boolean;
  description?: string;
  tag?: string;
}

export const menuItems: MenuItem[] = [
  // ── TEA & COFFEE ──────────────────────────────────────────────────────────
  { id: "tc-01", name: "Kullhad Tea",       category: "Tea & Coffee", price: 15,  isVeg: true, isAvailable: true, description: "Classic chai served in an earthen kullhad" },
  { id: "tc-02", name: "Gud Ki Chai",       category: "Tea & Coffee", price: 30,  isVeg: true, isAvailable: true, description: "Traditional jaggery-sweetened tea" },
  { id: "tc-03", name: "Black Coffee",      category: "Tea & Coffee", price: 30,  isVeg: true, isAvailable: true },
  { id: "tc-04", name: "Hot Coffee",        category: "Tea & Coffee", price: 30,  isVeg: true, isAvailable: true, tag: "Bestseller" },
  { id: "tc-05", name: "Strong Hot Coffee", category: "Tea & Coffee", price: 35,  isVeg: true, isAvailable: true },

  // ── SNACKS ────────────────────────────────────────────────────────────────
  { id: "sn-01", name: "Bun Makkhan",          category: "Snacks", price: 30, isVeg: true, isAvailable: true },
  { id: "sn-02", name: "Grilled Bun Makkhan",  category: "Snacks", price: 35, isVeg: true, isAvailable: true },
  { id: "sn-03", name: "Masala Bun Makkhan",   category: "Snacks", price: 40, isVeg: true, isAvailable: true },
  { id: "sn-04", name: "Vada Pav",             category: "Snacks", price: 39, isVeg: true, isAvailable: true, tag: "Bestseller" },
  { id: "sn-05", name: "Grilled Vada Pav",     category: "Snacks", price: 45, isVeg: true, isAvailable: true },
  { id: "sn-06", name: "Peri Peri Fries",      category: "Snacks", price: 49, isVeg: true, isAvailable: true },
  { id: "sn-07", name: "Extra Loaded Fries",   category: "Snacks", price: 89, isVeg: true, isAvailable: true },
  { id: "sn-08", name: "Nachos with Salsa",    category: "Snacks", price: 89, isVeg: true, isAvailable: true },

  // ── MAGGI ─────────────────────────────────────────────────────────────────
  { id: "mg-01", name: "Masala Maggi",            category: "Maggi", price: 49,  isVeg: true, isAvailable: true },
  { id: "mg-02", name: "Veg Maggi",               category: "Maggi", price: 59,  isVeg: true, isAvailable: true },
  { id: "mg-03", name: "Veg Cheese Maggi",        category: "Maggi", price: 79,  isVeg: true, isAvailable: true },
  { id: "mg-04", name: "Creamy Maggi Delight",    category: "Maggi", price: 89,  isVeg: true, isAvailable: true, tag: "Bestseller" },
  { id: "mg-05", name: "Paneer Cheese Maggi",     category: "Maggi", price: 89,  isVeg: true, isAvailable: true },
  { id: "mg-06", name: "Veg Cheese Corn Maggi",   category: "Maggi", price: 89,  isVeg: true, isAvailable: true },
  { id: "mg-07", name: "Schezwan Maggi",          category: "Maggi", price: 89,  isVeg: true, isAvailable: true, tag: "Spicy" },
  { id: "mg-08", name: "Maggi Nirvana",           category: "Maggi", price: 99,  isVeg: true, isAvailable: true, tag: "Chef's Special" },

  // ── SANDWICHES ────────────────────────────────────────────────────────────
  { id: "sw-01", name: "Veg Sandwich",              category: "Sandwiches", price: 59,  isVeg: true, isAvailable: true },
  { id: "sw-02", name: "Veg Tandoori Sandwich",     category: "Sandwiches", price: 65,  isVeg: true, isAvailable: true },
  { id: "sw-03", name: "Paneer Sandwich",           category: "Sandwiches", price: 69,  isVeg: true, isAvailable: true },
  { id: "sw-04", name: "Veg Cheese Sandwich",       category: "Sandwiches", price: 79,  isVeg: true, isAvailable: true, tag: "Bestseller" },
  { id: "sw-05", name: "Tandoori Cheese Sandwich",  category: "Sandwiches", price: 85,  isVeg: true, isAvailable: true },
  { id: "sw-06", name: "Paneer Cheese Sandwich",    category: "Sandwiches", price: 89,  isVeg: true, isAvailable: true },
  { id: "sw-07", name: "Cheese Corn Sandwich",      category: "Sandwiches", price: 89,  isVeg: true, isAvailable: true },
  { id: "sw-08", name: "Mexican Sandwich",          category: "Sandwiches", price: 99,  isVeg: true, isAvailable: true, tag: "Spicy" },

  // ── BURGERS ───────────────────────────────────────────────────────────────
  { id: "bg-01", name: "Crispy Veg Burger",         category: "Burgers", price: 59,  isVeg: true, isAvailable: true },
  { id: "bg-02", name: "Veg Paneer Burger",         category: "Burgers", price: 79,  isVeg: true, isAvailable: true },
  { id: "bg-03", name: "Veg Cheese Burger",         category: "Burgers", price: 79,  isVeg: true, isAvailable: true, tag: "Bestseller" },
  { id: "bg-04", name: "Chilli Cheese Burger",      category: "Burgers", price: 89,  isVeg: true, isAvailable: true, tag: "Spicy" },
  { id: "bg-05", name: "Korean Veg Burger",         category: "Burgers", price: 89,  isVeg: true, isAvailable: true, tag: "New" },
  { id: "bg-06", name: "Veg Paneer Cheese Burger",  category: "Burgers", price: 99,  isVeg: true, isAvailable: true, tag: "Chef's Special" },

  // ── WRAPS ─────────────────────────────────────────────────────────────────
  { id: "wp-01", name: "Veg Tortilla",             category: "Wraps", price: 69,  isVeg: true, isAvailable: true },
  { id: "wp-02", name: "Paneer Tortilla",          category: "Wraps", price: 89,  isVeg: true, isAvailable: true, tag: "Bestseller" },
  { id: "wp-03", name: "Tandoori Paneer Tortilla", category: "Wraps", price: 99,  isVeg: true, isAvailable: true },

  // ── PASTA ─────────────────────────────────────────────────────────────────
  { id: "pa-01", name: "Masala Pasta",   category: "Pasta", price: 69,  isVeg: true, isAvailable: true, tag: "Gluten Free" },
  { id: "pa-02", name: "Tangy Tomato",   category: "Pasta", price: 89,  isVeg: true, isAvailable: true, tag: "Gluten Free" },
  { id: "pa-03", name: "Red Sauce",      category: "Pasta", price: 99,  isVeg: true, isAvailable: true, tag: "Gluten Free" },
  { id: "pa-04", name: "White Sauce",    category: "Pasta", price: 119, isVeg: true, isAvailable: true, tag: "Gluten Free" },

  // ── BEVERAGES ─────────────────────────────────────────────────────────────
  { id: "bv-01", name: "Cold Coffee",                  category: "Beverages", price: 59,  isVeg: true, isAvailable: true, tag: "Bestseller" },
  { id: "bv-02", name: "Chocolate Shake",              category: "Beverages", price: 59,  isVeg: true, isAvailable: true },
  { id: "bv-03", name: "Cold Coffee (Icecream)",       category: "Beverages", price: 79,  isVeg: true, isAvailable: true },
  { id: "bv-04", name: "Chocolate Shake (Icecream)",   category: "Beverages", price: 79,  isVeg: true, isAvailable: true },
  { id: "bv-05", name: "Oreo Shake",                   category: "Beverages", price: 89,  isVeg: true, isAvailable: true },
  { id: "bv-06", name: "KitKat Shake",                 category: "Beverages", price: 99,  isVeg: true, isAvailable: true, tag: "Bestseller" },
  { id: "bv-07", name: "Belgium Chocolate Shake",      category: "Beverages", price: 99,  isVeg: true, isAvailable: true },
  { id: "bv-08", name: "Strawberry Shake",             category: "Beverages", price: 99,  isVeg: true, isAvailable: true },
  { id: "bv-09", name: "Rich Mango Shake",             category: "Beverages", price: 99,  isVeg: true, isAvailable: true },
  { id: "bv-10", name: "Cold Drink",                   category: "Beverages", price: 29,  isVeg: true, isAvailable: true },
  { id: "bv-11", name: "Mineral Water",                category: "Beverages", price: 0,   isVeg: true, isAvailable: true, description: "As per MRP" },
];

export const reviews = [
  {
    id: "r1",
    name: "Anshika Singh",
    rating: 5,
    date: "7 months ago",
    text: "Must visit cafe crown — the food is savory. Tried the cold coffee and cheese sandwiches, both were delicious and well-presented. The portion was generous for the price. The staff was so polite. Overall, Cafe Crown is a great spot for coffee and tea lovers! ❤️👑",
    tags: ["Cold Coffee", "Cheese Sandwich"],
  },
  {
    id: "r2",
    name: "Anoop Swarnkar",
    badge: "Local Guide",
    rating: 5,
    date: "3 months ago",
    text: "A complete cafe to have your desired food. Tasty coffee with vada pav — a good combo to must try!",
    tags: ["Vada Pav", "Coffee"],
  },
  {
    id: "r3",
    name: "Janhvi Mishra",
    rating: 5,
    date: "11 months ago",
    text: "It is the bestest cafe I've ever been to ❤️ with one of the most beautiful and aesthetic interior, calm and peaceful environment and with the most tasty collection of food items at a very low cost. I truly recommend this cafe to everyone.",
    tags: ["Ambience", "Budget Friendly"],
  },
  {
    id: "r4",
    name: "Gopesh Prajapati",
    rating: 4,
    date: "8 months ago",
    text: "Very nice friendly environment, good and clean ambience and sitting area, polite staff. They serve delicious food and it's very budget friendly.",
    tags: ["Clean Ambience", "Polite Staff"],
  },
  {
    id: "r5",
    name: "Tripti Kashayp",
    rating: 5,
    date: "9 months ago",
    text: "Best burger 🍔 Budget friendly 👌",
    tags: ["Burger", "Budget Friendly"],
  },
  {
    id: "r6",
    name: "Shrikrishna Jee",
    rating: 5,
    date: "9 months ago",
    text: "Cozy environment, friendly staff and good food. I highly recommend this — THE CAFE CROWN",
    tags: ["Cozy", "Friendly Staff"],
  },
];

export const categoryIcons: Record<MenuCategory, string> = {
  "Tea & Coffee": "☕",
  "Snacks": "🍟",
  "Maggi": "🍜",
  "Sandwiches": "🥪",
  "Burgers": "🍔",
  "Wraps": "🌯",
  "Pasta": "🍝",
  "Beverages": "🥤",
};
