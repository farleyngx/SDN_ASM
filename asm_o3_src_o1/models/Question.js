const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Nội dung câu hỏi không được để trống"],
    },
    options: {
      type: [String],
      required: [true, "Danh sách đáp án không được để trống"],
    },
    keywords: {
      type: [String],
      default: [],
    },
    correctAnswerIndex: {
      type: Number,
      required: [true, "Vị trí đáp án đúng không được để trống"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model("Question", QuestionSchema);
