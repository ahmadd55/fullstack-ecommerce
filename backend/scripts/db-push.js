// Creates or updates the database schema against whatever DATABASE_URL / DB_*
// variables are currently set. Run this once against production before the first
// deploy, and again after changing a model.
//
//   npm run db:push            create missing tables
//   npm run db:push -- --alter also alter existing columns to match the models
import "dotenv/config.js";
import { sequelize } from "../src/models/index.js";

const alter = process.argv.includes("--alter");

try {
  await sequelize.authenticate();
  console.log("Connected to the database.");

  await sequelize.sync({ alter });
  console.log(
    alter ? "Schema altered to match models." : "Missing tables created."
  );

  await sequelize.close();
  process.exit(0);
} catch (error) {
  console.error("Schema push failed:");
  console.error(error.message);
  process.exit(1);
}
