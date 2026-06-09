// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const quizRoutes = require('./routes/quizRoutes');
// const questionRoutes = require('./routes/questionRoutes');

// // Tải cấu hình biến môi trường
// dotenv.config();

// // Khởi tạo ứng dụng Express
// const app = express();

// // Kết nối cơ sở dữ liệu MongoDB
// connectDB();

// // Middleware xử lý dữ liệu JSON gửi lên từ client
// app.use(express.json());

// // Gắn các cụm Routes vào ứng dụng
// app.use('/quizzes', quizRoutes);
// app.use('/question', questionRoutes);

// // Khởi chạy server lắng nghe các request
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`[Server] Ứng dụng đang chạy tại cổng ${PORT} ở chế độ Development`);
// });

//--------------------------------------------------------


const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');
const connectDB = require('./config/db');

// Tải biến môi trường
dotenv.config();

const app = express();

connectDB();

// 1. MIDDLEWARES XỬ LÝ DỮ LIỆU ĐẦU VÀO & PHƯƠNG THỨC FORM
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Cho phép lách luật method qua query string từ form HTML (ví dụ: ?_method=DELETE)
app.use(methodOverride('_method')); 

// 2. CẤU HÌNH PHỤC VỤ FILE TĨNH (Bootstrap / Custom CSS)
app.use(express.static(path.join(__dirname, 'public')));

// 3. CẤU HÌNH HỖN HỢP VIEW ENGINE (HANDLEBARS + EJS)
// Đăng ký engine Handlebars cho các file đuôi .hbs
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));

// Thiết lập mặc định tìm kiếm view và đăng ký render song song cho cả .hbs và .ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); // View mặc định cho cấu trúc trang chủ
app.engine('ejs', require('ejs').renderFile); // Đăng ký thêm trình render EJS

// 4. NHẬP CÁC TUYẾN ĐƯỜNG ĐỊNH TUYẾN (ROUTES)
const indexRoutes = require('./routes/indexRoutes');
const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');
const apiQuizRoutes = require('./routes/apiQuizRoutes');
const apiQuestionRoutes = require('./routes/apiQuestionRoutes');

// Gắn tiền tố router bám sát yêu cầu nghiệp vụ và cấu hình file
app.use('/', indexRoutes);
app.use('/quizzes', quizRoutes);
app.use('/questions', questionRoutes);
app.use('/api/quizzes', apiQuizRoutes);
app.use('/api/questions', apiQuestionRoutes);

// Xử lý lỗi 404 không tìm thấy đường dẫn
app.use((req, res, next) => {
    res.status(404).send('Trang bạn tìm kiếm không tồn tại trên hệ thống!');
});

// Khởi chạy server lắng nghe các request
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[Server] Ứng dụng đang chạy tại cổng ${PORT} ở chế độ Development`);
});
