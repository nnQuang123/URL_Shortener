import express from "express";
import urlRouter from "./routes/url.routes";
import { redirectUrl } from "./controllers/url.controller";

// Khởi tạo ứng dụng Express
const app = express();

// Middleware: cho phép server đọc được JSON trong request body
app.use(express.json());

// Gắn router vào prefix /api
app.use("/api", urlRouter);

// Route thử nghiệm - để kiểm tra server có chạy không
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server đang chạy tốt!" });
});

// GET /:code → gọi hàm redirectUrl trong controller
// Redirect nằm ở root — link ngắn sẽ là /:code
app.get("/:code", redirectUrl);

// Định nghĩa PORT - đọc từ biến môi trường, nếu không có thì dùng 3000
const PORT = process.env.PORT || 3000;
// Lắng nghe request tại PORT đã chọn
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
