import "dotenv/config";

export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const ARCJET_KEY = process.env.ARCJET_KEY as string;

if (!MONGO_URI || !JWT_SECRET || !ARCJET_KEY) {
  throw new Error("Missing environment variables");
}
