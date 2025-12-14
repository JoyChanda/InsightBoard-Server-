// seedProducts.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/Product.js";
import User from "./src/models/User.js";

dotenv.config();

const products = [
  // --- Featured / Home Page Products (6 Items) ---
  {
    title: "Classic White T-Shirt",
    desc: "100% cotton, unisex classic fit T-shirt. Comfortable and breathable.",
    category: "gentle",
    price: 12.99,
    qty: 150,
    minQty: 1,
    images: ["https://placehold.co/400x500/EEE/31343C?text=White+T-Shirt"],
    paymentOptions: ["card", "paypal"],
    showOnHome: true
  },
  {
    title: "Denim Jacket",
    desc: "Stylish medium-wash denim jacket with button closures.",
    category: "gentle",
    price: 59.99,
    qty: 50,
    minQty: 1,
    images: ["https://placehold.co/400x500/3b82f6/FFFFFF?text=Denim+Jacket"],
    paymentOptions: ["card", "paypal"],
    showOnHome: true
  },
  {
    title: "Graphic Hoodie",
    desc: "Soft fleece hoodie with printed graphic design. Unisex sizing.",
    category: "gentle",
    price: 45.99,
    qty: 70,
    minQty: 1,
    images: ["https://placehold.co/400x500/1f2937/FFFFFF?text=Graphic+Hoodie"],
    paymentOptions: ["card", "paypal"],
    showOnHome: true
  },
  {
    title: "Summer Floral Dress",
    desc: "Lightweight and breezy summer dress, perfect for warm weather outings.",
    category: "women",
    price: 39.99,
    qty: 60,
    minQty: 1,
    images: ["https://placehold.co/400x500/f472b6/FFFFFF?text=Summer+Dress"],
    paymentOptions: ["card", "paypal"],
    showOnHome: true
  },
  {
    title: "Running Sneakers",
    desc: "High-performance running shoes with breathable mesh and cushioned sole.",
    category: "sports",
    price: 79.99,
    qty: 40,
    minQty: 1,
    images: ["https://placehold.co/400x500/10b981/FFFFFF?text=Sneakers"],
    paymentOptions: ["card", "paypal"],
    showOnHome: true
  },
  {
    title: "Leather Crossbody Bag",
    desc: "Premium leather crossbody bag with adjustable strap and gold hardware.",
    category: "accessories",
    price: 89.99,
    qty: 30,
    minQty: 1,
    images: ["https://placehold.co/400x500/78350f/FFFFFF?text=Leather+Bag"],
    paymentOptions: ["card", "paypal"],
    showOnHome: true
  },

  // --- Other Products (9 Items) ---
  {
    title: "Slim Fit Chinos",
    desc: "Comfortable slim-fit chinos in khaki color, perfect for casual and office wear.",
    category: "gentle",
    price: 34.99,
    qty: 100,
    minQty: 1,
    images: ["https://placehold.co/400x500/d97706/FFFFFF?text=Chinos"],
    paymentOptions: ["card", "paypal"],
    showOnHome: false
  },
  {
    title: "Yoga Leggings",
    desc: "High-waisted, moisture-wicking leggings suitable for yoga and gym workouts.",
    category: "sports",
    price: 29.99,
    qty: 80,
    minQty: 1,
    images: ["https://placehold.co/400x500/8b5cf6/FFFFFF?text=Leggings"],
    paymentOptions: ["card"],
    showOnHome: false
  },
  {
    title: "Formal Oxford Shirt",
    desc: "Crisp white oxford shirt, tailored fit for professional occasions.",
    category: "gentle",
    price: 49.99,
    qty: 55,
    minQty: 1,
    images: ["https://placehold.co/400x500/e5e7eb/374151?text=Oxford+Shirt"],
    paymentOptions: ["card", "paypal"],
    showOnHome: false
  },
  {
    title: "Winter Wool Coat",
    desc: "Elegant wool blend coat to keep you warm and stylish during winter.",
    category: "women",
    price: 129.99,
    qty: 20,
    minQty: 1,
    images: ["https://placehold.co/400x500/374151/FFFFFF?text=Wool+Coat"],
    paymentOptions: ["card", "paypal"],
    showOnHome: false
  },
  {
    title: "Baseball Cap",
    desc: "Classic cotton baseball cap with adjustable strap back.",
    category: "accessories",
    price: 14.99,
    qty: 200,
    minQty: 1,
    images: ["https://placehold.co/400x500/ef4444/FFFFFF?text=Cap"],
    paymentOptions: ["card"],
    showOnHome: false
  },
  {
    title: "Cotton Pajama Set",
    desc: "Soft and cozy cotton pajama set for a good night's sleep.",
    category: "kids",
    price: 24.99,
    qty: 90,
    minQty: 1,
    images: ["https://placehold.co/400x500/fcd34d/374151?text=Pajamas"],
    paymentOptions: ["card", "paypal"],
    showOnHome: false
  },
  {
    title: "Sports Duffel Bag",
    desc: "Spacious duffel bag with separate shoe compartment for gym gear.",
    category: "sports",
    price: 39.99,
    qty: 45,
    minQty: 1,
    images: ["https://placehold.co/400x500/000000/FFFFFF?text=Duffel+Bag"],
    paymentOptions: ["card", "paypal"],
    showOnHome: false
  },
  {
    title: "Silk Scarf",
    desc: "Luxurious 100% silk scarf with floral print.",
    category: "accessories",
    price: 55.00,
    qty: 25,
    minQty: 1,
    images: ["https://placehold.co/400x500/ec4899/FFFFFF?text=Silk+Scarf"],
    paymentOptions: ["card", "paypal"],
    showOnHome: false
  },
  {
    title: "Kids Raincoat",
    desc: "Waterproof yellow raincoat with hood and reflective stripes.",
    category: "kids",
    price: 29.99,
    qty: 60,
    minQty: 1,
    images: ["https://placehold.co/400x500/eab308/FFFFFF?text=Raincoat"],
    paymentOptions: ["card", "paypal"],
    showOnHome: false
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
         throw new Error("MONGO_URI not found in environment variables");
    }

    await mongoose.connect(mongoUri, { dbName: 'insightboard' });
    console.log("MongoDB connected");

    // 1. Find the Manager User
    let manager = await User.findOne({ email: "testmanager@gmail.com" });
    
    // Fallback if manager doesn't exist (though they should)
    if (!manager) {
        console.log("⚠️ Manager 'testmanager@gmail.com' not found. Fetching ANY user to assign products...");
        manager = await User.findOne();
    }

    if (!manager) {
        console.error("❌ No users found in DB. Please run 'node seedManager.js' first.");
        process.exit(1);
    }
    
    console.log(`Assigning products to Manager: ${manager.name} (${manager._id})`);

    // 2. Prepare Products with createdBy
    const productsWithUser = products.map(p => ({
        ...p,
        createdBy: manager._id
    }));

    // 3. Clear and Insert
    await Product.deleteMany({});
    console.log("Old products deleted");

    await Product.insertMany(productsWithUser);
    console.log(`✅ Successfully seeded ${products.length} products!`);

    mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding products:", err);
    process.exit(1);
  }
};

seedDB();
