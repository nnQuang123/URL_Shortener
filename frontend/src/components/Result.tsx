import { useState } from "react";

// ===== Props type =====
interface ResultProps {
  /** URL rút gọn vừa tạo */
  shortUrl: string;
}

/**
 * Result — Hiển thị kết quả link rút gọn kèm nút Copy.
 * Có animation fade-in và feedback "Đã copy!" khi click.
 */
export default function Result({ shortUrl }: ResultProps) {
  const [copied, setCopied] = useState<boolean>(false);

  // Copy link vào clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      // Reset trạng thái sau 2 giây
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback cho trình duyệt không hỗ trợ clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = shortUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="animate-fade-in-up w-full">
      {/* Label */}
      <p className="text-sm text-text-muted mb-2 font-medium">
        ✨ Link đã được rút gọn
      </p>

      {/* Result card */}
      <div
        className="
          flex flex-col sm:flex-row items-stretch sm:items-center gap-3
          p-4 rounded-xl
          bg-surface-input border border-accent/20
          transition-all duration-300
        "
      >
        {/* Link hiển thị */}
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex-1 text-accent hover:text-accent-light
            font-mono text-sm sm:text-base
            truncate transition-colors duration-200
            hover:underline underline-offset-4
          "
        >
          {shortUrl}
        </a>

        {/* Nút Copy */}
        <button
          onClick={handleCopy}
          className={`
            px-4 py-2.5 rounded-lg font-medium text-sm
            transition-all duration-200 cursor-pointer
            flex items-center justify-center gap-2 min-w-[120px]
            ${
              copied
                ? "bg-success/20 text-success border border-success/30"
                : "bg-white/5 text-text hover:bg-white/10 border border-white/10 hover:border-white/20 active:scale-[0.97]"
            }
          `}
        >
          {copied ? (
            <>
              {/* Check icon */}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Đã copy!
            </>
          ) : (
            <>
              {/* Clipboard icon */}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
    </div>
  );
}
