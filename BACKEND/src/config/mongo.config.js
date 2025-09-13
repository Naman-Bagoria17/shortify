// Mongoose is an Object Data Modeling(ODM) library for MongoDB and Node.js.It acts as a layer on top of MongoDB that makes it easier to interact with the database.Instead of writing raw MongoDB queries, you work with JavaScript objects and models that represent collections and documents.
// MongoDB itself is schemaless, but Mongoose adds schema-based modeling.
import mongoose from "mongoose";

// The async keyword is used to define a function that returns a Promise(A Promise is an object that represents the eventual completion (success) or failure (error) of an asynchronous operation.) and allows you to use the await keyword inside it.
// The await keyword is used to wait for a Promise to resolve before continuing execution.
// Connecting to a database takes time(a few milliseconds to a few seconds).
// It may involve:
// Resolving DNS of the MongoDB cluster.
// Opening a network socket.
// Authenticating credentials.So, mongoose.connect() returns a Promise — not an immediate value.

// They are used to handle asynchronous code (like database calls, API requests, file reading) in a way that looks like synchronous code.
//async: Declares a function as asynchronous and Always returns a Promise(even if you don’t explicitly return one).
//await: Can only be used inside an async function. It Pauses execution until the Promise is resolved or rejected. It Makes code look synchronous and easier to read.
//Why do we use them? Because many operations in Node.js(like MongoDB queries with Mongoose, API calls, reading files) are asynchronous. Without await, you’d need.then() and callbacks, which can get messy.

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
