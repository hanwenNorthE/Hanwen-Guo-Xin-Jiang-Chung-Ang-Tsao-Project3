const mongoose = require("mongoose");
const { Schema } = mongoose;

const passwordSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Password = mongoose.model("Password", passwordSchema);

module.exports = Password;