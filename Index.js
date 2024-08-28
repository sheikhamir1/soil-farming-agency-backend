require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoDbConnect = require("./ConfigFiles/ConnectMongodb");
const cors = require("cors");
// connect mongodb connect here
mongoDbConnect();

const port = process.env.PORT || 4000;

const corsConfig = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.options("*", cors(corsConfig));
app.use(cors(corsConfig));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// api auth routes
app.use("/api/auth", require("./Routes/Admin/AdminAuth"));
app.use("/api/userauth", require("./Routes/User/UserAuth"));

// api profile
app.use("/api/profile", require("./Routes/Admin/Profile"));

// api protected routes
app.use("/api/soil", require("./Routes/Admin/SoilRoute"));
app.use("/api/distributor", require("./Routes/Admin/Distributor"));

// testing route
app.get("/", (req, res) => {
  res.send("backend deployed!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
