const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing. Create backend/.env and set MONGO_URI.");
    }
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection failed:", error.message);
    if (String(error.message).includes("querySrv ETIMEOUT")) {
      // eslint-disable-next-line no-console
      console.error(
        "Atlas DNS/network timeout. Check internet/DNS, Atlas IP access list, and URI (include DB name)."
      );
    }
    process.exit(1);
  }
};

module.exports = connectDb;
