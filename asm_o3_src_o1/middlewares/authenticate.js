const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Question = require("../models/Question");

// 1. Cấu hình Chiến lược xác thực cục bộ bằng phương thức của plugin
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 2. Middleware giải mã JWT Token (Xác thực người dùng thường)
exports.verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const err = new Error("Bạn cần cung cấp mã token đăng nhập!");
      err.status = 401;
      return next(err);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret-key");

    const user = await User.findById(decoded._id || decoded.id);
    if (!user) {
      const err = new Error("Tài khoản liên kết với token này không tồn tại!");
      err.status = 401;
      return next(err);
    }

    // Đính kèm object user vào request để dùng cho verifyAdmin/verifyAuthor [cite: 70, 78]
    req.user = user;
    next();
  } catch (error) {
    const err = new Error("Phiên đăng nhập không hợp lệ hoặc đã hết hạn!");
    err.status = 401;
    return next(err);
  }
};

// 3. [TASK 1] Middleware xác thực quyền quản trị Admin [cite: 67, 68]
exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin === true) {
    // [cite: 72, 73]
    return next(); // [cite: 74]
  } else {
    const err = new Error("Bạn không có quyền thực hiện yêu cầu này!"); // [cite: 76]
    err.status = 403; // [cite: 76]
    return next(err); // [cite: 75, 76]
  }
};

// 4. [TASK 1] Middleware xác thực tác giả câu hỏi [cite: 67, 77]
exports.verifyAuthor = async (req, res, next) => {
  try {
    const questionId = req.params.questionId;
    const question = await Question.findById(questionId);

    if (!question) {
      const err = new Error("Không tìm thấy câu hỏi tương ứng!");
      err.status = 404;
      return next(err);
    }

    // Đối sánh ObjectId tác giả với ObjectId người dùng đăng nhập [cite: 79]
    if (
      question.author &&
      question.author.toString() === req.user._id.toString()
    ) {
      // [cite: 79]
      return next(); // Trùng khớp thì cho phép đi tiếp [cite: 80]
    } else {
      const err = new Error("Bạn không phải người tạo ra câu hỏi này!"); // [cite: 80]
      err.status = 403;
      return next(err); // [cite: 80]
    }
  } catch (error) {
    return next(error);
  }
};
