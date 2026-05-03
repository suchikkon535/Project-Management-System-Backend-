const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "member"],
      default: "member",
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    color: {
      type: String,
      default: "#000000",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["active", "archived", "completed"],
      default: "active",
      index: true,
    },

    dueDate: {
      type: Date,
    },

    members: [memberSchema],

    taskCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedTaskCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    visibility: {
      type: String,
      enum: ["private", "team", "public"],
      default: "private",
      index: true,
    },
  },
  { timestamps: true }
);

projectSchema.index({ user: 1, status: 1 });
projectSchema.index({ user: 1, visibility: 1 });

projectSchema.pre("save", function () {
  const ownerExists = this.members.some(
    (m) => m.user.toString() === this.user.toString()
  );

  if (!ownerExists) {
    this.members.push({
      user: this.user,
      role: "owner",
    });
  }
});

module.exports = mongoose.model("Project", projectSchema);