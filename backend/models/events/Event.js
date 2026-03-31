import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventTitle: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    eventType: {
      type: String,
      enum: ["solo", "team"],
      required: true,
    },

    eventFormat: {
      type: String,
      enum: ["blitz", "rapid", "classical"],
      required: true,
    },

    platform: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },

    registrations: {
      startAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
      endAt: {
        type: Date,
        required: true,
      },
      maxSlots: {
        type: Number,
        required: true,
        min: 1,
      },
      isOpen: {
        type: Boolean,
        default: true,
      },
    },

    currentRegistrations: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

eventSchema.index({ eventType: 1, eventFormat: 1, platform: 1 });

const Event = mongoose.model("Event", eventSchema);

export default Event;
