//it provides schema based solution for mongoDB
// mongoose is a library that:
// Helps define schemas for your MongoDB documents.
// Provides built -in validation and middleware.
// Makes working with MongoDB more structured and organized.

// MongoDB itself is schemaless, but Mongoose adds schema-based modeling.
import mongoose from "mongoose";

// The async keyword is used to define a function that returns a Promise and allows you to use the await keyword inside it.
// The await keyword is used to wait for a Promise to resolve before continuing execution.
// Connecting to a database takes time(a few milliseconds to a few seconds).
// It may involve:
// Resolving DNS of the MongoDB cluster.
// Opening a network socket.
// Authenticating credentials.So, mongoose.connect() returns a Promise — not an immediate value.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
