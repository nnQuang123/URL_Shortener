// ===== Type definitions cho URL Shortener =====

/** Body gửi lên API POST /api/shorten */
export interface ShortenRequest {
  originalUrl: string;
}

/** Response trả về từ API POST /api/shorten */
export interface ShortenResponse {
  shortUrl: string;
  code: string;
}

/** Lỗi trả về từ API */
export interface ApiError {
  error: string;
}

/** Một item lưu trong localStorage history */
export interface HistoryItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  code: string;
  createdAt: string; // ISO date string
}
