const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const userRoutes = require("./routes/userRoutes");
const passport = require("passport");

// 1. Tải cấu hình biến môi trường (Phải luôn ở đầu)
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();

// Kết nối cơ sở dữ liệu MongoDB
connectDB();

// ==========================================
// TẦNG 1: CÁC MIDDLEWARE CẤU HÌNH ĐẦU VÀO (PRE-REQUEST)
// ==========================================
// Parse dữ liệu JSON gửi lên từ client
app.use(express.json());

// Khởi tạo cấu hình và môi trường xác thực mã băm của Passport
app.use(passport.initialize());

// ==========================================
// TẦNG 2: CÁC CỤM ĐỊNH TUYẾN NGHIỆP VỤ (ROUTES)
// ==========================================
app.use("/quizzes", quizRoutes);
app.use("/question", questionRoutes);
app.use("/users", userRoutes);

// ==========================================
// TẦNG 3: MIDDLEWARE XỬ LÝ LỖI TẬP TRUNG (POST-REQUEST)
// ==========================================
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || "Lỗi hệ thống! Vui lòng thử lại sau.",
    },
  });
});

// Khởi chạy server lắng nghe các request
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] app chạy ngon ở cổng ${PORT} | Development mode`);
});
