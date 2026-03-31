import firebaseAdmin from "../config/firebaseAdmin.js";
import User from "../models/User.js";
import { emailRegex, passwordRegex } from "../utils/regex.js";
import { generateToken } from "../utils/generateToken.js";
import { messaging } from "firebase-admin";
import { decode } from "jsonwebtoken";

export const registerEmailPassword = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({
      error: "userName, email, and password are required",
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters long and contain at least one letter and one number",
    });
  }

  try {
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "User with this email already exists",
      });
    }

    // Create Firebase user
    const firebaseUser = await firebaseAdmin.auth().createUser({
      email,
      password,
      displayName: userName,
    });

    // Create MongoDB profile
    const user = await User.create({
      firebaseUid: firebaseUser.uid,
      userName,
      email,
      collegeEmail: null,
      authMethod: "emailPassword",
      role: "user",
      isOnboardingComplete: false,
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const loginEmailPassword = async (req, res) => {
  const { idToken } = req.body; // expects idtoken sent by the frontend

  if (!idToken) {
    return res.status(400).json({ error: "ID token is required" });
  }
  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);

    const { uid, email } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("Login error", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const handleMicrosoftAuth = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "ID token is required" });
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);

    const { uid, name, email, picture } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });

    // if new user, create one
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        userName: name,
        email: null,
        collegeEmail: email,
        authMethod: "microsoft",
        role: "user",
        profilePictureUrl: picture || "",
        isOnboardingComplete: false,
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("Microsoft auth error:", err);
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};

export const handleGoogleAuth = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "ID token is required" });
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);

    const { uid, name, email, picture } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });

    // if new user, create one
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        userName: name,
        email: email.toLowerCase(),
        collegeEmail: null,
        authMethod: "google",
        role: "user",
        profilePictureUrl: picture || "",
        isOnboardingComplete: false,
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("Google auth error", err);
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};
