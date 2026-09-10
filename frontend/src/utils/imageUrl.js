const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export const PLACEHOLDER_IMAGE = "/placeholder.svg";

export const resolveImageUrl = (image) => {
  const path = image?.image || image;

  if (!path) return PLACEHOLDER_IMAGE;

  if (path.startsWith("http")) return path;

  return `${API_ORIGIN}${path}`;
};

export default resolveImageUrl;
