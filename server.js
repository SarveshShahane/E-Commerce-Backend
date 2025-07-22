import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
import productRoutes from "./routes/product.routes.js";
import authRoutes from "./routes/auth.routes.js";
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  });
