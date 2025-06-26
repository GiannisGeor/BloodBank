const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware.jsx");
const Inventory = require("../models/inventoryModel.js");
const mongoose = require("mongoose");

//register a new user
router.post("/register", async (req, res) => {
  try {
    //check if user exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "Ο χρήστης υπάρχει ήδη",
      });
    }

    // hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    //save the user

    const user = new User(req.body);
    await user.save();

    return res.send({
      success: true,
      message: "Επιτυχής Εγγραφή",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//login user

router.post("/login", async (req, res) => {
  try {
    // check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "Λάθος στοιχεία σύνδεσης",
      });
    }

    // check if userType matches
    if (user.userType !== req.body.userType) {
      return res.send({
        success: false,
        message: `Ο χρήστης δεν είναι εγγεγραμμένος ως ${req.body.userType}`,
      });
    }

    //compare passwords
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.send({
        success: false,
        message: "Λαθος στοιχεία σύνδεσης",
      });
    }

    //generate token
    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });
    return res.send({
      success: true,
      message: "Συνδεθήκατε επιτυχώς",
      data: token,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//get current user
router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });

    return res.send({
      success: true,
      message: "Ο χρήστης ανακτήθηκε",
      data: user,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all unique donors
router.get("/get-all-donors", authMiddleware, async (req, res) => {
  try {
    // get all unique donor ids from inventory
    const organization = new mongoose.Types.ObjectId(req.body.userId);
    const uniqueDonorids = await Inventory.distinct("donor", {
      organization,
    });

    const donors = await User.find({
      _id: { $in: uniqueDonorids },
    });

    return res.send({
      success: true,
      message: "Οι αιμοδότες ανακτήθηκαν επιτυχώς",
      data: donors,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all unique hospitals
router.get("/get-all-hospitals", authMiddleware, async (req, res) => {
  try {
    // get all unique hospital ids from inventory
    const organization = new mongoose.Types.ObjectId(req.body.userId);
    const uniqueHospitalIds = await Inventory.distinct("hospital", {
      organization,
    });

    const donors = await User.find({
      _id: { $in: uniqueHospitalIds },
    });

    return res.send({
      success: true,
      message: "Τα νοσοκομεία ανακτήθηκαν επιτυχώς",
      data: donors,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
