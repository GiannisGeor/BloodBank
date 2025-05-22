const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
app.use(express.json());

const usersRoute = require("./routes/usersRoute");
const inventoryRoute = require("./routes/inventoryRoute");

app.use("/api/users", usersRoute);
app.use("/api/inventory", inventoryRoute);

app.listen(port, () => console.log(`Node JS server started at  ${port} `));
