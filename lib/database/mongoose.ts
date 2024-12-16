import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: typeof mongoose | null; // Use the typeof mongoose for accurate type
  promise: Promise<typeof mongoose> | null;
}

// Extend the Node.js global object to include mongoose caching
declare global {
  let mongoose: MongooseConnection | undefined;
}

// Safely initialize global.mongoose if it doesn't exist
const globalForMongoose = global as typeof globalThis & { mongoose?: MongooseConnection };

globalForMongoose.mongoose = globalForMongoose.mongoose || { conn: null, promise: null };

const cached = globalForMongoose.mongoose;

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) {
    throw new Error("Missing MONGODB_URL");
  }

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "headshot",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};
