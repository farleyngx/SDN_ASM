const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

// [POST] /question - Tạo mới một câu hỏi độc lập (CẦN CẬP NHẬT AUTHOR)
exports.createQuestion = async (req, res, next) => {
  try {
    const questionData = {
      ...req.body,
      author: req.user._id,
    };

    const newQuestion = await Question.create(questionData);
    return res.status(201).json(newQuestion);
  } catch (error) {
    return next(error);
  }
};

// [GET] /question - Lấy toàn bộ câu hỏi độc lập
exports.getAllQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    return next(error);
  }
};

// [GET] /question/:questionId - Lấy chi tiết 1 Câu hỏi theo ID
exports.getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question)
      return res.status(404).json({ message: "Không tìm thấy câu hỏi" });
    res.status(200).json(question);
  } catch (error) {
    return next(error);
  }
};

// [PUT] /question/:questionId - Cập nhật câu hỏi
exports.updateQuestion = async (req, res, next) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.questionId,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedQuestion)
      return res.status(404).json({ message: "Không tìm thấy câu hỏi" });
    res.status(200).json(updatedQuestion);
  } catch (error) {
    return next(error);
  }
};

// [DELETE] /question/:questionId - Xóa câu hỏi độc lập
exports.deleteQuestion = async (req, res, next) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(
      req.params.questionId,
    );
    if (!deletedQuestion)
      return res.status(404).json({ message: "Không tìm thấy câu hỏi" });

    await Quiz.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } },
    );
    return res.status(200).json({ message: "Xóa câu hỏi thành công" });
  } catch (error) {
    return next(error);
  }
};
