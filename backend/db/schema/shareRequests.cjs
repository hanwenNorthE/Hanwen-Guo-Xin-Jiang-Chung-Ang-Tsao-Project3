const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shareRequestsSchema = new Schema(
  { fromUsername: {
    type: String,
    required: true
  },
  toUsername: {
    type: String,
    required: true
  },
    fromUser: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
    toUser: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    creator: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    }
  },
  { timestamps: true }
);

const ShareRequest = mongoose.model('ShareRequest', shareRequestsSchema);

module.exports = ShareRequest;
