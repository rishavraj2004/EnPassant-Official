import mongoose from "mongoose";

// chess accounts sub schema
const chessAccountsSchema = new mongoose.Schema(
  {
    chessCom: {
      username: { type: String, trim: true },
      ratings: {
        blitz: { type: Number, default: 0 },
        bullet: { type: Number, default: 0 },
        rapid: { type: Number, default: 0 },
      },
    },
    lichess: {
      username: { type: String, trim: true },
      ratings: {
        blitz: { type: Number, default: 0 },
        bullet: { type: Number, default: 0 },
        rapid: { type: Number, default: 0 },
      },
    },
    lastSync: { type: Date, default: Date.now },
  },
  { _id: false },
);

// main user schema
const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    userName: { type: String, required: true, trim: true },
    collegeEmail: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      sparse: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    branch: {
      type: String,
      default: null,
      trim: true,
    },
    year: { type: Number, min: 1, max: 5, default: 1 }, // 5 for passed out peeps if needed(can be removed if not required)
    chessAccounts: { type: chessAccountsSchema, default: {} },
    profilePictureUrl: {
      type: String,
      default: " ", // left blank, will be added later
      trim: true,
    },
    isOnboardingComplete: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    authMethod: {
      type: String,
      enum: ["emailPassword", "google", "microsoft"],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
