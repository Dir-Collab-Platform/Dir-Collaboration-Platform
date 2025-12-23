import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String }, // Better Auth uses string IDs
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    emailVerified: { type: Boolean, default: false },
    image: { type: String },
    
    // Your Custom GitHub Fields
    githubUserName: { type: String }, 
    gitHubID: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
    
    // Relations (Keep these as ObjectIds if they point to other Mongoose models)
    reposOwned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Repository" }],
  },
  { timestamps: true, _id: false } // Disable auto-generation of ObjectId
);

export default mongoose.models.User || mongoose.model("User", userSchema);