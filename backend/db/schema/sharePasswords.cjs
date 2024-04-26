const mongoose = require("mongoose");
const { Schema } = mongoose;

const sharePasswordsSchema  = new Schema(
  {
    sharePasswords:[],
    creator: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const sharePassword = mongoose.model("sharePassword", sharePasswordsSchema);

module.exports = sharePassword;