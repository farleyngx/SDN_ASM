const jwt = require("jsonwebtoken");
const User = require("../models/User");

// [POST] /users/register - Đăng ký tài khoản
exports.register = async (req, res, next) => {
  try {
    if (!req.body.password) {
      return res.status(400).json({ message: "Mật khẩu không được để trống!" });
    }
    const newUser = await User.register(
      { username: req.body.username, admin: req.body.admin || false },
      req.body.password,
    );
    return res.status(200).json({
      message: "Đăng ký tài khoản thành công!",
      user: {
        _id: newUser._id,
        username: newUser.username,
        admin: newUser.admin,
      },
    });
  } catch (err) {
    if (err.name === "UserExistsError") {
      return res.status(400).json({
        message: "Username đã tồn tại, vui lòng chọn username khác.",
      });
    }
  }
};

// // [POST] /users/login - Đăng nhập và cấp mã Token JWT
// exports.login = (req, res) => {
//   try {
//     const token = jwt.sign(
//       { _id: req.user._id, username: req.user.username },
//       process.env.JWT_SECRET || "secret-key",
//       { expiresIn: "1d" },
//     );
//     return res.status(200).json({
//       message: "Đăng nhập thành công!",
//       token: token,
//     });
//   } catch (err) {
//     return res.status(401).json({
//       message: err.message,
//     });
//   }
// };

// [POST] /users/login - Đăng nhập tài khoản
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 1. Kiểm tra dữ liệu đầu vào cơ bản
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ tài khoản và mật khẩu!"
      });
    }

    // 2. Gọi hàm xác thực tĩnh của plugin passport-local-mongoose
    // Cú pháp: User.authenticate()(username, password) -> trả về một Promise
    const authResult = await User.authenticate()(username, password);
    
    // authResult sẽ trả về một Object chứa { user } nếu đúng, hoặc { error } nếu sai
    if (authResult.error) {
      // BẮT CHẶT LỖI SAI MẬT KHẨU / SAI TÀI KHOẢN TẠI ĐÂY
      return res.status(401).json({
        success: false,
        error_type: "LOGIN_FIELDS_INVALID",
        message: "Tài khoản hoặc mật khẩu không chính xác!"
      });
    }

    // 3. ĐĂNG NHẬP ĐÚNG -> Tiến hành ký mã thông báo Token JWT
    const authenticatedUser = authResult.user;
    
    const token = jwt.sign(
      { _id: authenticatedUser._id, username: authenticatedUser.username },
      process.env.JWT_SECRET || "secret-key",
      { expiresIn: "1d" }
    );

    // Trả về JSON thành công rực rỡ cho Postman
    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      access_token: token,
      user: {
        _id: authenticatedUser._id,
        username: authenticatedUser.username,
        admin: authenticatedUser.admin // Phục vụ thuộc tính req.user.admin cho ASM3
      }
    });

  } catch (err) {
    // Bắt lỗi hệ thống đột xuất (Lỗi kết nối DB, lỗi thư viện JWT...)
    return res.status(500).json({
      success: false,
      error_type: "SERVER_INTERNAL_ERROR",
      message: err.message
    });
  }
};

// [TASK 3] [GET] /users - Lấy danh sách toàn bộ thành viên (Dành riêng cho Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
};
