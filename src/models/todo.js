const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    descripcion: {
      type: String,
      minlength: 1,
      maxlength: 255, // To avoid a maliciously long string
      trim: true,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;
