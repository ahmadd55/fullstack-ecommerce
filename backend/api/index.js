// Vercel serverless entry point. An Express app is itself a (req, res) handler,
// so it can be exported directly. The local server lives in ../index.js instead,
// because serverless functions must never call app.listen().
import app from "../src/app.js";

export default app;
