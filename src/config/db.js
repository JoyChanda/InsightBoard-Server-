const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO_URI;

let client;

async function connectDB() {
  try {
    if (!client) {
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
    }

    await client.connect();

    await client.db("admin").command({ ping: 1 });

    console.log("✅ MongoDB connected successfully!");
    return client;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
