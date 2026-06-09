const Question = require('../models/Question');
const axiosClient = require('../config/axiosClient');

// [POST] /api/questions - Tạo mới một câu hỏi độc lập
exports.createQuestion = async (req, res) => {
    try {
        const newQuestion = await Question.create(req.body);
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// [GET] /api/questions - Lấy toàn bộ câu hỏi độc lập
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [GET] /api/questions/:questionId - Lấy chi tiết 1 Câu hỏi theo ID
exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);
        if (!question) return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [PUT] /api/questions/:questionId - Cập nhật câu hỏi
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

// [DELETE] /api/questions/:questionId - Xóa câu hỏi độc lập
exports.deleteQuestion = async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.questionId);
        if (!deletedQuestion) return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
        res.status(200).json({ message: 'Xóa câu hỏi thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//--------------------------------------------------------

// [GET] /questions - Danh sách câu hỏi độc lập trong kho
exports.renderQuestionList = async (req, res) => {
    try {
        const response = await axiosClient.get('/api/questions');
        res.render('question/list.ejs', { questions: response.data, layout: false });
    } catch (error) {
        res.status(500).send('Lỗi lấy kho câu hỏi: ' + error.message);
    }
};

// [GET] /questions/:questionId  - Render câu hỏi cụ thể 
exports.renderQuestionDetail = async (req, res) => {
    try {
        const response = await axiosClient.get(`/api/questions/${req.params.questionId}`);
        res.render('question/details.ejs', { questions: response.data, layout: false });
    } catch (error) {
        res.status(500).send('Lỗi lấy kho câu hỏi: ' + error.message);
    }
};

// [GET] /questions/create - Form tạo câu hỏi
exports.renderCreateForm = (req, res) => {
    res.render('question/create.ejs', { layout: false });
};

// [POST] /questions/create - Xử lý lưu câu hỏi vào kho
exports.handleCreateQuestion = async (req, res) => {
    try {
        const { text, options, keywords, correctAnswerIndex } = req.body;
        const payload = {
            text,
            options: options.split(',').map(o => o.trim()),
            keywords: keywords ? keywords.split(',').map(k => k.trim()) : [],
            correctAnswerIndex: parseInt(correctAnswerIndex)
        };
        await axiosClient.post('/api/questions', payload);
        res.redirect('/questions');
    } catch (error) {
        res.status(400).send('Lỗi tạo câu hỏi: ' + error.message);
    }
};

// [GET] /questions/edit/:questionId - Form sửa câu hỏi
exports.renderEditForm = async (req, res) => {
    try {
        const response = await axiosClient.get(`/api/questions/${req.params.questionId}`);
        res.render('question/edit.ejs', { question: response.data, layout: false });
    } catch (error) {
        res.status(404).send('Không tìm thấy câu hỏi');
    }
};

// [PUT] /questions/update/:questionId - Xử lý sửa câu hỏi
exports.handleUpdateQuestion = async (req, res) => {
    try {
        const { text, options, keywords, correctAnswerIndex } = req.body;
        const payload = {
            text,
            options: options.split(',').map(o => o.trim()),
            keywords: keywords ? keywords.split(',').map(k => k.trim()) : [],
            correctAnswerIndex: parseInt(correctAnswerIndex)
        };
        await axiosClient.put(`/api/questions/${req.params.questionId}`, payload);
        res.redirect('/questions');
    } catch (error) {
        res.status(400).send('Lỗi sửa câu hỏi: ' + error.message);
    }
};

// [DELETE] /questions/delete/:questionId - Xóa câu hỏi khỏi kho
exports.handleDeleteQuestion = async (req, res) => {
    try {
        await axiosClient.delete(`/api/questions/${req.params.questionId}`);
        res.redirect('/questions');
    } catch (error) {
        res.status(500).send('Lỗi xóa câu hỏi: ' + error.message);
    }
};

// [GET] /questions/:questionId - Xem chi tiết câu hỏi
exports.renderQuestionDetail = async (req, res) => {
    try {
        const response = await axiosClient.get(`/api/questions/${req.params.questionId}`);
        res.render('question/details.ejs', { questions: response.data, layout: false });
    } catch (error) {
        res.status(404).send('Không tìm thấy câu hỏi: ' + error.message);
    }
};