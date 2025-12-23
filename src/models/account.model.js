import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    _id: { type: String },
    userId: { type: String, required: true, index: true }, // Must be String to match User._id
    accountId: { type: String, required: true }, // The ID from GitHub
    providerId: { type: String, required: true, default: "github" }, 
    accessToken: { type: String },
    refreshToken: { type: String },
    accessTokenExpiresAt: { type: Date },
    refreshTokenExpiresAt: { type: Date },
    scope: { type: String },
    idToken: { type: String },
    password: { type: String }, // Required by internal schema (usually null for OAuth)
  },
  { timestamps: true, _id: false }
);

// Match your index requirement
accountSchema.index({ providerId: 1, accountId: 1 }, { unique: true });

export default mongoose.models.Account || mongoose.model("Account", accountSchema);