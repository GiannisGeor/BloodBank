const router = require("express").Router();
const Inventory = require("../models/inventoryModal");
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");

// add inventory

router.post("/add", authMiddleware, async (req, res) => {
  try {
    // validate email and inventory type
    const user = await User.findOne({ email: req.body.email });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});
