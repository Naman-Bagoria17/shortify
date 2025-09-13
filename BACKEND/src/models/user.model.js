import mongoose from "mongoose";

import bcrypt from "bcrypt"
//SHA256/MD5 are fast hashing algorithms → attackers can brute-force billions of hashes per second.Bcrypt is slow and adaptive (you can increase salt rounds) → makes brute-force much harder.

//This User model securely stores user data. Passwords are never stored in plain text — they’re hashed using bcrypt in a pre-save hook. Passwords are also excluded from query results by default (select: false). For authentication, we define a comparePassword instance method that validates credentials securely. The schema uses toJSON transforms to remove sensitive fields before sending responses, which prevents accidental leaks.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,//means password is excluded by default from query results.Without select: false: You risk accidentally exposing the hashed password in when returning a user object in an API response.
  },
});

//Attaches an instance method to the schema.
//Uses bcrypt.compare to check plain-text password against the hashed one.
//This is typically used during login authentication.
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}
//Why define comparePassword as an instance method instead of a static method?
//Instance methods work on a specific document (user).
//this.password refers to the user’s hashed password in the current instance.

//modifies how the document looks when sent as JSON.
// Deletes password and __v from the API response.__v is Mongoose’s internal version key (used for concurrency control).Not useful to clients → removing it cleans up API responses.
// Prevents leaking sensitive data in API responses.
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});


//a Mongoose pre-save hook. Runs before saving the document.
//Pre-save middleware ensures password hashing is centralized at the schema level, not spread across controllers.Guarantees consistency → no risk of accidentally forgetting to hash in one place.
// if (!this.isModified('password')) return next(); → prevents re-hashing if the password wasn’t changed.
//Uses bcrypt.hash(password, 10) → securely hashes the password with a salt factor of 10.
//Protects against storing plain-text passwords.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


const User = mongoose.model("User", userSchema);

export default User;

//pre("validate") runs before Mongoose validates schema fields.
//pre("save") runs after validation but before saving to the database.
//Password hashing should be in pre("save") because you want the password field to exist first, then hash it before persistence.

//Why use select: false on the password field if we already delete it in toJSON?
//select: false ensures passwords never come back in queries made from your backend code to MongoDB via Mongoose unless explicitly requested.
//toJSON only affects responses (serialization), not queries.
//Together, they add defense-in-depth → passwords are hidden both at the query level and response level.