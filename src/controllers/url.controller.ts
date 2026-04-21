import type { Request, Response } from "express";
import db from "../lib/db";

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
  //  Sinh code và lưu code vào database
  let created: boolean = false;
  let code;
  while (!created) {
    try {
      code = generateRandomCode();
      db.prepare(
        `
    INSERT INTO urls (code, original_url) VALUES (?, ?)
  `,
      ).run(code, originalUrl);
      created = true;
    } catch (error: any) {
      if (error?.code !== 'SQLITE_CONSTRAINT_UNIQUE') throw error;
    }
  }

  // Trả về 201 Created với shortUrl
  res
    .status(201)
    .json({ shortUrl: `http://localhost:3000/${code}`, code: code });
}
// Controller 2: Nhận short code, redirect đến URL gốc
export function redirectUrl(req: Request, res: Response): void {
  // req.params.code là phần động trong URL
  const { code } = req.params as { code: string };

  //   Lấy url trong database
  const row = db
    .prepare("SELECT original_url FROM urls WHERE code = ?")
    .get(code) as { original_url: string } | undefined;

  //   Kiểm tra có lấy thành công không
  if (!row) {
    res.status(404).json({ error: "Link không tồn tại" });
    return;
  }

  // Cộng thêm 1 vào số lần click link
  db.prepare("UPDATE urls SET clicks = clicks + 1 WHERE code = ?").run(code);

  res.redirect(301, row.original_url);
}
