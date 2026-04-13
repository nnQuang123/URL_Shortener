import type { Request, Response } from "express";

// Tạo nơi lưu trữ data Map<shortCode, originalUrl>
const urlStore = new Map<string, string>();

// Hàm sinh chuỗi ngẫu nhiên 6 ký tự
function generateRandomCode(): string {
  return Math.random().toString(36).slice(2, 8);
}

// Controller 1: Nhận URL dài, trả về URL ngắn
export function shortenerUrl(req: Request, res: Response): void {
  // lấy URL từ người dùng
  const { originalUrl } = req.body as { originalUrl: string };
  // Kiểm tra người dùng có gửi URL không
  if (!originalUrl) {
    res.status(400).json({ error: "originalUrl là bắt buộc" });
    return;
  }
  // Kiểm tra có phải URL hợp lệ không
  try {
    new URL(originalUrl);
  } catch {
    res.status(400).json({ error: "URL không hợp lệ" });
    return;
  }
  // Sinh code và lưu vào store
  let code: string;
  //  Kiểm tra code có trùng không
  do {
    code = generateRandomCode();
  } while (urlStore.has(code));
  urlStore.set(code, originalUrl);

  // Trả về 201 Created với shortUrl
  const shortUrl = `http://localhost:3000/${code}`;
  res.status(201).json({ shortUrl, code });
}
// Controller 2: Nhận short code, redirect đến URL gốc
export function redirectUrl(req: Request, res: Response): void {
  // req.params.code là phần động trong URL
  const { code } = req.params as { code: string };
  //   Lấy originUrl trong urlStore
  const originUrl = urlStore.get(code);
  //   Kiểm tra có lấy thành công không
  if (!originUrl) {
    res.status(404).json({ error: "Link không tồn tại" });
    return;
  }
  res.redirect(301, originUrl)
}
