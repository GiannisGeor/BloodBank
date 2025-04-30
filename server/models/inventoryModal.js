const mongoose = require("mongoose");
const {
  default: InventoryForm,
} = require("../../client-vite/src/pages/Inventory/InventoryForm");

const inventorySchema = new mongoose.Schema(
  {
    InventoryType: {
      type: String,
      required: true,
      enum: ["in", "out"],
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    quantity: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organizations",
      required: true,
    },

    // if inventoryType is "out" then hospital will be set
    // if inventoryType is "in" then donor will be set

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: function () {
        return this.inventoryType === "out";
      },
    },

    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: function () {
        return this.inventoryType === "in";
      },
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model("inventories", inventorySchema);

module.exports = Inventory;
