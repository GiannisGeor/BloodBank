const router = require("express").Router();
const Inventory = require("../models/inventoryModel");
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware.jsx");
const mongoose = require("mongoose");

// add inventory
router.post("/add", authMiddleware, async (req, res) => {
  try {
    // validate email and inventoryType
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("Μη έγκυρο Email");

    if (req.body.inventoryType === "in" && user.userType !== "donor") {
      throw new Error("Αυτό το email δεν είναι εγγεγραμμένο ως αιμοδότης");
    }

    if (req.body.inventoryType === "out" && user.userType !== "hospital") {
      throw new Error("Αυτό το email δεν είναι εγγεγραμμένο ως νοσοκομείο");
    }

    // set organization
    req.body.organization = req.body.userId;

    if (req.body.inventoryType === "out") {
      // check if inventory is available
      const requestedGroup = req.body.bloodGroup;
      const requestedQuantity = req.body.quantity;
      const organization = new mongoose.Types.ObjectId(req.body.userId);

      const totalInOfRequestedGroup = await Inventory.aggregate([
        {
          $match: {
            organization,
            inventoryType: "in",
            bloodGroup: requestedGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);

      const totalIn =
        totalInOfRequestedGroup.length > 0
          ? totalInOfRequestedGroup[0].total
          : 0;

      const totalOutOfRequestedGroup = await Inventory.aggregate([
        {
          $match: {
            organization,
            inventoryType: "out",
            bloodGroup: requestedGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);

      const totalOut =
        totalOutOfRequestedGroup.length > 0
          ? totalOutOfRequestedGroup[0].total
          : 0;

      const availableQuantityOfRequestedGroup = totalIn - totalOut;

      if (availableQuantityOfRequestedGroup === 0) {
        throw new Error(
          `Δεν υπάρχει διαθέσιμο αίμα ομάδας ${requestedGroup.toUpperCase()} στο απόθεμα`
        );
      }

      if (availableQuantityOfRequestedGroup < requestedQuantity) {
        throw new Error(
          `Διαθέσιμες μόνο ${availableQuantityOfRequestedGroup} μονάδες αίματος ομάδας ${requestedGroup.toUpperCase()}`
        );
      }
      req.body.hospital = user._id;
    } else {
      req.body.donor = user._id;
    }

    const inventory = new Inventory(req.body);
    await inventory.save();

    return res.send({
      success: true,
      message: "Το απόθεμα προστέθηκε επιτυχώς",
    });
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
      .sort({ createdAt: -1 })
      .populate("donor")
      .populate("hospital");
    return res.send({ success: true, data: inventory });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

//get inventory with filters
router.post("/filter", authMiddleware, async (req, res) => {
  try {
    const inventory = await Inventory.find(req.body.filters)
      .limit(req.body.limit || 10)
      .sort({ createdAt: -1 })
      .populate("donor")
      .populate("hospital")
      .populate("organization");
    return res.send({ success: true, data: inventory });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

module.exports = router;
