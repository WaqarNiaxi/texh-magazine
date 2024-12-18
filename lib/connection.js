import mongoose from 'mongoose';

let cachedConnection = global.mongooseConnections;

if (!cachedConnection) {
  cachedConnection = global.mongooseConnections = {};
}

async function connectDB() {
  if (cachedConnection) {
    const connection = cachedConnection;
    if (connection.readyState === 1) {
      return connection;
    } else {
      cachedConnection = {};
    }
  }

  const { connection } = await mongoose.connect(process.env.MONGODB_URI);

  console.log(`Connected to MongoDB: ${connection.host}`);
  cachedConnection = connection;
}

module.exports = { connectDB };
