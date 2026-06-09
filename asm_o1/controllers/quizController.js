const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

// [POST] /quizzes - Tạo mới một Quiz
exports.createQuiz = async (req, res) => {
  try {
    const newQuiz = await Quiz.create(req.body);
    res.status(200).json({ message: `Quiz added`, _id: `${newQuiz._id}` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// [GET] /quizzes - Lấy toàn bộ danh sách Quiz kèm populate question
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("questions");
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] /quizzes/:quizId - Lấy chi tiết 1 Quiz theo ID (đã populate câu hỏi)
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate("questions");
    if (!quiz) return res.status(404).json({ message: "Không tìm thấy Quiz" });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [PUT] /quizzes/:quizId - Cập nhật thông tin Quiz [cite: 15]
exports.updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedQuiz)
      return res.status(404).json({ message: "Không tìm thấy Quiz" });
    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// [DELETE] /quizzes/:quizId - Xóa Quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.quizId);
    if (!deletedQuiz)
      return res.status(404).json({ message: "Không tìm thấy Quiz" });
    res.status(200).json({message: "Xóa câu hỏi thành công"})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] /quizzes/:quizId/populate - Lọc câu hỏi có từ khóa "capital"
exports.getQuizWithCapitalQuestions = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate({
      path: "questions",
      match: { text: { $regex: "capital", $options: "i" } },
    });
    if (!quiz) return res.status(404).json({ message: "Không tìm thấy Quiz" });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [POST] /quizzes/:quizId/question - Tạo 1 câu hỏi mới nằm trong Quiz
exports.createQuestionForQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    // Tạo câu hỏi mới [cite: 35]
    const newQuestion = await Question.create(req.body);

    // Đẩy ID vào mảng questions của Quiz [cite: 22]
    await Quiz.findByIdAndUpdate(quizId, {
      $push: { questions: newQuestion._id },
    });

    // Khớp ảnh mẫu số 4: Trả về chính Object câu hỏi vừa tạo kèm status 201 Created [cite: 35]
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// [POST] /quizzes/:quizId/questions - Tạo nhiều câu hỏi cùng lúc [cite: 36]
exports.createManyQuestionsForQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const questionsArray = req.body;

    if (!Array.isArray(questionsArray)) {
      return res.status(400).json({ message: "Dữ liệu phải là một mảng" });
    }

    // Chèn hàng loạt câu hỏi [cite: 36]
    const newQuestions = await Question.insertMany(questionsArray);
    const questionIds = newQuestions.map((q) => q._id);

    // Cập nhật mảng ID vào Quiz [cite: 22]
    await Quiz.findByIdAndUpdate(quizId, {
      $push: { questions: { $each: questionIds } },
    });

    // Khớp ảnh mẫu số 5: Trả về object thông báo thành công [cite: 36]
    res.status(200).json({ message: "Questions added successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
