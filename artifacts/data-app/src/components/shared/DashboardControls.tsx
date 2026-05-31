import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Sun, Moon, Printer, RefreshCw, ChevronDown, Check } from "lucide-react";

interface DashboardControlsProps {
  isDark: boolean;
  setIsDark: (val: boolean | ((v: boolean) => boolean)) => void;
  loading?: boolean;
  onRefresh: () => void;
  lastRefreshed?: string | null;
}

const INTERVAL_OPTIONS = [
  { label: "Every 5 min", ms: 5 * 60 * 1000 },
  { label: "Every 15 min", ms: 15 * 60 * 1000 },
  { label: "Every 1 hour", ms: 60 * 60 * 1000 },
  { label: "Every 24 hours", ms: 24 * 60 * 60 * 1000 },
];

export function DashboardControls({ isDark, setIsDark, loading, onRefresh, lastRefreshed }: DashboardControlsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedIntervalMs, setSelectedIntervalMs] = useState(5 * 60 * 1000);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (loading) {
      setIsSpinning(true);
    } else {
      const t = setTimeout(() => setIsSpinning(false), 600);
      return () => clearTimeout(t);
    }
  }, [loading]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    if (autoRefresh) {
      const timer = setInterval(() => {
        onRefresh();
      }, selectedIntervalMs);
      return () => clearInterval(timer);
    }
  }, [autoRefresh, selectedIntervalMs, onRefresh]);

  const btnStyle = {
    backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2",
    color: isDark ? "#c8c9cc" : "#4b5563",
  };

  return (
    <div className="flex items-center gap-3 pt-2 print:hidden">
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center rounded-[6px] overflow-hidden h-[26px] text-[12px]"
          style={btnStyle}
        >
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1 px-2 h-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSpinning ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <div
            className="w-px h-4 shrink-0"
            style={{ backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }}
          />
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center justify-center px-1.5 h-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-popover shadow-md overflow-hidden z-50">
            <div className="p-2 border-b">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span>Auto-refresh</span>
              </label>
            </div>
            <div className="py-1">
              {INTERVAL_OPTIONS.map((opt) => (
                <button
                  key={opt.ms}
                  onClick={() => setSelectedIntervalMs(opt.ms)}
                  className="w-full text-left px-3 py-1.5 text-sm flex items-center justify-between hover:bg-muted"
                  disabled={!autoRefresh}
                  style={{ opacity: autoRefresh ? 1 : 0.5 }}
                >
                  {opt.label}
                  {selectedIntervalMs === opt.ms && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => window.print()}
        disabled={loading}
        className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors disabled:opacity-50"
        style={btnStyle}
        aria-label="Export as PDF"
      >
        <Printer className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setIsDark((d) => !d)}
        className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors"
        style={btnStyle}
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
