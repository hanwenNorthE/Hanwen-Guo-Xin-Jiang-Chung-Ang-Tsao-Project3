const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    friends: [{ 
      type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }
]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;