import "dotenv/config.js";
import app from "./src/app.js";
import { sequelize } from "./src/models/index.js";

const PORT = process.env.PORT || 3000;

try {
  await sequelize.authenticate();
  console.log("PostgreSQL connected successfully");

  // Local convenience only. Production schema changes go through `npm run db:push`
  // so a restart can never silently alter a live database.
  await sequelize.sync({ alter: true });
  console.log("Tables synchronized successfully");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Database error:");
  console.error(error.message);
}
