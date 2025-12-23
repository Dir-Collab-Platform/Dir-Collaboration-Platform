import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    _id: { type: String },
    userId: { type: String, required: true, index: true },
    token: { type: String, required: true, unique: true }, // The actual session cookie value
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true, _id: false }
);

export default mongoose.models.Session || mongoose.model("Session", sessionSchema);