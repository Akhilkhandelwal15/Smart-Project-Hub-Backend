import mongoose from "mongoose";

export const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },

  description: {
    type: String,
    trim: true,
    maxlength: 5000,
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    index: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  ],

  status: {
    type: String,
    enum: ["todo", "in-progress", "blocked", "done"],
    default: "todo",
    index: true,
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
    index: true,
  },

  dueDate: {
    type: Date,
    index: true,
  },

  tags: [
    {
      type: String,
      trim: true,
      index: true,
    },
  ],

  attachments: [
    {
      filename: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  commentsCount: {
    type: Number,
    default: 0,
  },

  activity: [
    {
      action: {
        type: String,
        enum: [
          "created",
          "updated",
          "status_changed",
          "assigned",
          "commented",
        ],
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  ai: {
    summary: {
      type: String,
    },
    prioritySuggestion: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
    },
    lastAnalyzedAt: {
      type: Date,
    },
  },

  completedAt: {
    type: Date,
  },

  deletedAt: {
    type: Date,
    default: null,
    index: true,
  },
},
{
  timestamps: true,
});

const Task = mongoose.model("Task", taskSchema);
export default Task;