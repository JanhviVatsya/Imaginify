import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the Node.js global object to include mongoose caching
declare global {
  var mongoose: MongooseConnection | undefined;
}

let cached: MongooseConnection = global.mongoose || {
  conn: null,
  promise: null,
};

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined");
  }

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "HeadShot",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  global.mongoose = cached; // Cache the connection globally

  return cached.conn;
};
