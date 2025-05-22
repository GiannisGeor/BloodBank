const router = require("express").Router();
const Inventory = require("../models/inventoryModel"); // Note: Model not Modal
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware.jsx");

// add inventory
router.post("/add", authMiddleware, async (req, res) => {
  try {
    // validate email and inventoryType
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("Invalid Email");

    if (req.body.inventoryType === "in" && user.userType !== "donor") {
      throw new Error("This email is not registered as a donor");
    }

    if (req.body.inventoryType === "out" && user.userType !== "hospital") {
      throw new Error("This email is not registered as a hospital");
    }

    // set organization
    req.body.organization = req.body.userId;

    if (req.body.inventoryType === "out") {
      req.body.hospital = user._id;
    } else {
      req.body.donor = user._id;
    }

    const inventory = new Inventory(req.body);
    await inventory.save();

    return res.send({ success: true, message: "Inventory Added Successfully" });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

//get inventory
router.get("/get", authMiddleware, async (req, res) => {
  try {
    const inventory = await Inventory.find({
      organization: req.body.userId,
    })
      .populate("donor")
      .populate("hospital");
    return res.send({ success: true, data: inventory });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

module.exports = router;
