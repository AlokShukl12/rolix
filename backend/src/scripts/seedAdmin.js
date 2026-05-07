require("dotenv").config();
const connectDb = require("../config/db");
const User = require("../models/User");
const { ROLES } = require("../config/constants");

const run = async () => {
  await connectDb();

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@123";
  const adminName = process.env.SEED_ADMIN_NAME || "System Administrator Account";
  const adminAddress = process.env.SEED_ADMIN_ADDRESS || "Default admin address";

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log("Admin already exists:", adminEmail);
    process.exit(0);
  }

  await User.create({
    name: adminName.length < 20 ? `${adminName} User Profile` : adminName,
    email: adminEmail,
    address: adminAddress,
    password: adminPassword,
    role: ROLES.ADMIN
  });

  // eslint-disable-next-line no-console
  console.log("Admin seeded:", adminEmail);
  process.exit(0);
};

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to seed admin:", error.message);
  process.exit(1);
});
