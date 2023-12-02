const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://admin:admin123@mydb.zybabgl.mongodb.net/search-pagination?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const userSchema = new mongoose.Schema({
  name: String,
  job: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

// Route to create a new user
app.post("/api/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ newUser, message: "User created" });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// Route to get all users
app.get("/api/users", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const totalUsers = await User.countDocuments();

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

app.get("/api/search", async (req, res) => {
  const { searchInput } = req.query;

  if (!searchInput) return res.status(400).json({ message: "no search input" });

  try {
    const result = await User.find({
      $or: [
        { name: new RegExp(searchInput, "i") },
        { job: new RegExp(searchInput, "i") },
      ],
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
