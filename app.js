const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

require("dotenv/config");

app.use(cors());
app.options("*", cors());

const api = process.env.API_URL;

// Routes
const productsRouter = require("./routes/products");
const orderRouter = require("./routes/orders");
const categoriesRoutes = require("./routes/categories");
const usersRoutes = require("./routes/users");

// Middlewar
// usados antes de cualquier respuesta
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

// Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, orderRouter);

// connecto to my database mongodb cloud
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.DB_NAME || 3000;
app.listen(PORT, () => {
  console.log("server is running http://localhost:3000");
});
