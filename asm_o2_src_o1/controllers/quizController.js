const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const axiosClient = require('../config/axiosClient');

// [POST] /api/quizzes - Tạo mới một Quiz
exports.createQuiz = async (req, res) => {
  try {
    const newQuiz = await Quiz.create(req.body);
    res.status(200).send(`Added the quiz with id: ${newQuiz._id}`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// [GET] /api/quizzes - Lấy toàn bộ danh sách Quiz kèm populate question
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("questions");
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] /api/quizzes/:quizId - Lấy chi tiết 1 Quiz theo ID (đã populate câu hỏi)
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate('questions');
        if (!quiz) return res.status(404).json({ message: 'Không tìm thấy Quiz' });
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [PUT] /api/quizzes/:quizId - Cập nhật thông tin Quiz
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

// [DELETE] /api/quizzes/:quizId - Xóa Quiz 
exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.quizId);
    if (!deletedQuiz)
      return res.status(404).json({ message: "Không tìm thấy Quiz" });
    res.status(200).json(null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] /api/quizzes/:quizId/populate - Lọc câu hỏi có từ khóa "capital"
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

// [POST] /api/quizzes/:quizId/question - Tạo 1 câu hỏi mới nằm trong Quiz
exports.createQuestionForQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const newQuestion = await Question.create(req.body);

    await Quiz.findByIdAndUpdate(quizId, {
      $push: { questions: newQuestion._id },
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// [POST] /api/quizzes/:quizId/questions - Tạo nhiều câu hỏi cùng lúc 
exports.createManyQuestionsForQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const questionsArray = req.body;

    if (!Array.isArray(questionsArray)) {
      return res.status(400).json({ message: "Dữ liệu phải là một mảng" });
    }

    const newQuestions = await Question.insertMany(questionsArray);
    const questionIds = newQuestions.map((q) => q._id);

    await Quiz.findByIdAndUpdate(quizId, {
      $push: { questions: { $each: questionIds } },
    });

    res.status(200).json({ message: "Questions added successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//-------------------------------------------------------

// [GET] /quizzes - Hiển thị danh sách các đề Quiz
exports.renderQuizList = async (req, res) => {
    try {
        const response = await axiosClient.get('/api/quizzes');
        res.render('quiz/list.ejs', { quizzes: response.data, layout: false });
    } catch (error) {
        res.status(500).send('Lỗi khi lấy danh sách Quiz: ' + error.message);
    }
};

// [GET] /quizzes/create - Hiển thị Form tạo mới Quiz
exports.renderCreateForm = (req, res) => {
    res.render('quiz/create.ejs', { layout: false });
};

// [POST] /quizzes/create - Xử lý gửi dữ liệu Form tạo mới Quiz
exports.handleCreateQuiz = async (req, res) => {
    try {
        await axiosClient.post('/api/quizzes', req.body);
        res.redirect('/quizzes');
    } catch (error) {
        res.status(400).send('Lỗi khi tạo Quiz: ' + error.message);
    }
};

// [GET] /quizzes/edit/:quizId - Hiển thị Form cập nhật Quiz
exports.renderEditForm = async (req, res) => {
    try {
        const response = await axiosClient.get(`/api/quizzes/${req.params.quizId}`);
        res.render('quiz/edit.ejs', { quiz: response.data, layout: false });
    } catch (error) {
        res.status(404).send('Không tìm thấy thông tin Quiz');
    }
};

// [PUT] /quizzes/update/:quizId - Xử lý cập nhật Quiz qua Method-Override
exports.handleUpdateQuiz = async (req, res) => {
    try {
        await axiosClient.put(`/api/quizzes/${req.params.quizId}`, req.body);
        res.redirect('/quizzes');
    } catch (error) {
        res.status(400).send('Lỗi khi sửa Quiz: ' + error.message);
    }
};

// [DELETE] /quizzes/delete/:quizId - Xử lý xóa Quiz qua Method-Override
exports.handleDeleteQuiz = async (req, res) => {
    try {
        await axiosClient.delete(`/api/quizzes/${req.params.quizId}`);
        res.redirect('/quizzes');
    } catch (error) {
        res.status(500).send('Lỗi khi xóa Quiz: ' + error.message);
    }
};

// [GET] /quizzes/:quizId - Xem chi tiết cấu trúc câu hỏi thuộc Quiz
exports.renderQuizDetail = async (req, res) => {
    try {
        const quizRes = await axiosClient.get(`/api/quizzes/${req.params.quizId}`);
        const questionRes = await axiosClient.get('/api/questions');
        
        res.render('quiz/details.ejs', { 
            quiz: quizRes.data, 
            allQuestions: questionRes.data,
            layout: false 
        });
    } catch (error) {
        res.status(500).send('Lỗi tải chi tiết Quiz: ' + error.message);
    }
};

// [POST] /quizzes/:quizId/question/add-existing - Gán câu hỏi có sẵn từ kho vào Quiz
exports.handleAddQuestionToQuiz = async (req, res) => {
    try {
        const { questionId } = req.body;
        const quizRes = await axiosClient.get(`/api/quizzes/${req.params.quizId}`);
        const updatedQuestions = [...quizRes.data.questions.map(q => q._id || q), questionId];
        
        await axiosClient.put(`/api/quizzes/${req.params.quizId}`, {
            questions: updatedQuestions
        });
        res.redirect(`/quizzes/${req.params.quizId}`);
    } catch (error) {
        res.status(400).send('Lỗi khi thêm câu hỏi vào đề: ' + error.message);
    }
};
