import { useState, useEffect, useCallback } from "react";
import FormInput from "./components/FormInput";
import Result from "./components/Result";
import HistoryList from "./components/HistoryList";
import type { ShortenResponse, ApiError, HistoryItem } from "./types";

// Key dùng để lưu history vào localStorage
const STORAGE_KEY = "url-shortener-history";

/**
 * Đọc history từ localStorage.
 * Trả về mảng rỗng nếu chưa có hoặc dữ liệu lỗi.
 */
function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryItem[];
  } catch {
    return [];
  }
}

/**
 * Ghi history vào localStorage.
 */
function saveHistory(items: HistoryItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// ===== App Component =====
export default function App() {
  // State: kết quả shortUrl vừa tạo (hiển thị trong Result)
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  // State: loading khi đang gọi API
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // State: thông báo lỗi
  const [error, setError] = useState<string | null>(null);
  // State: lịch sử link đã rút gọn
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history từ localStorage khi mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Xử lý submit: gọi API và cập nhật state
  const handleSubmit = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    setShortUrl(null);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: url }),
      });

      // Nếu response không OK → đọc lỗi từ body
      if (!res.ok) {
        const errBody = (await res.json()) as ApiError;
        throw new Error(errBody.error || `Lỗi ${res.status}`);
      }

      // Parse response thành công
      const data = (await res.json()) as ShortenResponse;
      setShortUrl(data.shortUrl);

      // Thêm vào history (mới nhất lên đầu)
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        originalUrl: url,
        shortUrl: data.shortUrl,
        code: data.code,
        createdAt: new Date().toISOString(),
      };

      setHistory((prev) => {
        const updated = [newItem, ...prev];
        saveHistory(updated);
        return updated;
      });
    } catch (err) {
      // Xử lý lỗi network hoặc lỗi từ API
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi không xác định");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Xóa toàn bộ history
  const handleClearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return (
    <div className="bg-gradient-animated min-h-screen flex flex-col items-center justify-start px-4 py-12 sm:py-20 relative">
      {/* Content wrapper — z-index cao hơn background gradient */}
      <div className="relative z-10 w-full max-w-xl space-y-8">
        {/* ===== Header ===== */}
        <header className="text-center space-y-3">
          {/* Logo icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 mb-2">
            <svg
              className="h-7 w-7 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5"
              />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary-light via-accent to-accent-light bg-clip-text text-transparent">
              URL Shortener
            </span>
          </h1>
          <p className="text-text-muted text-sm sm:text-base">
            Biến link dài thành link ngắn gọn — nhanh chóng và miễn phí
          </p>
        </header>

        {/* ===== Main Card ===== */}
        <main className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Form nhập URL */}
          <FormInput onSubmit={handleSubmit} isLoading={isLoading} />

          {/* Thông báo lỗi */}
          {error && (
            <div className="animate-fade-in-up flex items-center gap-3 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Kết quả link rút gọn */}
          {shortUrl && <Result shortUrl={shortUrl} />}
        </main>

        {/* ===== Divider ===== */}
        {history.length > 0 && (
          <div className="border-t border-white/5" />
        )}

        {/* ===== History List ===== */}
        <HistoryList items={history} onClearAll={handleClearHistory} />

        {/* ===== Footer ===== */}
        <footer className="text-center text-xs text-text-muted/40 pt-4">
          Built with React + TypeScript + Tailwind CSS
        </footer>
      </div>
    </div>
  );
}
