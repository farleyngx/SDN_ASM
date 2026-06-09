const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');

// Tải cấu hình biến môi trường
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();

// Kết nối cơ sở dữ liệu MongoDB
connectDB();

// Middleware xử lý dữ liệu JSON gửi lên từ client
app.use(express.json());

// Gắn các cụm Routes vào ứng dụng
app.use('/quizzes', quizRoutes);
app.use('/question', questionRoutes);

// Khởi chạy server lắng nghe các request
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[Server] Ứng dụng đang chạy tại cổng ${PORT} ở chế độ Development`);
});