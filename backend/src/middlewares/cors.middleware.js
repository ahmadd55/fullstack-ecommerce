import cors from "cors";

const configuredOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = ["http://localhost:5173", ...configuredOrigins];

// Vercel gives every push a fresh preview subdomain, which can never be listed
// ahead of time. Opt in only when you actually want previews to reach this API.
const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS === "true";
const vercelPreviewPattern = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

const corsOptions = {
  origin: (origin, callback) => {
    // Server-to-server calls and same-origin requests send no Origin header.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (allowVercelPreviews && vercelPreviewPattern.test(origin)) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

export default cors(corsOptions);
