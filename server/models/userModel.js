const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      required: true,
      enum: ["donor", "organization", "hospital", "admin"],
    },

    //if the user is donor or admin we have  name
    name: {
      type: String,
      required: function () {
        if (this.userType == "admin" || this.userType == "donor") {
          return true;
        } else {
          return false;
        }
      },
    },
    // otherwise we have hospitalname or organization name

    hospitalName: {
      type: String,
      required: function () {
        if (this.userType == "hospital") {
          return true;
        } else {
          return false;
        }
      },
    },
    organizationName: {
      type: String,
      required: function () {
        if (this.userType == "organization") {
          return true;
        } else {
          return false;
        }
      },
    },
    website: {
      type: String,
      required: function () {
        if (this.userType == "hospital" || this.userType == "organization") {
          return true;
        } else {
          return false;
        }
      },
    },
    address: {
      type: String,
      required: function () {
        if (this.userType == "hospital" || this.userType == "organization") {
          return true;
        } else {
          return false;
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
