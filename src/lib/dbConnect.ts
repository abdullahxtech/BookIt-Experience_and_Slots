import mongoose from 'mongoose';

// Get the MongoDB connection string from our .env.local file
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}


let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If we have a cached connection, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection promise doesn't exist, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  // Wait for the connection promise to resolve
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // If connection fails, reset the promise and throw the error
    cached.promise = null;
    throw e;
  }

  // Return the successful connection
  return cached.conn;
}

export default dbConnect;

