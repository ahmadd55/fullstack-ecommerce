import multer from "multer";

// Vercel caps serverless request bodies at 4.5 MB, so reject anything larger
// here rather than letting the platform drop it with an opaque error.
const MAX_FILE_SIZE = 4 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, PNG, WEBP and GIF files are allowed!"
      ),
      false
    );
  }
};

export const uploadProductImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});
