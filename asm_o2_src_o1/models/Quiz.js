const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tiêu đề Quiz không được để trống']
    },
    description: {
        type: String,
        default: ''
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question' // Tham chiếu tới Model Question để thực hiện populate
        }
    ]
}, { versionKey: false });

module.exports = mongoose.model('Quiz', QuizSchema);