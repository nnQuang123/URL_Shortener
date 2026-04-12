import express from "express";

// Khởi tạo ứng dụng Express
const app = express();

// Middleware: cho phép server đọc được JSON trong request body
// Nếu không có dòng này, req.body sẽ luôn là undefined
app.use(express.json());

// Định nghĩa PORT - đọc từ biến môi trường, nếu không có thì dùng 3000
const PORT = process.env.PORT || 3000;

// Route thử nghiệm - để kiểm tra server có chạy không
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server đang chạy tốt!" });
});

// Lắng nghe request tại PORT đã chọn
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
