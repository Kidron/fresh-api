import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
},
{
    collection: "test-users"
});

const User = mongoose.model("User", UserSchema);

export default User;
