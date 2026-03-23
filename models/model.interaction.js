const mongoose = require("mongoose");
const interactionSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["question", "comment", "poll_vote"],
      required: true,
    },
    content: { type: String }, // The text of the question or comment
    metadata: { type: Object }, // Store poll options or vote values here
  },
  { timestamps: true },
);

module.exports = mongoose.model("Interaction", interactionSchema);
