const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI?.trim();

  if (mongoUri) {
    try {
      const conn = await mongoose.connect(mongoUri);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.warn(`⚠️  MONGO_URI is set but failed to connect: ${error.message}`);
      if (process.env.NODE_ENV === "production") {
        console.error("❌ Production must connect to MongoDB Atlas. Aborting.");
        process.exit(1);
      }
      console.warn("⚠️  Falling back to in-memory MongoDB for development.");
    }
  }

  if (process.env.NODE_ENV === "production") {
    console.error("❌ MONGO_URI is required in production mode.");
    process.exit(1);
  }

  const memoryServer = await MongoMemoryServer.create();
  const conn = await mongoose.connect(memoryServer.getUri());
  console.log(`✅ In-memory MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
