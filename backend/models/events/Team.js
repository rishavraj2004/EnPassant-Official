import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

    teamName: {
      type: String,
      required: true,
      trim: true,
    },

    captainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

teamSchema.index({ eventId: 1, teamName: 1 }, { unique: true });

teamSchema.pre("save", function (next) {
  const memberIds = this.members.map((m) => m.userId.toString());
  const uniqueIds = new Set(memberIds);

  if (memberIds.length !== uniqueIds.size) {
    return next(new Error("Duplicate members in team"));
  }

  if (!memberIds.includes(this.captainId.toString())) {
    return next(new Error("Captain must be included in team members"));
  }

  next();
});

const Team = mongoose.model("Team", teamSchema);

export default Team;
