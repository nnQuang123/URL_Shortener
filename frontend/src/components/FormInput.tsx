import { useState, type FormEvent } from "react";

// ===== Props type =====
interface FormInputProps {
  /** Callback khi user submit URL */
  onSubmit: (url: string) => void;
  /** Trạng thái loading khi đang gọi API */
  isLoading: boolean;
}

/**
 * FormInput — Component nhập URL và nút rút gọn.
 * Có validate input rỗng, disable button khi loading hoặc chưa nhập.
 */
export default function FormInput({ onSubmit, isLoading }: FormInputProps) {
  const [url, setUrl] = useState<string>("");

  // Xử lý submit form
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  const isDisabled = isLoading || url.trim().length === 0;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {/* Label */}
      <label
        htmlFor="url-input"
        className="block text-sm font-medium text-text-muted tracking-wide uppercase"
      >
        Dán link cần rút gọn
      </label>

      {/* Input + Button group */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* URL Input */}
        <input
          id="url-input"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/your-very-long-url..."
          required
          className="
            flex-1 px-4 py-3.5 rounded-xl
            bg-surface-input text-text placeholder-text-muted/50
            border border-white/10
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40
            hover:border-white/20
            text-sm sm:text-base
          "
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isDisabled}
          className={`
            px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base
            transition-all duration-200 cursor-pointer
            flex items-center justify-center gap-2 min-w-[140px]
            ${
              isDisabled
                ? "bg-primary/30 text-white/40 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark text-white btn-glow shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.97]"
            }
          `}
        >
          {isLoading ? (
            <>
              {/* Spinner icon */}
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Đang xử lý...
            </>
          ) : (
            <>
              {/* Link icon */}
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5"
                />
              </svg>
              Rút gọn
            </>
          )}
        </button>
      </div>
    </form>
  );
}
