const Question = require('../models/Question');

// [POST] /question - Tạo mới một câu hỏi độc lập
exports.createQuestion = async (req, res) => {
    try {
        const newQuestion = await Question.create(req.body);
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// [GET] /question - Lấy toàn bộ câu hỏi độc lập
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [GET] /question/:questionId - Lấy chi tiết 1 Câu hỏi theo ID
exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);
        if (!question) return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [PUT] /question/:questionId - Cập nhật câu hỏi
exports.updateQuestion = async (req, res) => {
    try {
        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.questionId,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedQuestion) return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
        res.status(200).json(updatedQuestion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// [DELETE] /question/:questionId - Xóa câu hỏi độc lập
exports.deleteQuestion = async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.questionId);
        if (!deletedQuestion) return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
        res.status(200).json({ message: 'Xóa câu hỏi thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};