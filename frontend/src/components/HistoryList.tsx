import { useState } from "react";
import type { HistoryItem } from "../types";

// ===== Props type =====
interface HistoryListProps {
  /** Danh sách lịch sử link đã rút gọn */
  items: HistoryItem[];
  /** Callback xóa toàn bộ history */
  onClearAll: () => void;
}

/**
 * HistoryList — Hiển thị danh sách các link đã rút gọn trước đó.
 * Mỗi item có nút copy riêng. Có nút xóa tất cả.
 */
export default function HistoryList({ items, onClearAll }: HistoryListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Không render gì nếu chưa có history
  if (items.length === 0) return null;

  // Copy một link cụ thể
  const handleCopy = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Rút gọn URL gốc để hiển thị (tối đa 50 ký tự)
  const truncateUrl = (url: string, maxLength: number = 50): string => {
    if (url.length <= maxLength) return url;
    return url.slice(0, maxLength) + "…";
  };

  // Format ngày tạo
  const formatDate = (iso: string): string => {
    const date = new Date(iso);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="animate-fade-in-up w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-text-muted tracking-wide uppercase flex items-center gap-2">
          {/* Clock icon */}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Lịch sử ({items.length})
        </h2>

        {/* Nút xóa tất cả */}
        <button
          onClick={onClearAll}
          className="
            text-xs text-error/70 hover:text-error
            transition-colors duration-200 cursor-pointer
            flex items-center gap-1
            px-2 py-1 rounded-lg hover:bg-error/10
          "
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
          Xóa tất cả
        </button>
      </div>

      {/* Danh sách items */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="
              animate-fade-in-up
              flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4
              p-3 rounded-xl
              bg-surface-input/50 border border-white/5
              hover:border-white/10 hover:bg-surface-hover/50
              transition-all duration-200 group
            "
          >
            {/* URL info */}
            <div className="flex-1 min-w-0 space-y-1">
              {/* Short URL */}
              <a
                href={item.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-accent hover:text-accent-light
                  font-mono text-sm transition-colors duration-200
                  hover:underline underline-offset-4 block truncate
                "
              >
                {item.shortUrl}
              </a>
              {/* Original URL + timestamp */}
              <div className="flex items-center gap-2 text-xs text-text-muted/60">
                <span className="truncate">{truncateUrl(item.originalUrl)}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline whitespace-nowrap">{formatDate(item.createdAt)}</span>
              </div>
            </div>

            {/* Nút Copy */}
            <button
              onClick={() => handleCopy(item.id, item.shortUrl)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium
                transition-all duration-200 cursor-pointer
                flex items-center gap-1.5 shrink-0
                ${
                  copiedId === item.id
                    ? "bg-success/20 text-success"
                    : "bg-white/5 text-text-muted hover:bg-white/10 hover:text-text opacity-60 group-hover:opacity-100"
                }
              `}
            >
              {copiedId === item.id ? (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                    />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
