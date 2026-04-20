import type { Request, Response } from "express";
import prisma from "../lib/prisma";

// Hàm sinh chuỗi ngẫu nhiên 6 ký tự
function generateRandomCode(): string {
  return Math.random().toString(36).slice(2, 8);
}

// Controller 1: Nhận URL dài, trả về URL ngắn
export async function shortenerUrl(req: Request, res: Response): Promise<void> {
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
  let code: string;
  let created: boolean = false;
  let url: any;
  while (!created) {
    try {
      code = generateRandomCode();

      const url = await prisma.url.create({
        data: { code, originalUrl },
      });
      created = true;
    } catch (error: any) {
      // Nếu không phải lỗi unique thì throw lỗi
      if (error.code != "P2002") {
        throw error;
      }
    }
  }

  // Trả về 201 Created với shortUrl
  res
    .status(201)
    .json({ shortUrl: `http://localhost:3000/${url.code}`, code: url.code });
}
// Controller 2: Nhận short code, redirect đến URL gốc
export async function redirectUrl(req: Request, res: Response): Promise<void> {
  // req.params.code là phần động trong URL
  const { code } = req.params as { code: string };
  //   Lấy url trong database
  const url = await prisma.url.fineUnique({ where: { code } });

  //   Kiểm tra có lấy thành công không
  if (!url) {
    res.status(404).json({ error: "Link không tồn tại" });
    return;
  }

  // Cộng thêm 1 vào số lần click link
  await prisma.url.update({
    where: {code},
    data: {clicks: {increment: 1}}
  })

  res.redirect(301, url.originalUrl);
}
