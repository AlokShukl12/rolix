const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const app = require("./app");
const connectDb = require("./config/db");

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  await connectDb();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
};

bootstrap();
