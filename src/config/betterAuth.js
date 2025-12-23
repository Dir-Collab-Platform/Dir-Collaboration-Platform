import mongoose from "mongoose";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb"; // Use the official adapter
import dotenv from "dotenv";

dotenv.config();

// Ensure connection before initializing Auth
await mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection.db; 

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  
  // FIX: Use the adapter function and pass the native 'db' object
  database: mongodbAdapter(db, {
    collections: {
      user: "users",       // Map to your Mongoose collection names
      session: "sessions",
      account: "accounts",
    }
  }),

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      // Map GitHub profile to your custom Mongoose fields
      mapProfile: (profile) => {
        return {
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          githubUserName: profile.login, // Matches your schema
          gitHubID: profile.id.toString(), // Matches your schema
        };
      },
    },
  },
  
  // Allow Better Auth to recognize your custom Mongoose fields
  user: {
    additionalFields: {
      githubUserName: { type: "string" },
      gitHubID: { type: "string" },
      role: { type: "string" },
    }
  },

  emailAndPassword: {
    enabled: false,
  },
});