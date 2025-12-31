import mongoose from "mongoose";

/* to find any project then we need to take care of deletedAt field.
to find any project we have to use:
  Project.find({
  status: "active",
  deletedAt: null
}) */
const projectSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
       role: {
        type: String,
        enum: ["owner", "manager", "member"],
        default: "member",
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    }
  ],
  status: {
    type: String,
    enum: ["active", "archived"],
    default: "active",
    index: true,
  },
  visibility: {
    type: String,
    enum: ["private", "team"],
    default: "private",
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  stats: {
    totalTasks: {
      type: Number,
      default: 0,
    },
    completedTasks: {
      type: Number,
      default: 0,
    },
  },
  settings: {
    allowComments: {
      type: Boolean,
      default: true,
    },
    allowAttachments: {
      type: Boolean,
      default: true,
    },
  },
  deletedAt: { // for soft delete 
    type: Date,
    default: null,
    index: true,
  },
},
{
  timestamps: true,
}
);

const Project = mongoose.model("Project", projectSchema);
export default Project;