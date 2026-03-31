import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    registrationType: {
      type: String,
      enum: ["solo", "team"],
      required: true,
    },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

eventRegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

eventRegistrationSchema.pre("save", function (next) {
  if (this.registrationType === "team" && !this.teamId) {
    return next(new Error("Team ID is required for team registration"));
  }

  if (this.registrationType === "solo" && this.teamId) {
    return next(new Error("Solo registration cannot have a team ID"));
  }

  next();
});

const EventRegistration = mongoose.model(
  "EventRegistration",
  eventRegistrationSchema,
);

export default EventRegistration;
